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
  Platform,
  Alert,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useRecentKeywords from '../../hooks/useRecentKeywords';

import {CommunityStackParamList} from '../../types/common';
import {fetchMarketsByKeyword} from '../../api/market'; // api/market.ts에서 가져온 함수

// Market 인터페이스는 api/market.ts 및 백엔드 응답과 동일하게 유지
interface Market {
  id: string; // 또는 number, 백엔드 응답에 따름
  name: string;
  center_lat: number;
  center_lng: number;
}

// MarketSearch 컴포넌트를 CommunityStackParamList의 MarketSearchScreen 스크린으로 사용
type MarketSearchScreenNavigationProp = StackNavigationProp<
  CommunityStackParamList,
  'MarketSearchScreen'
>;

type MarketSearchScreenRouteProp = RouteProp<
  CommunityStackParamList,
  'MarketSearchScreen'
>;

const MarketSearch = () => {
  const navigation = useNavigation<MarketSearchScreenNavigationProp>();
  const route = useRoute<MarketSearchScreenRouteProp>();
  const {keywords, addKeyword, removeKeyword, clearKeywords} =
    useRecentKeywords();
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // 검색이 시작되었는지 여부
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // 화면 진입 시 TextInput에 자동 포커스 (InteractionManager는 선택 사항)
    inputRef.current?.focus();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSearch = useCallback(
    async (searchText: string) => {
      if (!searchText.trim()) {
        setSearchResults([]);
        setIsSearching(false); // 검색어가 없으면 검색 상태 해제
        return;
      }

      setIsLoading(true);
      setIsSearching(true); // 검색 시작 상태 설정

      try {
        // 실제 API 호출: fetchMarketsByKeyword는 'query' 파라미터를 받음
        const results = await fetchMarketsByKeyword(searchText);
        console.log('MarketSearch에서 받은 검색 데이터: ', results);

        // API 응답이 Market[] 배열이라고 가정 (SearchScreen.tsx와 동일)
        setSearchResults(results);
        await addKeyword(searchText); // 검색어 저장
      } catch (error) {
        console.error('시장 검색 중 오류 발생:', error);
        Alert.alert(
          '검색 오류',
          '시장 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.',
        );
        setSearchResults([]); // 오류 발생 시 결과 초기화
      } finally {
        setIsLoading(false);
        Keyboard.dismiss(); // 검색 완료 후 키보드 닫기
      }
    },
    [addKeyword],
  );

  const handleRecentKeywordPress = (text: string) => {
    setKeyword(text);
    handleSearch(text);
  };

  // 검색 결과 항목 클릭 시 PostListScreen으로 시장 이름 전달 및 복귀
  const handleMarketSelect = (marketName: string) => {
    Keyboard.dismiss();
    // PostListScreen으로 이동하면서 선택된 시장 이름 전달
    navigation.navigate('PostListScreen', {selectedMarketName: marketName});
  };

  // 검색 결과 항목 렌더링
  const renderSearchResultItem = ({item}: {item: Market}) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleMarketSelect(item.name)}>
      <Text style={styles.searchResultText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // 키보드 닫기 및 검색어/결과 초기화 버튼
  const renderDismissButton = () => {
    if (keyword.length > 0) {
      return (
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => {
            setKeyword(''); // 검색어 초기화
            setSearchResults([]); // 결과 초기화
            setIsSearching(false); // 검색 상태 해제
            Keyboard.dismiss(); // 키보드 닫기
          }}>
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
          placeholder="시장명을 검색하세요"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={() => handleSearch(keyword)}
          returnKeyType="search"
        />
        {renderDismissButton()}
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
            keyboardShouldPersistTaps="handled" // 키보드 관련 이슈 방지
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
                    style={styles.removeKeywordButton}>
                    <Ionicons name="close-circle" size={18} color="#aaa" />
                  </TouchableOpacity>
                </View>
              )}
              keyboardShouldPersistTaps="handled" // 키보드 관련 이슈 방지
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
    color: '#007AFF',
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
    flex: 1,
  },
  keywordText: {
    fontSize: 16,
    color: '#555',
  },
  removeKeywordButton: {
    position: 'absolute',
    top: 10,
    right: 0,
    padding: 5,
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

export default MarketSearch;
