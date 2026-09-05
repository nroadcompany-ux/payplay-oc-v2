# [OC] EVIDENCE / CURRENT / Technology Stack Recovery — 기술스택 복원 [2026-09-05]

## Verdict

ODR-01 Technology Stack = **RESOLVED** by uploaded current PayPlay source evidence.

## Current source evidence

| Layer | Evidence |
|---|---|
| Workspace | pnpm 11 workspace, Node >=20.19 |
| OC Frontend | `frontend/oc` = React 19.2.8 + Vite 8.2.1 + React Router 8.3.0 |
| OC State | Zustand 5 + TanStack React Query 5 |
| HTTP | Axios |
| Backend | NestJS 11 |
| ORM | Prisma 6.19 |
| Database engine | PostgreSQL |
| OC deploy contract | Vercel SPA rewrite contract |
| Backend deploy contract | Docker/Nginx/AWS-oriented deployment files present |

## Important boundary

- Next.js exists in the PayPlay workspace for OSP, but **OC frontend itself is React/Vite SPA**.
- This evidence resolves framework selection only.
- It does **not** authorize DB migration, production credentials, provider binding, physical Shared IAM/Person/Merchant schema, or domain deployment.
- Physical schema in `backend/prisma/schema.prisma` of this repo remains intentionally empty until dedicated decisions close.

## Execution baseline

New OC implementation baseline:

`React/Vite/React Router → NestJS → Prisma → PostgreSQL`

Production binding remains HOLD.

New Product Meaning Created = 0
