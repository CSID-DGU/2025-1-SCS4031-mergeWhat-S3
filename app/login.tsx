// app/login.tsx
import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const footerImage = require('../assets/images/logo.png');

export default function LoginScreen() {
    const router = useRouter();

    const handleKakaoLogin = () => {
        // 카카오 로그인 WebView가 있는 라우트로 이동
        router.push('/(auth)/kakao');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <Image source={footerImage} style={styles.logo} resizeMode="contain" />
                <TouchableOpacity
                    style={styles.kakaoButton}
                    activeOpacity={0.7}
                    onPress={handleKakaoLogin}
                >
                    <Ionicons
                        name="chatbubble"
                        size={18}
                        color="#191919"
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>카카오 로그인</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    inner: {
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    kakaoButton: {
        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#FEE500',
        borderRadius: 8,

        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 20,
        // Android 그림자
        elevation: 4,
    },
    icon: {
        marginRight: 10, // 아이콘과 텍스트 사이 간격
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#191919',

        includeFontPadding: false, // 안드로이드에서 위아래 여백을 없애서 수직 중앙 정렬
        lineHeight: 18,            // 텍스트가 높이 방향으로도 아이콘과 같은 중앙에 위치하게 해줍니다
    },
    logo: {
        width: 240,  // 적절한 너비
        height: 100, // 이미지 비율에 맞게 높이 조정
        marginBottom: 50,
    },

});
