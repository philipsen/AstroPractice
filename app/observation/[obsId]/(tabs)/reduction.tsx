import ReductionSummary from "@/src/components/ReductionSummary";
import { useObservationStore } from "@/src/state/useObservationStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import { Calc, GetGha, GetReductionCorrections, SetObservationData, SetPosition } from "../../../../src/helpers/astron/init";
import { CalcAssumedPosition } from "../../../../src/helpers/CalcAssumedPosition";
import { useNightMode } from '../../../../src/state/NightModeContext';

export default function SightReduction() {
    const { setNightMode } = useNightMode();
    const { colors, dark } = useTheme();
    const router = useRouter();
    const observation = useObservationStore((s) => s.observation);
    const [realPosition, setRealPosition] = useState<boolean>(true);

    if (observation) {
        console.log("Calc reductions");
        // Keep global Astron state in sync with the store (body, time, Hs, etc.) — same as sextant tab.
        SetObservationData(observation);

        const ghaReal = GetGha();
        const [assumedLat, assumedLong] = CalcAssumedPosition(ghaReal, observation.latitude, observation.longitude);
        SetPosition(assumedLat, assumedLong);
        Calc();
        // console.log("Reduction corrections with assumed position:", rdAssumed);
        const rdAssumed = GetReductionCorrections();

        SetPosition(observation.latitude, observation.longitude);
        Calc();
        const rdReal = GetReductionCorrections();
        // console.log("Reduction corrections with real position:", rdReal);

        const rd = realPosition ? rdReal : rdAssumed;
        return (
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <ReductionSummary data={{
                    observation: observation,
                    reduction: rd,
                    realPosition: realPosition,
                    setRealPosition: setRealPosition
                }} />

                <View style={{ position: 'absolute', flexDirection: 'row', left: 10, bottom: 0, zIndex: 101 }}>
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
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <Text style={{ color: colors.onSurface }}>loading...</Text>
            </View>
        );
    }
}

