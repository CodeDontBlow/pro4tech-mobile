import { Tabs } from 'expo-router';
import React from 'react';
import Header from '@/components/Header/Header';
import TabBar from '@/components/TabBar/TabBar';

export default function AgentTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        header: () => <Header title="ORBITA" showProfile profileRoute="/(agent)/profile" />,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Index' }} />
      <Tabs.Screen name="chamados" options={{ title: 'Tickets' }} />
    </Tabs>
  );
}