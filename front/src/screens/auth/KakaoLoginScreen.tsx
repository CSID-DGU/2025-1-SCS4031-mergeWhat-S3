// src/screens/auth/KakaoLoginScreen.tsx

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthContext } from '../../hooks/useAuthContext';
import { colors } from '../../constants/colors';
import { MypageStackParamList } from '../../navigations/stack/MyPageNavigator';

type KakaoNavProp = NativeStackNavigationProp<MypageStackParamList, 'KakaoLogin'>;

const REDIRECT_URI = 'http://192.168.45.7:3030/auth/kakao';
const REST_API_KEY  = '8c3664c384de04e9af29cb5c7d0581e2';

export default function KakaoLoginScreen() {
  const navigation = useNavigation<KakaoNavProp>();
  const { isLoggedIn, loginWithToken } = useAuthContext();

  const [isLoading, setIsLoading]       = useState(false);
  const [isNavigating, setIsNavigating] = useState(true);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  // WebView 로드 전 URL 검사
  const handleShouldStartLoad = (event: any) => {
    const url: string = event.nativeEvent?.url ?? event.url;
    if (url.startsWith(`${REDIRECT_URI}?code=`)) {
      const code = url.split('code=')[1];
      requestToken(code);
      return false; // WebView가 콜백 페이지를 실제로 로드하지 않도록 막음
    }
    return true;
  };

  // WebView 로딩 상태 감지
  const handleNavigationStateChange = (event: WebViewNavigation) => {
    setIsNavigating(event.loading);
  };

  // 인가 코드 → 토큰 요청 → 프로필 조회 → Context에 로그인 처리
  const requestToken = async (code: string) => {
    setIsLoading(true);
    try {
      // 1) 토큰 요청
      const response = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=authorization_code
               &client_id=${REST_API_KEY}
               &redirect_uri=${encodeURIComponent(REDIRECT_URI)}
               &code=${code}`.replace(/\s+/g, ''),
      });
      const tokenData = await response.json();
      if (!tokenData.access_token) {
        throw new Error('토큰 발급 실패: 응답에 access_token이 없습니다.');
      }
      const accessToken = tokenData.access_token;

      // 2) 프로필 요청
      const profileRes = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!profileRes.ok) {
        throw new Error(`프로필 조회 실패: HTTP ${profileRes.status}`);
      }
      const data = await profileRes.json();
      if (!data.kakao_account?.profile) {
        throw new Error('프로필 정보가 응답에 없습니다.');
      }

      // 3) Context에 로그인 처리
      await loginWithToken(accessToken);

      // 4) ‘로그인 성공’ 상태를 표시
      setJustLoggedIn(true);

    } catch (e: any) {
      console.error('프로필 조회 실패(전체):', e);
      Alert.alert('로그인 오류', '카카오 로그인에 실패했습니다.\n다시 시도해 주세요.');

      // 실패 시 다시 로그인 화면으로 되돌리기
      navigation.replace('Login');
    } finally {
      setIsLoading(false);
    }
  };

  // justLoggedIn 과 isLoggedIn 값이 모두 true가 된 시점에만 replace 호출
  useEffect(() => {
    if (justLoggedIn && isLoggedIn) {
      navigation.replace('MypageHome');
    }
  }, [justLoggedIn, isLoggedIn, navigation]);

  // 카카오 인가 URL
  const kakaoAuthUrl = `
    https://kauth.kakao.com/oauth/authorize?
      response_type=code
      &client_id=${REST_API_KEY}
      &redirect_uri=${encodeURIComponent(REDIRECT_URI)}
      &scope=profile_nickname,profile_image
  `.replace(/\s+/g, '');

  return (
    <SafeAreaView style={styles.container}>
      {(isNavigating || isLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={colors.BLACK} />
        </View>
      )}
      <WebView
        style={styles.container}
        source={{ uri: kakaoAuthUrl }}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
