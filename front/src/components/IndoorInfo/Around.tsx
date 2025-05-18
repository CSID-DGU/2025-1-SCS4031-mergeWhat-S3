// front/src/components/IndoorInfo/Around.tsx
import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

type Place = {
  id: string;
  place_name: string;
  category_name: string;
  address_name: string;
  distance: string;
};

type AroundProps = {
  type: '실내놀거리' | '관광지'; // 검색 키워드
};

const AroundInfo = ({type}: AroundProps) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;

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

          if (Array.isArray(data.documents)) {
            // 로그: 어떤 카테고리가 포함되어 있는지 먼저 확인
            const startsWithCafeChain = data.documents.filter(
              (item: {category_name: string}) =>
                item.category_name.startsWith('음식점 > 카페 > 커피전문점'),
            );

            // 필터링
            let results = data.documents;

            if (type === '실내놀거리') {
              results = results.filter(
                (item: {category_name: string}) =>
                  !item.category_name.startsWith('음식점 > 카페 > 커피전문점'),
              );
            }

            setPlaces(results);
          } else {
            setPlaces([]);
          }
        } catch (err) {
          console.error(`❌ ${type} 검색 실패:`, err);
        } finally {
          setLoading(false);
        }
      },
      err => {
        console.error('❌ 위치 정보 가져오기 실패:', err);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      },
    );
  }, [type]);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <View style={{padding: 16}}>
      <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>
        {type} 검색 결과
      </Text>
      {places.length === 0 ? (
        <Text style={{color: '#888'}}>검색 결과가 없습니다.</Text>
      ) : (
        places.map((place, index) => (
          <View key={index} style={{marginBottom: 12}}>
            <Text style={{fontWeight: 'bold'}}>{place.place_name}</Text>
            <Text>{place.address_name}</Text>
            <Text style={{fontSize: 12, color: '#999'}}>
              거리: {(parseFloat(place.distance) / 1000).toFixed(1)} km
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

export default AroundInfo;
