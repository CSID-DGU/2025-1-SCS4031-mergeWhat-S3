import React, { useRef, useMemo, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import SearchBar from '@/components/SearchBar';
import KakaoMap from '@/components/KakaoMap';

configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

export default function HomeScreen() {
  const [inputText, setInputText] = useState('');
  const [keyword, setSearchKeyword] = useState('');
  const [searchCount, setSearchCount] = useState(0);
  const [placeList, setPlaceList] = useState<string[]>([]);
  const [selectIndex, setSelectIndex] = useState<number | undefined>(undefined);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList<string>>(null);
  const snapPoints = useMemo(() => ['5%', '25%', '40%'], []);

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  // 마커 클릭 → 리스트 스크롤
  const handleMarkerClick = (idx: number) => {
    flatListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0 });
    bottomSheetRef.current?.snapToIndex(2);
  };

  // 리스트 아이템 클릭
  const handleItemPress = (idx: number) => {
    setPlaceList([placeList[idx]]);
    setSelectIndex(idx);
    // 시트 25% 고정, 추후 블록 크기에 따라 수정
    bottomSheetRef.current?.snapToIndex(1);
  };

  return (
    <View style={styles.container}>
      {/* 지도 */}
      <View style={styles.mapContainer}>
        <KakaoMap
          latitude={37.1}
          longitude={15}
          searchKeyword={keyword}
          searchCount={searchCount}
          onPlacesChange={places => {
            setPlaceList(places);
            setSelectIndex(undefined);
          }}
          onMarkerClick={handleMarkerClick}
          selectIndex={selectIndex}
        />
      </View>

      {/* 검색창 */}
      <View style={styles.searchBarContainer}>
        <SearchBar
          value={inputText}
          onChangeText={setInputText}
          onSearch={() => {
            setSearchKeyword(inputText);
            setSearchCount(c => c + 1);
            setPlaceList([]);
            setSelectIndex(undefined);
          }}
        />
      </View>

      {/* BottomSheet + FlatList */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={1}
        enableContentPanningGesture={false}
        style={styles.sheetContainer}
      >
        <FlatList
          ref={flatListRef}
          data={placeList}
          keyExtractor={(_, i) => i.toString()}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleItemPress(index)}>
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>검색된 장소가 없습니다.</Text>
            </View>
          )}
          ListFooterComponent={() =>
            selectIndex === undefined && placeList.length > 0 ? (
              <View style={styles.footerContainer}>
                <TouchableOpacity
                  onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
                  style={styles.footerButton}
                >
                  <Text style={styles.footerText}>↑ 맨 위로</Text>
                </TouchableOpacity>
                <View style={{ height: 285 }} />
              </View>
            ) : null
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
    position: 'absolute', top: 40, left: 20, right: 20, zIndex: 10
  },
  sheetContainer: { flex: 1, backgroundColor: 'white' },
  listContent: { paddingHorizontal: 16, paddingVertical: 8 },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  itemText: { fontSize: 16, lineHeight: 24 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  emptyText: { color: '#888' },
  footerContainer: { alignItems: 'center', paddingVertical: 8 },
  footerButton: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  footerText: { fontSize: 14, color: '#444' }
});
