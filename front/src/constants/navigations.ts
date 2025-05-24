// 상속 및 스택 네비게이션 이름 정의

const authNavigations = {
  AUTH_HOME: 'AuthHome',
  KAKAO: 'Kakao',
} as const;

const MapNavigations = {
  MAP_HOME: 'MapHome',
} as const;

export {authNavigations, MapNavigations}; // 내보내기. -> 그럼 AuthStack 파일에서 import로 사용가능
