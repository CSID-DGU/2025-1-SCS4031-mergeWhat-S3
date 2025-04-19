// 버튼에 관한 설정!!

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  PressableProps,
  Dimensions,
} from 'react-native';
import {colors} from '../constants/colors';

interface CustomButtonProps extends PressableProps {
  label: string;
  variant?: 'filled' | 'outlined';
  size?: 'large' | 'medium';
  inValid?: boolean; // 버튼이 비활성화 됐을때 별개로 스타일 지정하려고
}

const deviceHeight = Dimensions.get('screen').height; // 휴대폰 액정크기에 따라 버튼 크기가 엇나가지 않도록 미리 측정

function CustomButton({
  label,
  variant = 'filled',
  size = 'large',
  inValid = false,
  ...props
}: CustomButtonProps) {
  return (
    <Pressable
      disabled={inValid} // 버튼이 비활성화 상태면 사용x
      style={(
        {pressed}, // 버튼이 눌렸을때의 스타일
      ) => [
        styles.container,
        styles[size],
        pressed ? styles[`${variant}Pressed`] : styles[variant],
        inValid && styles.inValid,
      ]}
      {...props}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    //flexDirection: 'row',
  },
  inValid: {
    opacity: 0.5, //투명도
  },
  filled: {
    backgroundColor: colors.PINK_700,
  },
  outlined: {
    borderColor: colors.PINK_700,
    borderWidth: 1,
  },
  filledPressed: {
    // 버튼을 눌렀을때
    backgroundColor: colors.PINK_500,
  },
  outlinedPressed: {
    backgroundColor: colors.PINK_700,
    borderWidth: 1,
    opacity: 0.5,
  },

  large: {
    // 버튼 크기. function CustomButton에서 size='large'로 기본설정됨
    width: '100%',
    paddingVertical: deviceHeight > 700 ? 15 : 10,
    alignItems: 'center',
    //flexDirection: 'row',
    justifyContent: 'center',
  },
  medium: {
    width: '50%',
    paddingVertical: deviceHeight > 700 ? 12 : 8,
    alignItems: 'center',
    //flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  filledText: {
    color: colors.WHITE,
  },
  outlinedText: {
    color: colors.PINK_700,
  },
});

export default CustomButton;
