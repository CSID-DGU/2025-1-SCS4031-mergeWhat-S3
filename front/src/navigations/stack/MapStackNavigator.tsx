import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {MapNavigations} from '../../constants';
import MapHomeScreen from '../../screens/map/MapHomeScreen';
import SearchScreen from '../../screens/map/SearchScreen';

// Market 인터페이스 (SearchScreen.tsx와 동일하게 정의)
interface Market {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
}

// MapStackParamList 타입 정의 업데이트
export type MapStackParamList = {
  // MapHome으로 전달될 수 있는 파라미터
  MapHome:
    | {
        searchResultsFromSearchScreen?: Market[]; // ✅ SearchScreen에서 넘어오는 검색 결과 목록
        initialSelectedMarket?: Market; // ✅ (선택 사항) 만약 MapHome 진입 시 특정 시장을 바로 선택하고 싶다면
        //selectedMarketFromSearch?: Market;
      }
    | undefined;
  [MapNavigations.SEARCH_SCREEN]: undefined;
};

const Stack = createStackNavigator<MapStackParamList>();

function MapStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: 'white',
        },
        headerStyle: {
          shadowColor: 'gray',
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontSize: 15,
        },
        headerTintColor: 'black',
      }}>
      <Stack.Screen
        name={MapNavigations.MAP_HOME}
        component={MapHomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={MapNavigations.SEARCH_SCREEN}
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default MapStackNavigator;
