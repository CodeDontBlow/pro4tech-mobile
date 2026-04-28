import { Tabs } from 'expo-router';
import React from 'react';
import Header from '@/components/Header/Header';
import TabBar from '@/components/TabBar/TabBar';

export default function UserTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        header: () => <Header title="ORBITA" showProfile />,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="history" options={{ title: 'Histórico' }} />
      <Tabs.Screen name="waiting" options={{ href: null }} />
    </Tabs>
  );
}