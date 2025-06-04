import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

interface SearchBarProps {
  onPress: () => void;
}

const SearchBar = ({onPress}: SearchBarProps) => {
  return (
    // 전체 SearchBar를 TouchableOpacity로 감싸 클릭 가능하게 함
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={1}>
      <TextInput
        style={styles.input}
        placeholder="시장명, 상점을 검색하세요"
        editable={false}
        pointerEvents="none"
      />
    </TouchableOpacity>
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
    height: 40,
  },
});

export default SearchBar;
