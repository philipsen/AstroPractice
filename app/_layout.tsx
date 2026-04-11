

import { Stack, useNavigationContainerRef } from "expo-router";
import React, { useEffect, useState } from 'react';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NightModeContext } from '../src/state/NightModeContext';

const nightTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#000',
    surface: '#111',
    text: 'red',
    primary: 'red',
    accent: 'red',
  },
};

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#fff',
    text: '#000',
  },
};

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
      <PaperProvider theme={nightMode ? nightTheme : lightTheme}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} navigationContainerRef={navigationRef} />
        </SafeAreaProvider>
      </PaperProvider>
    </NightModeContext.Provider>
  );
}
