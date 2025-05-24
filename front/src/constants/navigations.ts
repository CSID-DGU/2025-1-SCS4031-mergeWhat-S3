// 상속 관련한 것들 관리

const authNavigations = {
  AUTH_HOME: 'AuthHome',
  KAKAO: 'Kakao',
} as const;

const MapNavigations = {
  MAP_HOME: 'MapHome',
} as const;

export {authNavigations, MapNavigations}; // 내보내기. -> 그럼 AuthStack 파일에서 import로 사용가능
