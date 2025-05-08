import axiosInstance from './axios';

// 검색바에서 시장명 검색
export const fetchMarketsByKeyword = async (keyword: string) => {
  const response = await axiosInstance.get('/markets/search', {
    params: {query: keyword},
  });
  return response.data;
};

// 카테고리별 상점 데이터 가져오기
export const fetchStoresByCategory = async (
  category: string,
  polygonName: string,
) => {
  const response = await axiosInstance.get('/stores/search', {
    params: {query: category},
  });
  return response.data;
};
