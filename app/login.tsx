// app/login.tsx
import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();

    const handleKakaoLogin = () => {
        // 카카오 로그인 WebView가 있는 라우트로 이동
        router.push('/(auth)/kakao');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>로그인이 필요합니다</Text>
                <Button title="카카오 로그인" onPress={handleKakaoLogin} />
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
});
