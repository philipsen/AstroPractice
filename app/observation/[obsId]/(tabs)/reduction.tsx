import ReductionSummary from "@/src/components/ReductionSummary";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { FAB } from "react-native-paper";
import { Calc, GetGha, GetReductionCorrections, SetPosition } from "../../../../src/helpers/astron/init";
import { CalcAssumedPosition } from "../../../../src/helpers/CalcAssumedPosition";
import { getObservation } from "../../../../src/helpers/ObservationRepository";

export default function SightReduction() {
    const obsId = Number(useLocalSearchParams().obsId);
    const router = useRouter();

    const db = useSQLiteContext();
    const obs = useMemo(() => getObservation(db, Number(obsId)), [db, obsId]);


    SetPosition(obs.latitude, obs.longitude);
    Calc();
    const rdReal = GetReductionCorrections();
    // console.log("Reduction corrections with real position:", rdReal);

    const ghaReal = GetGha();
    const [assumedLat, assumedLong] = CalcAssumedPosition(ghaReal, obs.latitude, obs.longitude);
    SetPosition(assumedLat, assumedLong);
    Calc();
    const rdAssumed = GetReductionCorrections();
    // console.log("Reduction corrections with assumed position:", rdAssumed);

    const [realPosition, setRealPosition] = useState<boolean>(true);
    const rd = realPosition ? rdReal : rdAssumed;

    return (
        <View style={{ flex: 1 }}>
            <ReductionSummary data={{
                observation: obs,
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
}

