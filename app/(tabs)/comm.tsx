// 커뮤니티 탭
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const comm = () => {
    return (
        <View style={styles.container}>
            <Text>커뮤니티 탭입니다.</Text>
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

export default comm;