import ReductionSummary from "@/src/components/ReductionSummary";
import { useObservationStore } from "@/src/state/useObservationStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { Calc, GetGha, GetReductionCorrections, SetPosition } from "../../../../src/helpers/astron/init";
import { CalcAssumedPosition } from "../../../../src/helpers/CalcAssumedPosition";
import { useNightMode } from '../../../../src/state/NightModeContext';

export default function SightReduction() {
    const { nightMode, setNightMode } = useNightMode();
    const router = useRouter();
    const observation = useObservationStore((s) => s.observation);
    const [realPosition, setRealPosition] = useState<boolean>(true);

    if (observation) {
        console.log("Calc reductions");

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
            <View style={{ flex: 1, backgroundColor: nightMode ? '#181818' : '#fff' }}>
                <ReductionSummary data={{
                    observation: observation,
                    reduction: rd,
                    realPosition: realPosition,
                    setRealPosition: setRealPosition
                }} />

                <View style={{ position: 'absolute', flexDirection: 'row', left: 10, bottom: 0, zIndex: 101 }}>
                    <FAB
                        icon="arrow-left"
                        style={{ margin: 16, backgroundColor: nightMode ? '#181818' : '#fff' }}
                        color={nightMode ? 'red' : '#000'}
                        onPress={() => {
                            router.back();
                        }}
                        size="small"
                    />
                    <FAB
                        icon={nightMode ? 'white-balance-sunny' : 'weather-night'}
                        style={{ margin: 16, backgroundColor: nightMode ? '#181818' : '#fff' }}
                        onPress={() => setNightMode(!nightMode)}
                        color={nightMode ? 'red' : '#000'}
                        size="small"
                        accessibilityLabel={nightMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                    />
                </View>
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: nightMode ? '#181818' : '#fff' }}>
                <Text style={{ color: nightMode ? '#ff3333' : '#000' }}>loading...</Text>
            </View>
        );
    }
}

