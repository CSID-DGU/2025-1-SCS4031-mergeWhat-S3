// 상속 관련한 것들 관리

const authNavigations = {
  // 쓸 일이 많으니까 '상수화' 과정
  AUTH_HOME: 'AuthHome',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
} as const;

const MapNavigations = {
  MAP_HOME: 'MapHome',
} as const;

export {authNavigations, MapNavigations}; // 내보내기. -> 그럼 AuthStack 파일에서 import로 사용가능
