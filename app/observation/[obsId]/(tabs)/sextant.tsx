import SextantCorrectionsSummary, { CorrectionsInput } from '@/src/components/SextantCorrectionsSummary';
import { useObservationStore } from '@/src/state/useObservationStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { GetSextantCorrections, SetObservationData } from '../../../../src/helpers/astron/init';
import { useNightMode } from '../../../../src/state/NightModeContext';


export default function SextantCorrections() {
    const { nightMode, setNightMode } = useNightMode();
    const router = useRouter();
    const observation = useObservationStore((s) => s.observation);
    if (!observation) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: nightMode ? '#181818' : '#fff' }}>
                <Text style={{ color: nightMode ? 'red' : '#000' }}>Loading</Text>
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
        <View style={{ flex: 1, backgroundColor: nightMode ? '#181818' : '#fff' }}>
            <SextantCorrectionsSummary
                data={data}
            />
            {/* FAB row: back and night mode side by side at bottom left */}
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
}
