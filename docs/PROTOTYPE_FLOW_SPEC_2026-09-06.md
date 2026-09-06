# [OC-PROTOTYPE] BASELINE / WORKING / Prototype Flow Specification — 대표 프로토타입 흐름 [2026-09-06]

## 목적

전체 화면을 먼저 프로토타이핑하지 않고, 개발 전 구조적 위험이 큰 대표 업무 Flow를 클릭 가능하게 검증한다.

## Prototype Coverage

### P-01 업무 홈 / TODAY
업무 홈 → TODAY Queue → 업무 상세 → Return → 완료/보류 상태 반영.

검증:
- Projection과 Source Truth 분리
- Source/Return 보존
- 상태 `예정/진행/보류/완료`
- Empty/Error

### P-02 고객360 / A/S / VS
고객360 → A/S 접수 → CS 처리 → VS Handoff → 방문 작업 → Evidence → Verified Complete → Customer360 Activity → A/S Case Close.

검증:
- 3-block Handoff
- Remote impossible reason
- Schedule change history
- Partial/Revisit
- Verified Complete와 Case Close 분리

### P-03 Sales → Quote → Contract
신규유입 → 가망고객 → TM/방문일정 → 견적 생성/발송 → 계약 전환 → Customer360.

검증:
- 고객 Master 중복 없음
- 수동 상태전이
- Quote snapshot
- Contract transition
- Source/Return

### P-04 Contract / e-sign
계약 상세 → 전자서명 문서 선택 → 발송 준비 → Submission 상태 → 완료/실패 → Contract Activity → Customer360.

검증:
- e-sign 완료 ≠ 계약 자동 완료
- Provider failure trace
- Optional document selection
- Activity projection

### P-05 Supply / Inventory
A/S 또는 설치 업무 → 발주 → 입고/배송 → Serial/재고 할당 → 현장업무 → TODAY/Customer360 Projection.

검증:
- Source Transaction owner
- Serial/Asset 연결
- shortage/partial
- shipment failure
- Projection only

### P-06 Teamplay / Permission
구성원 → 역할/업무분장 → 권한 설정 → 메뉴/Row/Field/Action 제한 → Audit.

검증:
- direct URL denial
- masked/hidden field
- read/edit 분리
- HOLD 우회 금지

### P-07 Common Shell
1차 Sidebar → 2차 Sidebar → HEADER SHALL (상단바) → Search/Context/User → Page.

검증:
- Canonical 6대 Category
- Navigation/Content/Header context consistency
- date/time Asia/Seoul, HH:mm
- HOLD/준비중 처리
- white canvas / thin neutral border / #FF6B00

## Screen Coverage Rule

대표 Flow에 필요한 화면만 Prototype 필수다. 동일 Pattern의 반복 화면은 대표 Family 1개를 검수한 뒤 확장 가능하다.

## Interaction States

각 대표 Flow에서 최소 1회씩 확인:
- Loading
- Empty
- Error
- Permission denied
- Confirm
- Cancel
- Back/Return
- Partial/Retry where applicable

## Human Validation Questions

1. 실제 직원 업무 순서와 맞는가?
2. 현재 위치와 돌아갈 위치가 명확한가?
3. Source와 Projection이 혼동되지 않는가?
4. 필요한 핵심 정보가 첫 화면에 보이는가?
5. 같은 정보를 여러 번 입력하지 않는가?
6. 실패/부분완료/재방문 시 업무가 사라지지 않는가?
7. 권한 없는 정보/Action이 숨겨지는가?

## Prototype Gate PASS

- P-01~P-07 Representative Flow 연결 완료
- Source / Return 전수 확인
- Error/Empty/Denied State 확인
- Canonical IA 일치
- Visual Language v2 일치
- Owner Human Review 완료
- Material Correction 0 또는 보정 반영 완료

Prototype Gate가 PASS되기 전 Claude Code 대량 구현 재개 금지.

`New Product Meaning Created = 0`
