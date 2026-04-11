import { useGroupsStore } from '@/src/state/useGroupsStore';
import { useObservationStore } from '@/src/state/useObservationStore';
import {
  createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs';
import { useLocalSearchParams, withLayoutContext } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNightMode } from '../../../../src/state/NightModeContext';

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TopTabsLayout() {
  const { nightMode } = useNightMode();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: nightMode ? '#181818' : '#fff' }}>
      <MaterialTopTabs
        id="material-top-tabs"
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
          tabBarStyle: {
            backgroundColor: nightMode ? '#181818' : '#fff',
            borderBottomColor: nightMode ? 'red' : '#000',
            borderBottomWidth: 1,
          },
          tabBarLabelStyle: {
            color: nightMode ? 'red' : '#000',
            fontWeight: 'bold',
          },
          tabBarIndicatorStyle: {
            backgroundColor: nightMode ? 'red' : '#000',
          },
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
