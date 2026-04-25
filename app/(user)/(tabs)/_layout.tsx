import { Tabs } from 'expo-router';
import React from 'react';
import TabBar from '@/components/TabBar/TabBar';

export default function UserTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="history" options={{ title: 'Histórico' }} />
      <Tabs.Screen name="waiting" options={{ href: null }} />
    </Tabs>
  );
}