# [OC-CSVS] EVIDENCE / CURRENT / Current CS·VS Gap Recovery [2026-09-06]

## 목적
Owner 제공 `nroad-ecosystem/payplay` 계열 Source Archive의 현재 Customer Support/Fulfillment 자산을 v2 Canonical `PCS-102 / PCS-103` 기준과 대조한다.

## Current Source — 확인된 것

### Customer Support Request
Current domain은 다음을 직접 지원한다.
- Request Type: NEW_PRODUCT_CONSULTATION / SERVICE_TERMINATION / CONTRACT_DOCUMENT / BUSINESS_TRANSFER / SALES_REPORT / AFTER_SALES_SERVICE / RECEIPT_PAPER
- Status: RECEIVED / IN_PROGRESS / ON_HOLD / COMPLETED
- Source Channel: HOMEPAGE / CSMM / INTERNAL
- Applicant / Phone / Email / Store Name
- Assignee
- Linked Store
- Processing Note CRUD
- Status 변경
- 담당자 배정/해제
- Store link
- Soft delete
- 완료 시 `resolvedAt`

Frontend에는 목록/상세 Route, Processing Note, assignee 조회, Return Location 검증 테스트가 존재한다.

## v2 Canonical — PCS-103 A/S 접수
Owner Current Source 기준:
- CS 진단 → 원격/내부 처리 → 원격 불가 시 VS 방문 또는 제조사 입고
- CS→VS Handoff = `What we know / What we tried / What we need` + 원격 불가 사유
- VS 현장 처리 결과와 A/S Case Close는 별도 Command
- 자동 종료 금지

## Gap 판정

| 항목 | Current | v2 필요 | Decision |
|---|---|---|---|
| A/S Intake | CustomerSupportRequest + AFTER_SALES_SERVICE | 유지 | REUSE |
| 상태관리 | RECEIVED/IN_PROGRESS/ON_HOLD/COMPLETED | v2 Case State 정합 필요 | MODIFY |
| 담당자 배정 | 존재 | 유지 | REUSE |
| Processing Note | CRUD 존재 | CS 진단/처리 기록에 활용 가능 | REUSE |
| Store 연결 | linkedStoreId 존재 | Customer360 Context 연결 | MODIFY |
| CS→VS 3-block Handoff | 미확인 | 필수 | NEW |
| Remote impossible reason | 미확인 | 필수 | NEW |
| VS 방문 Schedule 생성 Contract | current customer-support 안에서 직접 확인 안 됨 | CS 판단 후 생성 | MODIFY |
| VS Evidence checklist | 미확인 | 사진/Serial·Asset/Test/고객확인 | NEW |
| Partial Complete | Fulfillment 일부 partial 의미 존재, A/S VS Rule과 동일성 미확정 | 필수 예외처리 | MODIFY |
| Revisit | exact command 미확인 | 재방문 이유/잔여작업 | NEW |
| Verified Complete | 미확인 | Evidence 충족 후만 허용 | NEW |
| VS Result → Activity Ledger | 미확인 | 필수 | NEW |
| VS Complete ≠ Case Close | current COMPLETED는 Request 자체 완료 | 별도 Command 필요 | CONFLICT |
| 일정 변경 History | exact VS schedule history 미확인 | 삭제 금지 | MODIFY |

## 핵심 Conflict
Current `CustomerSupportRequest.changeStatus(COMPLETED)`는 Request 자체에 `resolvedAt`을 설정한다.

v2에서는:
- VS 현장 결과 완료
- Verified Complete
- A/S Case Close

를 같은 이벤트로 취급하면 안 된다.

따라서 Current `COMPLETED` 의미를 v2의 `Verified Complete`로 단순 매핑하지 않는다.

## 개발 가이드
허용:
- Current Customer Support List/Detail UI 패턴 선택 재사용
- Request/Assignee/Processing Note API 구조 재사용
- Return Context 패턴 재사용
- v2 Handoff/Evidence/Verified Complete를 Logical/Mock으로 추가

금지/HOLD:
- Current physical schema를 v2 A/S Case schema로 즉시 승계
- VS Moving State
- Offline Mode
- Duplicate Assignment Exact Rule
- Provider/Production Binding

## PM 판정
- PCS-103 = MODIFY
- PCS-102 = MODIFY + v2 Evidence/Verified Complete 신규 보강
- Current CustomerSupport 자산 재사용 가치 = HIGH
- Current Completion semantics = CONFLICT, v2 Rule 우선

New Product Meaning Created = 0
