# [OC] DIRECTIVE / ACTIVE / Claude Code Prototype Development — 프로토타입 개발 작업지시서 [2026-09-06]

## 0. Owner Authorization

2026-09-06 Owner directive:

> 바로 프로토타입 개발 시작.

이 지시는 **Production Implementation GO가 아니라 Prototype Development GO**다.

- Prototype 개발: **GO**
- Logical/Mock 연동: **GO**
- Current Source 재사용: **GO**
- Production DB Migration: **HOLD**
- Real Provider/Credential Binding: **HOLD**
- Production Deployment Binding: **HOLD**
- PMG / PSET-106: **HOLD**

New Product Meaning Created = 0.

---

## 1. Target Repository / Branch

Repository:
`nroadcompany-ux/payplay-oc-v2`

Working branch:
`exec/sprint0-foundation-contracts`

PR:
`#1 [OC] Planning Closure + Prototype Gate Preparation`

**Do not merge to main.**
Prototype work must stay on the working branch until PM/Owner gate passes.

---

## 2. Canonical Technology Stack

Source: `docs/TECH_STACK_EVIDENCE.md`

ODR-01 = **RESOLVED**.

### Frontend
- React 19.2.x
- TypeScript
- Vite 8.2.x
- React Router 8.3.x
- Zustand 5
- TanStack React Query 5
- Axios
- React Hook Form + Zod
- Radix UI

### Backend
- NestJS 11
- TypeScript
- Prisma 6.19
- PostgreSQL

### Prototype rule
Use the existing React/Vite + NestJS structure in this repository.
Do not introduce Next.js, another router, another state framework, or another design system.

---

## 3. Source Priority

When sources conflict, apply this order:

1. Google Sheet `07 : OC 개발 기획 (카테고리 기준)` DEV MASTER
2. `docs/HANDOFF.md`
3. `docs/SIDEBAR_IA_BASELINE.md`
4. `docs/DESIGN_BASELINE.md`
5. final audit/contract documents under `docs/`
6. Figma = visual and prototype interaction source
7. Current/legacy code = reuse evidence, not policy owner

Figma must never redefine Product Meaning, Data Owner, Route Owner, Permission, State, or HOLD.

---

## 4. Canonical Common Shell

All desktop prototype screens use:

`1차 Sidebar → 2차 Sidebar → HEADER SHALL (상단바) → Page Content`

### 1차 Sidebar — exact 6 categories
1. 회사정보
2. 영업관리
3. 고객관리
4. 팀플레이
5. 경영관리 — HOLD/non-executable
6. 설정관리

**Prohibited:**
- 독립 `홈` category 생성
- 독립 `서비스` category 생성
- PMG HOLD menu를 실행 route로 활성화

### HEADER SHALL
Must include:
- Context/Breadcrumb
- Search
- Asia/Seoul date
- `HH:mm` time only; seconds prohibited
- User/Operator area

Navigation selection, breadcrumb, and visible page content must always represent the same context.

---

## 5. Design Runtime Rules

Source: `docs/DESIGN_BASELINE.md`

- White Canvas
- Primary Orange `#FF6B00`
- `#F07200` prohibited for Current implementation
- Card only for independent object / clickable unit
- Large sections: whitespace + typography + alignment + minimum divider
- Gray section/card surfaces must not be used as generic page-layout blocks
- thin neutral border only where object separation is necessary
- Primary CTA: orange filled, normally one per screen
- Retry must not be destructive red filled
- status color only for badge/icon/small alert/thin border
- desktop action target >= 32x32
- normal text contrast >= 4.5:1

Do not visually copy stale Figma navigation labels. Navigation SSOT is `menu-registry.json` + `SIDEBAR_IA_BASELINE.md`.

---

## 6. Prototype Development Scope — P-01 ~ P-07

Implement a runnable web prototype matching the approved representative Figma flows.

### P-01 업무 홈 / TODAY
Entry:
- PCI-101 업무 홈
- PCS-101 TODAY

Flow:
`업무 홈/TODAY → 업무 카드 → Source Detail → Return`

Rules:
- TODAY = Work Projection
- Source Transaction direct modification prohibited from projection layer
- 예정/진행/보류/완료 state presentation
- permission-ineligible work must not appear

### P-02 Customer360 / CS / VS
Flow A:
`고객360 → A/S Quick Action → A/S Case → CS→VS Handoff → Field Result → Customer360 Return`

Flow B:
`VS → Evidence complete → Verified Complete → Return`

Rules:
- Customer360 = Canonical Customer Surface
- Activity Ledger != Customer Master
- CS→VS payload must preserve:
  - What we know
  - What we tried
  - What we need
  - Remote impossible reason
- VS Verified Complete != A/S Case Close
- Partial/Revisit/Absent history preserved

### P-03 Sales Queue / Quote / Contract
Flow:
`신규유입/가망/TM/방문영업 → Sales Domain Action → 견적/계약 → Customer360 Return`

Rules:
- Queue/View != Customer Master
- Customer360 is customer context
- Sales transition = manual-first
- no independent common calendar
- no automatic sales state transition

### P-04 Contract / e-Sign
Flow:
`Contract Context → 전자서명 문서 선택 → 발송 준비 → Submission Status → Customer360`

Rules:
- selected documents preserved as Document Plan Snapshot
- missing mandatory documents blocks send
- e-sign completion must not auto-close entire Contract
- Provider credential/production binding prohibited
- failure/retry/reconciliation history preserved

### P-05 Customer Ops
Scope:
- PCS-104 수발주
- PCS-105 결제/미수금
- PCS-106 재고

Flow:
`Queue → Source Detail → Action Preview → Customer360/TODAY Return`

Rules:
- each domain owns its Source Transaction
- Customer360 only summary/history
- TODAY only due/follow-up projection
- real logistics/payment provider = HOLD
- physical inventory schema/migration = HOLD

### P-06 Permission
Flow:
`PSET-102 Permission Matrix → Row Denied / Field Masked / Audit → Return`

Required model:
- Menu
- Row Scope
- Field Visibility
- Action Permission

Required test states:
- direct URL Row Denied
- restricted Finance field masked
- denied action has audit evidence
- self-escalation prohibited
- hidden menu != authorization

### P-07 Common Shell / State Family
Flow:
`Common Shell → Category/Menu Navigation → Loading / Empty / Error / Permission Denied`

Rules:
- Canonical 6-category IA
- same layout grammar across normal/error/empty states
- HOLD routes cannot become executable
- category navigation must synchronize primary/secondary/header/content

---

## 7. Figma Reference Nodes

File:
`https://www.figma.com/design/SkArbeMMTWzUFP7eEawBis`

Primary references:
- `2:2` 업무 홈 · TODAY
- `2:34` 고객360
- `2:69` VS mobile
- `2:95` A/S
- `10:182` Sales Queue
- `10:203` Quote/Contract
- `10:243` Customer Ops
- `2:172` Permission
- `43:2` e-Sign Document Select
- `43:23` e-Sign Submission Status
- `43:52` Permission Denied/Masked/Audit
- `43:77` Common Shell QA
- `43:107` State Family

Use Figma for visual hierarchy and interaction intent only. Existing stale labels must be corrected using the Canonical IA source.

---

## 8. Required Prototype Routes

Do not invent Production route architecture. Create prototype-safe routes within the existing router pattern.

Minimum logical prototype navigation must cover:

- Home/TODAY
- Customer360
- A/S Case
- VS execution
- Sales Queue
- Quote/Contract
- Contract e-Sign select/status
- Customer Ops
- Permission settings
- Permission denied/masked state
- Common Shell QA
- Loading/Empty/Error/Denied state family

If an exact production route is not confirmed, use a clear prototype namespace/route and document it as `PROTOTYPE ONLY`. Do not present it as final physical route.

---

## 9. Data / API Rule

Prototype may use:
- NestJS Mock API
- in-memory data
- local mock fixture
- existing logical contracts
- action preview with `persisted=false`

Prototype must not use:
- production DB migration
- real provider credentials
- production payment/logistics/e-sign calls
- production secrets
- destructive write to current OC production data

All mock responses must preserve Source Context and Return Context.

---

## 10. Mandatory States

Every representative family must support where applicable:

- Loading
- Empty
- Error
- Permission Denied
- No Result / Not Found
- Partial
- Revisit / Follow-up
- Restricted Field Masked
- Disabled/HOLD action

Do not introduce a new business state merely to make UI easier.

---

## 11. HOLD — Strictly Prohibited

Do not implement or infer:

- PMG-101~104
- PMG-201~202
- PMG-HOLD 채널·광고
- PSET-106 System 설정
- Shared Person physical architecture
- Merchant Account physical architecture
- Shared IAM physical architecture
- Physical Storage / production schema migration
- real Provider binding
- production credentials
- production deployment binding
- PCS-104 Logen production binding
- PCS-106 physical schema/migration
- PCS-190 Cleaner/Recovery/Format real endpoint
- VS 이동중 State
- VS Offline Mode
- 기사 중복배정 Exact Rule
- PMG-104 formula
- PHR-106 recreation

If a screen needs one of the above, show disabled/HOLD/placeholder behavior only.

---

## 12. Reuse Rules

Before creating a new component or screen:

1. inspect existing `frontend/oc` component and route assets,
2. inspect Current source reuse inventory documents,
3. reuse or wrap existing component where semantics match,
4. use Visual Language v2 wrapper if visual delta exists,
5. create new component only when no valid reusable asset exists.

Do not copy Legacy TMS wholesale.
Do not copy WDI code/schema.
WDI meaning may only remain PMG proposal/reference.

---

## 13. Acceptance Criteria

Prototype Development can be reported complete only when all are true:

### Common Shell
- [ ] exact 6-category Primary Sidebar
- [ ] Secondary menu matches Canonical category
- [ ] HEADER SHALL context/search/date/time/user
- [ ] category/menu/header/content synchronized
- [ ] HOLD route not executable

### P-01~P-07
- [ ] all representative flows runnable
- [ ] all forward CTAs work
- [ ] all required Return paths work
- [ ] Source Context preserved
- [ ] Return Context preserved
- [ ] no Product Meaning change

### State / Permission
- [ ] Loading
- [ ] Empty
- [ ] Error
- [ ] Permission Denied
- [ ] Field Masked
- [ ] disabled/HOLD action

### Visual
- [ ] White Canvas
- [ ] #FF6B00 only as Current primary orange
- [ ] no generic gray panel overuse
- [ ] typography/spacing/divider hierarchy
- [ ] mobile VS flow usable

### Technical
- [ ] Typecheck PASS
- [ ] Build PASS
- [ ] existing foundation guard PASS
- [ ] no Prisma model/migration added
- [ ] no production/provider binding added

---

## 14. Required QA

Run and report:

1. `pnpm install` if needed
2. TypeScript typecheck
3. frontend build
4. backend build/typecheck if touched
5. relevant existing tests
6. `tests/visual-code-qa-gate.md`
7. manual prototype flow check P-01~P-07
8. HOLD grep / physical-binding guard

If any required gate fails, do not report `COMPLETE`; return `BLOCKED` with evidence.

---

## 15. Commit Strategy

Use small reviewable commits by family.

Recommended order:

1. Common Shell correction
2. P-01 Home/TODAY
3. P-02 Customer360 + CS/VS
4. P-03 Sales + Quote/Contract
5. P-04 Contract/e-Sign
6. P-05 Customer Ops
7. P-06 Permission
8. P-07 State Family
9. Cross-flow QA / visual correction

Do not merge.
Do not push production deployment.

---

## 16. Completion Return Format

Claude Code must return exactly this structure:

```text
[OC PROTOTYPE DEVELOPMENT REPORT]

Branch:
Head SHA:

1. Implemented Prototype Scope
- P-01:
- P-02:
- P-03:
- P-04:
- P-05:
- P-06:
- P-07:

2. Common Shell
- Primary Sidebar:
- Secondary Sidebar:
- HEADER SHALL:
- Navigation synchronization:

3. Changed Files
- ...

4. Routes
- ...

5. Mock APIs / Fixtures
- ...

6. Source / Return
- PASS / FAIL + evidence

7. Empty / Error / Permission
- PASS / FAIL + evidence

8. Visual Language v2
- PASS / FAIL + evidence

9. Tests
- Typecheck:
- Build:
- QA Gate:
- Manual P-01~P-07:

10. HOLD Audit
- Production DB migration = 0
- Real Provider Binding = 0
- Production Credential = 0
- PMG implementation = 0
- PSET-106 implementation = 0

11. Remaining OPEN / HOLD
- ...

12. Screenshots / Preview URL
- ...

New Product Meaning Created = 0
```

---

## 17. Stop Conditions

Stop and report to PM instead of guessing when:

- Canonical ID conflicts with screen meaning
- a required business rule is absent
- Product Meaning would need invention
- a HOLD must be lifted to continue
- production credential/provider is required
- physical schema/migration is required
- Current source and DEV MASTER conflict semantically

Otherwise proceed autonomously through the full prototype batch.

---

## Final Directive

**START NOW.**

Build the runnable OC Prototype P-01~P-07 on the current working branch using the confirmed React/Vite + NestJS stack, Visual Language v2, Canonical 6-category IA, existing logical/mock contracts, and current source reuse assets.

Do not wait for additional PM confirmation for routine implementation decisions that are already covered by the sources above.
Do not cross any listed HOLD.
Do not create new Product Meaning.

Final Gate after Claude return:
`PM Cross QA → Owner Human Validation → Prototype Gate PASS/Correction → Final Developer Handoff`.
