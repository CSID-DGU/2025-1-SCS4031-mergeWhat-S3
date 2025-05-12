
// index.tsx
import React, { useRef, useMemo, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { WebView } from 'react-native-webview';
import BottomSheet from '@gorhom/bottom-sheet';
import SearchBar from '@/components/SearchBar';
import KakaoMap from '@/components/KakaoMap';

configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

export default function IndexScreen() {
  const [inputText, setInputText] = useState('');
  const [keyword, setSearchKeyword] = useState('');
  const [searchCount, setSearchCount] = useState(0);
  const [placeList, setPlaceList] = useState<string[]>([]);
  const [selectIndex, setSelectIndex] = useState<number | undefined>(undefined);
  const [parkingInfoMap, setParkingInfoMap] = useState<
    Record<string, { free: string; total: string }>
  >({});
  const [sortType, setSortType] = useState<'잔여 주차면수'>('잔여 주차면수');
  const sortOptions = ['잔여 주차면수'];
  const [mode, setMode] = useState<'search' | 'parking'>('search');

  const webviewRef = useRef<WebView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList<string>>(null);
  const snapPoints = useMemo(() => ['5%', '25%', '40%', '85%'], []);

  const categories = [
    { icon: '🥬', label: '채소' },
    { icon: '🥩', label: '고기' },
    { icon: '🐟', label: '생선' },
    { icon: '🍽️', label: '먹거리' },
    { icon: '👟', label: '신발' },
  ];

  const infos = [
    { icon: '🚗', label: '주차장' },
    { icon: '🚻', label: '화장실' },
    { icon: '🏛️', label: '관광지' },
  ];

  useEffect(() => {
    bottomSheetRef.current?.snapToIndex(2);
  }, []);

  const handleMarkerClick = (idx: number) => {
    flatListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0 });
    bottomSheetRef.current?.snapToIndex(2);
    setSelectIndex(undefined);
    setTimeout(() => setSelectIndex(idx), 0);
  };

  const handleItemPress = (idx: number) => {
    setSelectIndex(idx);
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleMessage = (evt: any) => {
    let msg;
    try { msg = JSON.parse(evt.nativeEvent.data); } catch { return; }
    if (msg.type === 'PARKING_DATA') {
      setMode('parking');
      setParkingInfoMap(msg.data);
      setPlaceList(Object.keys(msg.data));
      setSelectIndex(undefined);
      bottomSheetRef.current?.snapToIndex(2);
    }
  };

  const sortedPlaceList = useMemo(() => {
    if (sortType === '잔여 주차면수') {
      return [...placeList].sort((a, b) => {
        const aFree = Number(parkingInfoMap[a]?.free ?? 0);
        const bFree = Number(parkingInfoMap[b]?.free ?? 0);
        return bFree - aFree;
      });
    }
    return placeList;
  }, [placeList, sortType, parkingInfoMap])

  return (
    <View style={styles.container}>
      {/* 지도 영역 */}
      <View style={styles.mapContainer}>
        <KakaoMap
          ref={webviewRef}
          latitude={37.1}
          longitude={15}
          searchKeyword={keyword}
          searchCount={searchCount}
          onPlacesChange={places => {
            setPlaceList(places);
            setSelectIndex(undefined);
            setParkingInfoMap({});
          }}
          onMarkerClick={handleMarkerClick}
          onMessage={handleMessage}
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
        <View style={styles.topBar}>
          <Text style={styles.sectionTitle}>카테고리</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {categories.map((c, i) => (
              <TouchableOpacity key={i} style={styles.chip}>
                <Text style={styles.chipText}>{c.icon} {c.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>주변 정보</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {infos.map((info, i) => (
              <TouchableOpacity
                key={i}
                style={styles.chip}
                onPress={() => {
                  if (info.label === '주차장') {
                    webviewRef.current?.postMessage(JSON.stringify({ type: 'PARKING' }));
                  }
                }}
              >
                <Text style={styles.chipText}>{info.icon} {info.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {mode === 'parking' && (
          <View style={styles.filterButton}>
            <TouchableOpacity
              onPress={() => {
                // 향후 팝업 등으로 바꿀 수 있음
                setSortType('잔여 주차면수');
              }}
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#007bff',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ color: '#007bff', fontSize: 14 }}>{sortType} ▼</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={sortedPlaceList}
          keyExtractor={(_, i) => i.toString()}
          nestedScrollEnabled
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const isSelected = index === selectIndex;
            const info = parkingInfoMap[item];
            return (
              <TouchableOpacity onPress={() => handleItemPress(index)}>
                <View style={[styles.itemContainer, isSelected && styles.itemSelected]}>
                  <Text style={styles.itemText}>
                    {item}{info ? ` — ${info.free}/${info.total}` : ''}
                  </Text >
                </View >
              </TouchableOpacity >
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {placeList.length === 0 ? '검색된 장소가 없습니다.' : '주차장 정보가 없습니다.'}
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <TouchableOpacity
                onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
                style={styles.footerButton}
              >
                <Text style={styles.footerText}>↑ 맨 위로</Text>
              </TouchableOpacity>
              <View style={{ height: 285 }} />
            </View>
          )}

        />
      </BottomSheet >
    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1 },
  searchBarContainer: { position: 'absolute', top: 40, left: 20, right: 20, zIndex: 10 },
  sheetContainer: { flex: 1, backgroundColor: 'white' },
  listContent: { paddingHorizontal: 16, paddingVertical: 8 },
  itemContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  itemText: { fontSize: 16, lineHeight: 24 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  emptyText: { color: '#888' },
  footerContainer: { alignItems: 'center', paddingVertical: 8 },
  footerButton: { backgroundColor: '#eee', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  footerText: { fontSize: 14, color: '#444' },
  topBar: { paddingHorizontal: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 4 },
  chipScroll: { flexDirection: 'row', alignItems: 'center' },
  chip: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  chipText: { fontSize: 12, color: '#333' },
  itemSelected: { backgroundColor: '#e0f0ff', },
  filterButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 8 }
});

