//app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';
import { AuthProvider } from '@/hooks/useAuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
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
                title: '시장',
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={
                      focused
                        ? require('@/assets/images/click_market_icon.png')
                        : require('@/assets/images/market_icon.png') // 활성 상태 이미지
                    }
                    style={{
                      width: 24,
                      height: 24,
                      resizeMode: 'contain',
                      marginBottom: -2,  // 텍스트와 간격 조절
                    }}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="comm"
              options={{
                title: '커뮤니티',
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={
                      focused
                        ? require('@/assets/images/click_community_icon.png')
                        : require('@/assets/images/community_icon.png')  // 활성 상태 이미지
                    }
                    style={{
                      width: 24,
                      height: 24,
                      resizeMode: 'contain',
                      marginBottom: -2,  // 텍스트와 간격 조절
                    }}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="mypage"
              options={{
                title: '마이페이지',
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={
                      focused
                        ? require('@/assets/images/click_mypage_icon.png')
                        : require('@/assets/images/mypage_icon.png')  // 활성 상태 이미지
                    }
                    style={{
                      width: 24,
                      height: 24,
                      resizeMode: 'contain',
                      marginBottom: -2,  // 텍스트와 간격 조절
                    }}
                  />
                ),
              }}
            />
          </Tabs>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
