# HANDOFF — 개발 기준 통합본

| 항목 | 내용 |
|---|---|
| Document ID | PPOC2-HANDOFF-001 |
| Status | WORKING |
| Last Reviewed | 2026-09-05 |
| Upstream | Google Sheet `07 : OC 개발 기획 (카테고리 기준)` DEV MASTER **v0.2** + Notion Handoff **v0.2** |
| Gate | **CONDITIONAL GO** |

> 본 문서는 Owner Source의 **사본**이다. 충돌 시 항상 Google Sheet 07 Master가 우선한다.
> 착수 전 최신 Sheet의 ID·상태를 재대조하고, 충돌 시 임의 판단하지 말고 `CONFLICT`로 반환한다.

---

## 1. 6대 상위 카테고리

`회사정보` · `영업관리` · `고객관리` · `팀플레이` · `경영관리` · `설정관리`

## 2. 핵심 Master 원칙

- 거래처 Master = `회사정보 > 거래처 관리`
- 고객 Master = `고객관리 > 고객 360`
- 직원/조직 Master = `팀플레이`
- 신규유입·가망고객·TM 일정·방문영업 일정은 고객 360의 **업무별 View/Queue**. 별도 고객 Master 생성 금지
- 동일 데이터 중복 Master 생성 금지

---

## 3. ID Master (07 DEV MASTER v0.2, 2026-09-05)

상태 범례: `CONFIRMED` / `CURRENT` = 구현 가능 · `PROPOSAL` / `HOLD` = **구현 금지**
Readiness 범례: `RWD` = READY WITH DEPENDENCY · `HOLD` = 구현 금지

### 회사정보 (PCI)

| ID | 2Depth | 3Depth | 상태 | Readiness | 제외 Dependency |
|---|---|---|---|---|---|
| PCI-101 | 업무 홈 (대시보드) | 회사 실적·업무 현황 | CONFIRMED | RWD | 실제 Projection Source binding |
| PCI-102 | 공지사항 | 전체 / 부서별 | CONFIRMED | RWD | 공지 작성·배포 정책 |
| PCI-103 | 회사 360 | 회사·사업·서비스·조직 | CURRENT | RWD | 동일 |
| PCI-104 | 운영 매뉴얼 | 행정 / 근무규칙 / 영업매뉴얼 / 서비스매뉴얼 | CURRENT | RWD | 관리자 CRUD Logical 범위까지 |
| PCI-201 | 거래처 관리 | 파트너사·제조사·공급사·발주사·VAN/PG/POS/프로그램사·설치AS·영업협력·물류·기타 | CONFIRMED | RWD | Shared Person/IAM physical, Existing DB mapping |
| PCI-202 | 거래처 상세 | 기본정보 / 담당자 / 주소 / 유형 / 업무범위 | CONFIRMED | RWD | 동일 |

### 영업관리 (PST)

| ID | 2Depth | 3Depth | 상태 | Readiness | 제외 Dependency |
|---|---|---|---|---|---|
| PST-101 | 신규유입 | 온/오프라인 신규 상담 | CONFIRMED | RWD | OSP intake / shared customer physical binding |
| PST-102 | 가망고객 | 전체 리드 | CONFIRMED | RWD | Customer360 shared binding |
| PST-103 | TM 영업 일정 | 가망 / 부재 / 거부 | CURRENT | RWD | **독립 Calendar 신규 구현 금지** |
| PST-201 | 방문 영업 일정 | 유력 / 가망 / 부재 / 거부 / 계약 | CURRENT | RWD | **자동 상태전이 금지** |
| PST-401 | 견적서 관리 | 작성 / 수정 / 전송 / 상태 | CONFIRMED | RWD | 실제 가격·수수료 Effective Policy → Mock/Logical |
| PST-402 | 견적서 상세 | 상품 / 가격 / 할인 / 수수료 | CONFIRMED | RWD | 동일. 견적→계약 Logical 전환만 |
| PST-302 | 계약 심의 (변경·해지) | 해지 / 명의변경 / 양도양수 / 계약변경 | CURRENT | RWD | Physical contract/customer master binding |
| PST-303 | 계약 만료 고객 | 만료 / 만료예정 | CURRENT | RWD | 실계약 데이터·기간 source binding |
| PST-490 | 영업도구 | 마진계산기 / 이자계산기 / 일반계산기 / 추가 도구 (카드형 Tool Hub + 빈 슬롯) | CONFIRMED | RWD | 외부 도구 URL·권한·endpoint binding |

### 고객관리 (PST-301 + PCS)

| ID | 2Depth | 3Depth | 상태 | Readiness | 제외 Dependency |
|---|---|---|---|---|---|
| PST-301 | **고객 360** | 고객·가맹점 통합 Master | CONFIRMED | RWD | Shared Person/Merchant/IAM physical binding |
| PCS-101 | TODAY | 예정 / 진행 / 보류 / 완료 | CONFIRMED | RWD | VS 이동중·오프라인·중복배정 Rule 제외 |
| PCS-102 | 신규설치 및 A/S 방문 | VS 일정 / 현장 실행 | CURRENT | RWD | 이동중 State / Offline / 중복배정 exact Rule **구현 금지** |
| PCS-103 | A/S 접수 | 접수 / 진단 / 처리 / 제조사 인계 | CURRENT | RWD | 미확정 세부 State 추가 금지 |
| PCS-104 | 택배 및 제품 수발주 | 발송 / 수령 / 제조사 발송·회수 | CURRENT | RWD | Real logistics provider binding |
| PCS-105 | 결제 및 미수금 관리 | 결제 / 미수 / 후속처리 | CURRENT | RWD | 실결제·정산 Provider binding |
| PCS-106 | 재고관리 | 입고 / 출고 / 보유 / 배정 | CONFIRMED | RWD | **Physical Storage/Production binding HOLD** |
| PCS-190 | CS도구 | 포스 클리너 / 원격지원 / 포스 리커버리 / 포스 포맷 자동화 / 추가 도구 (Tool Hub + 빈 슬롯) | CONFIRMED | RWD | 실제 endpoint binding |

> `PST-301`은 ID Prefix가 PST이나 **카테고리는 고객관리**다. (Cross Audit 2026-09-05에서 정정 완료)

### 팀플레이 (PHR)

| ID | 2Depth | 3Depth | 상태 | Readiness | 제외 Dependency |
|---|---|---|---|---|---|
| PHR-101 | 우리 팀 | 조직도 / 비상연락망 | CONFIRMED | RWD | Physical Member/IAM binding |
| PHR-102 | 구성원 | 소속 / 직급 / 역할 / 근무형태 | CURRENT | RWD | HR Restricted 필드 제외 |
| PHR-103 | 역할·업무분장 | 책임 / 주요업무 / 지원 / 대체 | CONFIRMED | RWD | 동일 |
| PHR-104 | 보고·협업 | 보고선 / 협업자 | CONFIRMED | RWD | 동일 |
| PHR-105 | 근무·휴가 | 신청 / 승인 / 현황 | CONFIRMED | RWD | **법정 계산·급여 영향 자동화 구현 제외** |
| PHR-107 | 내 정보 | 내 정보 / 수정 요청 / 계약·이력(권한별) | CONFIRMED | RWD | 민감 HR physical binding |
| PHR-108 | 내 업무 도구 | 공지 / 매뉴얼 / 지출결의 | CONFIRMED | RWD | **지출결의는 Entry Surface만. `PMG-103`이 PROPOSAL인 동안 Route/API 연결 금지 → Feature Flag 또는 Disabled** |

> `PHR-106 인사 이력`은 v0.1 Legacy이며 **v0.2 Master에 존재하지 않는다.** Canonical ID로 복원 금지.

### 경영관리 (PMG) — **전 항목 구현 금지**

| ID | 2Depth | 3Depth | 상태 | Readiness |
|---|---|---|---|---|
| PMG-100 | 경영관리 (상위 영역) | 구조만 확정 | CURRENT | 하위 개별 상태를 따름 |
| PMG-101 | 경영 현황 | KPI / 매출 / 마진 / 정산 | PROPOSAL | HOLD |
| PMG-102 | 정산 관리 | Expected vs Finalized | PROPOSAL | HOLD |
| PMG-103 | 지출결의 | 신청 / 승인 / 확정 | PROPOSAL | HOLD |
| PMG-104 | 수수료·보상 | 실적 + Policy Snapshot + Calculation + Approval | PROPOSAL | HOLD (Formula 미확정 추가 HOLD) |
| PMG-201 | 회사운영 > 차량 관리 | 소유형태 / 운행 / 정비 / 보험 / 비용 | PROPOSAL | HOLD |
| PMG-202 | 회사운영 > 주차 관리 | 센터별 정기·방문 / 등록차량 / 비용 | PROPOSAL | HOLD |
| PMG-HOLD | 채널·광고 | — | HOLD | HOLD (Ownership 경계 미확정) |

### 설정관리 (PSET)

| ID | 2Depth | 3Depth | 상태 | Readiness | 제외 Dependency |
|---|---|---|---|---|---|
| PSET-101 | 운영 설정 | 상태값 / 유형 / 카테고리 / 사유코드 / 문구 / 템플릿 | CONFIRMED | RWD | Shared IAM physical, Existing code schema |
| PSET-102 | 권한 설정 | 외부 파트너 / 내부 직원 / 내부 관리자 / 운영자 | CONFIRMED | RWD | 동일 |
| PSET-103 | 화면·메뉴 설정 | 메뉴명 / 순서 / 표시·숨김 / 기본필터 | CONFIRMED | RWD | Core Canonical ID 고정 |
| PSET-104 | 업무 Rule 설정 | 알림 / 일부 자동화 / 조건 | CURRENT | RWD | **Rule Registry/UI CRUD + Audit/복구까지만.** 영업 자동전이·CS→VS 자동판정은 Placeholder/비활성 |
| PSET-105 | 변경 이력·복구 | 누가 / 언제 / Before / After | CONFIRMED | RWD | 동일 |
| PSET-106 | System 설정 | 외부 API / Provider / DB / 보안 | CURRENT | **HOLD** | 별도 Security/Dev Gate 필요 |

---

## 4. Target Repository 구조 (Handoff v0.2 §10 권장)

```
company/  sales/  customer/  teamplay/  management/  settings/
shared/   legacy-adapters/
```

- Legacy `payplay-tms` **전체 복제 금지**. 필요 Domain Asset만 선별 이식.
- 실행 순서: `Foundation → Company → Sales → Customer → Teamplay → Settings → Physical Verification`
- 이식 제외: `PMG PROPOSAL/HOLD` · 팀채팅 · 채널·광고 · WDI 독립코드

---

## 5. 권한 기준

`외부 파트너` · `내부 직원` · `내부 관리자` · `운영자`
System / API / DB / 보안은 일반 관리자 수정 금지 — 제한된 운영·개발·보안 권한 사용.

---

## 6. 개발 완료 반환 형식 (필수)

```
WP ID / Sheet ID
구현 기능
REUSE / MODIFY / NEW / HOLD
변경 파일
Route
API
DB Model / Migration
Role / Permission
Error / Empty 처리
Test 결과
Remaining Dependency
남은 OPEN / HOLD
New Product Meaning Created = 0
```

정책이 불명확하면 질문으로 신규 Rule을 만들지 않고, 해당 ID를 `CONFLICT` / `NOT READY` / `HOLD`로 반환한다.
