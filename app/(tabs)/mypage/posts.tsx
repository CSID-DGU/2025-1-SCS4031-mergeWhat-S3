// app/(tabs)/mypage/posts.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, Stack } from 'expo-router';

const mockPosts = [
    {
        id: '1',
        title: '맛있는분식집 떡볶이 가격 올랐나요?',
        content: '저번에 갔을때는 3000원이었던 것 같은데 오늘 갔더니 3500원 이네요?',
        likes: 23,
        comments: 3,
        image: 'https://via.placeholder.com/80x80.png',
    },
    {
        id: '2',
        title: '근처 시장 떡볶이 리뷰',
        content: '맛있긴 한데 가격이 너무 자주 오르는 것 같아요...',
        likes: 12,
        comments: 5,
        image: 'https://via.placeholder.com/80x80.png',
    },
];

export const postCount = mockPosts.length;

const PostItem = ({ item }: { item: typeof mockPosts[0] }) => (
    <View style={styles.card}>
        <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
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

export default function UserPostsScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>

            <FlatList
                data={mockPosts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <PostItem item={item} />}
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
