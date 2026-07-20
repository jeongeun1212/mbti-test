# 유통/서비스IT팀 리더 MBTI 대시보드

유통/서비스IT팀 리더들을 위한 30문항 리더십 스타일 자가진단 + 팀 결과 대시보드입니다.
단일 HTML 파일(`index.html`)로 동작하며 별도 빌드 과정이 없습니다.

## 구성

- 홈: 닉네임 입력 후 진단 시작
- 테스트: 30문항을 한 문제씩 진행 (진행률/구간 표시)
- 결과: "OOO님은 [리더십 스타일] 스타일의 리더입니다" 형태로 결과 표시
- 대시보드: 팀 전체 16유형 분포, E/I·S/N·T/F·J/P 성향, 구성원 목록
- 관리자: 비밀번호 입력 후 결과 삭제 가능

## 실행 방법

`index.html`을 브라우저로 바로 열어도 동작합니다 (이 경우 결과는 이 브라우저 탭 안에서만
유지돼요). 팀 전체가 결과를 공유하려면 아래 "Neon DB 연동" 방법으로 배포하세요.

## 저장소(storage) 동작 방식

이 앱은 실행 환경에 따라 자동으로 3가지 저장 방식 중 하나를 사용합니다.

1. **Claude.ai 아티팩트로 열었을 때** — Claude의 내장 공유 저장소를 사용합니다.
2. **Vercel + Neon으로 배포했을 때** (아래 설정 참고) — 이 저장소의 `/api/members`를 통해
   실제 Neon Postgres DB에 저장됩니다. 팀원 누구나 어디서 접속하든 같은 결과를 봅니다.
3. **그 외 (GitHub Pages 등 API가 없는 곳)** — 위 두 가지가 모두 없으면 자동으로
   **이 브라우저 탭 안에서만 유지되는 임시 저장소**로 전환됩니다 (화면 상단에 안내 배너 표시).
   새로고침하거나 다른 사람이 접속하면 결과가 공유되지 않습니다.

## Neon DB 연동 (실제 팀 공유용 배포)

1. **Vercel에 이 저장소 연결**
   - [vercel.com/new](https://vercel.com/new) → GitHub 저장소 Import → Framework Preset은
     "Other"로 두고 그대로 Deploy (별도 빌드 설정 필요 없음)

2. **Neon Postgres 연결**
   - 가장 쉬운 방법: Vercel 프로�트 대시보드 → **Storage** 탭 → **Create Database** →
     **Neon**을 선택하면 Neon 프로젝트 생성과 `DATABASE_URL` 환경변수 등록이 자동으로 됩니다.
   - 또는 [neon.tech](https://neon.tech)에서 직접 프로젝트를 만들고, 연결 문자열(Connection
     string, `postgresql://...`)을 복사해서 Vercel 프로젝트 → **Settings → Environment
     Variables**에 `DATABASE_URL`이라는 이름으로 추가해도 됩니다.

3. **재배포**
   - 환경변수를 추가/변경했다면 Vercel에서 Redeploy 한 번 해주세요.
   - `/api/members`가 처음 호출될 때 `members` 테이블을 자동으로 만듭니다 (별도 마이그레이션
     불필요).

4. **로컬에서 테스트하고 싶다면**
   - `npm install -g vercel` 후 저장소 폴더에서 `vercel dev` 실행 (Vercel 계정 로그인 필요)
   - `.env.local` 파일에 `DATABASE_URL=postgresql://...`를 넣어두면 로컬에서도 같은 DB를
     바라봅니다.

배포 후 이 파일을 다시 열면 상단 경고 배너 없이 정상적으로 팀 공유 결과가 쌓입니다.

## 관리자 비밀번호

`index.html` 안의 `ADMIN_PASSWORD` 상수로 지정되어 있습니다 (기본값: `1q2w3e`).

**주의**: 이 저장소가 public이므로 소스 코드를 보는 누구나 비밀번호를 확인할 수 있습니다.
이 값은 실수로 삭제 버튼을 누르는 것을 막는 정도의 가벼운 안전장치이며, 실제 접근 제어가
필요하다면 서버 측 인증으로 교체해야 합니다. 비밀번호를 바꾸려면 `index.html`에서
`ADMIN_PASSWORD` 값을 수정하세요.

## 라이선스

MIT License — `LICENSE` 파일을 참고하세요.
