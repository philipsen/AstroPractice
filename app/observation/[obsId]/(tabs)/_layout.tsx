import { useGroupsStore } from '@/src/state/useGroupsStore';
import { useObservationStore } from '@/src/state/useObservationStore';
import {
  createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs';
import { useLocalSearchParams, withLayoutContext } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TopTabsLayout() {

  const observationId = Number(useLocalSearchParams().obsId);
   const selectedGroupId = useGroupsStore((s) => s.selectedGroupId);

  const observationInit = useObservationStore((s) => s.init);


  useEffect(() => {
    (async () => {
      console.log("TopTabsLayout useEffect: calling observationInit with obsId=", observationId, " selectedGroupId=", selectedGroupId);
       await observationInit(observationId, selectedGroupId);
    })();
  }, [observationInit, observationId, selectedGroupId]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MaterialTopTabs
        id="material-top-tabs"
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
        }}
      >
        <MaterialTopTabs.Screen
          name="index"
          initialParams={{ obsId: observationId }}
          options={{ title: 'Edit' }} />
        {/* <MaterialTopTabs.Screen
          name="sextant"
          initialParams={{ obsId: observationId }}
          options={{ title: 'Sextant' }} />
        <MaterialTopTabs.Screen
          name="reduction"
          initialParams={{ obsId: observationId }}
          options={{ title: 'Reduction' }} /> */}
      </MaterialTopTabs>

    </SafeAreaView>
  );
}
