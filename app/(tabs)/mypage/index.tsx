// app/(tabs)/mypage/index.tsx
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
import { useRouter } from 'expo-router';
import { useAuthContext } from '../../../hooks/useAuthContext';
import LoginScreen from '../../login';
import { postCount } from './posts';
import { reviewCount } from './reviews';
import { bookmarkCount } from './bookmarks';

const stats = [
    { label: '게시글', count: postCount, screen: '/mypage/posts' },
    { label: '리뷰', count: reviewCount, screen: '/mypage/reviews' },
    { label: '찜한 가게', count: bookmarkCount, screen: '/mypage/bookmarks' },
] as const;

const communityItems = [
    { label: '댓글 단 글', screen: '/mypage/comments' },
    { label: '좋아요 누른 글', screen: '/mypage/likes' },
] as const;

const otherItems = ['문의하기', '로그아웃', '회원 탈퇴'] as const;

const footerImage = require('../../../assets/images/logo.png');

export default function MypageIndexScreen() {
    const router = useRouter();
    const { isLoading, isLoggedIn, user, logout } = useAuthContext();

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isLoggedIn || !user) {
        return <LoginScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* 프로필 헤더 */}
                <View style={styles.profileRow}>
                    <View style={styles.avatarWrapper}>
                        {user.profileImage ? (
                            <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
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
                            onPress={() => router.push(item.screen)}
                        >
                            <Text style={styles.statCount}>{item.count}</Text>
                            <Text style={styles.statLabel}>{item.label}</Text>
                            {idx < stats.length - 1 && <View style={styles.dividerVertical} />}
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
                            onPress={() => router.push(item.screen)}
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
                                                    router.replace('/mypage');
                                                },
                                            },
                                        ],
                                        { cancelable: true }
                                    );
                                } else if (title === '회원 탈퇴') {
                                    router.push('/mypage/withdraw');
                                } else {
                                    Alert.alert(title, `${title} 화면은 아직 구현되지 않았습니다.`);
                                }
                            }}
                        >
                            <Text style={styles.listItemText}>{title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.footerImageWrapper}>
                    <Image source={footerImage} style={styles.footerImage} resizeMode="contain" />
                </View>

            </ScrollView>

        </SafeAreaView>
    );
}

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
    userName: { fontSize: 18, fontWeight: 'bold', color: '#333', paddingLeft: 3, paddingBottom: 3, },

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

    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 32, marginBottom: 8 },
    sectionList: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, overflow: 'hidden' },
    listItem: {
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    listItemText: { fontSize: 14, color: '#333' },
    logoTitle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    footerImageWrapper: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    footerImage: {
        width: 240,
        height: 120, // 또는 원본 비율에 맞게 조정
    },

});
