import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >

      <Tabs.Screen
        name="groups" // or whatever your screen name is
        options={{
          headerShown: false,
          title: '',
        }}
      />
    </Tabs>
  );
}

