import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const KakaoMapView = () => {

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://fanciful-kringle-8886ff.netlify.app/index.html' }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default KakaoMapView;
