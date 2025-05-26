// app/(tabs)/mypage/index.tsx
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// import useAuth from '../../../hooks/queries/useAuth'; // 추후 통합 시 주석 해제

// const statsConfig = (user: { postCount: number; reviewCount: number; bookmarkedCount: number }) => [
//   { label: '게시글', count: user.postCount, screen: '/mypage/posts' },
//   { label: '리뷰', count: user.reviewCount, screen: '/mypage/reviews' },
//   { label: '찜한 가게', count: user.bookmarkedCount, screen: '/mypage/bookmarks' },
// ] as const;

const stats = [
    { label: '게시글', count: 46, screen: '/mypage/posts' },
    { label: '리뷰', count: 21, screen: '/mypage/reviews' },
    { label: '찜한 가게', count: 33, screen: '/mypage/bookmarks' },
] as const;

const communityItems = ['댓글 단 글', '좋아요 누른 글'] as const;
const otherItems = ['문의하기', '차량 정보 등록하기', '로그아웃', '회원 탈퇴'] as const;

export default function MypageIndexScreen() {
    const router = useRouter();

    // 로그인 상태 판단 (추후 통합)
    // const { isLoading: authLoading, isLoggedIn, user } = useAuth();
    // useEffect(() => {
    //   if (!authLoading && !isLoggedIn) {
    //     router.replace('/login');
    //   }
    // }, [authLoading, isLoggedIn]);
    // if (authLoading) {
    //   return (
    //     <View style={styles.loader}>
    //       <ActivityIndicator size="large" />
    //     </View>
    //   );
    // }
    // if (!isLoggedIn || !user) return null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile Header */}
                <View style={styles.profileRow}>
                    <View style={styles.avatarWrapper}>
                        <Ionicons name="person-circle-outline" size={64} color="#ccc" />
                        <TouchableOpacity style={styles.editIcon}>
                            <Ionicons name="pencil" size={16} color="#555" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.userInfoRow}>
                        <Text style={styles.userName}>박서영님</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={20} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Stats Card */}
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

                {/* Community Section */}
                <Text style={styles.sectionTitle}>커뮤니티</Text>
                <View style={styles.sectionList}>
                    {communityItems.map(title => (
                        <TouchableOpacity key={title} style={styles.listItem}>
                            <Text style={styles.listItemText}>{title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Other Section */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>기타</Text>
                <View style={styles.sectionList}>
                    {otherItems.map(title => (
                        <TouchableOpacity key={title} style={styles.listItem}>
                            <Text style={styles.listItemText}>{title}</Text>
                        </TouchableOpacity>
                    ))}
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
        position: 'relative',
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 2,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    userInfoRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
    userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },

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
    dividerVertical: { position: 'absolute', right: 0, top: 8, bottom: 8, width: 1, backgroundColor: '#eee' },

    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 32, marginBottom: 8 },
    sectionList: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, overflow: 'hidden' },
    listItem: { paddingVertical: 16, paddingHorizontal: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    listItemText: { fontSize: 14, color: '#333' },
});