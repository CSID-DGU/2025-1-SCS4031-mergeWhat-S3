// app/(tabs)/mypage/reviews.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockReviews = [
    {
        id: '1',
        title: '맛있는 분식',
        content: '아침에 구매했는데, 지난번 본 음식을 그대로 쓰시는 건지 오래된 느낌이었어요...',
        rating: 5,
        likes: 23,
        comments: 3,
        image: 'https://via.placeholder.com/80x80.png',
    },
    {
        id: '2',
        title: '시장 국밥집',
        content: '양이 많고 맛있었어요! 다음에 또 가고 싶네요.',
        rating: 4,
        likes: 15,
        comments: 2,
        image: 'https://via.placeholder.com/80x80.png',
    },
];

export const reviewCount = mockReviews.length;

const ReviewItem = ({ item }: { item: typeof mockReviews[0] }) => (
    <View style={styles.card}>
        <View style={styles.textContainer}>
            <Text style={styles.title}>
                {item.title} {'⭐'.repeat(item.rating)}
            </Text>
            <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
            <View style={styles.iconRow}>
                <Ionicons name="heart-outline" size={16} color="#999" />
                <Text style={styles.iconText}> {item.likes}</Text>
                <Ionicons name="chatbubble-outline" size={16} color="#999" style={{ marginLeft: 12 }} />
                <Text style={styles.iconText}> {item.comments}</Text>
            </View>
        </View>
    </View>
);

export default function UserReviewsScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={mockReviews}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ReviewItem item={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
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
    title: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    content: {
        fontSize: 13,
        color: '#666',
        marginTop: 3,
        marginBottom: 3,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    iconText: {
        fontSize: 12,
        color: '#999',
    },
});
