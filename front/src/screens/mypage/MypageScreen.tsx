// 파일 경로: src/screens/mypage/MypageScreen.tsx

import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

// Expo Router 대신 React Navigation 사용
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// AuthContext 훅 경로가 실제로는 src/hooks/useAuthContext.ts로 되어 있어야 합니다.
import { useAuthContext } from '../../hooks/useAuthContext';

// “게시글”, “리뷰” 등의 네비게이터 이름을 아래 MypageStackParamList 타입과 동일하게 정의합니다.
// (이름은 MypageNavigator.tsx에서 정의한 것과 일치해야 합니다.)
type MypageNavProp = NativeStackNavigationProp<
  RootStackParamList & MypageStackParamList, // 필요 시, RootStack과 합쳐서 타입 검사
  'MypageHome'
>;

const stats = [
  { label: '게시글', count: 46, screen: 'Post' },
  { label: '리뷰', count: 21, screen: 'Review' },
  { label: '찜한 가게', count: 33, screen: 'BookMark' },
] as const;

const communityItems = [
  { label: '댓글 단 글', screen: 'Comment' },
  { label: '좋아요 누른 글', screen: 'Like' },
] as const;

const otherItems = ['문의하기', '로그아웃', '회원 탈퇴'] as const;

export default function MypageScreen() {
  const navigation = useNavigation<MypageNavProp>();
  const { isLoading, isLoggedIn, user, logout } = useAuthContext();

  // 로딩 중일 때
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 로그인되어 있지 않은 경우: 로그인 화면으로 이동
  if (!isLoggedIn || !user) {
    // React Navigation의 stack으로 이동 (예: AuthStackNavigator 내 LoginScreen)
    navigation.replace('Login'); 
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 프로필 헤더 */}
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            {user.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>?</Text>
              </View>
            )}
          </View>
          <View style={styles.userInfoRow}>
            <Text style={styles.userName}>{user.nickname}님</Text>
          </View>
        </View>

        {/* 통계 카드 */}
        <View style={styles.card}>
          {stats.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={styles.statItem}
              onPress={() => {
                // React Navigation 기준: 'Post' 등 Stack 내 화면 이름으로 네비게이트
                navigation.navigate(item.screen);
              }}
            >
              <Text style={styles.statCount}>{item.count}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
              {idx < stats.length - 1 && (
                <View style={styles.dividerVertical} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 커뮤니티 섹션 */}
        <Text style={styles.sectionTitle}>커뮤니티</Text>
        <View style={styles.sectionList}>
          {communityItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.listItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.listItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 기타 섹션 */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>기타</Text>
        <View style={styles.sectionList}>
          {otherItems.map((title) => (
            <TouchableOpacity
              key={title}
              style={styles.listItem}
              onPress={() => {
                if (title === '로그아웃') {
                  Alert.alert(
                    '로그아웃',
                    '정말 로그아웃 하시겠습니까?',
                    [
                      { text: '취소', style: 'cancel' },
                      {
                        text: '확인',
                        style: 'destructive',
                        onPress: async () => {
                          await logout();
                          // 마이페이지 스택 최상위로 돌아가서 replace
                          navigation.replace('MypageHome');
                        },
                      },
                    ],
                    { cancelable: true }
                  );
                } else if (title === '회원 탈퇴') {
                  navigation.navigate('Withdraw');
                } else {
                  Alert.alert(
                    title,
                    `${title} 화면은 아직 구현되지 않았습니다.`
                  );
                }
              }}
            >
              <Text style={styles.listItemText}>{title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoTitle}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 30 }}>
            시장하시죠
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 스타일은 원본과 거의 동일하게 가져왔습니다.
const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#fff' },
  content: {
    flexGrow: 1,
    paddingTop: 70,
    paddingBottom: 60,
    paddingHorizontal: 30,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: { width: 64, height: 64, borderRadius: 32 },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, color: '#fff' },
  userInfoRow: { marginLeft: 12 },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingLeft: 3,
    paddingBottom: 3,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statCount: { fontSize: 16, fontWeight: 'bold', color: '#4A90E2' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  dividerVertical: {
    position: 'absolute',
    right: 0,
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: '#eee',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 32,
    marginBottom: 8,
  },
  sectionList: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: { fontSize: 14, color: '#333' },

  logoTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
