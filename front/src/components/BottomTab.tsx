import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet} from 'react-native';

// Screens
import MapHomeScreen from '../screens/map/MapHomeScreen';
//import MarketScreen from '../screens/market/MarketScreen';
import CommunityScreen from '../screens/community/PostListScreen';
import MypageScreen from '../screens/mypage/MypageScreen';
//import AuthHomeScreen from '../screens/auth/AuthHomeScreen'; //로그인 및 회원가입
import AuthStackNavigator from '../navigations/stack/AuthStackNavigator';
import CommunityStackNavigator from '../navigations/stack/CommunityNavigator';

// 아이콘
import mapIcon from '../assets/map_icon.png';
import clickedMapIcon from '../assets/click_map_icon.png';
import marketIcon from '../assets/market_icon.png';
import clickedMarketIcon from '../assets/click_market_icon.png';
import commIcon from '../assets/community_icon.png';
import clickedCommIcon from '../assets/click_community_icon.png';
import mypageIcon from '../assets/mypage_icon.png';
import clickedMypageIcon from '../assets/click_mypage_icon.png';
import PostListScreen from '../screens/community/PostListScreen';

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
      }}>
      <Tab.Screen
        name="Map"
        component={MapHomeScreen}
        options={{
          tabBarLabel: '시장',
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
        name="Mypage"
        component={AuthStackNavigator}
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
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    borderTopWidth: 0.3,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'underfined',
  },
  focusedIcon: {
    tintColor: '#2a85ff',
  },
});

export default BottomTab;
