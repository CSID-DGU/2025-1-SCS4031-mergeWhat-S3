import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const mypage = () => {
    return (
        <View style={styles.container}>
            <Text>마이페이지 탭입니다.</Text>
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

export default mypage;