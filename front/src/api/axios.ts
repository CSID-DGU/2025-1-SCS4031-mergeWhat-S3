import axios from 'axios';
import {Platform} from 'react-native';

const axiosInstance = axios.create({
  baseURL:
    Platform.OS === 'android'
      ? 'http://10.0.2.2:3030' // 안드로이드 전용 ip주소, 이건 수정할 필요 없을 겁니다!
      : 'http://localhost:3030', // ios일땐 localhost
  withCredentials: true,
});

export default axiosInstance;
