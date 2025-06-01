// app/(auth)/kakao.tsx
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Colors } from '@/constants/Colors';

const REDIRECT_URI = 'http://192.168.45.7:3030/auth/kakao';
const REST_API_KEY = '8c3664c384de04e9af29cb5c7d0581e2';

export default function KakaoLoginScreen() {
    const router = useRouter();
    const { loginWithToken } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(true);

    // WebView가 새 URL을 로드하기 전에 호출
    const handleShouldStartLoad = (event: any) => {
        const url: string = event.nativeEvent?.url ?? event.url;
        if (url.startsWith(`${REDIRECT_URI}?code=`)) {
            const code = url.split('code=')[1];
            requestToken(code);
            return false; // WebView가 콜백 페이지를 실제로 로드하지 않도록 막음
        }
        return true; // 나머지는 정상 로드
    };

    // WebView 로딩 상태만 감지 → 로딩 인디케이터용
    const handleNavigationStateChange = (event: WebViewNavigation) => {
        setIsNavigating(event.loading);
    };

    // 카카오 인가 코드 → 토큰 교환 → Context에 로그인 처리 → 마이페이지 이동
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
            console.log('[토큰 응답]', tokenData);

            if (!tokenData.access_token) {
                throw new Error('토큰 발급 실패: 응답에 access_token이 없습니다.');
            }

            const accessToken = tokenData.access_token;

            // 2) 프로필 요청
            const profileRes = await fetch('https://kapi.kakao.com/v2/user/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            console.log('[프로필 HTTP 상태]', profileRes.status, profileRes.ok);
            if (!profileRes.ok) {
                throw new Error(`프로필 조회 실패: HTTP ${profileRes.status}`);
            }

            const data = await profileRes.json();
            console.log('[프로필 JSON]', data);

            if (!data.kakao_account || !data.kakao_account.profile) {
                throw new Error('프로필 정보가 응답에 없습니다.');
            }

            // 정상적으로 프로필이 존재할 때만 로그인 처리
            await loginWithToken(accessToken);
            router.replace('/mypage');
        } catch (e: any) {
            console.error('프로필 조회 실패(전체):', e);
            Alert.alert('로그인 오류', '카카오 로그인에 실패했습니다.\n다시 시도해 주세요.');
            router.replace('/login');
        } finally {
            setIsLoading(false);
        }
    };

    // scope 파라미터를 추가해서 닉네임과 프로필 사진 권한을 요청
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
                    <ActivityIndicator size="small" color={Colors.BLACK} />
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
        backgroundColor: Colors.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
