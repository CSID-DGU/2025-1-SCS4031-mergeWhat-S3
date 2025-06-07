import React, {useEffect, useMemo, useRef, useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {BottomSheetFlatList, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import SearchBar from '../../components/SearchBar';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import htmlContent from './kakaoHTML'; // 카카오맵API로 폴리곤 나눈 html -> webview로 전환
import Geolocation from '@react-native-community/geolocation';
import {marketImageMap} from '../../assets/market/marketImages';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import IndoorInfoSheet from '../store/IndoorInfoSheet';
import {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../../types/common';
import {getUltraSrtFcst, WeatherData} from '../../components/weather';
import {weatherIconMap} from '../../assets/weather/weatherImage';
import {StackNavigationProp} from '@react-navigation/stack';
import {MapStackParamList} from '../../navigations/stack/MapStackNavigator';
import {MapNavigations} from '../../constants/navigations';
import {fetchMarketsByKeyword} from '../../api/market';

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 접근 권한 요청',
          message: '현재 위치를 사용하기 위해 위치 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('위치 권한이 거부되어 현재 위치를 사용할 수 없습니다.');
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

type Market = {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  place_name?: string;
  distance?: string;
};

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

function getWeatherIcon(weatherData: WeatherData[] | null) {
  if (!weatherData) return null;
  const pty = weatherData.find(d => d.category === 'PTY')?.value;
  const sky = weatherData.find(d => d.category === 'SKY')?.value;

  if (pty === '1' || pty === '4') return weatherIconMap.rain;
  if (pty === '2' || pty === '3') return weatherIconMap.snow;
  if (sky === '1') return weatherIconMap.sunny;
  if (sky === '3' || sky === '4') return weatherIconMap.cloudy;

  return null;
}

type MapHomeScreenNavigationProp = StackNavigationProp<
  MapStackParamList,
  'MapHome'
>;

function MapHomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const webViewRef = useRef<WebView>(null);
  const [activeIndoor, setActiveIndoor] = useState<boolean>(false);

  const snapPoints = useMemo(() => ['7%', '30%', '40%', '80%'], []);
  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);

  const stackNavigation = useNavigation<MapHomeScreenNavigationProp>();
  const tabNavigation =
    stackNavigation.getParent<
      BottomTabNavigationProp<MainTabParamList, 'Map'>
    >();

  const route = useRoute();
  const [bottomSheetCurrentIndex, setBottomSheetCurrentIndex] = useState(1);
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  const [searchResults, setSearchResults] = useState<Market[]>([]);
  const [defaultMarketList, setDefaultMarketList] = useState<
    {
      id: string;
      name: string;
      center_lat: number;
      center_lng: number;
      place_name: string;
      distance: string;
    }[]
  >([]);

  const [currentIndoorStores, setCurrentIndoorStores] = useState<Store[]>([]);

  const [clickedIndoorName, setClickedIndoorName] = useState<string | null>(
    null,
  );

  const [currentMarketCenter, setCurrentMarketCenter] = useState<{
    latitude: number;
    longitude: number;
    marketId: number;
  } | null>(null);

  const [webviewMode, setWebviewMode] = useState<'market' | 'parking'>(
    'market',
  );

  const [selectedMarketName, setSelectedMarketName] = useState<string | null>(
    null,
  );

  // ⭐ Parking.tsx에서 주차장 목록을 받아와 저장할 상태
  const [parkingPlaces, setParkingPlaces] = useState<any[]>([]);
  // ⭐ Parking.tsx에서 선택된 주차장 정보 (마커 클릭 시)
  const [selectedParkingPlace, setSelectedParkingPlace] = useState<any>(null);
  // ⭐ 주차장 목록 정렬 기준 (원혁님 코드 참고)
  const [sortType, setSortType] = useState<'distance' | 'name'>('distance');

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        console.log('웹뷰로부터 메시지 수신:', data);

        switch (data.type) {
          case 'requestParkingData':
            /*console.log(
              '📡 [onMessage] 웹뷰로부터 주차장 데이터 요청 수신:',
              data.payload,
            );*/
            // → 여기서 Kakao API 호출 or 기존 로직으로 parking data 가져오기
            break;

          case 'indoorClick':
            console.log(`[MapHomeScreen] 실내 폴리곤 클릭: ${data.name}`);
            setClickedIndoorName(data.name);
            setActiveIndoor(true);
            setBottomSheetCurrentIndex(2);
            break;

          case 'mapReady':
            console.log(
              '[MapHomeScreen] 지도 로드 완료(mapReady). 현재 모드:',
              webviewMode,
            );

            // 지도 모드 설정: 'market' 또는 'parking'
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: 'SET_MAP_MODE',
                mode: webviewMode,
              }),
            );

            // 주차장 모드인 경우에만 초기 주차장 검색 요청
            if (webviewMode === 'parking') {
              const target = currentMarketCenter;
              if (target) {
                webViewRef.current?.postMessage(
                  JSON.stringify({
                    type: 'SEARCH_PARKING',
                    lat: target.latitude,
                    lng: target.longitude,
                  }),
                );
                console.log(
                  '[MapHomeScreen] market center 기준 주차장 검색 요청',
                );
              } else {
                Geolocation.getCurrentPosition(
                  position => {
                    webViewRef.current?.postMessage(
                      JSON.stringify({
                        type: 'SEARCH_PARKING',
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      }),
                    );
                    console.log(
                      '[MapHomeScreen] 현재 위치 기준 주차장 검색 요청',
                    );
                  },
                  error =>
                    console.warn(
                      '현재 위치를 가져올 수 없어 주차장 검색 불가:',
                      error.message,
                    ),
                  {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 10000,
                  },
                );
              }
            }

            break;

          case 'POLYGON_CLICK':
            console.log(`[MapHomeScreen] 폴리곤 클릭: ${data.name}`);
            setClickedIndoorName(data.name);
            setActiveIndoor(true);
            setBottomSheetCurrentIndex(2);
            break;

          case 'MARKER_CLICK':
            console.log(`[MapHomeScreen] 마커 클릭: ${data.name}`);
            break;

          case 'PARKING_PLACES_DATA':
            console.log('[MapHomeScreen] 주차장 데이터 수신:', data.places);
            setParkingPlaces(data.places);
            setBottomSheetCurrentIndex(2);
            break;

          case 'PARKING_MARKER_CLICK':
            console.log('[MapHomeScreen] 주차장 마커 클릭:', data.place);
            setSelectedParkingPlace(data.place);
            break;

          case 'LOG':
            console.log('[WebView Log]:', data.message);
            break;

          default:
            console.warn(
              '[MapHomeScreen] 알 수 없는 웹뷰 메시지 타입:',
              data.type,
            );
            break;
        }
      } catch (error) {
        console.error('웹뷰 메시지 파싱 오류:', error, event.nativeEvent.data);
      }
    },
    [webviewMode, currentMarketCenter],
  );

  useEffect(() => {
    const loadMarketCoords = async () => {
      if (!selectedMarketName) {
        setCurrentMarketCenter(null);
        return;
      }
      try {
        const data = await fetchMarketsByKeyword(selectedMarketName);
        if (data && Array.isArray(data) && data.length > 0) {
          const matchedMarket = data.find(m => m.name === selectedMarketName);
          if (
            matchedMarket &&
            matchedMarket.center_lat &&
            matchedMarket.center_lng &&
            matchedMarket.id
          ) {
            setCurrentMarketCenter({
              latitude: matchedMarket.center_lat,
              longitude: matchedMarket.center_lng,
              marketId: matchedMarket.id,
            });
          } else {
            setCurrentMarketCenter(null);
          }
        } else {
          setCurrentMarketCenter(null);
        }
      } catch (error) {
        console.error('❌ 시장 좌표 불러오기 실패:', error);
        setCurrentMarketCenter(null);
      }
    };

    loadMarketCoords();
  }, [selectedMarketName]);

  // ⭐ IndoorInfoSheet에서 가게 데이터가 로드되었을 때 호출될 콜백
  const handleStoresLoaded = useCallback(
    (stores: Store[]) => {
      if (!activeIndoor || !clickedIndoorName) {
        console.log('[⚠️ 마커 전송 중단] Indoor 클릭 상태가 아님.');
        return;
      }

      console.log('[MapHomeScreen] 필터링된 가게 수:', stores.length);
      setCurrentIndoorStores(stores);

      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({type: 'clearMarkers'}));

        const storeLocations = stores
          .filter(s => s.center_lat && s.center_lng)
          .map(s => ({
            lat: s.center_lat,
            lng: s.center_lng,
            name: s.name,
          }));

        if (storeLocations.length > 0) {
          webViewRef.current.postMessage(
            JSON.stringify({
              type: 'addMultipleMarkers',
              locations: storeLocations,
            }),
          );
        }
      }
    },
    [activeIndoor, clickedIndoorName],
  );

  // SearchScreen에서 넘어온 시장 정보를 받기 위한 useEffect 수정
  useEffect(() => {
    if (
      webViewLoaded &&
      route.params &&
      (route.params as any).searchResultsFromSearchScreen
    ) {
      const results = (route.params as any)
        .searchResultsFromSearchScreen as Market[];
      console.log('SearchScreen에서 받은 검색 결과 목록:', results);

      setSearchResults(results); // 검색 결과 목록 상태 업데이트
      setActiveIndoor(false); // IndoorInfoSheet는 아직 띄우지 않음
      setBottomSheetCurrentIndex(2); // 검색 결과가 있을 때는 45% (index 2)로 설정

      // 기존 마커를 모두 지웁니다. (검색 결과에 따라 새로운 마커를 그릴 준비)
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({type: 'clearMarkers'}));
        console.log(
          '[MapHomeScreen] clearMarkers 메시지 전송됨 (SearchScreen 결과)',
        );
      }

      // 파라미터를 소비했음을 알림
      stackNavigation.setParams({searchResultsFromSearchScreen: undefined});
    }
  }, [route.params, stackNavigation, webViewLoaded]);

  // 버튼시트 Backdrop
  const renderBackdrop = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
    ) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="collapse" // pressBehavior="collapse" 유지
        disappearsOnIndex={0}
        appearsOnIndex={1}
        opacity={0.05}
        // Backdrop 클릭 시 BottomSheet를 인덱스 0 (7%)으로 명시적으로 이동
        onPress={() => bottomSheetRef.current?.snapToIndex(0)}
      />
    ),
    [bottomSheetRef], // bottomSheetRef를 의존성 배열에 추가
  );

  useEffect(() => {
    if (webViewLoaded) {
      InteractionManager.runAfterInteractions(() => {
        requestLocationPermission();
      });
    }
  }, [webViewLoaded]);

  useEffect(() => {
    if (webViewLoaded) {
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'SET_MAP_MODE',
          mode: webviewMode, // 'market' 또는 'parking'
        }),
      );
      console.log(`[MapHomeScreen] SET_MAP_MODE: ${webviewMode} 전송`);
    }
  }, [webViewLoaded, webviewMode]);

  // BottomTab에서 "Map" 탭으로 다시 돌아왔을 때 초기화 로직
  useEffect(() => {
    if (tabNavigation) {
      const unsubscribe = tabNavigation.addListener('tabPress', e => {
        setActiveIndoor(false);
        setSelectedMarketName(null);
        setClickedIndoorName(null);
        setBottomSheetCurrentIndex(1); // 탭 전환 시 BottomSheet를 30% (index 1)로 설정
        setSearchResults([]); // 탭 전환 시 검색 결과도 초기화
        setDefaultMarketList([]); // 탭 전환 시 기본 시장 목록도 초기화하여 다시 로드하도록 유도

        // 모든 마커 지우기 (탭 전환 시)
        if (webViewRef.current) {
          webViewRef.current.postMessage(
            JSON.stringify({type: 'clearMarkers'}),
          );
          console.log('[MapHomeScreen] clearMarkers 메시지 전송됨 (tabPress)');
        }

        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: 'moveCenter',
                lat: latitude,
                lng: longitude,
                // 📌 수정: 탭 전환 시 줌 레벨을 3으로 명시하여 메인 폴리곤 뷰로 돌아오도록 설정
                zoomLevel: 0,
              }),
            );
          },
          error => {
            console.warn(error.message);
            Alert.alert('현재 위치를 가져올 수 없습니다.');
          },
          {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
        );
        // 탭 전환 시 다시 주변 시장을 불러와 defaultMarketList를 채웁니다.
        fetchNearbyMarkets();
      });
      return unsubscribe;
    }
  }, [tabNavigation]);

  // 기상청 정보 받아오기 (변경 없음)
  useEffect(() => {
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
  }, []);

  const [currentPosition, setCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  function getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  }

  const handleSearchResults = (markets: Market[]) => {
    setSearchResults(markets);
    setActiveIndoor(false);

    // 검색 결과가 있다면 기존 마커 모두 지우기
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({type: 'clearMarkers'}));
    }

    if (markets.length > 0) {
      setBottomSheetCurrentIndex(2); // 검색 결과 목록을 보여주기 위해 45% (index 2)로 올림
    } else {
      setBottomSheetCurrentIndex(1); // 30%로
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({type: 'clearMarkers'}));
        console.log(
          '[MapHomeScreen] clearMarkers 메시지 전송됨 (handleSearchResults - 결과 없음)', //디버깅용
        );
      }
    }
  };

  const fetchNearbyMarkets = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        console.log('📍 현재 위치:', latitude, longitude);

        try {
          const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/keyword.json?query=전통시장&x=${longitude}&y=${latitude}&radius=10000&size=5`,
            {
              method: 'GET',
              headers: {
                Authorization: 'KakaoAK 3e4babfcb6814efcfdfd18c83c0e6c81',
              },
            },
          );

          const data = await response.json();
          console.log('✅ REST API 검색 결과:', data); //현재위치에서 가까운 전통시장 검색결과

          if (Array.isArray(data.documents)) {
            const marketList = data.documents.map((item: any) => ({
              id: String(item.id),
              name: item.place_name,
              center_lat: parseFloat(item.y),
              center_lng: parseFloat(item.x),
              distance: item.distance || '0',
            }));

            marketList.sort(
              (a: any, b: any) =>
                parseFloat(a.distance) - parseFloat(b.distance),
            );

            setDefaultMarketList(marketList);
            setCurrentPosition({latitude, longitude});

            // 초기 로딩 시에는 마커x
            // setBottomSheetCurrentIndex(1); // 기본 30% 유지
          }
        } catch (err) {
          console.error('❌ 전통시장 검색 실패:', err);
        }
      },
      error => {
        console.warn('❌ 현재 위치 가져오기 실패:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const moveToLocation = (
    center_lat: number,
    center_lng: number,
    name: string,
  ) => {
    console.log(
      '🧭 이동할 시장 좌표:',
      center_lat,
      center_lng,
      '시장명:',
      name,
    ); // 시장명 추가 로깅

    const targetZoomLevel = 0; // 📌 추가: zoomLevel 변수 선언

    setTimeout(() => {
      console.log(
        // 디버깅용
        `[MapHomeScreen] Sending moveCenter: lat=${center_lat}, lng=${center_lng}, zoom=${targetZoomLevel}`,
      );
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'moveCenter',
          lat: center_lat,
          lng: center_lng,
          zoomLevel: targetZoomLevel,
        }),
      );
    }, 200); // 100ms 지연

    setSelectedMarketName(name); // 선택된 시장명 업데이트
    setClickedIndoorName(null); // 실내 폴리곤 이름 초기화 (IndoorInfoSheet에서 사용)
    setActiveIndoor(true); // IndoorInfoSheet를 띄우도록 설정

    setSearchResults([]); // 중요: 검색 결과 목록을 초기화하여 IndoorInfoSheet가 렌더링되도록 함
    setBottomSheetCurrentIndex(2); // IndoorInfoSheet를 보여줄 때는 45% (index 2)로 유지

    // 시장 클릭 시에는 모든 마커 지우고 IndoorInfoSheet에서 가게 데이터 로드 후 마커 그림
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({type: 'clearMarkers'}));
    }
  };

  const getImageSource = (marketName: string) => {
    if (marketImageMap[marketName]) {
      return marketImageMap[marketName];
    } else {
      console.warn(`❌ 이미지 없음: ${marketName}.jpg`);
      return null;
    }
  };

  // defaultMarketList (현재 위치 기반 시장 리스트) 렌더링 함수
  const renderDefaultMarketItem = useCallback(
    ({
      item,
    }: {
      item: {
        id: string;
        name: string;
        distance: string;
        center_lat: number;
        center_lng: number;
      };
    }) => {
      const marketName = item.name;
      const imageSource = getImageSource(item.name);
      const distanceKm = (parseFloat(item.distance) / 1000).toFixed(1);

      return (
        <TouchableOpacity
          key={item.id}
          style={{marginBottom: 32}}
          onPress={() => {
            moveToLocation(
              item.center_lat,
              item.center_lng,
              item.name, // 시장명 전달
            );
          }}>
          {imageSource && (
            <Image
              source={imageSource}
              style={{
                width: '100%',
                height: 240,
                borderRadius: 12,
                marginBottom: 8,
              }}
              resizeMode="cover"
            />
          )}
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'left',
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              color: '#888',
              fontSize: 14,
              marginBottom: 16,
              marginLeft: 10,
              marginTop: 3,
            }}>
            {distanceKm ? `현재 위치에서 ${distanceKm}km` : '거리 정보 없음'}
          </Text>
        </TouchableOpacity>
      );
    },
    [moveToLocation], // moveToLocation 의존성 추가
  );

  useEffect(() => {
    if (!currentPosition) {
      Geolocation.getCurrentPosition(
        position => {
          setCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log('[📍 위치정보 확보됨 - searchResult용]');
        },
        error => {
          console.warn('[위치 정보 실패]', error.message);
        },
        {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
      );
    }
  }, []);

  // searchResults (검색 결과 목록) 렌더링 함수
  const renderStyledMarketItem = useCallback(
    ({
      item,
    }: {
      item: {
        id: string;
        name: string;
        center_lat: number;
        center_lng: number;
      };
    }) => {
      const imageSource = getImageSource(item.name);

      let distanceKm = '';
      if (currentPosition) {
        distanceKm = getDistanceFromLatLonInKm(
          currentPosition.latitude,
          currentPosition.longitude,
          item.center_lat,
          item.center_lng,
        );
      }
      return (
        <TouchableOpacity
          style={{marginBottom: 20, padding: 10}}
          onPress={
            () =>
              // 검색 결과 목록에서 항목 클릭 시, IndoorInfoSheet를 띄우고 지도 확대
              moveToLocation(item.center_lat, item.center_lng, item.name) // 시장명 전달
          }>
          <Text
            style={{
              marginTop: -5,
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: 4,
            }}>
            {item.name}
          </Text>
          {distanceKm && (
            <Text
              style={{
                color: '#888',
                fontSize: 14,
                marginBottom: 16,
                marginLeft: 1,
                marginTop: 3,
              }}>
              현재 위치에서 {distanceKm}km
            </Text>
          )}
          {imageSource && (
            <Image
              source={imageSource}
              style={{width: '100%', height: 200, borderRadius: 10}}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      );
    },
    [currentPosition, moveToLocation], // currentPosition, moveToLocation 의존성 추가
  );

  const handleSearchBarPress = () => {
    stackNavigation.navigate(MapNavigations.SEARCH_SCREEN);
  };

  // IndoorInfoSheet에서 가게 클릭 시
  const handleSelectStore = useCallback((store: Store) => {
    console.log('[MapHomeScreen] 가게 선택:', store.name);
    if (webViewRef.current) {
      // 모든 기존 마커 지우기 (선택된 가게 마커만 표시하기 위함)
      webViewRef.current.postMessage(JSON.stringify({type: 'clearMarkers'}));

      // 선택된 가게의 위치로 지도 이동 및 단일 마커 표시
      webViewRef.current.postMessage(
        JSON.stringify({
          type: 'addSingleMarker', // kakaoHTML.ts에 이 타입 처리 로직이 필요
          lat: store.center_lat,
          lng: store.center_lng,
          name: store.name,
          // 기타 마커 정보 (예: image, category)
        }),
      );
      console.log(`[MapHomeScreen] Sending addSingleMarker: ${store.name}`);

      // 선택된 가게 위치로 지도 중심 이동 및 줌 인 (더 상세하게)
      webViewRef.current.postMessage(
        JSON.stringify({
          type: 'moveCenter',
          lat: store.center_lat,
          lng: store.center_lng,
          zoomLevel: 1, // 가게 상세 줌 레벨 (확대)
        }),
      );
    }
  }, []);

  // IndoorInfoSheet에서 카테고리 선택 시
  const handleSelectCategory = useCallback(
    (category: string | null, currentMarketName: string) => {},
    [],
  );

  // IndoorInfoSheet에서 뒤로가기 버튼 클릭 시 (시장 목록으로 돌아가기)
  const handleBackToMarketList = useCallback(() => {
    setActiveIndoor(false);
    setClickedIndoorName(null);
    setSelectedMarketName(null); // 시장 이름 초기화
    setBottomSheetCurrentIndex(1); // 바텀 시트를 30% (index 1) 위치로
    setSearchResults([]); // 시장 목록으로 돌아가므로 검색 결과도 초기화
    setDefaultMarketList([]);

    // 모든 마커 지우는 메시지 전송
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({type: 'clearMarkers'}));
    }
    // 필요하다면 fetchNearbyMarkets를 다시 호출하여 현재 위치 기반 시장 목록을 업데이트
    fetchNearbyMarkets();
  }, []);

  useEffect(() => {
    const params = route.params as any;

    if (webViewLoaded && params?.initialSelectedMarket) {
      const {center_lat, center_lng, name} = params.initialSelectedMarket;

      console.log(
        '[📍초기 중심 이동] 선택된 시장:',
        name,
        center_lat,
        center_lng,
      );

      // WebView로 지도 중심 이동 (zoomLevel 3)
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'moveCenter',
          lat: center_lat,
          lng: center_lng,
          zoomLevel: 3,
        }),
      );

      // 지도 이동만 하고, 아직 마커/Indoor 상태 전환은 하지 않음
      stackNavigation.setParams({initialSelectedMarket: undefined}); // 소비
    }
  }, [webViewLoaded, route.params]);

  // ----------------------------------------------------------------------------------------

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.searchBarWrapper}>
          <SearchBar onPress={handleSearchBarPress} />
        </View>

        {/* Kakao 지도 WebView */}
        <View style={styles.mapWrapper}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{html: htmlContent}} // 항상 kakaoHTML.ts 사용
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={[styles.webview, {zIndex: 10}]}
            onMessage={onMessage} // 통합 메시지 핸들러 사용
            onLoadEnd={() => {
              console.log('✅ WebView 로드 완료');
              setWebViewLoaded(true);

              // 웹뷰가 로드되면, 현재 webviewMode에 따라 지도 모드를 설정
              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: 'SET_MAP_MODE',
                  mode: webviewMode, // 'market' 또는 'parking'
                }),
              );

              if (webviewMode === 'parking') {
                if (currentMarketCenter) {
                  webViewRef.current?.postMessage(
                    JSON.stringify({
                      type: 'SEARCH_PARKING',
                      lat: currentMarketCenter.latitude,
                      lng: currentMarketCenter.longitude,
                    }),
                  );
                  console.log(
                    '[MapHomeScreen] 현재 시장 중심으로 주차장 검색 요청 보냄.',
                  );
                } else {
                  Geolocation.getCurrentPosition(
                    position => {
                      webViewRef.current?.postMessage(
                        JSON.stringify({
                          type: 'SEARCH_PARKING',
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                        }),
                      );
                      console.log(
                        '[MapHomeScreen] 현재 위치로 주차장 검색 요청 보냄.',
                      );
                    },
                    error =>
                      console.warn(
                        '현재 위치를 가져올 수 없어 주차장 검색 불가:',
                        error.message,
                      ),
                    {
                      enableHighAccuracy: true,
                      timeout: 10000,
                      maximumAge: 10000,
                    },
                  );
                }
              }
            }}
          />
        </View>

        {/* Weather Information Button */}
        {weatherData && (
          <TouchableOpacity style={styles.weatherButton} activeOpacity={0.8}>
            <Image
              source={getWeatherIcon(weatherData)}
              style={{width: 26, height: 26, marginBottom: 0.5}}
              resizeMode="contain"
            />
            <Text style={{fontSize: 13, fontWeight: '600'}}>
              {weatherData.find(d => d.category === 'T1H')?.value ?? '-'}°C
            </Text>
          </TouchableOpacity>
        )}

        {/* Button to return to current location */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={() => {
            Geolocation.getCurrentPosition(
              (position: {coords: {latitude: any; longitude: any}}) => {
                const {latitude, longitude} = position.coords;
                webViewRef.current?.postMessage(
                  JSON.stringify({
                    type: 'moveCenter',
                    lat: latitude,
                    lng: longitude,
                    // 📌 수정: 현재 위치로 돌아갈 때 줌 레벨을 3으로 명시하여 메인 폴리곤 뷰로 설정
                    zoomLevel: 0,
                  }),
                );
                console.log(
                  `[MapHomeScreen] Sending moveCenter (currentLocationButton): lat=${latitude}, lng=${longitude}, zoom=3`,
                );
                // 현재 위치로 돌아갈 때 모든 마커 지우기
                if (webViewRef.current) {
                  webViewRef.current.postMessage(
                    JSON.stringify({type: 'clearMarkers'}),
                  );
                }
              },
              (error: {message: any}) => {
                console.warn(error.message);
                Alert.alert('현재 위치를 가져올 수 없습니다.');
              },
              {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
            );
          }}>
          <Image
            source={require('../../assets/current_location_icon.png')}
            style={{width: 84, height: 84}}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* BottomSheet Render */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={bottomSheetCurrentIndex} // 상태로 제어
          enablePanDownToClose={false} // false로 유지하여 7% 아래로 사라지는 것을 방지
          backdropComponent={renderBackdrop}
          style={[styles.sheetContainer, {zIndex: 11}]} // zIndex를 11로 높여 WebView보다 위에 오도록 설정
        >
          <View style={{flex: 1}}>
            {activeIndoor ? (
              // 📌 지도에서 폴리곤 클릭 또는 검색 결과 목록에서 항목 클릭 시
              <IndoorInfoSheet
                polygonName={clickedIndoorName}
                marketName={selectedMarketName || ''}
                onSelectStore={handleSelectStore}
                onSelectCategory={handleSelectCategory}
                onBackToMarketList={handleBackToMarketList}
                onStoresLoaded={handleStoresLoaded}
                centerLat={currentMarketCenter?.latitude || 0} // currentMarketCenter가 null이면 0으로 기본값
                centerLng={currentMarketCenter?.longitude || 0}
                marketId={currentMarketCenter?.marketId || 0}
                webviewMode={webviewMode}
                setWebviewMode={setWebviewMode}
              />
            ) : searchResults.length > 0 ? (
              // 🔍 유저가 SearchScreen에서 검색한 결과 목록
              <BottomSheetFlatList
                data={searchResults}
                keyExtractor={item => item.id.toString()}
                renderItem={renderStyledMarketItem} // 이미지 포함된 스타일 렌더링
                contentContainerStyle={{paddingHorizontal: 16}} // FlatList 내부 여백
              />
            ) : defaultMarketList.length > 0 ? (
              // 📍 현재 위치 기반 시장 리스트 (초기 로딩 시)
              <BottomSheetScrollView contentContainerStyle={{padding: 16}}>
                {/* '현재 위치에서 가까운 전통시장이에요' 텍스트와 '반경 5km 내외' 텍스트를 감싸는 View */}
                <View style={styles.nearbyMarketsHeader}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '400',
                      textAlign: 'left',
                    }}>
                    현재 위치에서 가까운 전통시장이에요
                  </Text>
                  <Text
                    style={{
                      color: '#888',
                      fontSize: 14,
                      marginLeft: 10, // 기존 텍스트와의 간격
                    }}>
                    반경 5km
                  </Text>
                </View>
                {defaultMarketList.map(item => {
                  const marketWithCoords = {
                    ...item,
                    center_lat: item.center_lat,
                    center_lng: item.center_lng,
                  };
                  return renderDefaultMarketItem({item: marketWithCoords});
                })}
              </BottomSheetScrollView>
            ) : (
              <View style={{padding: 16}}>
                <Text>로딩 중 ...</Text>
              </View>
            )}
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  searchBarWrapper: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  webview: {
    flex: 1,
    opacity: 1,
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0.5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherButton: {
    position: 'absolute',
    bottom: 100,
    top: 90,
    left: 17,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nearbyMarketsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 40,
  },
});

export default MapHomeScreen;
