// 네비게이션 파일을 위한 타입 정의

import {AxiosError} from 'axios';
import {
  UseMutationOptions,
  UseQueryOptions,
  QueryKey,
} from '@tanstack/react-query';
import {NavigatorScreenParams} from '@react-navigation/native';
import {AuthStackParamList} from '../navigations/stack/AuthStackNavigator';

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
  PostListScreen: undefined;
  PostWriteScreen: undefined;
};

export type MainTabParamList = {
  Map: undefined;
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
};

export interface StoreReview {
  review_id: number;
  store_id: number;
  user_id: number;
  user_nickname: string;
  review_rating: number;
  review_comment: string;
  review_created_at: string;
  review_image?: string | null;
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
