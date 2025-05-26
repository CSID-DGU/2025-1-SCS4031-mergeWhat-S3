// app/(tabs)/mypage/bookmarks.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockBookmarks = [
    {
        id: '1',
        name: '맛있는 분식',
        description: '떡볶이, 튀김, 순대 전문 분식집. 점심시간 붐빔 주의!',
        likes: 120,
        image: 'https://via.placeholder.com/80x80.png',
    },
    {
        id: '2',
        name: '전통 국밥집',
        description: '푸짐한 고기국밥과 깍두기 맛집!',
        likes: 95,
        image: 'https://via.placeholder.com/80x80.png',
    },
];

const BookmarkItem = ({ item }: { item: typeof mockBookmarks[0] }) => (
    <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.thumbnail} />
        <View style={styles.textContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.content} numberOfLines={2}>{item.description}</Text>
            <View style={styles.iconRow}>
                <Ionicons name="heart" size={16} color="#f66" />
                <Text style={styles.iconText}> {item.likes}</Text>
            </View>
        </View>
    </View>
);

export default function UserBookmarksScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={mockBookmarks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <BookmarkItem item={item} />}
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
