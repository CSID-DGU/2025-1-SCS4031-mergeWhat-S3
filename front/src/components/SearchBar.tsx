import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="시장 및 상점 검색"
        placeholderTextColor="#888"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
    fontSize: 14,
  },
});
