// 화면 전환되는 네비게이션을 다 이 파일에서!!
import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthHomeScreen from '../../screens/auth/AuthHomeScreen'; // 카카오로그인 버튼 있는 화면
import KakaoLoginScreen from '../../screens/auth/KakaoLoginScreen'; // 실제 카카오로그인 이루어지는 화면
import {authNavigations} from '../../constants';
import {kakaoLogin} from '../../api/auth';

export type AuthStackParamList = {
  [authNavigations.AUTH_HOME]: undefined;
  [authNavigations.KAKAO]: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: 'white',
        },
        headerStyle: {
          shadowColor: 'gray',
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontSize: 15,
        },
        headerTintColor: 'black',
      }}>
      <Stack.Screen
        name={authNavigations.AUTH_HOME}
        component={AuthHomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={authNavigations.KAKAO}
        component={KakaoLoginScreen}
        options={{
          headerTitle: '카카오 로그인',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default AuthStackNavigator;
