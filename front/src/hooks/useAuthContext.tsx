// hooks/useAuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    id: number;
    nickname: string;
    profileImage?: string;
};

type AuthContextType = {
    isLoading: boolean;
    isLoggedIn: boolean;
    user: User | null;
    loginWithToken: (token: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const isLoggedIn = !!user;

    // 앱 시작 시 AsyncStorage에 저장된 토큰이 있으면 자동 로그인 시도
    useEffect(() => {
        (async () => {
            try {
                const token = await AsyncStorage.getItem('kakaoToken');
                if (token) {
                    await loginWithToken(token);
                }
            } catch (e) {
                console.error('자동 로그인 중 에러:', e);
            } finally {
                setIsLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loginWithToken = async (token: string) => {
        // 1) 로컬에 토큰 저장
        await AsyncStorage.setItem('kakaoToken', token);

        // 2) 카카오 프로필 API 호출
        try {
            const res = await fetch('https://kapi.kakao.com/v2/user/me', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (!data.kakao_account || !data.kakao_account.profile) {
                throw new Error('카카오 프로필 정보가 응답에 없습니다.');
            }

            setUser({
                id: data.id,
                nickname: data.kakao_account.profile.nickname,
                profileImage: data.kakao_account.profile.profile_image_url,
            });
        } catch (e) {
            console.error('프로필 조회 실패:', e);
            await AsyncStorage.removeItem('kakaoToken');
            setUser(null);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('kakaoToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoading, isLoggedIn, user, loginWithToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
    return ctx;
};
