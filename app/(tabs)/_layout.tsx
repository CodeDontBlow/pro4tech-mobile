import { Tabs } from 'expo-router';
import React from 'react';

export default function RootLayout() {
     return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                }}
            />
        </Tabs>
    );
}
