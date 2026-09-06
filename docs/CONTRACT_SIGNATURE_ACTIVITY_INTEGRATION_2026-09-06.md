# [OC-CONTRACT] BASELINE / CURRENT / 계약·전자서명 Activity 통합 기준 [2026-09-06]

## 목적
Current OC의 계약/eformsign 자산을 v2 Canonical Customer360 / Activity Ledger 흐름에 연결하는 기준을 고정한다.

## Current evidence
Current source에는 다음 자산이 존재한다.
- Contract CRUD / Activity / Comment / Attachment
- ContractSignatureSubmission
- ContractDocumentRule
- EformsignTemplateBinding
- ContractSignatureDocument
- 문서별 전송/서명 상태
- 선택 Optional 문서
- eformsign webhook

## Canonical boundary
1. Contract가 Source Transaction Owner다.
2. 전자서명 Provider는 Source Adapter다.
3. Customer360은 계약/서명 원본을 직접 소유하지 않는다.
4. Customer360에는 Activity Ledger Projection으로만 반영한다.
5. TODAY는 필요한 후속업무만 Projection한다.
6. Provider credential / production binding은 HOLD다.

## Logical events
- CONTRACT_CREATED
- CONTRACT_UPDATED
- CONTRACT_SENT_FOR_SIGNATURE
- SIGNATURE_DOCUMENT_SELECTED
- SIGNATURE_SUBMITTED
- SIGNATURE_PARTIAL
- SIGNATURE_COMPLETED
- SIGNATURE_FAILED
- SIGNATURE_RECONCILIATION_REQUIRED
- CONTRACT_CANCELLED

## Customer360 activity minimum
- occurredAt
- actorRef
- customerRef
- contractRef
- sourceDomain = CONTRACT
- sourceTransactionRef
- activityType
- summary
- resultStatus

## Return Contract
- Customer360 → Contract Detail → 처리 → 동일 Customer Context Return
- TODAY → Contract Task → 처리 → TODAY Return Context 유지

## Reuse decision
- Contract CRUD/History = REUSE/MODIFY
- eformsign document/config/submission = REUSE/MODIFY
- Customer360 Activity 연결 = NEW logical integration
- Production eformsign binding = HOLD

## 금지
- Provider callback 결과를 곧바로 Customer Master 상태로 덮어쓰기 금지
- 전자서명 완료를 계약 전체 완료와 자동 동치 처리 금지
- Credential/Production endpoint 신규 연결 금지

New Product Meaning Created = 0
