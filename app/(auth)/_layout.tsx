// app/(auth)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
        >
            <Stack.Screen
                name="kakao"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
