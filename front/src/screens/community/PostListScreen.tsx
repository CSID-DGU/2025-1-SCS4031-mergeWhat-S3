import React, {useState} from 'react';
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
// 필요한 경우에만 SearchBar import
// import SearchBar from '../../components/SearchBar';

type NavigationProp = StackNavigationProp<
  CommunityStackParamList,
  'PostListScreen'
>;

const PostListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMarket, setSelectedMarket] = useState('자유게시판');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  const marketOptions = ['자유게시판', '농수산물', '먹거리', '옷', '기타 품목'];

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

      {/* 게시물 목록 (현재는 더미 제거, 향후 API 연결 예정) */}
      <View style={styles.noPosts}>
        <Text style={{color: '#888'}}>등록된 게시물이 없습니다.</Text>
      </View>

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
});

export default PostListScreen;
