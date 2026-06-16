import { SymbolView } from 'expo-symbols';
import { Tabs, useRouter } from 'expo-router';
import { Platform, Pressable, BackHandler } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Funkce pro zavření/minimalizaci aplikace
  const handleCloseApp = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp(); // Na Androidu aplikaci úplně ukončí
    } else {
      // Na iOS programové zavření Apple zakazuje (App Store by aplikaci zamítl)
      // Vyřešeno odnavigováním na pozadí/zpět do kořene routeru
      if (router.canGoBack()) {
        router.dismissAll();
      }
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'ToDo Teddy events',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'checklist',
                android: 'playlist_add_check',
                web: 'playlist_add_check',
              }}
              tintColor={color}
              size={28}
            />
          ), 
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Popis',
          headerTitle: 'Description by @dH',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'text.justify',
                android: 'notes',
                web: 'notes',
              }}
              tintColor={color}
              size={28}
            />
          ),
          headerRight: () => (
            // Křížek, který spouští funkci handleCloseApp
            <Pressable onPress={handleCloseApp} style={{ marginRight: 15 }}>
              {({ pressed }) => (
                <SymbolView
                  name={{
                    ios: 'xmark.circle',
                    android: 'close',
                    web: 'close',
                  }}
                  size={25}
                  tintColor={Colors[colorScheme].text}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
