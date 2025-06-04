import axios from 'axios';
import axiosInstance from './axios';
import {Platform} from 'react-native';
import {Post} from '../types/common';

// 커뮤니티 게시판 데이터 가져오기
export const fetchPostsByCategory = async (
  category: string,
): Promise<Post[]> => {
  try {
    const response = await axiosInstance.get('/posts/by-category', {
      params: {category},
    });

    return response.data;
  } catch (error) {
    console.error('게시물 목록 불러오기 실패:', error);
    throw error;
  }
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
  return response.data.id;
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

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  user?: {
    id: number;
    nickname: string;
    profile_url?: string;
  };
  created_at: string;
}

// 댓글 가져오기 (게시글 ID 기준)
export const fetchCommentsByPostId = async (
  postId: number,
): Promise<Comment[]> => {
  try {
    console.log(`Fetching comments for post ID: ${postId}`);
    const response = await axiosInstance.get<Comment[]>(
      `/comments/post/${postId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`게시글 ID ${postId}의 댓글 목록 불러오기 실패:`, error);
    throw error;
  }
};

// 댓글 작성 요청
export const createComment = async (
  postId: number,
  userId: number,
  content: string,
): Promise<Comment> => {
  try {
    console.log(
      `Creating comment for post ID ${postId} by user ID ${userId} with content: ${content}`,
    );
    const response = await axiosInstance.post<Comment>('/comments', {
      post_id: postId,
      user_id: userId,
      content: content,
    });
    return response.data;
  } catch (error) {
    console.error('댓글 생성 실패:', error);
    throw error;
  }
};
