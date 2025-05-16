import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import useRecentKeywords from '../hooks/useRecentKeywords'; // 경로 맞게 수정

interface SearchBarProps {
  keyword: string;
  setKeyword: (text: string) => void;
  onSearchResult: (
    markets: {
      id: string;
      name: string;
      center_lat: number;
      center_lng: number;
    }[],
  ) => void;
}

const SearchBar = ({keyword, setKeyword, onSearchResult}: SearchBarProps) => {
  const {keywords, addKeyword, removeKeyword, clearKeywords} =
    useRecentKeywords();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async (text: string) => {
    if (!text.trim()) return;
    try {
      const response = await axios.get(`http://10.0.2.2:3030/markets/search`, {
        params: {query: text},
      });
      console.log('프론트에서 받은 데이터: ', response.data);
      onSearchResult(response.data);
      await addKeyword(text); // 최근 검색어 추가
      setKeyword('');
      setShowSuggestions(false);
    } catch (error) {
      console.error('검색 중 오류 발생', error);
      onSearchResult([]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="시장명, 상점을 검색하세요"
        value={keyword}
        onChangeText={text => {
          setKeyword(text);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onSubmitEditing={() => handleSearch(keyword)}
        returnKeyType="search"
      />

      {showSuggestions && (
        <View style={styles.suggestionBox}>
          <View style={styles.suggestionHeader}>
            <Text style={styles.headerText}>최근 검색어</Text>
            {keywords.length > 0 && (
              <TouchableOpacity onPress={clearKeywords}>
                <Text style={styles.clearText}>전체 삭제</Text>
              </TouchableOpacity>
            )}
          </View>
          {keywords.length > 0 ? (
            <FlatList
              data={keywords}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={styles.keywordRow}>
                  <TouchableOpacity onPress={() => handleSearch(item.text)}>
                    <Text>{item.text}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeKeyword(item.id)}>
                    <Text style={styles.removeText}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={{color: '#aaa', marginTop: 8}}>
              최근 검색어가 없습니다
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 10,
    zIndex: 100,
  },
  input: {
    fontSize: 16,
  },
  suggestionBox: {
    backgroundColor: '#f9f9f9',
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerText: {
    fontWeight: 'bold',
  },
  clearText: {
    color: 'blue',
  },
  keywordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  removeText: {
    color: 'red',
    marginLeft: 12,
  },
});

export default SearchBar;
