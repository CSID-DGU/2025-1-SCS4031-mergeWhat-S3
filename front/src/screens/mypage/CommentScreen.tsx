// app/(tabs)/mypage/comments.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export const options = {
    title: '댓글 단 글',
    headerBackVisible: true,
    headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
};

const mockComments = [
    {
        id: '1',
        postTitle: '홍대 맛집 떡볶이 후기',
        commentText: '저도 여기 떡볶이 진짜 맛있더라고요!',
        likes: 12,
        // sample thumbnail (optional)
        image: 'https://via.placeholder.com/80x80.png',
    },
    {
        id: '2',
        postTitle: '강남 분식 추천',
        commentText: '요즘 여기 떡볶이 가격 엄청 올랐어요ㅠ',
        likes: 5,
        image: 'https://via.placeholder.com/80x80.png',
    },
    {
        id: '3',
        postTitle: '을지로 국수 맛집',
        commentText: '국수 너무 맛있어서 재방문 예정입니다!',
        likes: 8,
        image: 'https://via.placeholder.com/80x80.png',
    },
];

const CommentItem = ({ item }: { item: typeof mockComments[0] }) => (
    <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.thumbnail} />
        <View style={styles.textContainer}>
            <Text style={styles.postTitle} numberOfLines={1}>{item.postTitle}</Text>
            <Text style={styles.commentText} numberOfLines={2}>{item.commentText}</Text>
            <View style={styles.iconRow}>
                <Ionicons name="heart-outline" size={16} color="#999" />
                <Text style={styles.iconText}> {item.likes}</Text>
            </View>
        </View>
    </View>
);

export default function CommentsScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={mockComments}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <CommentItem item={item} />}
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
    commentText: {
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
