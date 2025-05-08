import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import axios from 'axios';

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
  ) => void; // 부모에 검색 결과 전달
}

const SearchBar = ({keyword, setKeyword, onSearchResult}: SearchBarProps) => {
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:3030/markets/search`, {
        params: {query: keyword},
      });
      console.log('프론트에서 받은 데이터: ', response.data);
      onSearchResult(response.data); // 받아온 시장 리스트를 부모 컴포넌트에 전달
    } catch (error) {
      console.error('검색 중 오류 발생', error);
      onSearchResult([]); // 에러 시 빈 리스트 전달
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="시장명, 상점을 검색하세요"
        value={keyword}
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch} // 엔터 누르면 검색
        returnKeyType="search"
      />
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
  },
  input: {
    fontSize: 16,
  },
});

export default SearchBar;
