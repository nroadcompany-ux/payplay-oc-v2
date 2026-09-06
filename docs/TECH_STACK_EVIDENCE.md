# [OC] EVIDENCE / WORKING / Technology Stack Recovery — 기술스택 복원 [2026-09-06]

## Verdict

ODR-01 Technology Stack = **OPEN / SOURCE CONFLICT**.

기존에 `React/Vite/React Router → NestJS → Prisma → PostgreSQL`로 RESOLVED 처리했으나, 이후 Owner가 제공한 기존 OC 제작 스택 정보와 GitHub의 별도 Next.js 계열 자산이 확인되어 재검증이 필요하다.

## Evidence A — uploaded current PayPlay source

| Layer | Evidence |
|---|---|
| Workspace | pnpm workspace, Node >=20.19 |
| OC Frontend candidate | `frontend/oc` = React 19.2.8 + Vite 8.2.1 + React Router 8.3.0 |
| State | Zustand 5 + TanStack React Query 5 |
| HTTP | Axios |
| Backend | NestJS 11 |
| ORM | Prisma 6.19 |
| Database engine | PostgreSQL |
| Deploy pattern | OC Vercel SPA / Backend Docker·Nginx·AWS-oriented files |

판정: **CURRENT SOURCE CANDIDATE**. 해당 소스가 실제 `oc.payplay.kr` 배포 Repo인지 확인되지 않았다.

## Evidence B — Owner-provided existing OC stack statement

Owner 전달 정보:

- Backend: NestJS + TypeScript + PostgreSQL
- Frontend: Next.js + TypeScript + React

판정: **OWNER-PROVIDED IMPLEMENTATION EVIDENCE**. 실제 Repository / deployment mapping 확인 필요.

## Evidence C — GitHub `nroadcompany-ux/payplay`

`package.json` 확인 결과:

- package name: `payplay-tms-next`
- Next.js 16.2.9
- React 19.2.4
- TypeScript 5
- Supabase client/SSR packages
- App Router (`src/app/...`) 구조

Repo history에는 2026-06~07 PPOS/로그인/지출결의 작업 흔적이 있다.

중요:

- 현재 tree에서 `/users` route가 확인되지 않음
- NestJS backend가 이 Repo 내부에 확인되지 않음
- `oc.payplay.kr` domain binding evidence가 확인되지 않음

판정: **NEXT.JS CANDIDATE / NOT YET DEPLOYMENT-PROVEN**.

## Evidence D — legacy `payplay-tms`

- Legacy TMS route는 hash-route 계열 evidence가 존재
- 최신 Owner/Sheet reference는 `oc.payplay.kr/users` path-route 계열

판정: **REFERENCE / NOT PROVEN CURRENT DEPLOYMENT SOURCE**.

## Current decision boundary

아직 아래를 단정하지 않는다.

1. `oc.payplay.kr` 실제 Frontend가 React/Vite인지 Next.js인지
2. `nroadcompany-ux/payplay`가 실제 배포 Repo인지
3. NestJS backend의 실제 Repository와 deployment target
4. PostgreSQL access layer가 Prisma인지, 별도 driver/ORM인지
5. Vercel/AWS/기타 Production binding

## Execution impact

기존 `payplay-oc-v2`의 현재 Shell / Figma Pilot / Logical Mock / Contract / Test 작업은 프레임워크 독립 의미가 크므로 유지 가능하다.

단, ODR-01 재해결 전에는 다음을 확대하지 않는다.

- framework-specific 대량 screen scaffold
- production routing architecture
- SSR/RSC-specific architecture
- physical DB migration
- provider/credential binding
- production deployment binding

## Required closure evidence

ODR-01/02를 닫으려면 최소 하나의 deployment chain이 필요하다.

`oc.payplay.kr → Hosting Project → Git Repository → package.json → route tree → API endpoint/backend repo`

## Current Verdict

- ODR-01 Technology Stack: **OPEN / SOURCE CONFLICT**
- ODR-02 `oc.payplay.kr` Deployment Repository: **OPEN**
- `nroadcompany-ux/payplay`: **Next.js candidate confirmed, deployment mapping unconfirmed**
- uploaded `frontend/oc`: **React/Vite candidate confirmed, deployment mapping unconfirmed**

New Product Meaning Created = 0
