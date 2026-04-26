import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="triage-intro" />
      <Stack.Screen name="triage" />
      <Stack.Screen name="triage-end" />
      <Stack.Screen name="waiting" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}