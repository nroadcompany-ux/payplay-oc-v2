# [OC] EVIDENCE / CURRENT / Technology Stack Recovery — 기술스택 복원 [2026-09-06]

## Verdict

ODR-01 Technology Stack = **RESOLVED**.

2026-09-06 Owner가 제공한 `payplay-main (3).zip`을 직접 검증한 결과, 해당 소스는 `nroad-ecosystem/payplay` 통합 PayPlay 코드라인과 일치하는 강한 배포 Source Evidence를 포함한다.

## Confirmed OC stack

| Layer | Confirmed evidence |
|---|---|
| Workspace | `payplay`, pnpm workspace, Node >=20.19 |
| OC Frontend | `frontend/oc` = React 19.2.8 + TypeScript + Vite 8.2.1 + React Router 8.3.0 |
| State | Zustand 5 + TanStack React Query 5 |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| UI primitive | Radix UI |
| Backend | `backend` = NestJS 11 + TypeScript |
| ORM | Prisma 6.19 |
| Database | PostgreSQL (`pg` driver 포함) |
| OC deployment | Vercel, 운영 도메인 `https://oc.payplay.kr` |
| API deployment | AWS + Nginx + Docker/GHCR, 운영 API `https://api.payplay.kr` |

## Direct source evidence

### `frontend/oc/package.json`

- `react` 19.2.8
- `react-dom` 19.2.8
- `vite` 8.2.1
- `react-router` 8.3.0
- `typescript`
- `@tanstack/react-query`
- `zustand`
- `axios`

### `frontend/oc/README.md`

README가 OC를 다음과 같이 직접 설명한다.

- `OC(구 TMS)의 Supabase/PWA 기능을 유지하면서 React로 전환한 사내 업무 시스템 프런트엔드`
- 운영 도메인: `https://oc.payplay.kr`
- 배포: GitHub Actions CD가 `frontend/oc`를 Vercel CLI 작업 디렉터리로 전달
- Git push 자동 배포는 비활성화, 운영 배포는 GitHub Actions `CD`를 수동 실행
- 기술 스택: React / TypeScript / Vite / React Router
- 신규 직원 API는 NestJS 사용

### `frontend/oc/src/app/App.tsx`

실제 path route 확인:

- `/dashboard`
- `/notice/*`
- `/consultation-requests`
- `/customer-requests`
- `/customer-on`
- `/contract`
- `/schedule`
- `/salelog`
- `/fulfillment`
- `/inventory`
- `/purchase-orders`
- `/shipments`
- `/products`
- `/skus`
- `/users`
- `/security`
- `/contract-signature-config`
- `/my-page`

따라서 기존 Sheet Reference의 `oc.payplay.kr/users` path-route와도 일치한다.

### `backend/package.json`

- `@nestjs/common` 11
- `@nestjs/core` 11
- `@nestjs/platform-express`
- `@prisma/client` 6.19
- `prisma` 6.19
- `pg`
- `@aws-sdk/client-s3`

### Deployment evidence

소스에 다음 파일이 존재한다.

- `.github/workflows/cd.yml`
- `deploy/production/compose.app.yml`
- `deploy/production/nginx.conf.template`
- `docs/deployment/architecture.md`
- `docs/deployment/runbook.md`

GHCR naming도 `nroad-ecosystem` 배포 계열과 직접 연결된다.

## Next.js conflict resolution

Owner가 전달받은 `Frontend = Next.js + TypeScript + React` 설명과 `nroadcompany-ux/payplay`의 `payplay-tms-next` 자산은 실제 존재한다.

그러나 이번 Source Archive에서 **현재 OC package / route / README / deployment contract가 React/Vite로 직접 확인**되므로, Next.js 자산은 현재 `oc.payplay.kr` OC Frontend의 Canonical implementation stack으로 사용하지 않는다.

Next.js는 별도 PayPlay 자산/시점/앱 계열 Reference로 유지한다.

## ODR-02 boundary

`nroad-ecosystem/payplay`와 이번 Archive의 동일성은 구조·배포 naming·최근 기능 흔적으로 매우 강하다.

다만 GitHub Connector가 아직 `nroad-ecosystem` private Repo를 직접 읽지 못하므로 **exact current main SHA equality는 미검증**이다.

따라서:

- ODR-01 Technology Stack = **RESOLVED**
- ODR-02 Deployment Repository = **STRONG CONFIRMED CANDIDATE / exact GitHub SHA verification pending**

## Execution impact

`payplay-oc-v2`의 현재 React/Vite + NestJS 방향은 계속 진행 가능하다.

기존 HOLD는 그대로 유지한다.

- Shared Person / Merchant / IAM physical
- Physical DB migration
- Real provider / credentials
- Production binding
- PMG
- PSET-106

New Product Meaning Created = 0
