import {WeatherData} from '../weather'; // weather.ts에 타입 정의되어 있다면 경로 유지
import {weatherIconMap} from '../../assets/weather/weatherImage';

export function getWeatherIcon(weatherData: WeatherData[] | null) {
  if (!weatherData) return null;
  const pty = weatherData.find(d => d.category === 'PTY')?.value;
  const sky = weatherData.find(d => d.category === 'SKY')?.value;

  if (pty === '1' || pty === '4') return weatherIconMap.rain;
  if (pty === '2' || pty === '3') return weatherIconMap.snow;
  if (sky === '1') return weatherIconMap.sunny;
  if (sky === '3' || sky === '4') return weatherIconMap.cloudy;

  return null;
}

type WeatherAdvice = {
  message: string;
  recommend: 'indoor' | 'outdoor';
};

export function getWeatherRecommendation(
  weatherData: WeatherData[] | null,
): WeatherAdvice {
  if (!weatherData) {
    return {
      message: '',
      recommend: 'outdoor',
    };
  }

  const pty = weatherData.find(d => d.category === 'PTY')?.value ?? '';
  const t1h = parseFloat(
    weatherData.find(d => d.category === 'T1H')?.value ?? '0',
  );

  // 우선순위 1: 기온이 매우 높을 때
  if (pty === '0' && t1h > 35) {
    return {
      message: '오늘은 매우 더운 날씨가 이어집니다. 실내 놀거리를 추천드려요.',
      recommend: 'indoor',
    };
  }

  // 비
  if (pty === '1' || pty === '4') {
    return {
      message: '오늘은 비가 내리네요. 실내 놀거리를 추천드려요.',
      recommend: 'indoor',
    };
  }

  // 흐림
  if (pty === '2') {
    return {
      message: '오늘은 날씨가 흐리네요. 실내 놀거리를 추천드려요.',
      recommend: 'indoor',
    };
  }

  // 눈
  if (pty === '3') {
    return {
      message: '오늘은 눈이 오네요. 실내 놀거리를 추천드려요.',
      recommend: 'indoor',
    };
  }

  // 맑음
  if (pty === '0') {
    return {
      message: '오늘은 날씨가 맑네요. 실외 놀거리를 추천드려요.',
      recommend: 'outdoor',
    };
  }

  // 기본
  return {
    message: '',
    recommend: 'outdoor',
  };
}
