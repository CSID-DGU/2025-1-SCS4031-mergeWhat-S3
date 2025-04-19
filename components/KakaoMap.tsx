import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

type KakaoMapProps = {
  latitude: number;
  longitude: number;
};

export default function KakaoMap({ latitude, longitude }: KakaoMapProps) {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ uri: 'http://192.168.75.88:3000/map.html' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={() => console.log('WebView loaded successfully')}
        onError={(e) => console.error('WebView error: ', e.nativeEvent)}
        injectedJavaScript={`(function() {
          window.console.log = function(message) {
            window.ReactNativeWebView.postMessage(message);
          }
        })();`}
        onMessage={(event) => console.log(event.nativeEvent.data)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
  },
});