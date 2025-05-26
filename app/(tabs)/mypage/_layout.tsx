// app/(tabs)/mypage/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function MypageLayout() {
    return (
        <Stack
            // index.tsx 를 초기 화면으로 삼겠다
            initialRouteName="index"
            screenOptions={{
                headerTitleAlign: 'center',
                headerShadowVisible: false,
            }}
        >
            {/* /mypage → index.tsx */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />

            {/* /mypage/posts */}
            <Stack.Screen
                name="posts"
                options={{
                    title: '내가 쓴 게시글',
                    headerBackVisible: true,
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#000',
                    },
                }}
            />

            {/* /mypage/reviews */}
            <Stack.Screen
                name="reviews"
                options={{
                    title: '내 리뷰',
                    headerBackVisible: true,
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#000',
                    },
                }}
            />

            {/* /mypage/bookmarks */}
            <Stack.Screen
                name="bookmarks"
                options={{
                    title: '찜한 가게',
                    headerBackVisible: true,
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#000',
                    },
                }}
            />
        </Stack>
    );
}
