import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  fetchAllStores,
  fetchStoreProducts,
  fetchStoresByCategory,
  StoreProduct,
} from '../../api/market';
import {fetchMarketsByKeyword} from '../../api/market';
import Geolocation from '@react-native-community/geolocation';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fetchBusinessHourByStoreId, BusinessHour} from '../../api/market';
import ParkingInfo from '../../components/IndoorInfo/Parking'; // ParkingInfo 컴포넌트 임포트
import AroundInfo from '../../components/IndoorInfo/Around';
import {getUltraSrtFcst, WeatherData} from '../../components/weather';
import {
  getWeatherIcon,
  getWeatherRecommendation,
} from '../../components/IndoorInfo/getWeatherIcon';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ReviewStackParamList, StoreReview} from '../../types/common';
import useAuth from '../../hooks/queries/useAuth';
import {authNavigations} from '../../constants/navigations';
import ReviewList from '../../components/IndoorInfo/ReviewList';
//import {StoreReview} from '../../api/review';
import ReviewKeywords from '../../components/IndoorInfo/ReviewKeyword';

const {width} = Dimensions.get('window');

const defaultImage = require('../../assets/시장기본이미지.png');
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
  contact?: string;
  indoor_name: string;
  market?: {name: string};
};

const emptyStars = require('../../assets/review_star.png');

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

type IndoorInfoSheetProps = {
  polygonName: string | null;
  marketName: string | null;
  onSelectStore: (store: Store) => void;
  onSelectCategory: (
    category: string | null,
    currentMarketName: string,
  ) => void;
  onBackToMarketList: () => void;
  onStoresLoaded?: (stores: Store[]) => void;
  centerLat: number;
  centerLng: number;
  webviewMode: 'market' | 'parking';
  setWebviewMode: React.Dispatch<React.SetStateAction<'market' | 'parking'>>;
  marketId: number; // ⭐ marketId prop 추가
};

const IndoorInfoSheet = ({
  polygonName,
  marketName,
  onSelectStore,
  onSelectCategory,
  onBackToMarketList,
  onStoresLoaded,
  centerLat,
  centerLng,
  webviewMode,
  setWebviewMode,
  marketId, // ⭐ marketId prop 받기
}: IndoorInfoSheetProps) => {
  type NavigationProp = StackNavigationProp<
    ReviewStackParamList,
    'IndoorInfoScreen'
  >;
  const navigation = useNavigation<any>();
  const [storeList, setStoreList] = useState<Store[]>([]);
  const webViewRef = useRef<WebView>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [setMarketId] = useState<number | null>(null);

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedTab, setSelectedTab] = useState<'home' | 'review' | 'product'>(
    'home',
  );
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [isBusinessHourExpanded, setIsBusinessHourExpanded] = useState(false);

  const [averageRating, setAverageRating] = useState<number | null>(null);

  const {isLogin: realLogin} = useAuth();
  const isLogin = false;

  useEffect(() => {
    console.log('[🟢 로그인 상태]:', isLogin);
  }, [isLogin]);

  const handleReviewPress = () => {
    if (!isLogin) {
      Alert.alert(
        '로그인이 필요합니다',
        '리뷰를 작성하려면 먼저 로그인해주세요.',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '로그인하러 가기',
            onPress: () =>
              navigation.navigate('Auth', {
                screen: authNavigations.AUTH_HOME,
              }),
          },
        ],
      );
      return;
    }

    navigation.navigate('ReviewScreen', {
      storeName: selectedStore?.name,
      storeId: selectedStore?.id,
    });
  };

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
      // marketName이 null이면 스킵
      if (!marketName) {
        console.log('[ℹ️ store 로딩 스킵] marketName이 없습니다.');
        setStoreList([]);
        if (onStoresLoaded) {
          onStoresLoaded([]);
        }
        return;
      }

      try {
        const stores = await fetchAllStores(marketName);

        if (polygonName) {
          const filtered = stores.filter(
            (store: Store) => store.indoor_name === polygonName,
          );
          setStoreList(filtered);
          if (onStoresLoaded) {
            onStoresLoaded(filtered);
          }
        } else {
          setStoreList(stores);
          if (onStoresLoaded) {
            onStoresLoaded(stores);
          }
        }
      } catch (error) {
        console.error('❌ store 불러오기 실패:', error);
        if (onStoresLoaded) {
          onStoresLoaded([]);
        }
      }
    };

    loadStores();
  }, [polygonName, marketName, onStoresLoaded]); // marketName 의존성 추가

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

  const [selectedMarketCenter, setSelectedMarketCenter] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    const loadMarketCenter = async () => {
      // ⭐ 수정: marketName이 유효한지 먼저 확인
      if (!marketName) {
        console.log('[ℹ️ 시장 좌표 로딩 스킵] marketName이 없습니다.');
        setSelectedMarketCenter(null);
        return;
      }

      try {
        console.log('[🔍 fetchMarketsByKeyword 호출] marketName:', marketName); // 추가 로그
        const data = await fetchMarketsByKeyword(marketName);

        // ⭐ 수정: data가 배열이 아니거나 비어있을 경우 처리
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn(
            '[❌ 해당 시장 좌표 없음] fetchMarketsByKeyword 결과가 없거나 유효하지 않습니다. marketName:',
            marketName,
          );
          setSelectedMarketCenter(null);
          return;
        }

        const matched = data.find((m: any) => m.name === marketName);

        if (matched && matched.center_lat && matched.center_lng) {
          setSelectedMarketCenter({
            latitude: matched.center_lat,
            longitude: matched.center_lng,
          });
          console.log('[✅ 시장 좌표 설정 완료]', matched);
        } else {
          // ⭐ 수정: marketName은 이미 props로 받았으므로 바로 사용
          console.log(
            '[❌ 해당 시장 좌표 없음] 일치하는 시장을 찾지 못했거나 좌표가 없음. 현재 marketName:',
            marketName,
          );
          setSelectedMarketCenter(null); // 매치되는 시장이 없으면 좌표 초기화
        }
      } catch (err) {
        // ⭐ 수정: 에러 발생 시 marketName 함께 로깅
        console.error(
          '❌ market 좌표 불러오기 실패:',
          err,
          'marketName:',
          marketName,
        );
        setSelectedMarketCenter(null); // 에러 발생 시 좌표 초기화
      }
    };

    loadMarketCenter();
  }, [marketName]); // marketName이 변경될 때마다 이 useEffect가 실행됩니다.

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
      status: isOpen ? '영업중' : '영업중',
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

  const handleCategoryPress = async (category: string | null) => {
    if (category === '주차장') {
      setWebviewMode('parking');

      // ✅ 메시지 직접 전송: parking 모드로 전환
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'SET_MAP_MODE',
          mode: 'parking',
        }),
      );

      console.log('[IndoorInfoSheet] SET_MAP_MODE: parking 메시지 전송 완료');

      setSelectedCategory('주차장');
      setStoreList([]);
      if (onStoresLoaded) onStoresLoaded([]);
      return;
    }

    // marketName이 null이면 카테고리 필터링도 불가능하므로 경고 후 종료
    if (!marketName) {
      console.warn('[⚠️ 카테고리 필터링 불가] marketName이 없습니다.');
      setStoreList([]);
      if (onStoresLoaded) onStoresLoaded([]);
      onSelectCategory(null, ''); // marketName이 없으므로 빈 문자열 전달 (또는 null)
      return;
    }

    if (category === selectedCategory || category === null) {
      try {
        const stores = await fetchAllStores(marketName);
        setStoreList(stores);
        setSelectedCategory(null);
        if (onStoresLoaded) {
          onStoresLoaded(stores);
        }
        onSelectCategory(null, marketName);
      } catch (err) {
        console.error('❌ 전체 store 재불러오기 실패:', err);
        if (onStoresLoaded) {
          onStoresLoaded([]);
        }
        onSelectCategory(null, marketName);
      }
    } else {
      try {
        let stores: Store[];
        if (category === '가맹점') {
          const allStores = await fetchAllStores(marketName);
          stores = allStores.filter(
            (store: {is_affiliate: boolean; market?: {name: string}}) =>
              store.is_affiliate === true && store.market?.name === marketName,
          );
        } else if (!productCategories.includes(category)) {
          // '주차장', '화장실', '근처놀거리'와 같은 비-상점 카테고리는 storeList를 비웁니다.
          stores = [];
        } else {
          stores = await fetchStoresByCategory(category, marketName);
        }

        setStoreList(stores);
        setSelectedCategory(category);
        if (onStoresLoaded) {
          onStoresLoaded(stores);
        }
        onSelectCategory(category, marketName);
      } catch (error) {
        console.error(`❌ ${category} 필터링 실패:`, error);
        if (onStoresLoaded) {
          onStoresLoaded([]);
        }
        onSelectCategory(null, marketName);
      }
    }
  };

  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
  const recommendation = weatherData
    ? getWeatherRecommendation(weatherData)
    : null;

  useEffect(() => {
    if (selectedCategory === '근처놀거리') {
      Geolocation.getCurrentPosition(
        async pos => {
          const {latitude, longitude} = pos.coords;

          try {
            const data = await getUltraSrtFcst(latitude, longitude);
            setWeatherData(data);
          } catch (error) {
            console.error('[❌ 날씨 API 에러]', error);
          }
        },
        err => {
          console.error('[❌ 위치 권한 오류]', err.message);
        },
        {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
      );
    } else {
      setWeatherData(null);
    }
  }, [selectedCategory]);

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
    <View style={{marginTop: 10}}>
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

  const [selectedReviewSort, setSelectedReviewSort] = useState<
    'latest' | 'highestRating' | 'lowestRating'
  >('latest'); // 리뷰 정렬 상태 추가

  const [reviews, setReviews] = useState<StoreReview[]>([]);

  const handleReviewsLoaded = useCallback((loadedReviews: StoreReview[]) => {
    setReviews(loadedReviews); // IndoorInfoSheet의 reviews 상태 업데이트
  }, []);

  useEffect(() => {
    // 디버깅용
    console.log('[IndoorInfoSheet] selectedStore.id:', selectedStore?.id);
  }, [selectedStore]);

  const [parkingPlaces, setParkingPlaces] = useState<any[]>([]);

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
              resizeMode="cover"
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

            {selectedTab === 'home' && (
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

                <TouchableOpacity
                  onPress={() =>
                    navigation.dispatch(
                      CommonActions.navigate({
                        name: 'EditInfoScreen',
                        params: {
                          screen: 'EditScreen',
                          params: {
                            storeName: selectedStore.name,
                            storeId: selectedStore.id,
                            storeCategory: selectedStore.category,
                            storeAddress: selectedStore.address,
                            storeContact: selectedStore.contact,
                            storeBusinessHours: businessHours,
                          },
                        },
                      }),
                    )
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 30,
                      marginRight: 10,
                    }}>
                    <Text
                      style={{color: '#3366FF', fontSize: 13, marginRight: 4}}>
                      ❔
                    </Text>
                    <Text
                      style={{
                        color: '#3366FF',
                        fontSize: 14,
                        fontWeight: '500',
                        textDecorationLine: 'underline',
                      }}>
                      정보 수정 제안하기
                    </Text>
                  </View>
                </TouchableOpacity>

                {renderProductList()}
                <View style={{marginLeft: -10}}>
                  <ReviewList
                    storeId={selectedStore.id}
                    showAverage={true}
                    sortBy={selectedReviewSort}
                  />
                </View>
              </View>
            )}

            {selectedTab === 'product' && (
              <View style={styles.storeInfoBox}>{renderProductList()}</View>
            )}

            {/* 리뷰 키워드 분석 컴포넌트 */}

            {selectedTab === 'review' && (
              <View style={{marginTop: 24, paddingHorizontal: 0}}>
                {reviews.length > 0 && ( // 리뷰가 있을 때만 키워드 분석 표시
                  <ReviewKeywords
                    storeId={selectedStore.id}
                    totalReviewsCount={reviews.length} // ⭐ 전체 리뷰 개수 전달
                  />
                )}
                {/* 리뷰가 없을 때 키워드 영역 표시 안 함 (ReviewKeywords 내부에서 처리 가능) */}

                {/* ⭐ 리뷰 정렬 버튼들은 ReviewKeywords 아래, ReviewList 위에 위치 ⭐ */}
                <View style={styles.reviewSortButtons}>
                  <TouchableOpacity
                    style={
                      selectedReviewSort === 'latest'
                        ? styles.sortButtonSelected
                        : styles.sortButton
                    }
                    onPress={() => setSelectedReviewSort('latest')}>
                    <Text
                      style={
                        selectedReviewSort === 'latest'
                          ? styles.sortButtonTextSelected
                          : styles.sortButtonText
                      }>
                      • 최신순
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      selectedReviewSort === 'highestRating'
                        ? styles.sortButtonSelected
                        : styles.sortButton
                    }
                    onPress={() => setSelectedReviewSort('highestRating')}>
                    <Text
                      style={
                        selectedReviewSort === 'highestRating'
                          ? styles.sortButtonTextSelected
                          : styles.sortButtonText
                      }>
                      • 평점 높은 순
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      selectedReviewSort === 'lowestRating'
                        ? styles.sortButtonSelected
                        : styles.sortButton
                    }
                    onPress={() => setSelectedReviewSort('lowestRating')}>
                    <Text
                      style={
                        selectedReviewSort === 'lowestRating'
                          ? styles.sortButtonTextSelected
                          : styles.sortButtonText
                      }>
                      • 평점 낮은 순
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 리뷰 작성 UI는 정렬 버튼 아래로 옮김 */}
                {/* {reviews.length > 0 && ( */}
                <View style={styles.reviewInputContainer}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#333',
                      marginBottom: 1,
                      textAlign: 'center',
                    }}>
                    <Text style={{color: '#3366FF', fontWeight: 'bold'}}>
                      {selectedStore.name}
                    </Text>{' '}
                    다녀오셨어요?{'\n\n'}방문 후기를 남겨주세요!
                  </Text>

                  <TouchableOpacity
                    onPress={handleReviewPress}
                    style={{
                      alignItems: 'center',
                      marginTop: 13,
                    }}>
                    <Text
                      style={{
                        fontSize: 30,
                        color: '#FFD700',
                        letterSpacing: 4,
                        marginBottom: 20,
                      }}>
                      ☆☆☆☆☆
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* )} */}

                <ReviewList
                  storeId={selectedStore.id}
                  showAverage={true}
                  sortBy={selectedReviewSort}
                  onReviewsLoaded={handleReviewsLoaded} // ⭐ ReviewList에서 로드된 리뷰 전달
                />
              </View>
            )}
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, styles.categoryTitle]}>
              카테고리
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.buttonRow, {paddingRight: 12}]}>
              {['🥬 농수산물', '🍡 먹거리', '👕 옷', '🎎 혼수'].map(label => {
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
              {/* 모든 가게 보기 버튼도 여기에 포함 */}
              {selectedCategory !== null && (
                <CategoryButton
                  label="모든 가게 보기"
                  onPress={() => handleCategoryPress(null)}
                  isSelected={false}
                />
              )}
            </ScrollView>

            <View style={[styles.buttonRow, {marginTop: 4}]}>
              <CategoryButton
                label="💳 가맹점"
                onPress={() => handleCategoryPress('가맹점')}
                isSelected={selectedCategory === '가맹점'}
              />
            </View>

            <Text style={[styles.sectionTitle, styles.nearbyTitle]}>
              주변 정보
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.buttonRow, {marginBottom: 10}]}>
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
            </ScrollView>

            {selectedCategory &&
              !productCategories.includes(selectedCategory) && (
                <Text style={[styles.sectionTitle, styles.marketTitle]}>
                  {selectedCategory === '주차장' &&
                    `${marketName} 근처 주차장 추천`}
                  {selectedCategory === '화장실' && `${marketName} 근처 화장실`}
                  {selectedCategory === '근처놀거리' &&
                    `${marketName} 근처 관광지`}
                </Text>
              )}

            {selectedCategory &&
              productCategories.includes(selectedCategory) && (
                <Text style={[styles.sectionTitle, styles.marketTitle]}>
                  {marketName} 상점들
                </Text>
              )}

            {!selectedCategory && (
              <Text style={[styles.sectionTitle, styles.marketTitle]}>
                {marketName} 상점들
              </Text>
            )}

            {selectedCategory === '근처놀거리' && weatherData && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                  <Image
                    source={getWeatherIcon(weatherData)}
                    style={{width: 22, height: 22, marginRight: 6}}
                    resizeMode="contain"
                  />
                  <Text style={{fontSize: 14, marginRight: 4}}>서울특별시</Text>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {weatherData.find(d => d.category === 'T1H')?.value ?? '-'}
                    °C
                  </Text>
                </View>

                <Text style={{fontSize: 13, color: '#666', marginBottom: 12}}>
                  {recommendation?.message}
                </Text>
              </>
            )}

            {selectedCategory === '근처놀거리' &&
              selectedMarketCenter &&
              weatherData && (
                <>
                  {recommendation?.recommend === 'indoor' ? (
                    <AroundInfo
                      type="실내놀거리"
                      latitude={selectedMarketCenter.latitude}
                      longitude={selectedMarketCenter.longitude}
                      marketId={marketId} // ⭐ props로 받은 marketId를 전달합니다.
                    />
                  ) : (
                    <AroundInfo
                      type="관광지"
                      latitude={selectedMarketCenter.latitude}
                      longitude={selectedMarketCenter.longitude}
                      marketId={marketId} // ⭐ props로 받은 marketId를 전달합니다.
                    />
                  )}
                </>
              )}

            {/* ⭐ 주차장 정보 렌더링 조건부 추가 */}

            {selectedCategory === '주차장' && (
              <ParkingInfo
                centerLat={selectedMarketCenter?.latitude || 0}
                centerLng={selectedMarketCenter?.longitude || 0}
                webViewRef={webViewRef}
                selectedCategory={''}
                onItemPress={function (lat: number, lng: number): void {
                  throw new Error('Function not implemented.');
                }}
              />
            )}

            {/* 주차장, 화장실, 근처 놀거리가 아닐 때만 상점 목록 렌더링 */}
            {selectedCategory !== '주차장' &&
              selectedCategory !== '화장실' &&
              selectedCategory !== '근처놀거리' &&
              storeList.map((store, idx) => {
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
                      onSelectStore(store);
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

                      {distance && (
                        <Text style={styles.storeDistance}>
                          현재 위치에서 {distance}km
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            {/* 상점 목록이 비어있고, 주차장/화장실/근처놀거리 카테고리가 아닐 때 "상점 정보 없음" 표시 */}
            {storeList.length === 0 &&
              !selectedCategory && ( // 초기 상태 (카테고리 선택 안 함) 또는 카테고리 필터링 결과 없음
                <Text style={styles.noStoreText}>
                  {marketName}에 등록된 상점 정보가 없습니다.
                </Text>
              )}
            {storeList.length === 0 &&
              selectedCategory &&
              productCategories.includes(selectedCategory) && ( // 상점 카테고리 선택 후 결과 없음
                <Text style={styles.noStoreText}>
                  선택한 카테고리의 상점 정보가 없습니다.
                </Text>
              )}
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
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
    paddingHorizontal: 2,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 0,
  },
  buttonSelected: {
    backgroundColor: '#e0f0ff',
    borderColor: '#91AEFF',
  },
  buttonText: {
    fontSize: 13,
    color: '#333',
  },
  storeCard: {marginBottom: 24},

  storeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 18,
  },

  storeName: {fontSize: 16, fontWeight: '600'},
  storeDesc: {fontSize: 13, color: '#555', marginBottom: 4},
  storeDistance: {color: '#f55', fontSize: 13, fontWeight: '500'},

  storeAffiliate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3366ff',
    marginLeft: 8,
    marginTop: 2.5,
  },
  storeNameTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
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

  // 추가된 스타일
  noStoreText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
    color: '#888',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  productItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  businessHourContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  businessHourRow: {
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  reviewSortButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  sortButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  sortButtonSelected: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3366FF',
    backgroundColor: '#E6F0FF',
    marginRight: 8,
  },
  sortButtonText: {
    fontSize: 13,
    color: '#555',
  },
  sortButtonTextSelected: {
    fontSize: 13,
    color: '#3366FF',
    fontWeight: 'bold',
  },
  reviewInputContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default IndoorInfoSheet;
