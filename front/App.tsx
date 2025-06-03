/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';

import RootNavigator from './src/navigations/RootNavigator';
import queryClient from './src/api/queryClient';
import {  AuthProvider } from './src/hooks/useAuthContext';

function App() {
  return (
    
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
   
  );
}

export default App;
