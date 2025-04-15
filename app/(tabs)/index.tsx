// 시장 탭
import React, { useRef, useMemo, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

// BottomSheet 컴포넌트 불러오기
import BottomSheet from '@gorhom/bottom-sheet';

// 컴포넌트 불러오기
import SearchBar from '@/components/SearchBar'; // 검색창
import MapPlaceholder from '@/components/MapPlaceholder'; // 지도(카카오맵으로 대체)
import NearbyList from '@/components/NearbyList'; // 슬라이딩 영역 임시 리스트

export default function HomeScreen() {
  //BottomSheet 제어 참조 변수
  const bottomSheetRef = useRef<BottomSheet>(null);

  //슬라이딩 카드 비율 결정, 슬라이딩 필요 없을 시 제외
  const snapPoints = useMemo(() => ['5%', '25%', '50%'], []);

  useEffect(() => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapPlaceholder />
      </View>

      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>

      <BottomSheet
        ref={bottomSheetRef} // 참조 연결
        snapPoints={snapPoints}   // 슬라이딩 포인트 비율
        index={1}
        style={styles.sheetContainer}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>시장, 놀거리 리스트</Text>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mapContainer: {
    flex: 1,
  },

  searchBarContainer: {
    position: 'absolute', // 지도 위에 검색창 겹침
    top: 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },

  sheetContainer: {
    flex: 1, // 높이를 BottomSheet 영역 전체로 확장
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});