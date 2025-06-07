// components/IndoorInfo/Parking.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';

interface ParkingPlace {
  PARKING_NAME: string;
  ADDR: string;
  LAT: string;
  LNG: string;
  RATES?: string;
  [key: string]: any;
}

interface ParkingProps {
  centerLat: number;
  centerLng: number;
  selectedCategory: string;
  onItemPress: (lat: number, lng: number) => void;
  webViewRef: React.RefObject<WebView<{}> | null>;
}

const Parking: React.FC<ParkingProps> = ({
  centerLat,
  centerLng,
  selectedCategory,
  onItemPress,
  webViewRef,
}) => {
  const [parkingPlaces, setParkingPlaces] = useState<ParkingPlace[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory !== '주차장') return;

    const fetchParkingData = async () => {
      setLoading(true);
      const API_KEY = '4d5054615477686d373350634c6477';
      try {
        const [metaResp, realResp] = await Promise.all([
          fetch(
            `http://openapi.seoul.go.kr:8088/${API_KEY}/json/GetParkInfo/1/1000/`,
          ),
          fetch(
            `http://openapi.seoul.go.kr:8088/${API_KEY}/json/GetParkingInfo/1/1000/`,
          ),
        ]);

        const metaJson = await metaResp.json();
        const realJson = await realResp.json();

        const meta = metaJson.GetParkInfo?.row || [];
        const real = realJson.GetParkingInfo?.row || [];

        // ✅ real 데이터를 Map으로 변환
        const realMap = new Map(
          real.map((item: any) => [item.PARKING_CODE, item]),
        );

        // ✅ 중복 제거 병합: meta 기준 unique하게 merge
        const mergedMap = new Map<string, any>();
        meta.forEach((metaItem: any) => {
          const code = metaItem.PARKING_CODE;
          if (!mergedMap.has(code)) {
            const realItem = realMap.get(code) || {};
            mergedMap.set(code, {...metaItem, ...realItem});
          }
        });

        const merged = Array.from(mergedMap.values());

        // 💵 요금 순 정렬
        merged.sort((a: ParkingPlace, b: ParkingPlace) => {
          const aFee = parseInt(a.RATES || '999999');
          const bFee = parseInt(b.RATES || '999999');
          return aFee - bFee;
        });

        // 🔍 주소 다양성 확인 로그
        const uniqueAddresses = [...new Set(merged.map(item => item.ADDR))];
        console.log(`📦 병합 후 고유 주차장 수: ${merged.length}`);
        console.log('🏷️ 고유 주소 샘플:', uniqueAddresses.slice(0, 10));

        setParkingPlaces(merged); // 🔄 최종 설정
        console.log('🔄 [주차장 목록 갱신]:', merged.length);
      } catch (err) {
        console.error('❌ 주차장 데이터 로딩 실패:', err);
        setParkingPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingData();
  }, [selectedCategory, centerLat, centerLng]);

  // 📡 웹뷰로 데이터 전송
  useEffect(() => {
    if (
      webViewRef?.current &&
      selectedCategory === '주차장' &&
      parkingPlaces.length > 0
    ) {
      console.log('📡 WebView로 주차장 마커 전송:', parkingPlaces.length);
      webViewRef.current.postMessage(
        JSON.stringify({
          type: 'setParkingMarkers',
          payload: parkingPlaces,
        }),
      );
    }
  }, [parkingPlaces, selectedCategory]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : parkingPlaces.length === 0 ? (
        <Text style={styles.noResult}>주차장 정보를 찾을 수 없습니다.</Text>
      ) : (
        <FlatList
          data={parkingPlaces}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                onItemPress(parseFloat(item.LAT), parseFloat(item.LNG))
              }>
              <Text style={styles.title}>{item.PARKING_NAME}</Text>
              <Text style={styles.subtitle}>{item.ADDR}</Text>
              {item.RATES && (
                <Text style={styles.price}>{item.RATES}원/시간</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default Parking;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#555',
  },
  price: {
    marginTop: 4,
    color: '#0066cc',
  },
  noResult: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
  },
});
