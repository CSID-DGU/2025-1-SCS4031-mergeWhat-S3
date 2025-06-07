// navigations/MainBottomTab.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../types/common'; // MainTabParamList import
import MapStackNavigator from './stack/MapStackNavigator'; // MapStackNavigator import
import CommunityStackNavigator from './stack/CommunityNavigator'; // CommunityStackNavigator import
import AuthStackNavigator from './stack/AuthStackNavigator'; // AuthStackNavigator import

// 아이콘 이미지 파일들 import (경로 확인 필요)
import marketIcon from '../assets/market_icon.png';
import clickedMarketIcon from '../assets/click_market_icon.png'; // 경로 확인 (assets 폴더 내부에 assets 또 있는지)
import commIcon from '../assets/community_icon.png';
import clickedCommIcon from '../assets/click_community_icon.png';
import mypageIcon from '../assets/mypage_icon.png';
import clickedMypageIcon from '../assets/click_mypage_icon.png';

import {Image, StyleSheet} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<MainTabParamList>(); // MainTabParamList 적용

function MainBottomTab() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 60 + insets.bottom, // 안전 영역을 고려한 높이
          borderTopWidth: 0.3,
          borderTopColor: '#ccc',
          backgroundColor: '#fff',
          paddingBottom: insets.bottom, // ✅ 핵심
        },
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="Map" // 'Map' 탭 이름
        component={MapStackNavigator} // ✅ MapStackNavigator를 컴포넌트로 설정
        options={{
          tabBarLabel: '시장', // 탭바 라벨
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? clickedMarketIcon : marketIcon}
              style={[styles.icon, focused && styles.focusedIcon]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStackNavigator}
        options={{
          tabBarLabel: '커뮤니티',
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? clickedCommIcon : commIcon}
              style={[styles.icon, focused && styles.focusedIcon]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={AuthStackNavigator} // Assuming AuthStackNavigator is for MyPage/Auth flow
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? clickedMypageIcon : mypageIcon}
              style={[styles.icon, focused && styles.focusedIcon]}
              resizeMode="contain"
            />
          ),
        }}
      />
      {/* 만약 'MarketScreen'이 별도의 탭이라면 MainTabParamList에 추가하고 여기에 정의 */}
      {/* <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarLabel: '마켓',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? clickedMarketIcon : marketIcon}
              style={[styles.icon, focused && styles.focusedIcon]}
              resizeMode="contain"
            />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    borderTopWidth: 0.3,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontSize: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  focusedIcon: {
    tintColor: '#2a85ff', // 원하는 포커스 색상
  },
});

export default MainBottomTab;
