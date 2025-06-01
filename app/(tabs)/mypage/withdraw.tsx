// app/(tabs)/mypage/withdraw.tsx
import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';

export const options = {
    title: '회원 탈퇴',
    headerBackVisible: true,
    headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
};

export default function WithdrawScreen() {
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirmToggle = () => {
        setConfirmed(prev => !prev);
    };

    const handleWithdrawPress = () => {
        if (!confirmed) {
            Alert.alert('안내', '회원 탈퇴 전에 안내사항을 확인하고 동의해야 합니다.');
            return;
        }
        Alert.alert(
            '최종 확인',
            '정말로 회원 탈퇴를 진행하시겠습니까?\n삭제된 계정 정보는 복구할 수 없습니다.',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '탈퇴하기',
                    style: 'destructive',
                    onPress: () => {
                        // 나중에 백엔드 연동 시 실제 API 호출을 여기에 넣으면 됩니다.
                        Alert.alert('완료', '회원 탈퇴 요청이 접수되었습니다.');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.header}>회원 탈퇴 안내</Text>

                <View style={styles.warningBox}>
                    <Text style={styles.warningText}>
                        • 회원 탈퇴 시 모든 개인 정보와 개인정보 묶음이{' '}
                        <Text style={{ fontWeight: 'bold' }}>영구적으로 삭제</Text>됩니다.{'\n'}
                        • 삭제된 계정과 관련된 모든 활동 내역(게시물, 댓글 등)은 복구할 수 없습니다.{'\n'}
                        • 탈퇴 후 동일한 카카오 아이디로 재가입할 수 있습니다.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.checkboxContainer, confirmed && styles.checkboxContainerChecked]}
                    onPress={handleConfirmToggle}
                    activeOpacity={0.8}
                >
                    <View style={[styles.checkbox, confirmed && styles.checkboxChecked]} />
                    <Text style={styles.checkboxLabel}>위 안내사항을 모두 확인하고 동의합니다</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.withdrawButton, !confirmed && styles.withdrawButtonDisabled]}
                    onPress={handleWithdrawPress}
                    activeOpacity={0.8}
                    disabled={!confirmed}
                >
                    <Text style={styles.withdrawButtonText}>회원 탈퇴하기</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: {
        padding: 24,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 16,
    },
    warningBox: {
        backgroundColor: '#fff3f3',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f5c6cb',
        marginBottom: 24,
    },
    warningText: {
        fontSize: 14,
        color: '#7f0000',
        lineHeight: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
    },
    checkboxContainerChecked: {
        borderColor: '#d32f2f',
        backgroundColor: '#ffe5e5',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 8,
        borderRadius: 4,
    },
    checkboxChecked: {
        backgroundColor: '#d32f2f',
        borderColor: '#d32f2f',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },
    withdrawButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    withdrawButtonDisabled: {
        backgroundColor: '#f5a9a9',
    },
    withdrawButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});
