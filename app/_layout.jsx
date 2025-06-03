import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Inter-Black": require('../assets/fonts/Inter_18pt-Black.ttf'),
    "Inter-Bold": require('../assets/fonts/Inter_18pt-Bold.ttf'),
    "Inter-Medium": require('../assets/fonts/Inter_18pt-Medium.ttf'),
    "Inter-Regular": require('../assets/fonts/Inter_18pt-Regular.ttf'),
    "Inter-Light": require('../assets/fonts/Inter_18pt-Light.ttf'),
    "Inter-Thin": require('../assets/fonts/Inter_18pt-Thin.ttf'),
    "Inter-Semibold": require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
    "Inter-ExtraBold": require('../assets/fonts/Inter_18pt-ExtraBold.ttf'),
    "Inter-ExtraLight": require('../assets/fonts/Inter_18pt-ExtraLight.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='(dashboard)'
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name='(auth)'
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name='(reports)'
          options={{
            headerShown: false
          }}
        />
      </Stack>
      {/* <StatusBar style="auto" /> */}
    </ThemeProvider>
  );
}
