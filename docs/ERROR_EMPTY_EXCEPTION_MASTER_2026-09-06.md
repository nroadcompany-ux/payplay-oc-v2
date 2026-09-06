# [OC] BASELINE / CURRENT / Error·Empty·Exception Master Matrix — 오류·빈상태·예외 통합표 [2026-09-06]

## 목적
개발 전 대표 Domain의 Error / Empty / Exception / Retry / Return 규칙을 한 기준으로 고정한다.

| Domain | Empty | Error | Exception | Required Recovery/Return |
|---|---|---|---|---|
| 업무 홈/TODAY | 업무 없음 | Projection 조회 실패 | Source 삭제/권한상실 | Empty 설명, Retry, Source 미존재 표시 |
| 신규유입/가망 | Queue 없음 | 저장/조회 실패 | 중복 Customer 후보 | 중복 Master 생성 금지, 수동 확인 |
| TM/방문영업 | 일정 없음 | 변경 실패 | 부재/거부/취소 | History 보존, Return Context 유지 |
| 견적 | 상품/고객 없음 | PDF/전송 실패 | 가격/수수료 미확정 | Quote 보존, 임의 계산 금지, Retry |
| 계약/e-sign | 문서 없음 | Provider/Submission 실패 | 일부 문서 완료/재조정 필요 | 실패 Trace, 계약 자동완료 금지 |
| Customer360 | Activity 없음 | 통합조회 실패 | Source 일부 inaccessible | Partial rendering, Source link 상태 표시 |
| A/S | Case 없음 | 저장/배정 실패 | 원격처리 불가 | Processing Note 보존, VS Handoff 가능 |
| VS | Evidence 없음 | 업로드/저장 실패 | 고객부재/부분완료/재방문 | Verified Complete 차단, 이유/History 보존 |
| 발주/배송 | 주문/배송 없음 | 상태조회 실패 | 부족/부분입고/반송 | Source 상태 보존, Follow-up 생성 |
| 재고 | 재고 없음 | 조회/조정 실패 | Serial 불일치/부족 | 임의 수량 보정 금지, 확인필요 |
| 미수금 | 대상 없음 | 조회/기록 실패 | 일부입금/금액불일치 | 완료 금지, 확인필요, 후속일 유지 |
| 거래처 | 결과 없음 | 저장 실패 | 중복 사업자/Inactive | 중복 Master 방지, History 보존 |
| Teamplay | 구성원 없음 | 조회/수정 실패 | 민감정보 접근거부 | 최소정보/권한거부 처리 |
| Permission | 정책 없음 | 저장 실패 | 직접 URL/Row/Field/Action deny | Default Deny, Audit 유지 |
| 메뉴/설정 | 설정 없음 | 변경 실패 | HOLD 메뉴 활성화 시도 | Canonical ID 유지, HOLD 우회 차단 |

## 공통 Rule
1. Error가 Source Transaction을 삭제하거나 자동 완료시키지 않는다.
2. Empty와 Error를 동일 상태로 표현하지 않는다.
3. Retry는 Destructive Action이 아니다.
4. 실패한 변경은 이전 정상 상태를 유지한다.
5. Source/Return Context가 있는 화면은 실패 후에도 Return을 제공한다.
6. Permission denied는 데이터 없음으로 위장하지 않는다. 단 민감정보 존재 여부를 노출하지 않는 정책이 우선할 수 있다.
7. Partial success는 완료로 승격하지 않는다.
8. Provider failure가 Domain Source Truth를 임의 변경하지 않는다.
9. HOLD/미확정 정책은 Error fallback으로 임의 실행하지 않는다.
10. Error/Exception은 필요 시 Activity/Audit에 추적 가능해야 한다.

## Prototype 필수 상태
P-01~P-07 전체에서 최소한 다음을 대표 검증한다.
- Empty
- Error
- Permission denied
- Confirm/Cancel
- Back/Return
- Retry
- Partial/Revisit where applicable

Verdict: **PLANNING ERROR/EMPTY/EXCEPTION BASELINE COMPLETE**

`New Product Meaning Created = 0`
