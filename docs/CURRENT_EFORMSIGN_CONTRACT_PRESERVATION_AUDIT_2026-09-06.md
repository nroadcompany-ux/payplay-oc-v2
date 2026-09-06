# [OC] EVIDENCE / CURRENT / eformsign & Contract Preservation Audit [2026-09-06]

## 목적
Current OC의 전자서명·계약 자산을 v2에서 손실 없이 보존하되 Provider/Production Binding HOLD를 유지한다.

## Current source evidence
Frontend:
- `features/contract-signature/*`
- `entities/contract-signature/*`
- `pages/contract-signature-config/*`
- Contract detail/editor + signature panel

Backend:
- ContractSignatureSubmission
- ContractSignatureDocument
- ContractDocumentRule
- EformsignTemplateBinding
- Contract signature readiness
- eformsign auth/document/template adapters
- test signature provider adapter

## Confirmed current capabilities
- 계약별 전자서명 준비상태 조회
- 발송 문서 계획 및 필수/선택 문서 구분
- 선택 Optional 문서 제출
- 문서 계획 fingerprint 검증
- 서명 Submission 이력
- 문서별 상태/실패정보
- Draft 복귀
- Reconciliation
- 서명 문서 다운로드
- 전자서명 문서 Rule 설정
- eformsign Template Binding
- Field Mapping
- 발송 준비 점검

Decision: **REUSE / MODIFY**.

## Canonical preservation rule
1. Contract 기본 CRUD/History/Attachment/Comment 자산 보존
2. 전자서명 문서 Rule/Template/Mapping 기능 손실 금지
3. 견적→계약 Handoff와 전자서명은 별도 단계로 유지
4. Customer360에 계약/전자서명 활동 이력 연결
5. 현재 Provider 상태값을 v2 Product Meaning으로 과확장하지 않는다

## HOLD
- eformsign Production Credential
- Provider Production Binding
- 실제 Production Webhook Cutover
- Provider 장애/재처리 SLA 신규 정책
- Physical Shared Customer/Merchant Binding

Current eformsign 코드는 **Provider adapter/reference source로 재사용 가능**하지만 Production 연결은 별도 Gate 전까지 금지한다.

New Product Meaning Created = 0
