// 시장 탭
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Market = () => {
    return (
        <View style={styles.container}>
            <Text>시장 탭입니다.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Market;