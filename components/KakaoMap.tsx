import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export type KakaoMapProps = {
  latitude: number;
  longitude: number;
  searchKeyword?: string;
  searchCount?: number;
  onPlacesChange: (places: string[]) => void;
  onMarkerClick: (index: number) => void;
  selectIndex?: number;
};

export default function KakaoMap({
  latitude, longitude,
  searchKeyword, searchCount,
  onPlacesChange, onMarkerClick,
  selectIndex,
}: KakaoMapProps) {
  const webviewRef = useRef<WebView>(null);

  // 1) 검색 키워드 변경 시
  useEffect(() => {
    if (searchKeyword && webviewRef.current) {
      const kw = JSON.stringify(searchKeyword);
      webviewRef.current.injectJavaScript(`
        window.searchPlaces(${kw});
        true;
      `);
    }
  }, [searchKeyword, searchCount]);

  // 2) 리스트 클릭(selectIndex) 변경 시
  useEffect(() => {
    if (selectIndex !== undefined && webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        window.selectPlace(${selectIndex});
        true;
      `);
    }
  }, [selectIndex]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ uri: 'http://192.168.75.208:3000/map.html' }}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScript={`
    (function() {
      const oldLog = console.log;
      console.log = function(...args) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'CONSOLE', payload: args })
        );
        oldLog.apply(console, args);
      };
    })();
    true;
  `}
        onMessage={evt => {
          let msg;
          try { msg = JSON.parse(evt.nativeEvent.data); } catch { return; }
          if (msg.type === 'CONSOLE') console.log('[Webview]', ...msg.payload);
          else if (msg.type === 'PLACES_LIST') onPlacesChange(msg.places);
          else if (msg.type === 'MARKER_CLICK') onMarkerClick(msg.index);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 }
});
