# [OC-PROTOTYPE] REGISTER / CURRENT / Prototype Screen Coverage Matrix — 프로토타입 화면 커버리지 [2026-09-06]

## 목적
P-01~P-07 대표 Flow에서 반드시 클릭 연결해야 하는 Screen Family와 상태를 고정한다. 동일 Pattern 반복 화면은 대표 Family 검수 후 확장한다.

| Flow | Required Screens | Required States | Key Validation |
|---|---|---|---|
| P-01 업무 홈/TODAY | 업무 홈, TODAY Queue, 업무 Source Detail, Return | Loading/Empty/Error/완료/보류 | Projection≠Source, Return |
| P-02 고객360/A/S/VS | 고객360, A/S Case, CS 처리, VS Handoff, VS Mobile, Evidence/Complete, Customer360 Activity | Empty/Error/Partial/Revisit/Denied | 3-block, Verified Complete, Case Close 분리 |
| P-03 Sales/Quote/Contract | 신규유입, 가망, TM 일정, 방문영업, Quote List, Quote Detail/Edit, Contract Create/Detail | Empty/Error/Confirm/Cancel/Expired | 수동 전이, Quote snapshot, no duplicate Customer |
| P-04 Contract/e-sign | Contract Detail, 문서선택, 발송준비, Submission Status, 실패/재조정, Activity/Customer360 | Loading/Error/Partial/Retry | e-sign complete≠Contract complete |
| P-05 Supply/Inventory | 발주, 배송, 재고, Serial/Allocation, Shortage/Partial, Source 업무 Return | Empty/Error/Shortage/Partial | Source owner, Projection only |
| P-06 Teamplay/Permission | 우리 팀/구성원, 역할·업무분장, Permission Matrix, Denied Result, Audit | Empty/Error/Denied/Masked | Menu/Row/Field/Action, Default Deny |
| P-07 Common Shell | 1차 Sidebar, 2차 Sidebar, HEADER SHALL, Search, User Area, 준비중/HOLD | Active/Hover/Focus/Denied | Canonical 6대 Category, context consistency |

## Prototype Minimum Screen Set
중복 Pattern을 제거한 최소 대표 화면군:
1. 업무 홈
2. TODAY Queue
3. Generic Source Detail
4. 고객360
5. A/S Case Detail
6. VS Handoff
7. VS Mobile Execution
8. 신규유입 List/Detail
9. 가망고객 List/Detail
10. 영업 일정
11. Quote List
12. Quote Detail/Edit
13. Contract Create/Detail
14. e-sign Document Select
15. e-sign Submission Status
16. Purchase Order
17. Shipment
18. Inventory/Serial
19. 우리 팀/구성원
20. Permission Matrix
21. Audit/Change History
22. Common Empty/Error/Denied State Family

## Common Shell on every desktop representative
- Primary Sidebar
- Secondary Sidebar
- HEADER SHALL (상단바)
- Breadcrumb/Context
- Search
- Asia/Seoul date + HH:mm
- User/Operator
- White Canvas
- `#FF6B00` local primary/selection
- Thin Neutral Divider

## Screen State Coverage Rule
모든 화면을 별도 상태 Frame으로 복제할 필요는 없지만 P-01~P-07 전체 합산으로 아래 상태는 반드시 실제 클릭/전환으로 검증한다.
- Loading
- Empty
- Error
- Permission denied
- Confirm
- Cancel
- Retry
- Partial/Revisit
- Back/Return
- HOLD/준비중

## Excluded from Prototype Current Gate
- PMG-101~104, PMG-201~202
- PSET-106
- Real Provider Credential/Production
- Physical DB Migration
- VS 이동중/Offline/중복배정 Exact Rule
- Logen Production Binding

## PASS Rule
Screen Family 22개 기준으로 P-01~P-07 Flow가 끊기지 않고, Source/Return·Error/Empty/Denied·Canonical IA·Visual v2가 검증되면 Prototype Screen Coverage = PASS Candidate.

`New Product Meaning Created = 0`
