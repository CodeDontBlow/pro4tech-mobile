import { Stack } from 'expo-router';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(user)" />
      <Stack.Screen name="(agent)" />
    </Stack>
  );
}