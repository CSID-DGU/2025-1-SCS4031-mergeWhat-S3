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
    token: string | null;
    loginWithToken: (token: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const isLoggedIn = !!user;

    useEffect(() => {
        (async () => {
            try {
                const storedToken = await AsyncStorage.getItem('kakaoToken');
                if (storedToken) {
                    await loginWithToken(storedToken);
                }
            } catch (e) {
                console.error('자동 로그인 중 에러:', e);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const loginWithToken = async (token: string) => {
        await AsyncStorage.setItem('kakaoToken', token);
        setToken(token);

        try {
            const res = await fetch('https://kapi.kakao.com/v2/user/me', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            if (!data.kakao_account?.profile) {
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
            setToken(null);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('kakaoToken');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ isLoading, isLoggedIn, user, token, loginWithToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
    return ctx;
};
