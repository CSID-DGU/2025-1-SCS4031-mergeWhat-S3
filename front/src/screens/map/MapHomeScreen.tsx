import React, {useEffect, useMemo, useRef, useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Text,
  Button,
  Image,
  TouchableOpacity,
  InteractionManager,
  ScrollView,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import SearchBar from '../../components/SearchBar';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import htmlContent from './kakaoHTML'; // 카카오맵API로 폴리곤 나눈 html -> webview로 전환
import Geolocation from '@react-native-community/geolocation';
import {marketImageMap} from '../../assets/market/marketImages';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import IndoorInfoSheet from '../store/IndoorInfoSheet';
import {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {
  BottomTabNavigationEventMap,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../../types/common';
import {getUltraSrtFcst, WeatherData} from '../../components/weather';
import {weatherIconMap} from '../../assets/weather/weatherImage';
import useAuth from '../../hooks/queries/useAuth';

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

//-----------------------------------------------------------------------------

function MapHomeScreen() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const webViewRef = useRef<WebView>(null); // 검색->버튼시트에 뜬 결과 클릭했을때->화면이동
  const [keyword, setKeyword] = useState('');
  const [activeIndoor, setActiveIndoor] = useState<boolean>(false);

  const snapPoints = useMemo(() => ['7%', '45%', '80%'], []);

  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);

  const navigation =
    useNavigation<BottomTabNavigationProp<MainTabParamList, 'Map'>>();

  // 버튼시트 Backdrop
  const renderBackdrop = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
    ) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="collapse" // 화면 누르면 버튼시트 알아서 내려감. 아예 사라지게 만드려면 "close"
        disappearsOnIndex={0}
        appearsOnIndex={1}
        opacity={0.2} // 뒤 화면 어두워지는 정도. 기본값0.5
      />
    ),
    [],
  );

  // 시장 검색명
  const [searchResults, setSearchResults] = useState<
    {
      id: string;
      name: string;
      center_lat: number;
      center_lng: number;
    }[]
  >([]);

  // 시장명 검색x -> 현재위치에서 가까운 시장리스트
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

  const [webViewLoaded, setWebViewLoaded] = useState(false);

  useEffect(() => {
    // 카카오맵 화면 구현
    if (webViewLoaded) {
      InteractionManager.runAfterInteractions(() => {
        requestLocationPermission();
      });
    }
  }, [webViewLoaded]);

  // 인근 시장 검색을 위한 카카오맵 구현
  useEffect(() => {
    if (webViewLoaded) {
      const initLocation = async () => {
        await requestLocationPermission(); // 위치 권한 요청
        fetchNearbyMarkets(); // 권한 허용되었을 때만 실행
      };

      initLocation();
    }
  }, [webViewLoaded]);

  // BottomTab에서 "Map" 탭으로 다시 돌아왔을 때 초기화
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      // 👇 이 부분에 초기화 로직 작성
      setKeyword('');
      setSearchResults([]);
      setActiveIndoor(false);

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          webViewRef.current?.postMessage(
            JSON.stringify({
              type: 'moveCenter',
              lat: latitude,
              lng: longitude,
            }),
          );
        },
        error => {
          console.warn(error.message);
          Alert.alert('현재 위치를 가져올 수 없습니다.');
        },
        {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
      );
    });

    return unsubscribe;
  }, [navigation]);

  // 기상청 정보 받아오기
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

  // 검색한 시장 -> 현재위치와의 거리 구하는 함수
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
    setSearchResults(markets); // 여전히 상태 업데이트는 필요함
    setActiveIndoor(false); // IndoorInfoSheet 강제 해제. 언제라도 검색 시 -> 바로 버튼시트 내용이 searchResult로 바뀌게

    if (markets.length > 0) {
      const {center_lat, center_lng} = markets[0];

      // BottomSheet 42%로 열기
      bottomSheetRef.current?.snapToIndex(1);

      // 지도 중심 이동
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'moveCenter',
          lat: center_lat,
          lng: center_lng,
          zoomLevel: 3,
        }),
      );
    }
  };

  // 초기 버튼시트 - 현재위치에서 가까운 시장들 카카오API로 검색
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
          console.log('✅ REST API 검색 결과:', data);

          if (Array.isArray(data.documents)) {
            const marketList = data.documents.map((item: any) => ({
              id: String(item.id),
              name: item.place_name,
              center_lat: parseFloat(item.y),
              center_lng: parseFloat(item.x),
              distance: item.distance || '0',
            }));

            // distance 기준 오름차순 정렬
            marketList.sort(
              (a: any, b: any) =>
                parseFloat(a.distance) - parseFloat(b.distance),
            );

            setDefaultMarketList(marketList); // 인근 시장
            setCurrentPosition({latitude, longitude}); // 검색결과로서 나올 시장
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

  // 시장명 검색 -> 검색 결과 -> 여기서 사용자가 클릭한 시장명 저장해두기.
  const [selectedMarketName, setSelectedMarketName] = useState<string | null>(
    null,
  );

  // 시장명 검색 -> 클릭한 시장 좌표로 지도 화면 이동
  const moveToLocation = (
    center_lat: number,
    center_lng: number,
    name: string,
  ) => {
    console.log('🧭 이동할 시장 좌표:', center_lat, center_lng);

    webViewRef.current?.postMessage(
      JSON.stringify({
        type: 'moveCenter',
        lat: center_lat,
        lng: center_lng,
        zoomLevel: 0, // 검색 결과 클릭하면 -> 화면이 약도로 확대됨
      }),
    );
    //setActiveIndoor(name);
    setSelectedMarketName(name);
    setClickedIndoorName(null); // 폴리곤 직접 클릭한 건 아님
    setSelectedMarketName(name); // 시장명 저장
    setActiveIndoor(true); // IndoorInfoSheet 열도록 설정
    bottomSheetRef.current?.snapToIndex(1); // BottomSheet 열기
  };

  // 백엔드로부터 searchResult 결과 렌더링
  const renderMarketItem = ({
    item,
  }: {
    item: {
      id: string;
      name: string;
      center_lat: number;
      center_lng: number;
    };
  }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        moveToLocation(item.center_lat, item.center_lng, item.name)
      } // 버튼 클릭 시 좌표 전송
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  // defaultMarkerList 이미지 매칭
  const getImageSource = (marketName: string) => {
    if (marketImageMap[marketName]) {
      return marketImageMap[marketName];
    } else {
      console.warn(`❌ 이미지 없음: ${marketName}.jpg`);
      return null;
    }
  };

  // 현재위치에서 가까운 시장 결과 렌더링
  const renderDefaultMarketItem = ({
    item,
  }: {
    item: {
      id: string;
      name: string;
      distance: string;
    };
  }) => {
    //console.log('🧩 버튼시트 렌더링 item:', item);

    const marketName = item.name;
    //console.log('가져온 시장명: ', marketName);

    const imageSource = getImageSource(item.name);
    const distanceKm = (parseFloat(item.distance) / 1000).toFixed(1);

    return (
      <View style={{marginBottom: 20, padding: 10}}>
        {imageSource && (
          <Image // 시장 이미지 크기 조절
            source={imageSource}
            style={{width: '100%', height: 200, borderRadius: 15}}
            resizeMode="cover"
          />
        )}
        <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
          {item.name}
        </Text>
        <Text style={{color: '#888', fontSize: 14}}>{distanceKm}km 거리</Text>
      </View>
    );
  };

  // --

  // searchResult의 버튼시트에 담길 것들
  const renderStyledMarketItem = ({
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
        onPress={() =>
          moveToLocation(item.center_lat, item.center_lng, item.name)
        }>
        <Text
          style={{
            marginTop: -5,
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: 10,
          }}>
          {item.name}
        </Text>
        {distanceKm && (
          <Text
            style={{
              color: '#888',
              fontSize: 14,
              marginBottom: 16,
              marginLeft: 10,
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
  };

  const [clickedIndoorName, setClickedIndoorName] = useState<string | null>(
    null,
  );

  // !----  스타일  ---!

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            onSearchResult={handleSearchResults}
          />
        </View>

        {/* Kakao 지도 WebView */}
        <View style={styles.mapWrapper}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{html: htmlContent}}
            javaScriptEnabled={true}
            domStorageEnabled
            style={styles.webview}
            onMessage={(event: WebViewMessageEvent) => {
              const message = JSON.parse(event.nativeEvent.data);
              if (message.type === 'indoorClick') {
                console.log('[📌 클릭된 폴리곤 이름]', message.name);
                setClickedIndoorName(message.name); // ✅ 상태로 저장
                setActiveIndoor(true);

                bottomSheetRef.current?.snapToIndex(1);
              }
            }}
            onLoadEnd={() => {
              console.log('✅ WebView 로드 완료');
              setWebViewLoaded(true);
            }}
          />
        </View>

        {/* 기상청 정보 버튼 */}
        {weatherData && (
          <TouchableOpacity style={styles.weatherButton} activeOpacity={0.8}>
            <Image
              source={getWeatherIcon(weatherData)}
              style={{width: 26, height: 26, marginBottom: 0.5}} // 날씨아이콘 크기
              resizeMode="contain"
            />
            <Text style={{fontSize: 13, fontWeight: '600'}}>
              {weatherData.find(d => d.category === 'T1H')?.value ?? '-'}°C
            </Text>
          </TouchableOpacity>
        )}

        {/* 현재 위치로 돌아가는 버튼 */}
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
                  }),
                );
              },
              (error: {message: any}) => {
                console.warn(error.message);
                Alert.alert('현재 위치를 가져올 수 없습니다.');
              },
              {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
            );
          }}>
          <Image
            source={require('../../assets/current_location_icon.png')} // 현재위치 버튼 이미지
            style={{width: 84, height: 84}} // 현재위치 버튼 크기
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* BottomSheet 렌더링 */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          enablePanDownToClose={false}
          backdropComponent={renderBackdrop}
          style={styles.sheetContainer}>
          <View style={{flex: 1}}>
            {activeIndoor ? (
              <IndoorInfoSheet
                polygonName={clickedIndoorName}
                marketName={selectedMarketName || ''}
              />
            ) : searchResults.length > 0 ? (
              // 🔍 유저가 검색한 결과
              <BottomSheetFlatList
                data={searchResults}
                keyExtractor={item => item.id.toString()}
                renderItem={renderStyledMarketItem}
              />
            ) : defaultMarketList.length > 0 ? (
              // 📍 현재 위치 기반 시장 리스트
              <BottomSheetScrollView contentContainerStyle={{padding: 16}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '400',
                    marginBottom: 40,
                    textAlign: 'left',
                  }}>
                  현재 위치에서 가까운 전통시장이에요
                </Text>
                {defaultMarketList.map(item => {
                  const imageSource = getImageSource(item.name);
                  const distanceKm = (parseFloat(item.distance) / 1000).toFixed(
                    1,
                  );

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={{marginBottom: 32}}
                      onPress={() => {
                        moveToLocation(
                          item.center_lat,
                          item.center_lng,
                          item.name,
                        );
                        setClickedIndoorName(null); // 실내 폴리곤 아님
                        setActiveIndoor(true); // ✅ IndoorInfoSheet 띄우기

                        bottomSheetRef.current?.snapToIndex(1);
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
                          fontSize: 13,
                          textAlign: 'left',
                        }}>
                        현재 위치에서 {distanceKm}km
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </BottomSheetScrollView>
            ) : (
              // 🔄 로딩 중
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
    //right: 90, // 현재위치 버튼이 right: 20 → 왼쪽으로 적절히 조절
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
});

export default MapHomeScreen;
function setKeyword(arg0: string) {
  throw new Error('Function not implemented.');
}
