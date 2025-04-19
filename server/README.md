## 서버 폴더 실행 : npm run start:dev

## 실행

1. 의존성 모듈 설치

프로젝트 위치에서 명령어를 실행합니다.

```
npm install
```

2. 환경 변수 설정

`[YOUR_USERNAME]` 부분 추가하여 `.env` 파일을 server 폴더 루트에 추가해주세요.

```
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD= 본인 mysql 비밀번호
DB_DATABASE=mergeWhat
DB_HOST=localhost
JWT_SECRET=SecretmergeWhat
JWT_ACCRESS_TOKEN_EXPIRATION=1h
JWT_REFRESH_TOKEN_EXPIRATION=30d
```

데이터베이스(mergeWhat)는 직접 생성한 이후에 실행코드를 입력하셔야 합니다.
테이블 생성같은 경우엔 server\src\app.module.ts 의 22번째 줄에서 'true'로 바꾸고 사용. 아니면 테이블명도 본인이 직접 생성한 뒤 실행 (erd 수정을 위해 false로 해둔 상황)

3. 실행

```
npm run start:dev
```

<br>

# Domain

```ts
type MarkerColor = 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'PURPLE';

type Category = {
  [key in MarkerColor]: string;
};

interface ImageUri {
  id?: number;
  uri: string;
}

interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  color: MarkerColor;
  score: number;
}

interface Post extends Marker {
  title: string;
  address: string;
  date: Date | string;
  description: string;
}

interface Profile {
  id: number;
  email: string;
  nickname: string | null;
  imageUri: string | null;
  kakaoImageUri: string | null;
  loginType: 'email' | 'kakao' | 'apple';
}
```

# API

## Auth

#### POST /auth/signup

- requestBody

```
{
    email: string
    password: string
}
```

#### POST /auth/signin

- requestBody

```js
{
  email: string;
  password: string;
}
```

- responseBody

```js
{
  accessToken: string;
  refreshToken: string;
}
```

#### GET /auth/refresh

- header

```js
Authorization: `Bearer ${refreshToken}`;
```

- responseBody

```js
{
  accessToken: string;
  refreshToken: string;
}
```

#### GET /auth/me (getProfile)

- responseBody

```ts
type ResponseProfile = Profile & Category;
```

#### PATCH /auth/me (editProfile)

- requestBody

```ts
type RequestProfile = Omit<
  Profile,
  'id' | 'email' | 'kakaoImageUri' | 'loginType'
>;
```

- responseBody

```ts
type ResponseProfile = Profile & Category;
```

#### POST /auth/logout

#### DELETE /auth/me

#### PATCH /auth/category

- requestBody

```ts
type Category
```

- responseBody

```ts
type ResponseProfile = Profile & Category;
```

#### POST /auth/oauth/kakao

- requestBody

```js
{
  token: string;
}
```

- responseBody

```js
{
  accessToken: string;
  refreshToken: string;
}
```

#### POST /auth/oauth/apple

- requestBody

```js
{
  identityToken: string;
  appId: string;
  nickname: string | null;
}
```

- responseBody

```js
{
  accessToken: string;
  refreshToken: string;
}
```

<br>

## Marker & Post

#### GET /markers/my

- responseBody

```ts
Marker[]
```

#### GET /posts/:id

- param

```ts
{
  id: number;
}
```

- requestBody

```ts
// type ResponsePost = Post & { images: ImageUri[] };

type ResponseSinglePost = ResponsePost & { isFavorite: boolean };
```

#### DELETE /posts/:id

- param

```ts
{
  id: number;
}
```

#### GET /posts/my

- query

```js
{
  page: number;
}
```

- responseBody

```js
// type ResponsePost = Post & { images: ImageUri[] };
ResponsePost[];
```

#### GET /posts/my/search

- query

```js
{
  query: string;
  page: number;
}
```

- responseBody

```js
// type ResponsePost = Post & { images: ImageUri[] };
ResponsePost[];
```

#### POST /posts

- requestBody

```ts
type RequestCreatePost = Omit<Post, 'id'> & { imageUris: ImageUri[] };
```

#### PATCH /post/:id

- param

```ts
{
  id: number;
}
```

- requestBody

```ts
type RequestUpdatePost = {
  id: number;
  body: Omit<Post, 'id' | 'longitude' | 'latitude' | 'address'> & {
    imageUris: ImageUri[];
  };
};
```

- responseBody

```ts
type ResponseSinglePost = ResponsePost & { isFavorite: boolean };
```

#### GET /posts (getCalendarPosts)

- query

```ts
{
  year: number;
  month: number;
}
```

- responseBody

```ts
// type CalendarPost = {
//   id: number;
//   title: string;
//   address: string;
// };

type ResponseCalendarPost = Record<number, CalendarPost[]>;
```

#### GET /favorites/my

- query

```ts
{
  page: number;
}
```

#### POST /favorites/:id

- param

```ts
{
  id: number;
}
```

- responseBody

```ts
{
  id: number;
}
```

<br>

## Image

#### POST /images

- requestBody : `FormData`
- responseBody : `string[]`
