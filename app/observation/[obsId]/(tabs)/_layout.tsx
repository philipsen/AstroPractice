import {
  createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs';
import { useLocalSearchParams, withLayoutContext } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SetObservationData } from '../../../../helpers/astron/init';
import { getObservation } from '../../../../helpers/ObservationRepository';

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TopTabsLayout() {

  const observationId = Number(useLocalSearchParams().obsId);
  const db = useSQLiteContext();
  const obs = getObservation(db, Number(observationId));
  SetObservationData(obs);

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
