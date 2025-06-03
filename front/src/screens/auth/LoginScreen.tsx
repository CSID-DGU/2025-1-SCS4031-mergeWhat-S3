// src/screens/auth/LoginScreen.tsx

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
// Ionicons 라이브러리에서 'chatbubble' 아이콘(속이 찬 말풍선)을 가져옵니다.
// Expo 프로젝트라면 아래와 같이 불러오셔도 됩니다.
// import { Ionicons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MypageStackParamList } from '../../navigations/stack/MyPageNavigator';

type LoginNavProp = NativeStackNavigationProp<MypageStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();

  const handleKakaoLogin = () => {
    navigation.navigate('KakaoLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>로그인이 필요합니다</Text>

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
    marginBottom: 24,
  },

  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FEE500',
    borderRadius: 8,

    paddingVertical: 12,
    paddingHorizontal: 20,

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
});
