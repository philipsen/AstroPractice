import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { PaperProvider } from 'react-native-paper';
import { migrateDbIfNeeded } from "../src/helpers/Migrations";

import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <>
      <PaperProvider>
        <SQLiteProvider databaseName="db.db" onInit={migrateDbIfNeeded}>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaProvider>
        </SQLiteProvider>
      </PaperProvider>
    </>
  );
}
