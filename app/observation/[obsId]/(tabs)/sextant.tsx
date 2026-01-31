
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React from 'react';
import { View } from 'react-native';
// import SextantCorrectionsSummary, { CorrectionsInput } from '../../../../components/SextantCorrectionsSummary';
import { GetSextantCorrections } from '../../../../helpers/astron/init';
import { getObservation } from '../../../../helpers/ObservationRepository';


export default function SextantCorrections() {
    const obsId = Number(useLocalSearchParams().obsId);
    console.log("SextantCorrections obsId =", obsId);
    const router = useRouter();
    const db = useSQLiteContext();
    const obs = getObservation(db, Number(obsId));
    // SetObservationData(obs);

    const corrections = GetSextantCorrections();
    // const data: CorrectionsInput = {
    //     observation: obs,
    //     corrections: corrections,
    // };
    return (
        <View style={{ flex: 1 }}>
            {/* <SextantCorrectionsSummary
                data={data}
            />
            <FAB
                icon="arrow-left"
                style={{ position: 'absolute', margin: 16, left: 10, bottom: 0 }}
                onPress={() => {
                    router.back();
                }}
            /> */}
        </View>
    );
}
