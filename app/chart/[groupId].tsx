import { ObservationEntity } from "@/models/ObservationEntity";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { FAB, Surface, Switch, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
// import ObservationPlot from "../../components/ObservationPlot2";
// import Zoomable from "../../components/Zoomable";
import { Degs_f } from "../../helpers/astron/Astron";

export default function Chart() {
  // console.log("Chart render start");
  const groupId = Number(useLocalSearchParams().groupId);
  const db = useSQLiteContext();
  const [observations, setObservations] = useState<ObservationEntity[]>([]);
  const [selectedObservations, setSelectedObservations] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetchItems = useCallback(() => {
    // console.log("refetchItems called");
    async function refetch() {
      setIsLoading(true);
      await db.withExclusiveTransactionAsync(async () => {
        const newObservations = await db.getAllAsync<ObservationEntity>(
          'SELECT * FROM observations WHERE groupId = ? ORDER BY created DESC;',
          [groupId]
        );
        setObservations(newObservations);
        setSelectedObservations(new Array(newObservations.length).fill(true));
        setIsLoading(false);
      });
    }
    refetch();
  }, [groupId]);

  useEffect(() => {
    // console.log("useEffect refetchItems called");
    refetchItems();
  }, [refetchItems]);

  // console.log("Chart: groupId=", groupId, " observations=", observations.length);

  const selectedObservationsList = useMemo(() => {
    return observations.filter((_, index) => selectedObservations[index]);
  }, [observations, selectedObservations]);

  const handleSwitchChange = useCallback((index: number, value: boolean) => {
    setSelectedObservations(prev => {
      const newSelected = [...prev];
      newSelected[index] = value;
      return newSelected;
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading observations...</Text>
        </View>
      ) : (
        <>
          <View style={{ flex: 1, padding: 16, marginTop: 20 }}>
            {/* <Zoomable contentWidth={400} contentHeight={400} minScale={1} maxScale={4} doubleTapScale={2.5}>
              <ObservationPlot observations={selectedObservationsList} />
            </Zoomable> */}
          </View>

          <View style={{ position: 'absolute', bottom: 16, right: 60, left: 60, maxHeight: 300 }}>
            <ScrollView style={{ borderRadius: 8, padding: 8 }}>
              {observations.map((observation, index) => (
                <Surface key={observation.id} style={{ marginBottom: 8, padding: 2, borderRadius: 4 }} elevation={2}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>{new Date(observation.created).toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' })}</Text>
                        <Text variant="bodyMedium" style={{ marginLeft: 8 }}>{observation.object}</Text>
                      </View>
                      <Text variant="bodyMedium">Hs: {Degs_f(observation.angle)}</Text>
                    </View>
                    <Switch
                      value={selectedObservations[index] || false}
                      onValueChange={(value) => handleSwitchChange(index, value)}
                    />
                  </View>
                </Surface>
              ))}
            </ScrollView>
          </View>

          <View style={{ position: 'absolute', bottom: 16, left: 16 }}>
            <FAB
              icon="arrow-left"
              size="small"
              onPress={() => router.back()}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
