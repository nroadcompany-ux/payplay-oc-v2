# [OC] TEST / ACTIVE / Sprint 1 Integration Cases [2026-09-05]

## Sales Core
1. PST-101 신규유입은 PST-301 Customer360 Master를 참조한다.
2. PST-101→102→103/201→401 전이는 자동이 아니라 사용자 수동이다.
3. PST-401 견적은 작성/수정/PDF/전송/상태/계약전환만 포함하고 내부 승인 Flow는 제외한다.
4. Sales 완료/취소 후 PST-301 Customer360 Context로 Return한다.

## Service Core
5. PCS-103 A/S 접수는 What we know / What we tried / What we need + 원격불가사유를 가진다.
6. 방문 필요 판단 후 PCS-102 일정으로 Handoff한다.
7. 일정 변경/취소 시 기존 History는 삭제하지 않는다.
8. 사진/Serial·Asset/Test Result/고객확인 누락 시 Verified Complete를 허용하지 않는다.
9. Partial Complete와 Revisit는 별도 중요 상태로 유지한다.
10. VS 결과는 Activity Ledger를 거쳐 PST-301 Customer360 History로 Return한다.
11. VS Verified Complete와 PCS-103 A/S Case Close는 별도 명령이며 자동 Close하지 않는다.

## Operations Core
12. PCS-104 수발주는 Logical/Mock 범위만 구현하고 Logen Production Binding은 HOLD한다.
13. PCS-105 미수금은 Restricted Summary + Queue Pattern만 사용한다.
14. PCS-106 재고는 Logical/Mock Only이며 Physical Schema/Migration을 생성하지 않는다.

## Settings Enforcement
15. PSET-103 Canonical ID는 수정할 수 없다.
16. PSET-103에서 변경 가능한 값은 displayName/order/visibility로 제한한다.
17. PSET-102 권한은 Menu + Row Scope + Field Visibility + Action Permission을 모두 평가한다.
18. Permission 기본 정책은 Default Deny다.
19. 설정 변경은 PSET-105 Audit Before/After + Recovery를 요구한다.
20. PSET-106은 HOLD 상태로 노출만 가능하고 구현하지 않는다.

## Front ↔ Mock API
21. Customer360/TODAY/Service/Sales/Operations/Settings 화면은 Nest Mock endpoint를 통해 Logical Contract를 읽는다.
22. Mock API 실패 시 Static Contract를 유지하고 연결 실패 상태를 표시한다.
23. VITE_API_BASE_URL 미지정 시 localhost:4100을 Mock API 기본값으로 사용한다.

## HOLD Regression
- DB Migration = 0
- Physical Prisma Model = 0
- Real Provider/Credential Binding = 0
- Production Binding = 0
- PMG Implementation = 0
- PSET-106 Implementation = 0
- VS 이동중/Offline/중복배정 Exact Rule 확정 = 0

New Product Meaning Created = 0
