// 사용자가 가장먼저 마주하게 되는 로직들

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainBottomTab from './MainBottomTab';
import ReviewScreen from '../screens/store/ReviewScreen';
import {ReviewStackParamList} from '../types/common';
import AuthStackNavigator from './stack/AuthStackNavigator';
import {RootStackParamList} from '../types/common';
import EditNavigator from './stack/EditNavigator';

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="IndoorInfoScreen" component={MainBottomTab} />
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="EditInfoScreen" component={EditNavigator} />
    </Stack.Navigator>
  );
}

export default RootNavigator;
