import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Alert,
  InteractionManager,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MapStackParamList} from '../../navigations/stack/MapStackNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons import
import useRecentKeywords from '../../hooks/useRecentKeywords';
import {fetchMarketsByKeyword} from '../../api/market'; // API 호출 함수 import

interface Market {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
}

// SearchScreen의 navigation prop 타입을 명시적으로 정의
type SearchScreenNavigationProp = StackNavigationProp<
  MapStackParamList,
  'Search'
>;

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const {keywords, addKeyword, removeKeyword, clearKeywords} =
    useRecentKeywords();
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef<TextInput>(null);

  // 화면 진입 시 TextInput에 자동 포커스
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      inputRef.current?.focus();
    });
    return () => task.cancel();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSearch = useCallback(
    async (searchText: string) => {
      if (!searchText.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsLoading(true);
      setIsSearching(true);
      try {
        const results = await fetchMarketsByKeyword(searchText);
        console.log('SearchScreen에서 받은 검색 데이터: ', results);
        setSearchResults(results);
        await addKeyword(searchText);
      } catch (error) {
        console.error('검색 중 오류 발생', error);
        Alert.alert(
          '검색 오류',
          '검색 중 문제가 발생했습니다. 다시 시도해주세요.',
        );
        setSearchResults([]);
      } finally {
        setIsLoading(false);
        Keyboard.dismiss();
      }
    },
    [addKeyword],
  );

  const handleRecentKeywordPress = (text: string) => {
    setKeyword(text);
    handleSearch(text);
  };

  // 검색 결과 항목 렌더링
  const renderSearchResultItem = ({item}: {item: Market}) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => {
        // 선택된 단일 시장이 아닌, 현재 검색된 전체 searchResults를 MapHome으로 전달
        navigation.navigate('MapHome', {
          searchResultsFromSearchScreen: searchResults,
          initialSelectedMarket: item,
        });
      }}>
      <Text style={styles.searchResultText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // 키보드 닫기 버튼 (옵션)
  const renderDismissKeyboard = () => {
    if (keyword.length > 0) {
      return (
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={Keyboard.dismiss}>
          <Ionicons name="close-circle-outline" size={20} color="#999" />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* 검색 바 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="시장명, 상점을 검색하세요"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={() => handleSearch(keyword)}
          returnKeyType="search"
        />
        {renderDismissKeyboard()}
      </View>

      {/* 검색 결과 또는 최근 검색어 표시 */}
      {isSearching ? ( // 검색이 시작되었거나 결과가 있을 때
        isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>검색 중...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id.toString()}
            renderItem={renderSearchResultItem}
            contentContainerStyle={styles.searchResultsContainer}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
          </View>
        )
      ) : (
        // 검색 전: 최근 검색어 표시
        <View style={styles.recentKeywordsContainer}>
          <View style={styles.recentKeywordsHeader}>
            <Text style={styles.recentHeaderTitle}>최근 검색어</Text>
            {keywords.length > 0 && (
              <TouchableOpacity onPress={clearKeywords}>
                <Text style={styles.clearAllText}>전체 삭제</Text>
              </TouchableOpacity>
            )}
          </View>
          {keywords.length > 0 ? (
            <FlatList
              data={keywords}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={styles.keywordRow}>
                  <TouchableOpacity
                    onPress={() => handleRecentKeywordPress(item.text)}
                    style={styles.keywordTextWrapper}>
                    <Text style={styles.keywordText}>{item.text}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeKeyword(item.id)}
                    // position: 'absolute'를 사용하여 위치를 자유롭게 조절
                    style={styles.removeKeywordButton}>
                    <Ionicons name="close-circle" size={18} color="#aaa" />
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noKeywordsText}>최근 검색어가 없습니다.</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // 상태바 고려
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
  },
  dismissButton: {
    position: 'absolute',
    right: 20,
    padding: 5,
    marginTop: -9.5,
  },
  recentKeywordsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  recentKeywordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recentHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllText: {
    color: '#007AFF', // iOS 파란색
    fontSize: 14,
  },
  keywordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  keywordTextWrapper: {
    flex: 1, // 텍스트 영역을 터치 영역으로 확장
  },
  keywordText: {
    fontSize: 16,
    color: '#555',
  },
  // 'X' 버튼
  removeKeywordButton: {
    position: 'absolute', // 부모의 레이아웃 흐름에서 분리
    top: 10, // 양수 값은 아래로, 음수 값은 위로
    right: 0, // 오른쪽 끝에 정렬
    padding: 5, // 터치 영역 확보
  },
  noKeywordsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 15,
  },
  searchResultsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchResultItem: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
  },
});

export default SearchScreen;
