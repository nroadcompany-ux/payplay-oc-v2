# [OC] BASELINE / CURRENT / CS→VS Interaction Contract [2026-09-06]

## 목적
Current CustomerSupport 자산을 활용해 PCS-103 A/S 접수 → PCS-102 VS 방문으로 이어지는 Logical Interaction을 고정한다.

## Current source reuse
Current CustomerSupport supports:
- request list/detail
- create/update
- status `RECEIVED / IN_PROGRESS / ON_HOLD / COMPLETED`
- assignee assign/unassign
- Store link/unlink
- Processing Note CRUD
- request delete

Decision: **MODIFY**.

## v2 CS→VS Handoff
CS가 방문 필요를 판단한 경우에만 VS 일정 생성 Action을 노출한다.

필수 Handoff payload:
1. What we know
2. What we tried
3. What we need
4. Remote impossible reason
5. customerRef / storeRef
6. source AS case/request reference

## VS execution minimum
- 도착
- 작업 시작
- 진단
- 사진
- Serial / Asset
- Test Result
- 부분완료
- 고객 확인
- 재방문
- 완료 요청

## Verified Complete Gate
필수 Evidence가 충족되기 전에는 Verified Complete 불가.

Verified Complete 후:
- VS Result → Activity Ledger append
- Customer360 history projection
- TODAY 완료/최근완료 projection 가능

## Separate command boundary
- VS Verified Complete ≠ A/S Case Close
- A/S Case Close는 별도 Action
- Current CustomerSupport `COMPLETED`를 자동으로 두 의미에 동시에 매핑하지 않는다

## History / Return
- 일정 변경·취소 History 삭제 금지
- Customer absent / Partial / Revisit 이유 보존
- Return Context: TODAY / Customer360 / A/S Case 출처 보존

## HOLD
- 이동중 State
- Offline Mode
- 기사 중복배정 Exact Rule
- Physical schedule/assignment schema finalization

New Product Meaning Created = 0
