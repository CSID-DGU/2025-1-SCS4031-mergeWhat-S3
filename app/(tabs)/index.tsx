import React, { useRef, useMemo, useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';  // FlatList 추가
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import SearchBar from '@/components/SearchBar';
import KakaoMap from '@/components/KakaoMap';

configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

export default function HomeScreen() {
  const [inputText, setInputText] = useState('');
  const [keyword, setSearchKeyword] = useState('');
  const [searchCount, setSearchCount] = useState(0);
  const [placeList, setPlaceList] = useState<string[]>([]);   // 검색된 장소 리스트

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['5%', '25%', '50%'], []);

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <KakaoMap
          latitude={37.1}
          longitude={15}
          searchKeyword={keyword}
          searchCount={searchCount}
          onPlacesChange={places => {
            // 키워드 포함도 기준으로 간단 정렬
            const sorted = [...places].sort((a, b) => {
              const ai = a.indexOf(keyword), bi = b.indexOf(keyword);
              return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
            });
            setPlaceList(sorted);
          }}
        />
      </View>

      <View style={styles.searchBarContainer}>
        <SearchBar
          value={inputText}
          onChangeText={setInputText}
          onSearch={() => {
            setSearchKeyword(inputText);
            setSearchCount(c => c + 1);
            setPlaceList([]);  // 검색 전 리스트 초기화
          }}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={1}
        style={styles.sheetContainer}
      >
        <FlatList
          data={placeList}
          keyExtractor={(_, idx) => idx.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>검색된 장소가 없습니다.</Text>
            </View>
          }
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1 },
  searchBarContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Android 그림자
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#888',
  },
});
