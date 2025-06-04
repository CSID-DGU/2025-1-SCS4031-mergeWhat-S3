import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  RouteProp,
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CommunityStackParamList} from '../../types/common';
import {fetchPostsByCategory} from '../../api/post';
import {Post} from '../../types/common';

// PostListScreen의 navigation prop 타입 정의
type PostListScreenNavigationProp = StackNavigationProp<
  CommunityStackParamList,
  'PostListScreen'
>;

// PostListScreen의 route prop 타입 정의
type PostListScreenRouteProp = RouteProp<
  CommunityStackParamList,
  'PostListScreen'
>;

const PostListScreen = () => {
  const navigation = useNavigation<PostListScreenNavigationProp>();
  const route = useRoute<PostListScreenRouteProp>();

  const [selectedCategory, setSelectedCategory] = useState('시장로드맵');
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentMarketName, setCurrentMarketName] = useState('광장시장');

  // marketOptions 변수 재정의
  const marketOptions = ['시장로드맵', '농수산물', '먹거리', '옷', '기타 품목'];

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryMap: {[key: string]: string} = {
    시장로드맵: 'course',
    농수산물: 'produce',
    먹거리: 'food',
    옷: 'fashion',
    기타품목: 'etc',
  };

  const handlePostPress = (item: Post) => {
    navigation.navigate('PostInfoScreen', {post: item});
  };

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const category = categoryMap[selectedCategory] ?? 'free';
      const response = await fetchPostsByCategory(category);
      setPosts(response);
      console.log('📦 받은 게시글 목록:', response);
    } catch (err) {
      console.error('❌ 게시물 불러오기 실패:', err);
      setError('게시물을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [loadPosts]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (route.params && typeof route.params.selectedMarketName === 'string') {
      setCurrentMarketName(route.params.selectedMarketName);
    }
  }, [route.params?.selectedMarketName]);

  const renderPost = ({item}: {item: Post}) => {
    const postImageUrl = item.images?.[0]?.postImage_url; // 수정된 부분

    return (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => handlePostPress(item)}>
        <View style={styles.rowContainer}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content} numberOfLines={2}>
              {item.content}
            </Text>

            <View style={styles.reactionRow}>
              <TouchableOpacity
                onPress={e => {
                  e.stopPropagation();
                }}
                style={styles.iconRow}>
                <Text style={{fontSize: 16}}>🤍</Text>
                <Text style={{marginLeft: 4}}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={e => {
                  e.stopPropagation();
                  handlePostPress(item);
                }}
                style={styles.iconRow}>
                <Image
                  source={require('../../assets/community_icon.png')}
                  style={{width: 18, height: 18}}
                />
                <Text style={{marginLeft: 4}}>댓글</Text>
              </TouchableOpacity>
            </View>
          </View>

          {postImageUrl ? (
            <Image
              source={{uri: postImageUrl}}
              style={styles.postImage}
              resizeMode="cover"
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadPosts} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.marketTitleContainer}
          onPress={() => navigation.navigate('MarketSearchScreen')}>
          <Text style={styles.marketTitleText}>{currentMarketName}</Text>
          <Image
            source={require('../../assets/토글클릭전.png')}
            style={styles.toggleIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {isSearching ? (
          <View style={styles.searchBarWrapper}>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="검색어를 입력하세요"
              returnKeyType="search"
              onSubmitEditing={() => {
                console.log('🔍 검색 실행:', searchText);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                console.log('🔍 검색 실행:', searchText);
              }}>
              <Ionicons
                name="search"
                size={20}
                color="#000"
                style={{marginLeft: 8}}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsSearching(true)}>
            <Ionicons name="search" size={22} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoryButtonContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {marketOptions.map(
            (
              option,
              index, // marketOptions 사용
            ) => (
              <React.Fragment key={option}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === option &&
                      styles.selectedCategoryButton,
                    index === 0 && {marginLeft: 16},
                  ]}
                  onPress={() => setSelectedCategory(option)}>
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === option &&
                        styles.selectedCategoryButtonText,
                    ]}>
                    {option}
                  </Text>
                  {selectedCategory === option && option !== '시장로드맵' && (
                    <TouchableOpacity
                      onPress={() => setSelectedCategory('시장로드맵')}
                      style={styles.clearCategoryButton}></TouchableOpacity>
                  )}
                </TouchableOpacity>
                {option === '시장로드맵' && (
                  <View style={styles.categoryDivider} />
                )}
              </React.Fragment>
            ),
          )}
        </ScrollView>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.postListContentContainer}
        ListEmptyComponent={
          !loading && !error && posts.length === 0 ? (
            <View style={styles.centered}>
              <Text>게시물이 없습니다.</Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  marketTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 4,
  },
  toggleIcon: {
    width: 20,
    height: 20,
  },
  categoryButtonContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCategoryButton: {
    backgroundColor: '#fff',
    borderColor: '#3366FF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#3366FF',
    fontWeight: 'bold',
  },
  clearCategoryButton: {
    marginLeft: 1,
  },
  clearCategoryButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3366FF',
  },
  categoryDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  postListContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
  },
  content: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  reactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 12,
    backgroundColor: '#f0f0f0',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
    marginLeft: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
    color: '#333',
  },
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 15,
  },
});

export default PostListScreen;
