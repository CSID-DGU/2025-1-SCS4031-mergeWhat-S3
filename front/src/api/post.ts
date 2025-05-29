import axios from 'axios';
import axiosInstance from './axios';
import {Platform} from 'react-native';

export interface StoreReview {
  id: number;
  user_id: number;
  store_id: number;
  rating: number;
  comment: string;
  image?: string | null;
  created_at: string;
  nickname: string; // JOIN된 member.nickname
}

//  특정 가게(store_id)의 리뷰 리스트 조회
export const fetchReviewsByStoreId = async (
  store_id: number,
): Promise<StoreReview[]> => {
  const res = await axiosInstance.get(`/reviews/store/${store_id}`);
  return res.data;
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

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  board_type: 'course' | 'produce' | 'food' | 'fashion';
  created_at: string;
}

// 커뮤니티 게시판 데이터 가져오기
export const fetchPostsByCategory = async (
  category: string,
): Promise<Post[]> => {
  const response = await axiosInstance.get('/posts/by-category', {
    params: {category},
  });
  //console.log('응답 받은 게시물:', response.data);
  return response.data;
};

const categoryMap: {[key: string]: string} = {
  시장로드맵: 'course',
  농수산물: 'produce',
  먹거리: 'food',
  옷: 'fashion',
  '기타 품목': 'etc',
};

// 게시글 등록 (이미지 제외)
export const createPost = async (
  title: string,
  content: string,
  category: string,
): Promise<number> => {
  const response = await axiosInstance.post('/posts/write', {
    title,
    content,
    board_type: categoryMap[category],
  });
  return response.data.id; // 새로 생성된 게시글 ID 반환
};

// 게시물에서 이미지 등록 (post_id에 연결)
export const uploadPostImage = async (
  postId: number,
  file: any,
): Promise<void> => {
  const formData = new FormData();

  formData.append('image', {
    uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
    name: file.fileName || 'image.jpg',
    type: file.type || 'image/jpeg',
  });
  formData.append('post_id', postId.toString());

  await axiosInstance.post('/post-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
