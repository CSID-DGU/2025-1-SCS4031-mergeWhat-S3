import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CommunityStackParamList} from '../../types/common';
// 필요한 경우
// import SearchBar from '../../components/SearchBar';
import {fetchPostsByCategory} from '../../api/post';
import {Post} from '../../types/common';

type NavigationProp = StackNavigationProp<
  CommunityStackParamList,
  'PostListScreen'
>;

const PostListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMarket, setSelectedMarket] = useState('시장로드맵');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  const marketOptions = ['시장로드맵', '농수산물', '먹거리', '옷', '기타 품목'];

  // api요청을 위해
  const [selectedCategory, setSelectedCategory] = useState('시장로드맵');
  const [posts, setPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState<{[key: number]: boolean}>({});
  const [likeCounts, setLikeCounts] = useState<{[key: number]: number}>({});
  const [postImages, setPostImages] = useState<{[key: number]: string | null}>(
    {},
  );

  const categoryMap: {[key: string]: string} = {
    시장로드맵: 'course',
    농수산물: 'produce',
    먹거리: 'food',
    옷: 'fashion',
    기타품목: 'etc',
  };

  const handleLikeToggle = (postId: number) => {
    setLiked(prev => ({...prev, [postId]: !prev[postId]}));
    setLikeCounts(prev => ({
      ...prev,
      [postId]: (prev[postId] ?? 0) + (liked[postId] ? -1 : 1),
    }));
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const category = categoryMap[selectedCategory] ?? 'free';
        const response = await fetchPostsByCategory(category);
        setPosts(response); // images 배열이 포함됩니다.
        console.log('📦 받은 게시글 목록:', response); // 디버깅용: images 배열 확인
      } catch (err) {
        console.error('❌ 게시물 불러오기 실패:', err);
      }
    };
    loadPosts();
  }, [selectedCategory]);

  const renderPost = ({item}: {item: Post}) => {
    const postImageUrl = item.images?.[0]?.postImageUrl;

    return (
      <View style={styles.postCard}>
        <View style={styles.rowContainer}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content} numberOfLines={2}>
              {item.content}
            </Text>

            {/* 좋아요 및 댓글 UI */}
            <View style={styles.reactionRow}>
              <TouchableOpacity
                onPress={() => handleLikeToggle(item.id)}
                style={styles.iconRow}>
                <Text style={{fontSize: 16}}>
                  {liked[item.id] ? '❤️' : '🤍'}
                </Text>
                <Text style={{marginLeft: 4}}>{likeCounts[item.id] ?? 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconRow}>
                <Image
                  source={require('../../assets/community_icon.png')}
                  style={{width: 18, height: 18}}
                />
                <Text style={{marginLeft: 4}}>댓글</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 이미지 */}
          {postImageUrl ? (
            <Image
              source={{uri: postImageUrl}}
              style={styles.postImage}
              resizeMode="cover"
            />
          ) : // 이미지가 없을 때 기본 이미지를 보여주고 싶다면 이 부분을 활성화
          // <Image
          //   source={require('../../assets/시장기본이미지.png')}
          //   style={styles.postImage}
          //   resizeMode="cover"
          // />
          null // 이미지가 없을 때 아무것도 보여주지 않음
          }
        </View>
      </View>
    );
  };

  // - - - - - - - - - - - - - -  - - - - - - - - - - -

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View style={{position: 'relative'}}>
          <TouchableOpacity
            style={styles.marketButton}
            onPress={() => setShowDropdown(prev => !prev)}>
            <Text style={styles.marketText}>{selectedMarket} ⌄</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdown}>
              {marketOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setSelectedMarket(option);
                    setSelectedCategory(option);
                    setShowDropdown(false);
                  }}
                  style={styles.dropdownItem}>
                  <Text style={styles.dropdownText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 검색 버튼 */}
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

      {/* 게시물 목록 */}
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPost}
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
  postCard: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  postContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row', // 이미지와 텍스트 나란히
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: '#444',
  },
  marketButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  marketText: {fontSize: 18, fontWeight: 'bold'},

  dropdown: {
    position: 'absolute',
    top: 35,
    left: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    zIndex: 10,
    paddingVertical: 6,
    elevation: 5,
    width: 120,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },

  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  noPosts: {
    marginTop: 50,
    alignItems: 'center',
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
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: 240, // 너무 넓어지지 않도록 제한
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
    color: '#333',
  },
  reactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
    backgroundColor: '#eee',
  },
});

export default PostListScreen;
