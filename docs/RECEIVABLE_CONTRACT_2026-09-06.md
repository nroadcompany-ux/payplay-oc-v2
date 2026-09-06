# [OC-CUSTOMER] BASELINE / WORKING / Receivable Contract — 결제·미수금 관리 계약 [2026-09-06]

## Scope

Canonical: `PCS-105 결제 및 미수금 관리`.
Current source에는 Contract 금액조건과 StoreSale 자산은 있으나 Canonical Receivable Queue/Allocation 구조는 확인되지 않아 **MODIFY**다.

## Core Meaning

Receivable은 결제 Provider가 아니라 **가맹점별 미수/납입/후속조치 업무 관리 Surface**다.

## Logical Fields

- receivableId
- customer/store reference
- contract reference
- expectedAmount
- receivedAmount
- outstandingAmount
- dueDate
- status
- paymentCondition reference
- owner
- followUpAt
- followUpNote
- lastActivityAt
- sourceContext / returnContext

## Status

`예정 / 일부입금 / 미수 / 확인필요 / 완료 / 보류`

실제 금융/정산 Provider 상태와 동일 Entity로 간주하지 않는다.

## Actions

- 내역 확인
- 수납 사실 기록
- 일부입금 기록
- 미수 사유 기록
- 후속일 지정
- 보류
- 완료 확인
- Customer360 Return

## Rules

1. Contract는 계약금/월납입금/설치비 등 Commercial Source를 제공한다.
2. Receivable Queue는 업무 Projection/관리 Layer이며 원본 금융원장을 대체하지 않는다.
3. 실제 결제 Provider/은행/PG 연동은 HOLD.
4. 일부입금은 잔액과 History를 보존한다.
5. 완료는 확인된 수납근거 후 사용자 명시 Action.
6. Customer360에는 요약 + Activity만 표시한다.
7. TODAY에는 due/follow-up 업무만 Projection한다.

## Error / Exception

- 계약 참조 없음 → Manual review / 신규 원장 임의 생성 금지
- 금액 불일치 → 확인필요
- 일부입금 → 완료 처리 금지
- Due date 없음 → Follow-up 대상으로 별도 표시
- Provider 조회 실패 → 업무 기록 유지

## Acceptance

- AC-RCV-01 미수 잔액과 원금/입금액 관계가 보존된다.
- AC-RCV-02 일부입금이 자동 완료되지 않는다.
- AC-RCV-03 후속일은 TODAY에 Projection 가능하다.
- AC-RCV-04 Customer360은 Source Transaction을 직접 변경하지 않는다.
- AC-RCV-05 Provider/은행 연동 없이 Logical/Mock으로 검증 가능하다.
- AC-RCV-06 실제 정산/결제 원장과 Receivable 업무 Layer를 동일시하지 않는다.

Decision: `PCS-105 = MODIFY` / Real Payment·Settlement Provider = HOLD.

`New Product Meaning Created = 0`
