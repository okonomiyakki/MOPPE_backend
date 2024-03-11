# 모프: 모두의 프로젝트 - 스터디 구인 플랫폼 [Server]

![image](https://github.com/hyzzzzy/ICE/assets/71072214/8d63f6e3-41ce-4e6c-a206-8e9b001e1d22)

## 🌈 목차

1. [사용 기술](#사용-기술)
2. [서비스 아키텍쳐](#서비스-아키텍쳐)
3. [서비스 URL](#서비스-url)
4. [서비스 주요 기능](#서비스-주요-기능)
5. [구현 기능](#구현-기능)
6. [로그인 인증 시퀀스 다이어그램](#로그인-인증-시퀀스-다이어그램)
7. [로컬 환경 변수 설정](#로컬-환경-변수-설정)
8. [로컬 실행 방법](#로컬-실행-방법)
9. [파일 구조](#파일-구조)
10. [협업툴 사용 방향성](#협업툴-사용-방향성)
11. [스크럼 방식](#스크럼-방식)
12. [API 문서](#api-문서)
13. [팀 페이지](#팀-페이지)
14. [팀원별 역할](#팀원별-역할)

## 사용 기술

### Server

![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge)![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=for-the-badge)![Express Badge](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=for-the-badge)![JSON Web Tokens Badge](https://img.shields.io/badge/JSON%20Web%20Tokens-000?logo=jsonwebtokens&logoColor=fff&style=for-the-badge)![PM2 Badge](https://img.shields.io/badge/PM2-2B037A?logo=pm2&logoColor=fff&style=for-the-badge)

### DataBase

![MySQL Badge](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=fff&style=for-the-badge)![Amazon RDS Badge](https://img.shields.io/badge/Amazon%20RDS-527FFF?logo=amazonrds&logoColor=fff&style=for-the-badge)

### DevOps

![NGINX Badge](https://img.shields.io/badge/NGINX-009639?logo=nginx&logoColor=fff&style=for-the-badge)![Amazon EC2 Badge](https://img.shields.io/badge/Amazon%20EC2-F90?logo=amazonec2&logoColor=fff&style=for-the-badge)

### Open API

![Kakao Badge](https://img.shields.io/badge/Kakao%20Login-FFCD00?logo=kakao&logoColor=000&style=for-the-badge)

### Communication

![GitLab Badge](https://img.shields.io/badge/GitLab-FC6D26?logo=gitlab&logoColor=fff&style=for-the-badge)![Google Sheets Badge](https://img.shields.io/badge/Google%20Sheets-34A853?logo=googlesheets&logoColor=fff&style=for-the-badge)![Notion Badge](https://img.shields.io/badge/Notion-000?logo=notion&logoColor=fff&style=for-the-badge)![Discord Badge](https://img.shields.io/badge/Discord-5865F2?logo=discord&logoColor=fff&style=for-the-badge)

## 서비스 아키텍쳐

![아키텍쳐](https://github.com/okonomiyakki/MOPPE_backend/assets/83577128/361d8a37-37ab-4c21-821e-b46b98144672)

## 서비스 URL

- [홈페이지 바로가기](https://moppe.co.kr/) - DB 프리티어 만료 (2024.01~)

## 서비스 목적

- 누구나 스터디 및 프로젝트를 함께 할 팀원을 모집 및 참여 가능하고, 완성한 프로젝트를 게시할 수 있는 플랫폼을 서비스합니다.

## 서비스 주요 기능

- **유저**

  - 회원가입 / 로그인
  - 카카오 로그인(회원가입)
  - 회원 탈퇴

- **마이페이지**

  - 회원 비밀번호 / 회원 정보 / 수정
  - 로그인 유저별 회원 정보 / 작성한 모집 & 자랑 게시글 / 북마크한 게시글 / 댓글 작성한 게시글 조회

- **게시글**

  - 게시글 등록 / 조회 / 수정 / 삭제
  - 키워드 / 모집 상태 / 카테고리별 검색 기능
  - 전체 게시글 목록 페이지네이션 조회 기능

- **댓글**

  - 댓글 & 대댓글 등록 / 조회 / 수정 / 삭제

- **북마크**
  - 북마크 등록 / 수정 / 삭제
  - 로그인 유저별 북마크 여부 동기화

## 구현 기능

- JWT 토큰 방식을 사용하여 로그인 인증 및 인가 로직 구현
- 편리한 사용자 경험을 위해 Kakao Oauth2.0 로그인 기능 적용
- Multer 이미지 업로드 기능 구현
- 데이터 유효성 검사 및 처리에 Class-Validator 사용
- 회원, 모집, 게시, 댓글, 북마크 관련 API 구현 (50 여개)
- MySQL ERD 설계
- AWS EC2 - RDS 클라우드 환경 구축
- Nginx 웹 서버를 연결하여, 프론트엔드 빌드 파일을 호스팅 하도록 구현
- Let's Encrypt SSL 인증서를 Nginx 웹 서버에 적용하여 HTTPS 프로토콜 구현
- AWS Route53 네임서버를 사용하여 도메인 연결

## 로그인 인증 시퀀스 다이어그램

### [1] 이메일 로그인

![서버 로그인](https://github.com/okonomiyakki/MOPPE_backend/assets/83577128/0700684f-72e1-47fc-82df-56bde97c0680)

1. 회원 계정 입력

   > [User] 회원 정보 입력 <br>
   > [Clienr] 입력 값 유효성 검사 <br>
   > [Server] 입력 값 유효성 검사 <br>

2. 로그인 및 서비스 토큰 발급

   > [DB] 회원 조회 <br>
   > [Server] 회원 유효성 검사 <br>
   > [Server] Access & Refresh Token 발급 <br>
   > [Client] 브라우저 쿠키에 Token 저장 <br>

### [2] 카카오 로그인

![카카오 로그인](https://github.com/okonomiyakki/MOPPE_backend/assets/83577128/e1e6f3e3-41f1-42f3-a408-7618dfb0b910)

1. 카카오 로그인 시도

   > [User] 카카오 로그인 버튼 클릭 <br>
   > [Client] 카카오 서버로 Client ID 전달 <br>
   > [Kakao] Client ID 유효성 검사 <br>
   > [Kakao] Client로 카카오 로그인 입력 Form 반환 <br>

2. 카카오 계정 입력

   > [User] 카카오 계정 입력 <br>
   > [Kakao] 카카오 계정 유효성 검사 <br>
   > [Kakao] 카카오 계정 정보 접근 권한 Code 발급(이하 Kakao Access Code) <br>

3. 카카오 계정 Access Token 발급

   > [Server] 카카오 서버로 Kakao Access Code / Clinet Redirect URI / Client ID 전달 <br>
   > [Kakao] Kakao Access Code 유효성 검사 <br>
   > [Kakao] 카카오 계정 Access Token 발급 <br>

4. 카카오 계정 정보 응답

   > [Server] 카카오 서버로 카카오 계정 Access Token 전달 <br>
   > [Kakao] 카카오 계정 Access Token 유효성 검사 <br>
   > [Kakao] 카카오 계정 정보(Email, Name 등) 반환 <br>

5. 회원가입 및 서비스 토큰 발급
   > [DB] 카카오 계정 이메일로 신규 회원 생성 <br>
   > [DB] 동일한 이메일로 이미 가입되어져 있을 시, 계정 통합 <br>
   > [Server] 회원 유효성 검사 <br>
   > [Server] Access & Refresh 토큰 발급 <br>
   > [Client] 브라우저 쿠키에 토큰 저장 <br>

## 로컬 환경 변수 설정

```bash
touch .env
```

```
BCRYPT_SALT_ROUNDS = { BCRYPT_SALT_ROUNDS };

PORT = { PORT };

DB_HOST = { DB_HOST };
DB_PORT = { DB_PORT };
DB_NAME = { DB_NAME };
DB_USERNAME = { DB_USERNAME };
DB_PASSWORD = { DB_PASSWORD };

JWT_SECRET_KEY_LENGTH = { JWT_SECRET_KEY_LENGTH };

ACCESS_TOKEN_SECRET = { ACCESS_TOKEN_SECRET };
ACCESS_TOKEN_EXPIRES_IN = { ACCESS_TOKEN_EXPIRES_IN };

REFRESH_TOKEN_SECRET = { REFRESH_TOKEN_SECRET };
REFRESH_TOKEN_EXPIRES_IN = { REFRESH_TOKEN_EXPIRES_IN };

UPLOAD_IMAGE_FILE_ROOT = { IMAGE_FILE_DOMAIN };

KAKAO_LOGIN_API_CLIENT_ID = { KAKAO_LOGIN_API };
KAKAO_LOGIN_API_REDIRECT_URI = { KAKAO_LOGIN_API_REDIRECT };
```

## 로컬 실행 방법

```bash
npm i

npm run dev
```

## 파일 구조

```
📦src
 ┣ 📂config --------------------DB풀링과 env커넥션을 담당합니다.
 ┣ 📂controllers ---------------Backend API 엔드포인트입니다.
 ┣ 📂database
 ┃ ┣ 📂dtos --------------------DTO 패턴이 사용된 클래스입니다.
 ┃ ┗ 📂repository --------------Raw쿼리문으로 DB와 Linking합니다.
 ┣ 📂middlewares ---------------토큰 인증 및 인가, 이미지 업로드, 에러처리 미들웨어입니다.
 ┃ ┣ 📂validationHandler -------유효성 검사 미들웨어입니다.
 ┣ 📂routes --------------------Backend API 라우터입니다.
 ┣ 📂services ------------------비지니스 로직을 담당합니다.
 ┣ 📂types ---------------------타입 및 인터페이스를 선언합니다.
 ┣ 📂utils ---------------------재사용 함수 로직들이 존재합니다.
 ┗ 📜app.ts --------------------서버 실행 파일입니다.
```

## 협업툴 사용 방향성

- Notion : 팀 페이지, 스크럼 정리, API 문서 정리
- Figma : 기획 및 추가 구현 단계에서 레이아웃을 잡고, 발표 자료를 만들기 위해 사용
- Google Sheets : 기능 요구 명세서 작성 및 공유
- Discord : 공지 및 중요 이슈 공유
- Gather : 팀원간 커뮤니케이션 및 온라인 스크럼 진행
- Gitlab
  - Code Repository
  - Gitlab Issue : Daily Todo List, QA, Trouble Shooting 내역 기제

## 스크럼 방식

- 매일 오후 12시 스크럼 진행 (게더타운을 활용한 온라인 스크럼)
- 프론트, 백엔드의 개발 진행상황 및 이슈 공유

## API 문서

[Notion 바로가기 - API Docs](https://okonomiyakki.notion.site/MOPPE-API-Docs-88db352d3b124dcfb372593cf7c178d5?pvs=4)

## 팀 페이지

[Notion 바로가기 - 7팀 [🧊 ICE]](https://www.notion.so/moppe/7-ICE-f7246ba42da24e16b0ae0285af9f1b6a?pvs=4)

[Google Sheets 바로가기 - 기능 요구 명세서](https://docs.google.com/spreadsheets/d/1vYMrVYKoE_0uvvn7BOaTmk6xT4DN5vzxJnJT6kk1m1g/edit#gid=2068004310)

## 팀원별 역할

| 이름                        | 역할                                                                                                                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🧊 이새미 (팀장, FE)        | 모집 글 게시글 리스트 페이지 <br/> 프로젝트 작성 페이지 <br/> 헤더 컴포넌트 <br/> 햄버거 메뉴 컴포넌트 <br/> 모달 컴포넌트 <br/> 에디터 이미지 처리 <br/> 배포                                |
| 🧊 김차미 (프론트 팀장, FE) | 댓글 컴포넌트 <br/> 메인 페이지 <br/> 유저 프로필 페이지 <br/> SCSS 기반 다크모드 구현                                                                                                        |
| 🧊 송현수 (FE)              | 로그인 페이지 <br/> 회원가입 페이지 <br/> 비밀번호 수정 페이지                                                                                                                                |
| 🧊 신혜지 (FE)              | 마이페이지 <br/> 회원 정보 수정 페이지 <br/> 기술 스택 컴포넌트 <br/> 챗봇 컴포넌트 <br/> 에디터 코드블록 처리 <br/> 메인 페이지 UI <br/> 404 에러 페이지 <br/> 모집완료 리스트 모달 컴포넌트 |
| 🧊 이주영 (FE)              | 모집 글 상세 페이지 <br/> 프로젝트 리스트 페이지 <br/> 공유하기 컴포넌트 <br/> Axios 기반 코드 <br/> 프론트 토큰 관리                                                                         |
| 🧊 장준희 (FE)              | 모집 글 작성 / 수정 페이지 <br/> 모집 글 미리보기 페이지 <br/> 프로젝트 상세 페이지 <br/> 회원탈퇴 페이지                                                                                     |
| 🧊 박지원 (백엔드 팀장, BE) | 회원 / 게시글 / 댓글 / 북마크 API<br/> ERD 설계 <br/> AWS EC2 - RDS Cloud 환경 구축 <br/> 프론트 + 백엔드 배포                                                                                |

|                Frontend                |              Frontend               |                 Frontend                 |               Frontend               |                Frontend                 |                Frontend                |                  Backend                  |
| :------------------------------------: | :---------------------------------: | :--------------------------------------: | :----------------------------------: | :-------------------------------------: | :------------------------------------: | :---------------------------------------: |
| ![](https://github.com/saemileee.png)  | ![](https://github.com/Chaam2.png)  | ![](https://github.com/hyunsoo0098.png)  | ![](https://github.com/hyzzzzy.png)  | ![](https://github.com/1004ljy980.png)  | ![](https://github.com/junhui324.png)  | ![](https://github.com/okonomiyakki.png)  |
| [이새미](https://github.com/saemileee) | [김차미](https://github.com/Chaam2) | [송현수](https://github.com/hyunsoo0098) | [신혜지](https://github.com/hyzzzzy) | [이주영](https://github.com/1004ljy980) | [장준희](https://github.com/junhui324) | [박지원](https://github.com/okonomiyakki) |

---

© 2023 Team ICE
