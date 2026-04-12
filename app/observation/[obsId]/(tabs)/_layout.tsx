import { useGroupsStore } from '@/src/state/useGroupsStore';
import { useObservationStore } from '@/src/state/useObservationStore';
import {
  createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs';
import { useLocalSearchParams, withLayoutContext } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TopTabsLayout() {
  const { colors } = useTheme();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <MaterialTopTabs
        id="material-top-tabs"
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderBottomColor: colors.outline,
            borderBottomWidth: 1,
          },
          tabBarLabelStyle: {
            color: colors.onSurface,
            fontWeight: 'bold',
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
          },
        }}
      >
        <MaterialTopTabs.Screen
          name="index"
          initialParams={{ obsId: observationId }}
          options={{ title: 'Edit' }} />
        <MaterialTopTabs.Screen
          name="sextant"
          initialParams={{ obsId: observationId }}
          options={{ title: 'Sextant' }} />
        <MaterialTopTabs.Screen
          name="reduction"
          initialParams={{ obsId: observationId }}
          options={{ title: 'Reduction' }} />
      </MaterialTopTabs>

    </SafeAreaView>
  );
}
