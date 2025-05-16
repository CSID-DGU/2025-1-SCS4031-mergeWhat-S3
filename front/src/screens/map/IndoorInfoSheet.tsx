import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  fetchAllStores,
  fetchStoreProducts,
  fetchStoresByCategory,
  StoreProduct,
} from '../../api/market';
import Geolocation from '@react-native-community/geolocation';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fetchBusinessHourByStoreId, BusinessHour} from '../../api/market';
import ParkingInfo from '../../components/Parking';

const defaultImage = require('../../assets/시장기본이미지.jpg');
const productCategories = ['농수산물', '먹거리', '옷', '혼수', '가맹점'];

type Store = {
  id: number;
  name: string;
  category: string;
  center_lat: number;
  center_lng: number;
  image?: string | null;
  description?: string | null;
  is_affiliate: boolean;
  address?: string;
  // time?: string;
  contact?: string;
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

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedTab, setSelectedTab] = useState<'home' | 'review' | 'product'>(
    'home',
  );
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [isBusinessHourExpanded, setIsBusinessHourExpanded] = useState(false);

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

  useEffect(() => {
    const loadBusinessHour = async () => {
      if (!selectedStore) return;
      try {
        const result = await fetchBusinessHourByStoreId(selectedStore.id);
        setBusinessHours(result);
      } catch (err) {
        console.error('❌ 영업시간 불러오기 실패:', err);
      }
    };
    loadBusinessHour();
  }, [selectedStore]);

  const getTodayBusinessHour = (): {status: string; time: string} => {
    const today = new Date();
    const days = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ];
    const todayName = days[today.getDay()];

    const todayData = businessHours.find(bh => bh.day === todayName);

    if (!todayData || todayData.is_closed)
      return {status: '영업시간 정보 없음', time: ''};

    const now = today.getHours() * 60 + today.getMinutes();
    const [openH, openM] = todayData.open_time.split(':').map(Number);
    const [closeH, closeM] = todayData.close_time.split(':').map(Number);

    const openMin = openH * 60 + openM;
    const closeMin = closeH * 60 + closeM;

    const isOpen = now >= openMin && now <= closeMin;

    return {
      status: isOpen ? '영업중' : '영업 종료',
      time: `${todayData.open_time.slice(0, 5)} ~ ${todayData.close_time.slice(
        0,
        5,
      )}`,
    };
  };

  const [productList, setProductList] = useState<StoreProduct[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!selectedStore) return;
      try {
        const data = await fetchStoreProducts(selectedStore.id);
        setProductList(data);
      } catch (err) {
        console.error('❌ 판매 품목 불러오기 실패:', err);
      }
    };

    loadProducts();
  }, [selectedStore]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryPress = async (category: string) => {
    if (category === selectedCategory) {
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
          const allStores = await fetchAllStores();
          stores = allStores.filter(
            (store: {is_affiliate: boolean}) => store.is_affiliate === true,
          );
        } else {
          stores = await fetchStoresByCategory(category, marketName);
        }

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
      style={[styles.button, isSelected && styles.buttonSelected]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderProductList = () => (
    <View style={{marginTop: 16}}>
      <Text style={styles.menuTitle}>판매 품목</Text>
      {productList.length > 0 ? (
        productList.map((item, idx) => (
          <Text key={idx} style={styles.productItem}>
            {item.name} : {item.price}원
          </Text>
        ))
      ) : (
        <Text style={{color: '#aaa'}}>판매 품목 정보 없음</Text>
      )}
    </View>
  );

  // 가게별 상세 정보 버튼시트
  return (
    <BottomSheetScrollView contentContainerStyle={{padding: 16}}>
      <View style={{padding: 16}}>
        {selectedStore ? (
          <View>
            <View style={styles.storeHeader}>
              <TouchableOpacity onPress={() => setSelectedStore(null)}>
                <Ionicons name="chevron-back" size={26} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={styles.storeNameTitle}>{selectedStore.name}</Text>
            <Image
              source={
                selectedStore.image ? {uri: selectedStore.image} : defaultImage
              }
              style={styles.storeImage}
            />
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'home' && styles.tabButtonSelected,
                ]}
                onPress={() => setSelectedTab('home')}>
                <Text style={styles.tabText}>홈</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'product' && styles.tabButtonSelected,
                ]}
                onPress={() => setSelectedTab('product')}>
                <Text style={styles.tabText}>판매품목</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'review' && styles.tabButtonSelected,
                ]}
                onPress={() => setSelectedTab('review')}>
                <Text style={styles.tabText}>리뷰</Text>
              </TouchableOpacity>
            </View>

            {selectedTab === 'home' && ( // 상세정보 중 '홈탭'
              <View style={styles.storeInfoBox}>
                <Text style={styles.storeAddress}>{selectedStore.address}</Text>

                <View style={styles.businessHourContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      setIsBusinessHourExpanded(!isBusinessHourExpanded)
                    }>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{color: '#3366ff', fontWeight: 'bold'}}>
                        {getTodayBusinessHour().status}
                      </Text>
                      <Text style={{marginLeft: 6}}>
                        {getTodayBusinessHour().time}
                      </Text>
                      <Text style={{marginLeft: 6}}>
                        {isBusinessHourExpanded ? '▲' : '▼'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {isBusinessHourExpanded && (
                    <View style={{marginTop: 6}}>
                      {businessHours.map((item, index) => (
                        <Text key={index} style={styles.businessHourRow}>
                          {item.day.slice(0, 1)}{' '}
                          {item.is_closed
                            ? '휴무'
                            : `${item.open_time.slice(
                                0,
                                5,
                              )}~${item.close_time.slice(0, 5)}`}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.contactRow}>
                  <Text style={styles.storeContact}>
                    📞 {selectedStore.contact || '전화번호 없음'}
                  </Text>
                  {selectedStore.is_affiliate && (
                    <Text style={[styles.storeAffiliate, {marginTop: 17}]}>
                      지역화폐 가맹점
                    </Text>
                  )}
                </View>
                {renderProductList()}
              </View>
            )}

            {selectedTab === 'product' && ( // 상세정보 중 '판매 품목 탭'
              <View style={styles.storeInfoBox}>{renderProductList()}</View>
            )}

            {selectedTab === 'review' && ( // 상세정보 중 '리뷰 탭'
              <Text style={{color: '#aaa', marginTop: 20}}>
                리뷰 준비 중입니다
              </Text>
            )}
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, styles.categoryTitle]}>
              카테고리
            </Text>
            <View style={styles.buttonRow}>
              {[
                '🥬 농수산물',
                '🍡 먹거리',
                '👕 옷',
                '🎎 혼수',
                '💳 가맹점',
              ].map(label => {
                const pure = label.replace(/[^가-힣]/g, '');
                return (
                  <CategoryButton
                    key={pure}
                    label={label}
                    onPress={() => handleCategoryPress(pure)}
                    isSelected={selectedCategory === pure}
                  />
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, styles.nearbyTitle]}>
              주변 정보
            </Text>
            <View style={styles.buttonRow}>
              {['🚗 주차장', '🚻 화장실', '🎡 근처 놀거리'].map(label => {
                const pure = label.replace(/[^가-힣]/g, '');
                return (
                  <CategoryButton
                    key={pure}
                    label={label}
                    onPress={() => handleCategoryPress(pure)}
                    isSelected={selectedCategory === pure}
                  />
                );
              })}
            </View>

            {selectedCategory &&
              productCategories.includes(selectedCategory) && (
                <Text style={[styles.sectionTitle, styles.marketTitle]}>
                  {marketName} 상점들
                </Text>
              )}

            {selectedCategory === '주차장' && <ParkingInfo />}

            {storeList.map((store, idx) => {
              const imageSource = store.image
                ? {uri: store.image}
                : defaultImage;
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
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setSelectedStore(store);
                    setSelectedTab('home');
                  }}>
                  <View style={styles.storeCard}>
                    <Image source={imageSource} style={styles.storeImage} />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 4,
                      }}>
                      <Text style={styles.storeName}>{store.name}</Text>
                      {store.is_affiliate && (
                        <Text style={styles.storeAffiliate}>
                          지역화폐 가맹점
                        </Text>
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
                </TouchableOpacity>
              );
            })}
          </>
        )}
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
  categoryTitle: {marginTop: -5},
  nearbyTitle: {marginTop: 17},
  marketTitle: {marginTop: 17},
  buttonRow: {flexDirection: 'row', flexWrap: 'wrap'},
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
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 0,
  },
  buttonSelected: {backgroundColor: '#91AEFF', borderColor: '#aaa'},
  buttonText: {fontSize: 14},
  storeCard: {marginBottom: 24},
  storeImage: {width: '100%', height: 200, borderRadius: 12, marginBottom: 18},
  storeName: {fontSize: 16, fontWeight: '600'},
  storeDesc: {fontSize: 13, color: '#555', marginBottom: 4},
  storeDistance: {color: '#f55', fontSize: 13, fontWeight: '500'},

  storeAffiliate: {
    // 가맹점
    fontSize: 13,
    fontWeight: '600',
    color: '#3366ff',
    marginLeft: 8,
    marginTop: 2.5,
  },
  storeNameTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20, // 상점명과 이미지 사이의 간격
    marginLeft: 0,
    textAlign: 'center',
  },
  tabRow: {flexDirection: 'row', justifyContent: 'center', marginBottom: 12},
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 4,
  },
  tabButtonSelected: {backgroundColor: '#ffcc33', borderColor: '#ffcc33'},
  tabText: {fontSize: 14, fontWeight: '500'},
  storeInfoBox: {paddingHorizontal: 12},
  storeAddress: {marginTop: 5, fontSize: 14, marginBottom: 13},
  storeTime: {fontSize: 14, color: 'orange', marginBottom: 4},

  storeContact: {marginTop: 5, fontSize: 14, marginBottom: -20},

  menuTitle: {fontSize: 15, fontWeight: '600', marginTop: 10, marginBottom: 10},

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  businessHourContainer: {
    marginBottom: 12,
  },
  businessHourRow: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },

  productItem: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
});

export default IndoorInfoSheet;
