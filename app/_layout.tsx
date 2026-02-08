import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';

import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <>
      <PaperProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaProvider>
      </PaperProvider>
    </>
  );
}
