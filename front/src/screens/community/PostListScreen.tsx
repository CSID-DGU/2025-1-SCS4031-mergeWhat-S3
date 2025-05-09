import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CommunityStackParamList} from '../../types/common';

type NavigationProp = StackNavigationProp<
  CommunityStackParamList,
  'PostListScreen'
>;

const PostListScreen = () => {
  const [selectedMarket, setSelectedMarket] = useState('광장시장');
  const [selectedCategory, setSelectedCategory] = useState<
    '리뷰' | '정보/질문'
  >('리뷰');
  const navigation = useNavigation<NavigationProp>();

  // 더미 게시물 목록
  const dummyPosts = Array.from({length: 6}, (_, i) => ({
    id: i,
    content: `게시물 내용 ${i + 1}`,
  }));

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.marketButton}>
          <Text style={styles.marketText}>{selectedMarket} ⌄</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="search" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 카테고리 토글 버튼 */}
      <View style={styles.categoryToggle}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === '리뷰' && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory('리뷰')}>
          <Text
            style={[
              styles.categoryText,
              selectedCategory === '리뷰' && styles.selectedCategoryText,
            ]}>
            리뷰 게시판
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === '정보/질문' && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory('정보/질문')}>
          <Text
            style={[
              styles.categoryText,
              selectedCategory === '정보/질문' && styles.selectedCategoryText,
            ]}>
            정보/질문 게시판
          </Text>
        </TouchableOpacity>
      </View>

      {/* 게시물 카드 리스트 */}
      <FlatList
        data={dummyPosts}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.postList}
        renderItem={({item}) => (
          <View style={styles.postCard}>
            <Text style={styles.postText}>{item.content}</Text>
          </View>
        )}
      />

      {/* 플로팅 + 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PostWriteScreen')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  marketButton: {flexDirection: 'row', alignItems: 'center'},
  marketText: {fontSize: 18, fontWeight: 'bold'},

  categoryToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
    gap: 8,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  categoryText: {fontSize: 14, color: '#333'},
  selectedCategory: {
    backgroundColor: '#E0E8FF',
    borderColor: '#3366FF',
  },
  selectedCategoryText: {
    color: '#3366FF',
    fontWeight: '600',
  },

  postList: {
    paddingHorizontal: 16,
  },
  postCard: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
  },
  postText: {fontSize: 15, color: '#333'},

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#3366FF',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    marginTop: -2,
  },
});

export default PostListScreen;
