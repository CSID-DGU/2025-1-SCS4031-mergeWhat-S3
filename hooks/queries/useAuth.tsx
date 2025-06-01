// hooks/queries/useAuth.ts
import { useState, useEffect } from 'react';

type User = {
    id: number;
    nickname: string;
    profileImage?: string;
};

type UseAuthReturn = {
    isLoading: boolean;
    isLoggedIn: boolean;
    user: User | null;
    kakaoLoginMutation: {
        mutate: (token: string) => void;
    };
};

export default function useAuth(): UseAuthReturn {
    const [isLoading, setLoading] = useState(true);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // 예시: 로딩 후 비로그인 상태 유지
        setTimeout(() => {
            setLoggedIn(false);
            setLoading(false);
        }, 500);
    }, []);

    // 더미 뮤테이션: 나중에 실제 로직으로 교체
    const kakaoLoginMutation = {
        mutate: (token: string) => {
            console.log('[stub] kakaoLoginMutation 호출:', token);
            // 예시로 로그인 처리
            setUser({ id: 1, nickname: '테스트유저' });
            setLoggedIn(true);
        },
    };

    return { isLoading, isLoggedIn, user, kakaoLoginMutation };
}
