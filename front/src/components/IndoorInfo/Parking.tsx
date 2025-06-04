import React, {ReactNode, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

interface ParkingPlace {
  [x: string]: ReactNode;
  PARKING_NAME: string;
  ADDR: string;
  LAT: string;
  LNG: string;
  // 필요한 다른 필드도 추가 가능
}

interface ParkingProps {
  centerLat: number;
  centerLng: number;
  onParkingData: (data: ParkingPlace[]) => void;
  onItemPress: (lat: number, lng: number) => void;
  webViewRef: React.RefObject<WebView<{}> | null>;
  parkingPlaces: ParkingPlace[]; // ✅ WebView로 전달할 데이터
}

const Parking: React.FC<ParkingProps> = ({
  centerLat,
  centerLng,
  onParkingData,
  onItemPress,
  webViewRef,
  parkingPlaces,
}) => {
  useEffect(() => {
    fetchParkingData(centerLat, centerLng);
  }, [centerLat, centerLng]);

  useEffect(() => {
    if (webViewRef?.current && parkingPlaces.length > 0) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: 'setParkingMarkers',
          payload: parkingPlaces,
        }),
      );
      console.log('✅ setParkingMarkers 메시지 웹뷰로 전송');
    }
  }, [parkingPlaces]);

  const fetchParkingData = async (lat: number, lng: number) => {
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

      const merged = meta.map((item: {PARKING_CODE: any}) => {
        const match = real.find(
          (r: {PARKING_CODE: any}) => r.PARKING_CODE === item.PARKING_CODE,
        );
        return {...item, ...match};
      });

      const filtered = merged.filter((item: any) => {
        if (!item.LAT || !item.LNG) return false;
        const dLat = parseFloat(item.LAT) - lat;
        const dLng = parseFloat(item.LNG) - lng;
        return dLat * dLat + dLng * dLng <= 0.01;
      });

      // 요금순 정렬 (낮은 가격 우선)
      filtered.sort((a: {RATES: any}, b: {RATES: any}) => {
        const aFee = parseInt(a.RATES || '999999');
        const bFee = parseInt(b.RATES || '999999');
        return aFee - bFee;
      });
      console.log('🛰 [API 응답(meta)]:', metaJson);
      console.log('🛰 [API 응답(real)]:', realJson);
      console.log('🔄 [병합된 주차장 목록]:', merged);
      onParkingData(filtered);
    } catch (error) {
      console.error('🚨 주차장 데이터 로딩 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
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
});
