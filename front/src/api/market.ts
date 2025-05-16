import axiosInstance from './axios';

// 검색바에서 시장명 검색  --> MapHomeScreen
export const fetchMarketsByKeyword = async (keyword: string) => {
  const response = await axiosInstance.get('/markets/search', {
    params: {query: keyword},
  });
  return response.data;
};

// 상점 데이터 가져오기  --> IndoorInfoSheet
export const fetchAllStores = async () => {
  const response = await axiosInstance.get('/stores/all');
  return response.data;
};

// 마켓ID별, 카테고리별 상점 데이터 가져오기  --> IndoorInfoSheet
export const fetchStoresByCategory = async (
  category: string,
  marketName: string,
) => {
  const response = await axiosInstance.get('/stores/search', {
    params: {marketName, category},
  });
  return response.data;
};

export type BusinessHour = {
  //  --> IndoorInfoSheet
  day: string; // '월요일', '화요일' ...
  open_time: string; // '09:00:00'
  close_time: string; // '20:00:00'
  is_closed: boolean;
};

// 가게 상세정보에서 필요한 영업시간  --> IndoorInfoSheet
export const fetchBusinessHourByStoreId = async (
  storeId: number,
): Promise<BusinessHour[]> => {
  const {data} = await axiosInstance.get(`/stores/${storeId}/business-hour`);
  return data;
};

export type StoreProduct = {
  name: string;
  price: string;
};

// 가게 상세정보에서 필요한 판매품목  --> IndoorInfoSheet
export const fetchStoreProducts = async (
  storeId: number,
): Promise<StoreProduct[]> => {
  const {data} = await axiosInstance.get(`/stores/${storeId}/products`);
  return data;
};
