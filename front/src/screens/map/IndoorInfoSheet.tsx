import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {fetchStoresByCategory} from '../../api/market';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

export type Store = {
  id: number;
  name: string;
  category: string;
  center_lat: number;
  center_lng: number;
};

const CategoryButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const IndoorInfoSheet = ({polygonName}: {polygonName: string}) => {
  const [storeList, setStoreList] = useState<any[]>([]);
  const webViewRef = useRef<WebView>(null);

  const handleCategoryPress = async (category: string) => {
    try {
      const stores: Store[] = await fetchStoresByCategory(
        category,
        polygonName,
      );

      console.log(
        '📤 WebView로 보낼 마커 목록:',
        stores.map(store => ({
          lat: store.center_lat,
          lng: store.center_lng,
        })),
      );

      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'showMarkers',
          markers: stores.map(store => ({
            lat: store.center_lat,
            lng: store.center_lng,
          })),
        }),
      );
    } catch (error) {
      console.error('❌ 카테고리 검색 오류:', error);
    }
  };

  return (
    <View style={{padding: 16}}>
      <Text style={styles.sectionTitle}>카테고리</Text>
      <View style={styles.buttonRow}>
        <CategoryButton
          label="🥬 농수산물"
          onPress={() => handleCategoryPress('농수산물')}
        />
        <CategoryButton
          label="🍡 먹거리"
          onPress={() => handleCategoryPress('먹거리')}
        />
        <CategoryButton
          label="👕 옷"
          onPress={() => handleCategoryPress('옷')}
        />
        <CategoryButton
          label="🎎 혼수"
          onPress={() => handleCategoryPress('혼수')}
        />
        <CategoryButton
          label="💳 가맹점"
          onPress={() => handleCategoryPress('가맹점')}
        />
      </View>

      <Text style={styles.sectionTitle}>주변 정보</Text>
      <View style={styles.buttonRow}>
        <CategoryButton
          label="🚗 주차장"
          onPress={() => handleCategoryPress('주차장')}
        />
        <CategoryButton
          label="🚻 화장실"
          onPress={() => handleCategoryPress('화장실')}
        />
        <CategoryButton
          label="🎡 근처 놀거리"
          onPress={() => handleCategoryPress('근처 놀거리')}
        />
      </View>

      {/* 결과 리스트 렌더링 */}
      {storeList.length > 0 && (
        <View style={{marginTop: 24}}>
          {storeList.map((store, index) => (
            <View key={index} style={{marginBottom: 12}}>
              <Text style={{fontWeight: 'bold'}}>{store.name}</Text>
              <Text style={{color: '#666'}}>
                {store.description || '설명 없음'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 24,
    color: '#333',
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
});

export default IndoorInfoSheet;
