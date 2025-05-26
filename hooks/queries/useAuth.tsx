// hooks/queries/useAuth.ts
import { useState, useEffect } from 'react';

/**
 * 더미 훅: AsyncStorage나 실제 API 대신
 * 여기에 로그인 로직만 붙여 넣으면 됩니다.
 */
type User = {
    name: string;
    postCount: number;
    reviewCount: number;
    bookmarkedCount: number;
};

export default function useAuth() {
    const [isLoading, setLoading] = useState(true);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // 1초 뒤에 “로그인 안 된 상태”로 판정 (테스트용)
        const t = setTimeout(() => {
            setLoggedIn(false);    // true로 바꾸면 로그인된 화면 나옴
            setUser({
                name: '박서영',
                postCount: 46,
                reviewCount: 21,
                bookmarkedCount: 33,
            });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(t);
    }, []);

    return { isLoading, isLoggedIn, user };
}
