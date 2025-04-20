import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

type KakaoMapProps = {
  latitude: number;
  longitude: number;
  searchKeyword?: string;
  searchCount?: number;
};

export default function KakaoMap({ latitude, longitude, searchKeyword, searchCount }: KakaoMapProps) {
  const webviewRef = useRef<WebView>(null);

  // searchKeyword 바뀔 때마다 injectJavaScript로 호출
  useEffect(() => {
    if (searchKeyword && webviewRef.current) {
      const kw = JSON.stringify(searchKeyword);

      // 한 번의 inject로 디버그 + 검색 호출
      const js = `
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'DEBUG_SEARCH', keyword: ${kw} })
        );
        window.searchPlaces(${kw});
        true;
      `;
      webviewRef.current.injectJavaScript(js);
    }
  }, [searchKeyword, searchCount]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ uri: 'http://192.168.75.56:3000/map.html' }}
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
        onMessage={evt => {
          // RN 쪽에서 메시지 수신
          let msg;
          try {
            msg = JSON.parse(evt.nativeEvent.data);
          } catch {
            return console.log('[Web]', evt.nativeEvent.data);
          }
          if (msg.type === 'DEBUG_SEARCH') {
            console.log('[RN] searchKeyword →', msg.keyword);
          }
        }}
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