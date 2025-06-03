// app/(tabs)/mypage/likes.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export const options = {
    title: '좋아요 누른 글',
    headerBackVisible: true,
    headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
};

const mockLikes = [
    {
        id: '1',
        postTitle: '가로수길 카페 추천',
        snippet: '여기 분위기랑 디저트가 최고였어요!',
        likes: true, // 좋아요 누른 여부(더미) 혹은 좋아요 수 표시
        image: 'https://via.placeholder.com/80x80.png',
    },
    {
        id: '2',
        postTitle: '신촌 떡볶이집 가격 비교',
        snippet: 'A집이 B집보다 쫀득하더라고요.',
        likes: true,
        image: 'https://via.placeholder.com/80x80.png',
    },
    {
        id: '3',
        postTitle: '홍대 맛집 리스트',
        snippet: '여기 X식당 꼭 가보세요!',
        likes: true,
        image: 'https://via.placeholder.com/80x80.png',
    },
];

const LikeItem = ({ item }: { item: typeof mockLikes[0] }) => (
    <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.thumbnail} />
        <View style={styles.textContainer}>
            <Text style={styles.postTitle} numberOfLines={1}>{item.postTitle}</Text>
            <Text style={styles.snippet} numberOfLines={2}>{item.snippet}</Text>
            <View style={styles.iconRow}>
                <Ionicons name="heart" size={16} color="#E0245E" />
                <Text style={styles.iconText}> 좋아요 표시</Text>
            </View>
        </View>
    </View>
);

export default function LikesScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={mockLikes}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <LikeItem item={item} />}
                contentContainerStyle={{ padding: 16 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    card: {
        flexDirection: 'row',
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 6,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    postTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    snippet: {
        fontSize: 13,
        color: '#666',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    iconText: {
        fontSize: 12,
        color: '#E0245E',
        marginLeft: 4,
    },
});
