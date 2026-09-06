# [OC-SALES] BASELINE / WORKING / Quote Contract — 견적서 관리·상세 계약 [2026-09-06]

## Scope

Canonical: `PST-401 견적서 관리`, `PST-402 견적서 상세`.
Current source archive에서 독립 Quote implementation은 확인되지 않았으므로 Screen/Logical Contract는 **NEW**다.

## Core Flow

가망/영업 Source → 견적 생성 → 상품/가격/할인/수수료 Rule 확인 → 저장 → PDF/전송 → 상태 추적 → 계약 전환 → Source/Customer360 Return.

## Required Data

- quoteId
- customer/store reference
- salesperson/owner
- line items
- quantity
- unit/list/effective price
- discount reason
- commission policy reference
- subtotal/tax/total
- validity period
- note
- delivery/install condition
- status
- created/updated/sent timestamps
- sourceContext / returnContext

## Status

`작성중 / 발송대기 / 발송 / 확인 / 만료 / 계약전환 / 취소`

상태 자동전이는 금지한다. External provider acknowledgement가 있더라도 계약전환은 별도 사용자 Action이다.

## Actions

- 생성
- 수정
- 복제
- PDF 생성
- 전송
- 상태 변경
- 계약 전환
- 취소
- Source로 돌아가기

## Rules

1. Product / Commercial Policy Master = OC.
2. 내부 승인 Flow는 Current Quote 범위에서 제외.
3. 할인·수수료 Formula 미확정 값 임의 구현 금지.
4. 견적 → 계약 전환 시 견적 History 삭제 금지.
5. 계약 전환 후 견적 Snapshot 보존.
6. Provider / Message / e-sign binding은 HOLD.
7. Customer Master 별도 생성 금지; 기존 Customer360 참조.

## Error / Empty

- 고객 없음 → 생성 차단 + Source Return
- 상품 없음 → Empty + 상품 선택 안내
- 가격정책 미확정 → 저장 가능 여부는 Policy 상태에 따르되 임의 계산 금지
- 전송 실패 → Quote 상태 유지 + 실패 Trace
- 계약전환 실패 → 견적 상태 보존

## Acceptance

- AC-QTE-01 Source Context가 유지된다.
- AC-QTE-02 Line Item 합계가 Logical Contract와 일치한다.
- AC-QTE-03 할인 사유가 필요한 경우 누락 저장을 차단한다.
- AC-QTE-04 PDF/전송 실패가 견적 자체를 삭제하지 않는다.
- AC-QTE-05 계약전환은 사용자 명시 Action이다.
- AC-QTE-06 전환 후 견적 Snapshot과 History가 남는다.
- AC-QTE-07 Customer360에서 견적 Activity를 조회할 수 있다.
- AC-QTE-08 미확정 Formula/Provider를 구현하지 않는다.

Decision: `PST-401/402 = NEW (Logical/UI)` / Physical Pricing & Provider Binding = HOLD.

`New Product Meaning Created = 0`
