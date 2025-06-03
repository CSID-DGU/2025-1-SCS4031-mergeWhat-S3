// 파일 경로: src/navigations/stack/MyPageNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthContext } from '../../hooks/useAuthContext';

// 로그인 관련 화면
import LoginScreen         from '../../screens/auth/LoginScreen';
import KakaoLoginScreen    from '../../screens/auth/KakaoLoginScreen';

// 마이페이지 홈 및 하위 화면
import MypageHomeScreen    from '../../screens/mypage/MypageScreen';
import BookMarkScreen      from '../../screens/mypage/BookMarkScreen';
import CommentScreen       from '../../screens/mypage/CommentScreen';
import LikeScreen          from '../../screens/mypage/LikeScreen';
import PostScreen          from '../../screens/mypage/PostScreen';
import ReviewScreen        from '../../screens/mypage/ReviewScreen';
import WithdrawScreen      from '../../screens/mypage/WithdrawScreen';

export type MypageStackParamList = {
  // 로그인 화면
  Login:        undefined;
  // 카카오 로그인 WebView
  KakaoLogin:   undefined;
  // 마이페이지 홈
  MypageHome:   undefined;
  // 하위 페이지들
  BookMark:     undefined;
  Comment:      undefined;
  Like:         undefined;
  Post:         undefined;
  Review:       undefined;
  Withdraw:     undefined;
};

const Stack = createNativeStackNavigator<MypageStackParamList>();

export default function MyPageNavigator() {
  const { isLoading, isLoggedIn } = useAuthContext();

  if (isLoading) {
    // 로딩 중에는 아무 화면도 렌더링하지 않거나 스켈레톤 등을 보여줄 수 있습니다.
    return null;
  }

  return (
    <Stack.Navigator >
      {isLoggedIn ? (
        // — 로그인된 상태: 마이페이지 홈 및 하위 화면들 등록 —
        <>
          <Stack.Screen
            name="MypageHome"
            component={MypageHomeScreen}
            options={{
                headerShown: false,
            }}
          />
          <Stack.Screen name="BookMark"
          component={BookMarkScreen}
          options={{
          title: '찜한 가게',
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
          },
        }} />
          <Stack.Screen name="Comment"
          component={CommentScreen}
          options={{
          title: '댓글 단 글',
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
          },
        }} />
          <Stack.Screen name="Like"
                 component={LikeScreen}
                 options={{
          title: '좋아요 누른 글',
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
          },
        }} />
          <Stack.Screen name="Post"
                 component={PostScreen}
                 options={{
          title: '게시글',
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
          },
        }} />
          <Stack.Screen name="Review"
               component={ReviewScreen}
               options={{
          title: '리뷰',
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
          },
        }} />
          <Stack.Screen name="Withdraw"
             component={WithdrawScreen}
             options={{
          title: '회원 탈퇴',
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
          },
        }} />
        </>
      ) : (
        // — 비로그인 상태: 로그인 화면 → 카카오 웹뷰 로그인 순서로 등록 —
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="KakaoLogin"
            component={KakaoLoginScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
