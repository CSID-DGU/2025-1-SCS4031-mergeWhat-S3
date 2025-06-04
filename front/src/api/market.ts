import axiosInstance from './axios';

// 검색바에서 시장명 검색  --> MapHomeScreen
export const fetchMarketsByKeyword = async (keyword: string) => {
  const response = await axiosInstance.get('/markets/search', {
    params: {query: keyword},
  });
  return response.data;
};

// 상점 데이터 가져오기  --> IndoorInfoSheet
export const fetchAllStores = async (marketName: string) => {
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

// 가게 상세정보에서 필요한 영업시간  --> IndoorInfoSheet
export const fetchBusinessHourByStoreId = async (
  storeId: number,
): Promise<BusinessHour[]> => {
  const {data} = await axiosInstance.get(`/stores/${storeId}/business-hour`);
  return data;
};

// 가게 상세정보에서 필요한 판매품목  --> IndoorInfoSheet
export const fetchStoreProducts = async (
  storeId: number,
): Promise<StoreProduct[]> => {
  const {data} = await axiosInstance.get(`/stores/${storeId}/products`);
  return data;
};

export const fetchPlaceImage = async (
  marketId: number, // ⭐ marketId 파라미터 추가
  placeName: string,
  isIndoor: boolean,
): Promise<PlaceImage | null> => {
  try {
    // ⭐ URL 경로에 marketId, placeName, isIndoor를 모두 포함
    // 예: /entertainment-image/123/종묘/true
    const response = await axiosInstance.get(
      `/entertainment-image/${marketId}/${placeName}/${isIndoor.toString()}`,
    );

    if (response.data) {
      return response.data;
    } else {
      console.warn(
        `[API] 장소에 대한 이미지를 찾을 수 없습니다: Market ID: ${marketId}, Place: ${placeName}, Indoor: ${isIndoor}`,
      );
      return null;
    }
  } catch (error) {
    console.error(
      `[API] Market ID: ${marketId}, ${placeName} 이미지 가져오기 실패:`,
      error,
    );
    throw error;
  }
};

// --------------------------------------------------------------------------------

export type Market = {
  id: number;
  name: string;
  field: string;
};

export type Store = {
  id: number;
  market_id: number;
  category_id: number;
  name: string;
  address: string;
  contact?: string;
  is_affiliate: boolean;
  indoor_name: string;
};

export type BusinessHour = {
  //  --> IndoorInfoSheet
  day: string; // '월요일', '화요일' ...
  open_time: string; // '09:00:00'
  close_time: string; // '20:00:00'
  is_closed: boolean;
};

export type StoreProduct = {
  name: string;
  price: string;
};

export type StoreImage = {
  id: number;
  store_id: number;
  image_url: string;
};

type PlaceImage = {
  id: number;
  market_id: number; // ⭐ market_id 추가
  name: string; // ⭐ place_name이 DB의 name 컬럼에 매핑
  is_indoor: boolean;
  image_url: string;
};
