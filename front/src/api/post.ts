import axiosInstance from './axios';

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
