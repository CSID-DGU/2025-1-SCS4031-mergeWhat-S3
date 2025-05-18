// src/components/ParkingInfo.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ParkingInfo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>주차장 정보</Text>
      <Text style={styles.desc}>🚗 근처에 있는 주차장을 안내해드립니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  desc: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default ParkingInfo;
