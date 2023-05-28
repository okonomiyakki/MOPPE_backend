# Back-end

## 7팀 백엔드

### 서버 실행 방법

```bash
git clone https://kdt-gitlab.elice.io/sw_track/class_04/web_2_project/team07/back-end.git

cd back-end

npm install

npm run dev
```

### Commit 컨벤션

```
Feat: 새로운 기능 추가
Fix: 코드 및 버그 수정
Style: 코드 포맷 변경 등 기존 코드에 영향이 없는 경우
Comment: 주석 추가 및 수정
Docs: README.md 등 문서 수정
Rename: 파일명 수정
Remove: 파일 삭제
```

### .env 설정

back-end/.env

```
BCRYPT_SALT_ROUNDS=

PORT=

DB_HOST=
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES_IN=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=
```
