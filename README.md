# 근로시간 체크 📊

정확한 근로시간 관리를 위한 웹 애플리케이션입니다. 현재까지의 근로시간을 분석하고, 최적의 퇴근시간을 계산해줍니다.

## ✨ 주요 기능

### 📈 근로시간 분석
- **현재까지 총 근로시간** 입력 및 계산
- **이번달 배정 근로시간**과 비교 분석
- **초과/부족 근로시간** 실시간 계산
- **잔여일 평균 근로시간** 자동 산출

### ⏰ 퇴근시간 계산
- **출근시간** 입력
- **하루 근로시간** 설정 (기본 8시간)
- **휴게시간** 설정 (기본 1시간)
- **정확한 퇴근시간** 자동 계산

### 🔗 스마트 연동
- 근로시간 분석 결과를 **퇴근시간 계산기에 바로 적용**
- 잔여일 평균 근로시간으로 **원클릭 이동**

## 🛠 기술 스택

### Frontend
- **[SvelteKit](https://kit.svelte.dev/)** - 모던 웹 프레임워크
- **[Svelte 5](https://svelte.dev/)** - Reactive UI 컴포넌트
- **[TypeScript](https://www.typescriptlang.org/)** - 타입 안정성
- **[Tailwind CSS](https://tailwindcss.com/)** - 유틸리티 CSS 프레임워크
- **[shadcn/ui](https://ui.shadcn.com/)** - UI 컴포넌트 라이브러리

### Development & Build
- **[Vite](https://vitejs.dev/)** - 빌드 도구
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - 코드 품질
- **[Yarn](https://yarnpkg.com/)** - 패키지 매니저

### Deployment
- **[GitHub Pages](https://pages.github.com/)** - 정적 사이트 호스팅
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD 자동화

## 🚀 설치 및 실행

### 사전 요구사항
- **Node.js** 18+ 
- **Yarn** 패키지 매니저

### 로컬 개발 환경 설정

1. **Repository 클론**
```bash
git clone https://github.com/ZWON-CENTER/worktime-checker.git
cd worktime-checker
```

2. **의존성 설치**
```bash
yarn install
```

3. **개발 서버 실행**
```bash
yarn dev

# 브라우저에서 자동으로 열기
yarn dev --open
```

4. **브라우저에서 확인**
```
http://localhost:5173
```

### 프로덕션 빌드

```bash
# 빌드 실행
yarn build

# 빌드 결과 미리보기
yarn preview
```

## 📦 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

### 자동 배포
- `main` 브랜치에 push할 때마다 자동 배포
- GitHub Actions 워크플로우가 빌드 및 배포 수행

### 수동 배포 (옵션)
```bash
# 로컬에서 빌드 후 배포
yarn build
npx gh-pages -d build
```

## 🎯 사용법

### 1. 근로시간 분석
1. **현재까지의 총 근로시간** 입력 (시간, 분)
2. **이번달 총 근로시간** 입력 
3. **현재까지의 근로 일수** 입력
4. **계산하기** 버튼 클릭

### 2. 퇴근시간 계산
1. **출근시간** 입력 (시간, 분)
2. **하루 근로시간** 설정 (기본 8시간)
3. **휴게시간** 설정 (기본 1시간)
4. **퇴근시간 계산하기** 버튼 클릭

### 3. 스마트 연동 사용
1. 근로시간 분석에서 **잔여일 평균 근로시간** 확인
2. **🚀 퇴근시간 계산하기** 버튼 클릭
3. 자동으로 퇴근시간 계산 페이지로 이동 및 설정

## 🔧 개발

### 코드 스타일
```bash
# ESLint 검사
yarn lint

# Prettier 포맷팅
yarn format

# 타입 체크
yarn check
```

### 디렉토리 구조
```
src/
├── routes/              # 페이지 라우트
│   ├── +layout.svelte  # 공통 레이아웃
│   ├── +page.svelte    # 메인 페이지 (근로시간 분석)
│   └── work-schedule/  # 퇴근시간 계산 페이지
├── lib/                # 공용 라이브러리
│   ├── components/     # UI 컴포넌트
│   └── assets/         # 정적 자산
└── app.html           # HTML 템플릿
```

## 🛡️ 보안 및 프라이버시

- **검색엔진 차단**: robots.txt 및 meta 태그로 검색 노출 방지
- **개인정보 미수집**: 입력된 데이터는 로컬에서만 처리
- **HTTPS 적용**: GitHub Pages의 보안 연결 사용

## 📝 라이선스

이 프로젝트는 개인용으로 제작되었습니다.

## 👨‍💻 개발자

**ZWON-CENTER** - 근로시간 관리의 새로운 기준
