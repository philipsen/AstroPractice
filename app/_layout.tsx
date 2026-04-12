

import { Stack, useNavigationContainerRef } from "expo-router";
import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { lightAppTheme, nightVisionTheme } from '../src/theme/appThemes';
import { NightModeContext } from '../src/state/NightModeContext';

export default function RootLayout() {
  const [nightMode, setNightMode] = useState(false);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const currentPath = navigationRef.getCurrentRoute()?.path || navigationRef.getCurrentRoute()?.name;
      if (currentPath) {
        console.log('Navigated to:', currentPath);
      }
    });
    return unsubscribe;
  }, [navigationRef]);

  return (
    <NightModeContext.Provider value={{ nightMode, setNightMode }}>
      <PaperProvider theme={nightMode ? nightVisionTheme : lightAppTheme}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} navigationContainerRef={navigationRef} />
        </SafeAreaProvider>
      </PaperProvider>
    </NightModeContext.Provider>
  );
}
