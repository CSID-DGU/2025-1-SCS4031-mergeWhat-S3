// 네비게이션 파일을 위한 타입 정의

import {AxiosError} from 'axios';
import {
  UseMutationOptions,
  UseQueryOptions,
  QueryKey,
} from '@tanstack/react-query';
import {NavigatorScreenParams} from '@react-navigation/native';
import {AuthStackParamList} from '../navigations/stack/AuthStackNavigator';
import {MapStackParamList} from '../navigations/stack/MapStackNavigator';

type ResponseError = AxiosError<{
  statusCode: number;
  message: string;
  error: string;
}>;

type UseMutationCustomOptions<TData = unknown, TVariables = unknown> = Omit<
  UseMutationOptions<TData, ResponseError, TVariables, unknown>,
  'mutationFn'
>;

type UseQueryCustomOptions<TQueryFnData = unknown, TData = TQueryFnData> = Omit<
  UseQueryOptions<TQueryFnData, ResponseError, TData, QueryKey>,
  'queryKey'
>;

export type {ResponseError, UseMutationCustomOptions, UseQueryCustomOptions};

export type CommunityStackParamList = {
  PostListScreen: {selectedMarketName?: string} | undefined;
  PostWriteScreen: undefined;
  MarketSearchScreen: undefined;
  PostInfoScreen: {post: Post};
};

export type MainTabParamList = {
  Map: NavigatorScreenParams<MapStackParamList>;
  Market: undefined;
  Community: undefined;
  MyPage: undefined;
};

export type ReviewStackParamList = {
  IndoorInfoScreen: undefined;
  ReviewScreen: {
    storeName: string;
    storeId: number;
  };
};

export type RootStackParamList = {
  IndoorInfoScreen: undefined;
  ReviewScreen: {storeName: string; storeId: number};
  EditInfoScreen: NavigatorScreenParams<EditStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  CommunityStack: NavigatorScreenParams<CommunityStackParamList>;
  Search: {
    selectedMarket?: {
      id: string;
      name: string;
      center_lat: number;
      center_lng: number;
    };
  };
};

export interface StoreReview {
  id: number; // DB의 'id'와 일치
  user_id: number; // DB의 'user_id'와 일치
  store_id: number; // DB의 'store_id'와 일치
  rating: number; // DB의 'rating'과 일치
  comment: string; // DB의 'comment'와 일치
  image?: string | null; // 백엔드에서 추가로 JOIN되거나 처리되는 이미지 필드
  created_at: string; // DB의 'created_at'과 일치
  nickname: string; // JOIN된 member.nickname
}

export type EditStackParamList = {
  EditScreen: {
    storeName: string;
    storeId: number;
    storeCategory: string;
    storeAddress: string;
    storeContact: string;
    storeBusinessHours: {
      day: string;
      open: string;
      close: string;
    }[];
  };
};

export interface PostImage {
  id: number;
  postImage_url: string; // postImage_url 컬럼이 postImageUrl로 매핑됨
  post_id: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id?: number;
  user?: PostAuthor;
  board_type: 'course' | 'produce' | 'food' | 'fashion' | 'etc';
  images?: PostAttachedImage[];
}

export interface PostAuthor {
  id?: number; // user_id에 해당
  nickname?: string;
  profile_url?: string;
}

export interface PostAttachedImage {
  id?: number;
  postImage_url: string;
}

export interface StoreKeyword {
  id: number;
  store_id: number;
  keyword: string;
  frequency: number;
}

type PlaceImage = {
  id: number;
  market_id: number; // ⭐ market_id 추가
  name: string; // ⭐ place_name이 DB의 name 컬럼에 매핑
  is_indoor: boolean;
  image_url: string;
};
