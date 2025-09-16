import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { TasksProvider } from './tasks-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TasksProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} component={ModalScreen} /> */}
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Todo Task List' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TasksProvider>
  );
}
