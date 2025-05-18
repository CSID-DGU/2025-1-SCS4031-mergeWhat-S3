export type WeatherData = {
  category: string;
  value: string;
  time: string;
};

// 위도/경도 → 기상청 격자 변환
function latLonToGrid(lat: number, lon: number): {nx: number; ny: number} {
  const RE = 6371.00877,
    GRID = 5.0,
    SLAT1 = 30.0,
    SLAT2 = 60.0,
    OLON = 126.0,
    OLAT = 38.0;
  const XO = 43,
    YO = 136,
    DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD,
    slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD,
    olat = OLAT * DEGRAD;
  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;
  const x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  return {nx: x, ny: y};
}

// base_date, base_time 계산
function getPreciseBaseDateTime(): {
  base_date: string;
  base_time: string;
  kstNow: Date;
} {
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000); // KST 보정

  const minutes = kstNow.getMinutes();
  let hours = kstNow.getHours();
  if (minutes < 30) {
    hours -= 1;
    if (hours < 0) {
      hours = 23;
      kstNow.setDate(kstNow.getDate() - 1);
    }
  }

  const yyyy = kstNow.getFullYear();
  const mm = String(kstNow.getMonth() + 1).padStart(2, '0');
  const dd = String(kstNow.getDate()).padStart(2, '0');
  const base_time = String(hours).padStart(2, '0') + '30';

  return {base_date: `${yyyy}${mm}${dd}`, base_time, kstNow};
}

// 🧠 현재 시각 이후 예보 중 가장 가까운 예보 1건만 추출
export async function getUltraSrtFcst(
  lat: number,
  lon: number,
): Promise<WeatherData[]> {
  const serviceKey =
    'P3SJ4c4dEFqS0In6hIbqXr1zzwx5zcDmA%2B3upxs9cSEjJh5YFqxCbkk3fFKUb9nZtxIgUmi4Dxze8Kp5H%2BAGAw%3D%3D';

  const {base_date, base_time, kstNow} = getPreciseBaseDateTime();
  const {nx, ny} = latLonToGrid(lat, lon);

  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.response?.header?.resultCode !== '00') {
    throw new Error(`기상청 API 오류: ${data.response?.header?.resultMsg}`);
  }

  const items = data.response?.body?.items?.item;
  if (!Array.isArray(items)) throw new Error('기상청 응답이 비정상적입니다.');

  // 🔍 현재 시각을 KST 기준 문자열로 변환 (예: 202505182330)
  const nowKey = `${kstNow.getFullYear()}${String(
    kstNow.getMonth() + 1,
  ).padStart(2, '0')}${String(kstNow.getDate()).padStart(2, '0')}${String(
    kstNow.getHours(),
  ).padStart(2, '0')}${String(kstNow.getMinutes()).padStart(2, '0')}`;

  const categorized: Record<
    string,
    {value: string; time: string; fcstKey: string}
  > = {};

  for (const item of items) {
    const key = item.category;
    const fcstKey = `${item.fcstDate}${item.fcstTime}`;
    if (fcstKey >= nowKey) {
      if (!categorized[key] || fcstKey < categorized[key].fcstKey) {
        categorized[key] = {
          value: item.fcstValue,
          time: `${item.fcstDate} ${item.fcstTime}`,
          fcstKey,
        };
      }
    }
  }

  return Object.entries(categorized).map(([category, data]) => ({
    category,
    value: data.value,
    time: data.time,
  }));
}
