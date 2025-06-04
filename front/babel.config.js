// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // 기존 reanimated 플러그인 유지
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env', // 환경 변수를 import 할 모듈 이름
        path: '.env', // .env 파일의 경로 (프로젝트 루트에 있어야 함)
        blacklist: null, // 환경 변수에서 제외할 목록
        whitelist: null, // 환경 변수에서 포함할 목록
        safe: false, // .env 파일이 없으면 오류 발생 (true로 설정 시)
        allowUndefined: true, // .env에 없는 변수 사용 시 undefined 허용
      },
    ],
  ],
};
