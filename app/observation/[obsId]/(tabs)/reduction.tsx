import ReductionSummary from "@/src/components/ReductionSummary";
import { useObservationStore } from "@/src/state/useObservationStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { Calc, GetGha, GetReductionCorrections, SetPosition } from "../../../../src/helpers/astron/init";
import { CalcAssumedPosition } from "../../../../src/helpers/CalcAssumedPosition";

export default function SightReduction() {
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
            <View style={{ flex: 1 }}>
                <ReductionSummary data={{
                    observation: observation,
                    reduction: rd,
                    realPosition: realPosition,
                    setRealPosition: setRealPosition
                }} />

                <FAB
                    icon="arrow-left"
                    style={{ position: 'absolute', margin: 16, left: 10, bottom: 0 }}
                    onPress={() => {
                        router.back();
                    }}
                />
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>loading...</Text>
            </View>
        );
    }
}

