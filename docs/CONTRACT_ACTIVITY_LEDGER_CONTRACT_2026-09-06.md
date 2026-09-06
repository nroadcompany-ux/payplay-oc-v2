# [OC-CONTRACT] BASELINE / WORKING / Contract Activity Ledger Contract — 계약·전자서명 이력 연결 [2026-09-06]

## Scope

Contract/eformsign Source Transaction을 Activity Ledger를 통해 Customer360 및 TODAY Projection에 연결한다.

## Source Ownership

- Contract state = Contract Domain
- e-sign submission/document state = e-sign adapter/domain
- Customer360 = projection/read surface
- TODAY = work projection
- Activity Ledger = append-only trace

## Activity Types

- contract.created
- contract.updated
- contract.sent
- contract.status_changed
- contract.cancelled
- contract.expiry_followup_created
- esign.plan_created
- esign.submission_started
- esign.document_sent
- esign.document_completed
- esign.document_failed
- esign.submission_completed
- esign.reconciliation_required

## Minimum Event Payload

- activityId
- activityType
- sourceDomain
- sourceEntityId
- customer/store reference
- actor
- occurredAt
- summary
- before/after reference where applicable
- evidence/reference id
- sourceContext

Activity Ledger는 원본 계약/전자서명 데이터의 복제 Master가 아니다.

## Projection Rules

Customer360:
- 최근 계약/전자서명 Activity 요약
- 원본 Contract Detail 진입
- 상태/문서 결과 표시

TODAY:
- 서명 대기
- 실패 확인
- 만료/후속 확인
- reconciliation 필요 업무

TODAY 완료가 Contract/e-sign Source를 자동 변경하지 않는다.

## Rules

1. e-sign document complete만으로 Contract 전체 완료 금지.
2. 실패/재시도 History 삭제 금지.
3. Activity는 append-only.
4. Source correction은 새 Activity로 남긴다.
5. Customer360에서 원본 상태 직접 변경 금지.
6. Provider Credential/Production Binding은 HOLD.

## Acceptance

- AC-CAL-01 계약 생성/변경이 Customer360 Activity에 나타난다.
- AC-CAL-02 전자서명 실패도 Activity에 남는다.
- AC-CAL-03 e-sign complete가 Contract automatic close를 발생시키지 않는다.
- AC-CAL-04 TODAY follow-up은 Source reference를 포함한다.
- AC-CAL-05 Customer360→Contract/e-sign Source→Return Context가 유지된다.
- AC-CAL-06 과거 Activity를 수정/삭제하여 현재 상태를 맞추지 않는다.

`New Product Meaning Created = 0`
