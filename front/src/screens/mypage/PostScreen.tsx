// 파일 경로: src/screens/mypage/PostScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

// Ionicons을 react-native-vector-icons/Ionicons에서 직접 가져옵니다.
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MypageStackParamList } from '../../navigation/stack/MypageNavigator';
type MypageNavProp = NativeStackNavigationProp<MypageStackParamList, 'Post'>;

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

/**
 * 하나의 게시글(포스트) 아이템을 렌더링
 */
const PostItem = ({ item }: { item: typeof mockPosts[0] }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.thumbnail} />
    <View style={styles.textContainer}>
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.content} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.iconRow}>
        <Ionicons name="heart-outline" size={16} color="#999" />
        <Text style={styles.iconText}> {item.likes}</Text>
        <Ionicons
          name="chatbubble-outline"
          size={16}
          color="#999"
          style={{ marginLeft: 12 }}
        />
        <Text style={styles.iconText}> {item.comments}</Text>
      </View>
    </View>
  </View>
);

/**
 * 마이페이지 - 게시글 목록 화면
 */
export default function PostScreen() {
  // 만약 화면 내에서 navigation.navigate를 쓰려면 아래처럼 사용하세요:
  // const navigation = useNavigation<MypageNavProp>();

  return (
    <View style={styles.container}>
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostItem item={item} />}
      />
    </View>
  );
}

/**
 * 스타일 정의 (기존 코드와 동일)
 */
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
