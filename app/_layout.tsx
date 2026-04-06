import { Stack } from 'expo-router';
import 'react-native-reanimated';

export const unstable_settings = {
    anchor: '(user)',
};

export default function RootLayout() {
    return (
        <Stack>
          <Stack.Screen name="(user)" options={{ headerShown: false }} />
          <Stack.Screen name="cadastro" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="triage" options={{ title: 'Triagem', headerShown: true }} />
        </Stack>
    );
}