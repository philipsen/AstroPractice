import SextantCorrectionsSummary, { CorrectionsInput } from '@/src/components/SextantCorrectionsSummary';
import { useObservationStore } from '@/src/state/useObservationStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { GetSextantCorrections, SetObservationData } from '../../../../src/helpers/astron/init';


export default function SextantCorrections() {
    const router = useRouter();
    const observation = useObservationStore((s) => s.observation);
    if (!observation) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading</Text>
            </View>
        );
    }
    SetObservationData(observation);

    const corrections = GetSextantCorrections();
    const data: CorrectionsInput = {
        observation: observation,
        corrections: corrections,
    };
    return (
        <View style={{ flex: 1 }}>
            <SextantCorrectionsSummary
                data={data}
            />
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
