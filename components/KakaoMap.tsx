import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export type KakaoMapProps = {
  latitude: number;
  longitude: number;
  searchKeyword?: string;
  searchCount?: number;
  onPlacesChange: (places: string[]) => void;  // ✨ 추가
};

export default function KakaoMap({
  latitude,
  longitude,
  searchKeyword,
  searchCount,
  onPlacesChange,                        // ✨ 추가
}: KakaoMapProps) {
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    if (searchKeyword && webviewRef.current) {
      const kw = JSON.stringify(searchKeyword);
      const js = `
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
        javaScriptEnabled
        domStorageEnabled
        onMessage={evt => {
          let msg;
          try {
            msg = JSON.parse(evt.nativeEvent.data);
          } catch {
            return;
          }
          if (msg.type === 'PLACES_LIST') {
            onPlacesChange(msg.places);     // ✨ 추가
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
