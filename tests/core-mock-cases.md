# Sprint 1 Core Logical/Mock Acceptance Cases

Status: WORKING / EXECUTION AUTHORIZED WITH HOLD

| Case | Source ID | Given | When | Then |
|---|---|---|---|---|
| CORE-01 | PST-301 | Customer360 조회 | `/mock/customer360/:id` 호출 | Canonical Owner=PST-301, 진행업무는 각 Domain Source ID를 보유 |
| CORE-02 | PST-301 | Activity Ledger 이력 | Customer360 응답 확인 | Ledger item은 append-only이며 Customer Master를 중복 생성하지 않음 |
| CORE-03 | PCS-101 | TODAY Queue | `/mock/today` 호출 | 상태는 예정/진행/보류/완료만 사용 |
| CORE-04 | PCS-101 | TODAY item 선택 | Source Path 확인 | Projection은 원본 Transaction을 직접 수정하지 않음 |
| CORE-05 | PCS-102 | 현장 방문 | Service Mock 확인 | 사진/Serial·Asset/Test Result/고객 확인을 Evidence Gate로 표현 |
| CORE-06 | PCS-102 | Evidence 미충족 | 완료 요청 | Verified Complete 불가 조건이 존재 |
| CORE-07 | PCS-102 | 부분완료/재방문 | State 확인 | 부분완료와 재방문을 완료와 구분 |
| CORE-08 | PCS-103 | CS→VS 전환 | Handoff 확인 | What we know / tried / need + 원격 불가 사유 포함 |
| CORE-09 | PCS-103 | VS 결과 발생 | Case 상태 확인 | VS 완료와 A/S Case Close는 별도 명령 |
| CORE-10 | PST-101/102/103/201 | Sales Queue | `/mock/sales` 호출 | 별도 Customer Master를 만들지 않고 PST-301을 참조 |
| CORE-11 | PST-103/201 | 영업 상태 변경 | Sales Contract 확인 | 자동 상태전이 금지, 사용자 수동 중심 |
| CORE-12 | PST-401 | 견적 처리 | Quote Actions 확인 | 작성/수정/PDF/전송/상태/계약전환만 포함, 내부 승인 제외 |

## HOLD regression

아래가 Mock 응답이나 Prisma Schema에 확정값으로 들어가면 실패 처리한다.

- VS 이동중 State
- Offline Mode
- 기사 중복배정 Exact Rule
- Shared Person / Merchant / IAM Physical Architecture
- Inventory Physical Schema / Migration
- Logen Production Binding
- PMG-104 Formula
- Provider Credential / Production Config

New Product Meaning Created = 0
