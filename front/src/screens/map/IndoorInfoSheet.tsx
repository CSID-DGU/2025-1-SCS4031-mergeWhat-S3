import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {WebView} from 'react-native-webview';
import {fetchAllStores} from '../../api/market';
import {fetchStoresByCategory} from '../../api/market';
import Geolocation from '@react-native-community/geolocation';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

const defaultImage = require('../../assets/시장기본이미지.jpg');

type Store = {
  id: number;
  name: string;
  category: string;
  center_lat: number;
  center_lng: number;
  image?: string | null;
  description?: string | null;
  is_affiliate: boolean;
};

const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

const IndoorInfoSheet = ({
  polygonName,
  marketName,
}: {
  polygonName: string;
  marketName: string;
}) => {
  const [storeList, setStoreList] = useState<Store[]>([]);
  const webViewRef = useRef<WebView>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // 현재 위치 가져오기
  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => {
        setCurrentPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      err => {
        console.warn('❌ 위치 가져오기 실패:', err);
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
    );
  }, []);

  useEffect(() => {
    console.log('[🔍 marketName]', marketName);
  }, [marketName]);

  // 전체 store테이블 데이터불러오기
  useEffect(() => {
    const loadStores = async () => {
      try {
        const stores = await fetchAllStores();
        setStoreList(stores);
      } catch (error) {
        console.error('❌ 전체 store 불러오기 실패:', error);
      }
    };

    loadStores();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 카테고리 버튼 클릭 시 → 필터링된 마커 표시
  const handleCategoryPress = async (category: string) => {
    if (category === selectedCategory) {
      // 👉 이미 눌린 버튼 다시 누르면 전체 store 불러오기
      try {
        const stores = await fetchAllStores();
        setStoreList(stores);
        setSelectedCategory(null);
      } catch (err) {
        console.error('❌ 전체 store 재불러오기 실패:', err);
      }
    } else {
      try {
        let stores;

        if (category === '가맹점') {
          // ✅ '가맹점'은 별도로 is_affiliate === true 필터링
          const allStores = await fetchAllStores();
          stores = allStores.filter(
            (store: {is_affiliate: boolean}) => store.is_affiliate === true,
          );
        } else {
          // ✅ 일반 카테고리 검색
          stores = await fetchStoresByCategory(category, marketName);
        }

        // 마커 표시
        webViewRef.current?.postMessage(
          JSON.stringify({
            type: 'showMarkers',
            markers: stores.map(
              (store: {center_lat: any; center_lng: any}) => ({
                lat: store.center_lat,
                lng: store.center_lng,
              }),
            ),
          }),
        );

        setStoreList(stores);
        setSelectedCategory(category);
      } catch (error) {
        console.error(`❌ ${category} 필터링 실패:`, error);
      }
    }
  };

  // 버튼 스타일
  const CategoryButton = ({
    label,
    onPress,
    isSelected,
  }: {
    label: string;
    onPress: () => void;
    isSelected: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected && styles.buttonSelected, // 선택 시 스타일 적용
      ]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheetScrollView contentContainerStyle={{padding: 16}}>
      <View style={{padding: 16}}>
        {/* 카테고리 */}
        <Text style={[styles.sectionTitle, styles.categoryTitle]}>
          카테고리
        </Text>
        <View style={styles.buttonRow}>
          <CategoryButton
            label="🥬 농수산물"
            onPress={() => handleCategoryPress('농수산물')}
            isSelected={selectedCategory === '농수산물'}
          />
          <CategoryButton
            label="🍡 먹거리"
            onPress={() => handleCategoryPress('먹거리')}
            isSelected={selectedCategory === '먹거리'}
          />
          <CategoryButton
            label="👕 옷"
            onPress={() => handleCategoryPress('옷')}
            isSelected={selectedCategory === '옷'}
          />
          <CategoryButton
            label="🎎 혼수"
            onPress={() => handleCategoryPress('혼수')}
            isSelected={selectedCategory === '혼수'}
          />
          <CategoryButton
            label="💳 가맹점"
            onPress={() => handleCategoryPress('가맹점')}
            isSelected={selectedCategory === '가맹점'}
          />
        </View>

        {/* 주변 정보 */}
        <Text style={[styles.sectionTitle, styles.nearbyTitle]}>주변 정보</Text>
        <View style={styles.buttonRow}>
          <CategoryButton
            label="🚗 주차장"
            onPress={() => handleCategoryPress('주차장')}
            isSelected={selectedCategory === '주차장'}
          />
          <CategoryButton
            label="🚻 화장실"
            onPress={() => handleCategoryPress('화장실')}
            isSelected={selectedCategory === '화장실'}
          />
          <CategoryButton
            label="🎡 근처 놀거리"
            onPress={() => handleCategoryPress('근처 놀거리')}
            isSelected={selectedCategory === '근처 놀거리'}
          />
        </View>

        {/* 시장 이름 + 가게 리스트 */}
        <Text style={[styles.sectionTitle, styles.marketTitle]}>
          {marketName} 상점들
        </Text>

        {storeList.map((store, idx) => {
          const imageSource = store.image ? {uri: store.image} : defaultImage;

          let distance = '';
          if (currentPosition) {
            distance = getDistanceFromLatLonInKm(
              currentPosition.latitude,
              currentPosition.longitude,
              store.center_lat,
              store.center_lng,
            );
          }

          return (
            <View key={idx} style={styles.storeCard}>
              <Image source={imageSource} style={styles.storeImage} />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}>
                <Text style={styles.storeName}>{store.name}</Text>
                {store.is_affiliate && (
                  <Text style={styles.storeAffiliate}>지역화폐 가맹점</Text>
                )}
              </View>
              <Text style={styles.storeDesc}>
                {store.description || '설명 없음'}
              </Text>
              {distance && (
                <Text style={styles.storeDistance}>
                  현재 위치에서 {distance}km
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  categoryTitle: {
    // '카테고리' 로 뜨는 텍스트 부분
    marginTop: -5,
  },

  nearbyTitle: {
    // '주변정보' 로 뜨는 텍스트 부분
    marginTop: 17,
  },

  marketTitle: {
    // 광장시장 '상점' 로 뜨는 텍스트 부분
    marginTop: 17,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
  },
  storeCard: {
    marginBottom: 24,
  },
  storeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  storeDesc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  storeDistance: {
    color: '#f55',
    fontSize: 13,
    fontWeight: '500',
  },
  storeAffiliate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3366ff', // 파란색
    marginLeft: 8, // 이름과 텍스트 간 간격
  },
  buttonSelected: {
    backgroundColor: '#91AEFF', // 연한 파란 배경
    borderColor: '#aaa',
  },
});

export default IndoorInfoSheet;
