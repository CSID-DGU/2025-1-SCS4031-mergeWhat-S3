import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: 'absolute',
              },
              default: {},
            }),
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: '지도',
              tabBarIcon: ({ color }) => <Entypo name="map" size={24} color="black" />,
            }}
          />
          <Tabs.Screen
            name="market"
            options={{
              title: '시장',
              tabBarIcon: ({ color }) => <Entypo name="shop" size={24} color="black" />,
            }}
          />
          <Tabs.Screen
            name="comm"
            options={{
              title: '커뮤니티',
              tabBarIcon: ({ color }) => <Entypo name="chat" size={24} color="black" />,
            }}
          />
          <Tabs.Screen
            name="mypage"
            options={{
              title: '마이페이지',
              tabBarIcon: ({ color }) => <Octicons name="person" size={24} color="black" />,
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
