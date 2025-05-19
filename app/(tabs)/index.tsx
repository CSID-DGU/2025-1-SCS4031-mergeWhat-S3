
// index.tsx
import React, { useRef, useMemo, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  BackHandler
} from 'react-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { WebView } from 'react-native-webview';
import BottomSheet from '@gorhom/bottom-sheet';
import SearchBar from '@/components/SearchBar';
import KakaoMap from '@/components/KakaoMap';
import * as Location from 'expo-location';

configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

export default function IndexScreen() {
  const [inputText, setInputText] = useState('');
  const [keyword, setSearchKeyword] = useState('');
  const [searchCount, setSearchCount] = useState(0);
  const [placeList, setPlaceList] = useState<string[]>([]);
  const [selectIndex, setSelectIndex] = useState<number | undefined>(undefined);
  const [parkingInfoMap, setParkingInfoMap] = useState<
    Record<string, { free: string; total: string; lat: number; lng: number }>
  >({});
  const [sortType, setSortType] = useState<'잔여 주차면수' | '거리순'>('잔여 주차면수');
  const sortOptions = ['잔여 주차면수'];
  const [mode, setMode] = useState<'search' | 'parking'>('search');
  const [selectName, setSelectName] = useState<string | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; } | null>(null);

  const webviewRef = useRef<WebView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList<string>>(null);
  const snapPoints = useMemo(() => ['5%', '30%', '40%', '85%'], []);

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
    const timer = setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('위치 권한이 거부되었습니다.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (mode === 'parking') {
        setMode('search');
        setPlaceList([]);
        setParkingInfoMap({});
        setSelectIndex(undefined);

        webviewRef.current?.postMessage(JSON.stringify({ type: 'CLEAR_MARKERS' }));
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [mode]);

  const handleMarkerClick = (name: string) => {
    const currentList = mode === 'parking' ? sortedPlaceList : placeList;
    const idx = currentList.findIndex(p => p === name);
    if (idx === -1) return;

    flatListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0 });
    bottomSheetRef.current?.snapToIndex(2);
    setSelectName(undefined);
    setTimeout(() => setSelectName(name), 0);
    setSelectIndex(idx);
  };

  const handleItemPress = (idx: number) => {
    // 리스트 인덱스 갱신
    setSelectIndex(idx);

    // 주차장 모드일 시 selectName으로 지도 이동
    if (mode === 'parking') {
      const name = sortedPlaceList[idx];
      setSelectName(name);
    }

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

  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371e3; // m
    const toRad = (d: number) => (d * Math.PI) / 180;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lng2 - lng1);

    const a = Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // meters
  }

  const sortedPlaceList = useMemo(() => {
    const list = [...placeList];
    if (sortType === '잔여 주차면수') {
      return list.sort((a, b) => {
        const aFree = Number(parkingInfoMap[a]?.free ?? 0);
        const bFree = Number(parkingInfoMap[b]?.free ?? 0);
        return bFree - aFree;
      });
    } else if (sortType === '거리순' && userLocation) {
      return list.sort((a, b) => {
        const aInfo = parkingInfoMap[a];
        const bInfo = parkingInfoMap[b];
        if (!aInfo || !bInfo) return 0;

        const aDist = getDistance(userLocation.lat, userLocation.lng, aInfo.lat, aInfo.lng);
        const bDist = getDistance(userLocation.lat, userLocation.lng, bInfo.lat, bInfo.lng);
        return aDist - bDist;
      });
    }
    return list;
  }, [placeList, sortType, parkingInfoMap, userLocation]);

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
          selectName={selectName}
          mode={mode}
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
        index={0}
        enableContentPanningGesture={false}
        style={styles.sheetContainer}
      >
        {mode === 'search' && (
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
        )}

        {mode === 'parking' && (
          <View style={styles.filterButton}>
            <TouchableOpacity
              onPress={() => {
                const next = sortType === '잔여 주차면수' ? '거리순' : '잔여 주차면수';
                setSortType(next);
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
          data={mode === 'parking' ? sortedPlaceList : placeList}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const currentList = mode === 'parking' ? sortedPlaceList : placeList;
            const idx = currentList.findIndex(p => p === item);
            const isSelected = idx === selectIndex;
            const info = parkingInfoMap[item];
            return (
              <TouchableOpacity onPress={() => handleItemPress(idx)}>
                <View style={[styles.itemContainer, isSelected && styles.itemSelected]}>
                  <Text style={styles.itemText}>
                    {item}{info ? ` — ${info.free}/${info.total}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
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
            placeList.length > 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                <TouchableOpacity
                  onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
                  style={styles.footerButton}
                >
                  <Text style={styles.footerText}>↑ 맨 위로</Text>
                </TouchableOpacity>
                <View style={{ height: 500 }} />
              </View>
            ) : <View style={{ height: 500 }} />
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
  itemContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, alignSelf: 'center', width: '92%', },
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
  filterButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 8, marginBottom: 8, }
});

