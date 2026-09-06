# DECISIONS — Owner 확정사항 / Pending / 금지사항

| 항목 | 내용 |
|---|---|
| Document ID | PPOC2-DEC-001 |
| Status | WORKING (파일 단위) |
| Last Reviewed | 2026-09-06 |
| 원칙 | 각 Decision은 개별 상태를 유지한다. Proposal을 Decision으로 임의 승격 금지. |

---

## 1. 용어 확정 (Owner)

| 확정 용어 | 매핑 ID | 비고 |
|---|---|---|
| 신규유입 | PST-101 | |
| 가망고객 | PST-102 | |
| 고객 360 | PST-301 | 카테고리는 **고객관리** (영업관리 아님) |
| TM 영업 일정 | PST-103 | |
| 방문 영업 일정 | PST-201 | |
| 계약 심의 (변경·해지) | PST-302 | |
| TODAY | PCS-101 | |
| 신규설치 및 A/S 방문 | PCS-102 | |
| A/S 접수 | PCS-103 | |
| 택배 및 제품 수발주 | PCS-104 | |
| 결제 및 미수금 관리 | PCS-105 | |
| 조직도 / 구성원 / 업무분장 / 보고·협업체계 | PHR-101 / 102 / 103 / 104 | v0.2 명칭은 **우리 팀 / 구성원 / 역할·업무분장 / 보고·협업** |
| 파트너사 | **PCI-201 / PCI-202 거래처 관리·상세** | v0.2에서 거래처 Master의 한 **유형**으로 흡수. `PPT-101/102`는 v0.1 전용 ID |

> **주의 — 용어 이동 2건.** 지시서의 `조직도`·`업무 분장표`·`파트너사`는 v0.2에서 명칭·소속이 바뀌었다.
> 구현 시 v0.2 Canonical ID를 따르고, 화면 표시명은 `PSET-103 화면·메뉴 설정`으로 조정한다.

---

## 2. Owner 확정 Rule

| ID | 결정 | 출처 |
|---|---|---|
| OC-R-001 | 고객 360 = 전체 관계 요약 + 역할별 필터 혼합. 기본정보 + 현재 진행업무 + 최근 이력 우선, 영업/CS/계약/결제/설치·A/S View 보조 | 지시서 + Handoff v0.2 §3 |
| OC-R-002 | TODAY 상태 = `예정 / 진행 / 보류 / 완료` | 지시서 + Handoff v0.2 §3, §12 |
| OC-R-003 | 영업 상태 전이 = 사용자 수동 중심. 자동 상태전이 금지 | 지시서 + 07 Master PST-103/201 |
| OC-R-004 | CS→VS = CS가 방문 필요 판단 후 VS 일정 생성 | 지시서 + Handoff v0.2 §3 |
| OC-R-005 | 계약 심의 범위 = 해지 / 명의변경 / 양도양수 / 계약변경 | 지시서 + 07 Master PST-302 |
| OC-R-006 | 6대 상위 카테고리 = 회사정보 / 영업관리 / 고객관리 / 팀플레이 / 경영관리 / 설정관리 | Handoff v0.2 §1 |
| OC-R-007 | 거래처 Master = `회사정보 > 거래처 관리`. 파트너사·제조사·공급사·발주사·VAN/PG/POS/프로그램사·설치/AS·영업협력·물류를 하나의 Master에서 유형으로 구분 | Handoff v0.2 §2, §8 |
| OC-R-008 | 고객 Master = `고객관리 > 고객 360`. 신규유입·가망고객·TM 일정·방문영업 일정은 고객 360의 업무별 View/Queue이며 **별도 고객 Master 생성 금지** | Handoff v0.2 §2 |
| OC-R-009 | 직원/조직 Master = `팀플레이` | Handoff v0.2 §2 |
| OC-R-010 | 동일 데이터 중복 Master 생성 금지 | Handoff v0.2 §2 |
| OC-R-011 | 견적서 = 작성·수정·PDF/전송·상태 + 상품/가격/할인/수수료 Rule + 견적→계약 전환. **내부 승인 Flow는 현재 제외** | Handoff v0.2 §3 |
| OC-R-012 | 팀플레이는 직원 친화적 명칭. 사용자 화면에 인사행정/노무관리 표현을 전면에 두지 않는다 | Handoff v0.2 §3 |
| OC-R-013 | 메뉴 Canonical ID는 고정. Display Name / Order / Visibility만 수정 가능 | Handoff v0.2 §3 |
| OC-R-014 | 설정 변경은 Audit Log + Before/After + 복구 필수 | Handoff v0.2 §3 |
| OC-R-015 | 권한 구분 = 외부 파트너 / 내부 직원 / 내부 관리자 / 운영자. System·API·DB·보안은 일반 관리자 수정 금지 | Handoff v0.2 §6 |
| OC-R-016 | VS 완료의 TODAY 반영은 **Verified Complete** 기준. 현장처리만으로 자동 종료 금지 | Handoff v0.2 §8 |
| OC-R-017 | CS→VS Handoff는 `What we know / What we tried / What we need` 3블록 + 원격 불가 사유 기록 | Handoff v0.2 §8 |
| OC-R-018 | VS 결과는 **Activity Ledger**를 거쳐 고객 360 이력에 반영 | Handoff v0.2 §8 |
| OC-R-019 | 일정 변경·취소 시 기존 일정 History 삭제 금지 | Handoff v0.2 §8 |

---

## 3. 승계 Decision — PayPlay OC Decision Register (APPROVED / SOT YES)

| ID | 결정 |
|---|---|
| D-OC-001 | Customer Account = 동일 실질 운영관계로 통합 관리하는 고객그룹. 법적 계약/세금/PG/정산 주체 아님 |
| D-OC-002 | 동일 장소 + 운영·장비·업무 연속성 유지 시 기존 Store ID 유지 Candidate. 타지역 이동은 신규 Store 우선. 애매하면 Human Review |
| D-OC-003 | Store에 단일 Legal Entity 고정 금지. 역할·기간 Assignment History 보존 |
| D-OC-004 | OC가 Product / Commercial Policy Master Owner |
| D-OC-005 | People / HR은 OC 공식 범위. 퇴사자 사후 행정요청은 Former Employee Service Desk |
| D-OC-006 | Legacy Capability는 신규 설계에 안 보인다는 이유만으로 삭제 금지 |

---

## 4. Pending — 임의 확정 금지

### P0 Structural Pending

| ID | 항목 | 허용 범위 |
|---|---|---|
| P-001 | Person Master 물리 위치 | Logical Relation 사용 가능. Physical DB/Owner 확정 금지 |
| P-002 | Merchant Account 최종 구조 | Customer Account/Store/User Identity와 동일 Entity 선확정 금지. 독립 Table 선생성 금지 |
| P-003 | Shared IAM 물리 Architecture | Logical Permission 요구 사용 가능. User/Auth/Session/Membership Physical Schema 확정 금지 |

### 추가 Pending

Inventory/Supply physical split · Billing/Receivable entity·state·allocation · Settlement detail ·
Compensation formula/rate/approval · Payment/Bank Provider · e-sign Provider · Quote/Message Provider ·
Carrier(Logen) Adapter · Remote Support/Vendor Integration · HR 본인확인·문서법적요건·Retention·SLA ·
Official Screen ID · Decision Detail UX · Legacy WDI Migration scope · Credential Key classification ·
Approval threshold

---

## 5. 절대 금지

1. `OPEN` / `PROPOSAL` / `HOLD` 임의 구현 금지. 상세문서가 충분해도 구현하지 않는다.
2. 신규 Product Meaning 생성 금지. 모든 반환에 `New Product Meaning Created = 0` 명시.
3. 기존 TMS 기능을 최신 Sheet에 없다는 이유만으로 삭제 금지.
4. 최신 Owner Source보다 과거 문서 우선 금지.
5. 현재 배포 OC를 정답으로 간주 금지.
6. 독립 Calendar 신규 구현 금지 (업무별 일정 View로만).
7. 공통 일정·미팅 독립 메뉴 생성 금지.
8. 신규 AI 기능·신규 채팅 기능 임의 생성 금지.
9. 채널·광고를 OC 메뉴로 승격 금지 (OSP / Marketing Play Ownership 경계 미확정).
10. `PMG-104` 수수료·보상 Formula 미확정 → 계산 엔진 구현 금지.
11. Legacy RLS/권한 구조 그대로 재사용 금지 (`PSET-102` 요건 미충족).
12. Physical Verification 전 금지: 재고 Migration · Logen Production Binding · CS Cleaner/Recovery/Format Endpoint 연결 · Shared IAM/Person/Merchant Physical Binding.

---

## 6. Owner Decision Required (본 Repo 착수 시점 신규)

| # | 항목 | 왜 필요한가 | 상태 |
|---|---|---|---|
| ODR-01 | **기술 스택 확정** | 기존 `oc.payplay.kr` 계열의 실제 기술스택 확인 | **RESOLVED — Owner 제공 `nroad-ecosystem/payplay` 계열 source archive에서 `frontend/oc` React 19 + TypeScript + Vite 8 + React Router 8, `backend` NestJS 11 + TypeScript + Prisma 6.19 + PostgreSQL 확인. `frontend/oc/README.md`가 운영 도메인 `https://oc.payplay.kr`, Vercel CD를 직접 명시. `/users` path-route도 App.tsx에서 확인.** |
| ODR-02 | **oc.payplay.kr 현재 배포 Repository 확정** | 실제 배포체/운영 Repo를 특정해 재사용 정밀도를 높여야 함 | **STRONG CONFIRMED CANDIDATE — Source archive 구조·GHCR `nroad-ecosystem` naming·배포 문서·최근 eformsign/계약/매장 기능 흔적이 `nroad-ecosystem/payplay`와 일치. 단 GitHub Connector가 private Repo current main SHA를 직접 읽지 못해 exact SHA equality만 미검증.** |
| ODR-03 | **`PCS-106` 재고 Source Conflict 판정** | 최신 TMS `db.js`에 `biz_inventory`·`biz_inventory_log` 참조 확인됨. 단 `create table` migration 부재 | **부분 해소 — §RECOVERY_REPORT 참조. Current source에는 React inventory UI + Nest inventory module이 존재하지만, v2 Physical Schema/Migration 승계 여부는 별도 검증 전 HOLD 유지.** |
| ODR-04 | **`biz_namecards` (명함관리) 처리** | Legacy 실기능이나 LEGACY RECOVERY QUEUE(REC-L01~L26) 어디에도 없음. Loss Risk | **OPEN** |
| ODR-05 | **`biz_commission_grades` 처리** | `PMG-104` Formula 미확정 HOLD 상태이나 Legacy에 수수료 등급 자산이 실재 | **OPEN** |
| ODR-06 | **고객 360 정책 충돌** | Legacy TMS 최신 커밋이 `고객 360 폐지 → 판매 상세로 통합`. 최신 Owner Source는 고객 360을 CONFIRMED 단일 Master로 규정 | **RESOLVED BY OWNER SOURCE PRIORITY — PST-301 Customer360 유지, Legacy 폐지안은 SUPERSEDED 참고자료** |

---

## 7. 변경 이력

| 일자 | 내용 |
|---|---|
| 2026-09-05 | 최초 작성. Owner 지시서 + Sheet 07 v0.2 + Handoff v0.2 + OC Decision Register 반영 |
| 2026-09-05 | ODR-01 기술스택을 업로드된 current PayPlay source evidence로 RESOLVED. ODR-06은 최신 Owner Source 우선 원칙에 따라 PST-301 유지로 정합. |
| 2026-09-06 | Owner 제공 기존 OC 제작 스택(Frontend Next.js+TS+React / Backend NestJS+TS+PostgreSQL)과 별도 Next.js 자산 확인으로 ODR-01을 일시 OPEN/SOURCE CONFLICT로 재개방. |
| 2026-09-06 | Owner 제공 `nroad-ecosystem/payplay` 계열 source archive의 `frontend/oc/README.md`, `package.json`, `App.tsx`, backend/deployment files를 직접 검증하여 ODR-01을 React/Vite + NestJS/Prisma/PostgreSQL로 재해결. ODR-02는 exact current main SHA verification만 남은 STRONG CONFIRMED CANDIDATE로 승격. |
