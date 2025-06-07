import axios from 'axios';
import axiosInstance from './axios';
import {Platform} from 'react-native';
import {StoreReview, StoreKeyword} from '../types/common';

//  특정 가게(store_id)의 리뷰 리스트 조회
export const fetchReviewsByStoreId = async (
  store_id: number,
): Promise<StoreReview[]> => {
  const res = await axiosInstance.get(`/reviews/store/${store_id}`);
  const rawData = res.data;

  // 필드 매핑
  const mappedData: StoreReview[] = rawData.map((item: any) => ({
    id: Number(item.review_id),
    user_id: Number(item.user_id ?? 0), // 서버에서 빠져 있다면 0 처리
    store_id: Number(item.store_id ?? store_id),
    rating: Number(item.review_rating),
    comment: item.review_comment ?? '',
    created_at: item.review_created_at,
    nickname: item.user_nickname ?? '익명',
    image: item.review_image ?? null, // 서버가 포함하는 경우만
  }));

  return mappedData;
};

// 리뷰 작성 -> 백엔드로 전송
export const submitReview = async (
  storeId: number,
  rating: number,
  comment: string,
  imageUri?: string,
) => {
  const formData = new FormData();

  console.log('🚀 formData to send:', formData);

  formData.append('store_id', storeId.toString());
  formData.append('rating', rating.toString());
  formData.append('comment', comment);
  if (imageUri) {
    formData.append('image', {
      uri: imageUri,
      name: 'review.jpg',
      type: 'image/jpeg',
    } as any);
  }

  const res = await axiosInstance.post('/reviews', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 특정 가게 리뷰 키워드, 빈도수를 가져오기
export const fetchStoreKeywordsByStoreId = async (
  storeId: number,
): Promise<StoreKeyword[]> => {
  try {
    const res = await axiosInstance.get(`/store-keywords/${storeId}`);
    return res.data;
  } catch (error) {
    console.error('❌ 키워드 데이터 가져오기 실패:', error);
    throw error;
  }
};
