// front/src/components/IndoorInfo/Around.tsx
import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, Image} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import defaultImage from '../../assets/시장기본이미지.png';

type Place = {
  id: string;
  place_name: string;
  category_name: string;
  address_name: string;
  distance: string;
};

type AroundProps = {
  type: '실내놀거리' | '관광지'; // 검색 키워드
  latitude: number;
  longitude: number;
};

const AroundInfo = ({type, latitude, longitude}: AroundProps) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🌐 REST API 호출 좌표:', latitude, longitude);

    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${type}&x=${longitude}&y=${latitude}&radius=1000&size=10`,
          {
            method: 'GET',
            headers: {
              Authorization: 'KakaoAK 3e4babfcb6814efcfdfd18c83c0e6c81',
            },
          },
        );

        const data = await response.json();
        console.log(`✅ REST API 검색 결과 (${type}):`, data);

        let results = data.documents || [];

        // 필터링: 실내놀거리에서 '커피전문점' 제거
        if (type === '실내놀거리') {
          results = results.filter(
            (item: any) =>
              !item.category_name.startsWith('음식점 > 카페 > 커피전문점'),
          );
        }

        setPlaces(results);
      } catch (err) {
        console.error(`❌ ${type} 검색 실패:`, err);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [type, latitude, longitude]);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <View style={{padding: 16}}>
      {places.length === 0 ? (
        <Text style={{color: '#888'}}>검색 결과가 없습니다.</Text>
      ) : (
        places.map((place, index) => {
          const distanceKm = (parseFloat(place.distance) / 1000).toFixed(1);

          // category_name 파싱
          const category = place.category_name
            ? place.category_name.split(' > ').slice(-2, -1)[0] ?? ''
            : '';

          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 20,
                borderBottomWidth: 1,
                borderColor: '#eee',
                paddingBottom: 12,
              }}>
              <View style={{flex: 1, marginRight: 12}}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 15, color: '#3366ff'}}>
                  {place.place_name}
                </Text>
                {category ? (
                  <Text style={{fontSize: 12, color: '#888', marginBottom: 4}}>
                    {category}
                  </Text>
                ) : null}
                <Text style={{fontSize: 12, color: '#f55'}}>
                  {distanceKm}km
                </Text>
              </View>
              <Image
                source={defaultImage}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
            </View>
          );
        })
      )}
    </View>
  );
};

export default AroundInfo;
