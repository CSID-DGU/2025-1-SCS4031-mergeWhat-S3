import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export type KakaoMapProps = {
  latitude: number;
  longitude: number;
  searchKeyword?: string;
  searchCount?: number;
  onPlacesChange: (places: string[]) => void;
  onMarkerClick: (index: number) => void;
  onMessage: (evt: any) => void;
  selectIndex?: number;
};

const KakaoMap = forwardRef<WebView, KakaoMapProps>(({
  latitude,
  longitude,
  searchKeyword,
  searchCount,
  onPlacesChange,
  onMarkerClick,
  onMessage,
  selectIndex
}, ref) => {
  const webviewRef = useRef<WebView>(null);
  // expose WebView methods to parent
  useImperativeHandle(ref, () => webviewRef.current!);

  // 검색 키워드 변경 시 호출
  useEffect(() => {
    if (searchKeyword && webviewRef.current) {
      const kw = JSON.stringify(searchKeyword);
      webviewRef.current.injectJavaScript(`
        window.searchPlaces(${kw});
        true;
      `);
    }
  }, [searchKeyword, searchCount]);

  // 선택 인덱스 변경 시 호출
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
        source={{ uri: 'http://192.168.75.234:3000/map.html' }}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScript={`
          (function() {
            const origLog = console.log;
            console.log = function(...args) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'CONSOLE', payload: args })
              );
              origLog.apply(console, args);
            };
          })();
          true;
        `}
        onMessage={evt => {
          let msg;
          try { msg = JSON.parse(evt.nativeEvent.data); } catch { return; }
          if (msg.type === 'PLACES_LIST') onPlacesChange(msg.places);
          else if (msg.type === 'MARKER_CLICK') {
            onMarkerClick(msg.index);
          }
          else if (msg.type === 'PARKING_DATA') {
            onMessage(evt);
          }
          else if (msg.type === 'CONSOLE') console.log('[WebView]', ...msg.payload);
        }}
      />
    </View>
  );
});

export default KakaoMap;

const styles = StyleSheet.create({
  container: { flex: 1 }
});
