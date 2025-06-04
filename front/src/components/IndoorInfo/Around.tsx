// components/IndoorInfo/Around.tsx
import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, Image, StyleSheet} from 'react-native';
import defaultImage from '../../assets/시장기본이미지.png';
import {fetchPlaceImage} from '../../api/market';

type Place = {
  id: string;
  place_name: string;
  category_name: string;
  address_name: string;
  distance: string;
  imageUrlFromDB?: string;
};

type AroundProps = {
  type: '실내놀거리' | '관광지';
  latitude: number;
  longitude: number;
  marketId: number; // ⭐ marketId 추가
};

const AroundInfo = ({type, latitude, longitude, marketId}: AroundProps) => {
  // ⭐ marketId props로 받음
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // marketId가 유효한지도 여기서 체크할 수 있습니다.
    if (!latitude || !longitude || !marketId) {
      // ⭐ marketId 유효성 검사 추가
      console.warn(
        '[⚠️ AroundInfo] 유효한 시장 좌표 또는 시장 ID가 없어 장소 검색을 스킵합니다.',
      );
      setPlaces([]);
      setLoading(false);
      return;
    }

    console.log('🌐 Kakao REST API 호출 좌표:', latitude, longitude);

    const fetchPlacesAndImages = async () => {
      setLoading(true);
      try {
        const kakaoResponse = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${type}&x=${longitude}&y=${latitude}&radius=1000&size=10`,
          {
            method: 'GET',
            headers: {
              Authorization: 'KakaoAK 3e4babfcb6814efcfdfd18c83c0e6c81',
            },
          },
        );

        if (!kakaoResponse.ok) {
          throw new Error(
            `Kakao API Error: ${kakaoResponse.status} ${kakaoResponse.statusText}`,
          );
        }

        const kakaoData = await kakaoResponse.json();
        console.log(`✅ Kakao REST API 검색 결과 (${type}):`, kakaoData);

        let results: Place[] = kakaoData.documents || [];

        if (type === '실내놀거리') {
          results = results.filter(
            (item: any) =>
              !item.category_name.startsWith('음식점 > 카페 > 커피전문점'),
          );
        }

        const placesWithImages = await Promise.all(
          results.map(async place => {
            const isIndoor = type === '실내놀거리'; // '실내놀거리'면 true, '관광지'면 false
            try {
              // ⭐ fetchPlaceImage 호출 시 marketId 전달
              const imageData = await fetchPlaceImage(
                marketId,
                place.place_name,
                isIndoor,
              );
              return {
                ...place,
                imageUrlFromDB: imageData ? imageData.image_url : undefined,
              };
            } catch (imageError) {
              console.error(
                `장소 이미지 가져오기 실패 - ${place.place_name}:`,
                imageError,
              );
              return {...place, imageUrlFromDB: undefined};
            }
          }),
        );

        setPlaces(placesWithImages);
      } catch (err) {
        console.error(`❌ ${type} 검색 실패:`, err);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacesAndImages();
  }, [type, latitude, longitude, marketId]); // ⭐ 의존성 배열에 marketId 추가

  // ... (이후 렌더링 로직은 동일)
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {places.length === 0 ? (
        <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
      ) : (
        places.map((place, index) => {
          const distanceKm = (parseFloat(place.distance) / 1000).toFixed(1);

          const categoryParts = place.category_name
            ? place.category_name.split(' > ')
            : [];
          const displayCategory =
            categoryParts.length > 0
              ? categoryParts[categoryParts.length - 1]
              : '';

          return (
            <View key={index} style={styles.placeCard}>
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.place_name}</Text>
                {displayCategory ? (
                  <Text style={styles.placeCategory}>{displayCategory}</Text>
                ) : null}
                <Text style={styles.placeDistance}>{distanceKm}km</Text>
              </View>
              <Image
                source={
                  place.imageUrlFromDB
                    ? {uri: place.imageUrlFromDB}
                    : defaultImage
                }
                style={styles.placeImage}
                resizeMode="cover"
              />
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    padding: 16,
  },
  noResultsText: {
    color: '#888',
    textAlign: 'center',
    paddingVertical: 20,
  },
  placeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 12,
  },
  placeInfo: {
    flex: 1,
    marginRight: 12,
  },
  placeName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#3366ff',
  },
  placeCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  placeDistance: {
    fontSize: 12,
    color: '#f55',
  },
  placeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});

export default AroundInfo;
