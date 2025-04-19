## 안드로이드 스튜디오 및 에뮬레이터 설정이 완료 되어 있다는 걸 전제로 합니다.

front 폴더는 프론트엔드, server 폴더는 백엔드(자바스크립트 코드로의 mysql연동)이기 때문에 각각의 README를 잘 참조해 주세요.

- ### 모듈 설치

1. cd front (프론트엔드 폴더로 이동)
2. npm install
3. npm install -g react-native-cli

- ### 실행

npx react-native run-android

(필요하다면 server 폴더도 실행. 실행 방식은 server폴더의 리드미 참조 )



- ios 사용자의 경우 (아직 안 될 가능성이 높습니다..)

1. cd ios
2. pod install
3. cd ..
4. npx react-native run-ios
