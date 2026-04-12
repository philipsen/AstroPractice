import ReductionSummary from "@/src/components/ReductionSummary";
import type { ReductionCorrections } from "@/src/models/ReductionCorrections";
import type { ObservationEntity } from "@/src/types/ObservationEntity";
import { useObservationStore } from "@/src/state/useObservationStore";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import {
    Calc,
    GetGha,
    GetReductionCorrections,
    SetObservationData,
    SetPosition,
} from "../../../../src/helpers/astron/init";
import { CalcAssumedPosition } from "../../../../src/helpers/CalcAssumedPosition";
import { useAndroidNavBarFabOffset } from '@/src/hooks/useAndroidNavBarFabOffset';
import { useNightMode } from '../../../../src/state/NightModeContext';

function computeReductionForObservation(
    observation: ObservationEntity,
    useRealPosition: boolean
): ReductionCorrections {
    SetObservationData(observation);

    const ghaReal = GetGha();
    const [assumedLat, assumedLong] = CalcAssumedPosition(
        ghaReal,
        observation.latitude,
        observation.longitude
    );
    SetPosition(assumedLat, assumedLong);
    Calc();
    const rdAssumed = GetReductionCorrections();

    SetPosition(observation.latitude, observation.longitude);
    Calc();
    const rdReal = GetReductionCorrections();

    return useRealPosition ? rdReal : rdAssumed;
}

export default function SightReduction() {
    const { setNightMode } = useNightMode();
    const { colors, dark } = useTheme();
    const router = useRouter();
    const androidNavFabOffset = useAndroidNavBarFabOffset();
    const observation = useObservationStore((s) => s.observation);
    const [realPosition, setRealPosition] = useState<boolean>(true);
    const [reduction, setReduction] = useState<ReductionCorrections | null>(null);

    useLayoutEffect(() => {
        if (!observation) {
            setReduction(null);
            return;
        }
        setReduction(computeReductionForObservation(observation, realPosition));
    }, [observation, realPosition]);

    useFocusEffect(
        useCallback(() => {
            const obs = useObservationStore.getState().observation;
            if (!obs) return;
            setReduction(computeReductionForObservation(obs, realPosition));
        }, [realPosition])
    );

    if (!observation) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <Text style={{ color: colors.onSurface }}>loading...</Text>
            </View>
        );
    }

    if (!reduction) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <Text style={{ color: colors.onSurface }}>Calculating…</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ReductionSummary
                data={{
                    observation,
                    reduction,
                    realPosition,
                    setRealPosition,
                }}
            />

            <View style={{ position: 'absolute', flexDirection: 'row', left: 10, bottom: androidNavFabOffset, zIndex: 101 }}>
                <FAB
                    icon="arrow-left"
                    style={{ margin: 16, backgroundColor: colors.surface }}
                    color={colors.onSurface}
                    onPress={() => {
                        router.back();
                    }}
                    size="small"
                />
                <FAB
                    icon={dark ? 'white-balance-sunny' : 'weather-night'}
                    style={{ margin: 16, backgroundColor: colors.surface }}
                    onPress={() => setNightMode(!dark)}
                    color={colors.onSurface}
                    size="small"
                    accessibilityLabel={dark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                />
            </View>
        </View>
    );
}
