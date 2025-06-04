// src/env.d.ts 또는 project-root/env.d.ts
declare module '@env' {
  export const API_BASE_URL: string;
  export const KAKAO_REST_API_KEY: string;
  export const APP_NAME: string;
  // .env 파일에 추가하는 다른 변수들도 여기에 선언
}
