import React, {useEffect, useMemo, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Text,
  Button,
  Image,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import SearchBar from '../../components/SearchBar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import htmlContent from './kakaoHTML'; // 카카오맵API로 폴리곤 나눈 html -> webview로 전환

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

//-----------------------------------------------------------------------------

function MapHomeScreen() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['7%', '25%', '50%'], []);

  /*const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);*/

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.searchBarWrapper}>
          <SearchBar />
        </View>

        {/* Kakao 지도 WebView */}
        <View style={styles.mapWrapper}>
          <WebView
            originWhitelist={['*']}
            source={{html: htmlContent}}
            javaScriptEnabled
            domStorageEnabled
            style={styles.webview}
          />
        </View>

        {/* 화면에 항상 떠 있게 하는 BottomSheet */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0} // 시작 시 5% 위치에서 보여짐
          enablePanDownToClose={false} // 아래로 내려도 닫히지 않도록 설정
          style={styles.sheetContainer}>
          <View style={styles.sheetContent}>
            <Text>시장 및 놀거리 리스트가 여기에 들어갑니다.</Text>
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
});

export default MapHomeScreen;
