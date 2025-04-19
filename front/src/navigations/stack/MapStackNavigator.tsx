import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {MapNavigations} from '../../constants';
import MapHomeScreen from '../../screens/map/MapHomeScreen';

export type AuthStackParamList = {
  [MapNavigations.MAP_HOME]: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

function AuthStackNavigator() {
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
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default AuthStackNavigator;
