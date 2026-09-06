# [OC-SERVICE] TEST / CURRENT / CS→VS Interaction Acceptance [2026-09-06]

## 범위
PCS-103 A/S 접수 → PCS-102 VS 방문 → Customer360 Activity Return.

## Acceptance Cases

1. CS 접수 생성 시 원본 Case ID 유지.
2. CS가 방문 필요를 수동 판단하기 전 VS 일정 자동 생성 금지.
3. VS Handoff에는 What we know가 존재해야 한다.
4. VS Handoff에는 What we tried가 존재해야 한다.
5. VS Handoff에는 What we need가 존재해야 한다.
6. Remote impossible reason이 필요한 경우 누락 차단.
7. VS Schedule 생성 시 원본 A/S Case 참조 유지.
8. 일정 변경 시 기존 Schedule History 삭제 금지.
9. 고객 부재 시 Case/일정 삭제 금지.
10. Partial Complete는 완료 수량과 잔여작업을 함께 기록.
11. Revisit는 재방문 이유를 요구.
12. 필수 사진 누락 시 Verified Complete 금지.
13. Serial/Asset 누락 시 요구 대상 작업은 Verified Complete 금지.
14. Test Result 누락 시 Verified Complete 금지.
15. 고객 확인이 필수인 작업은 고객확인 누락 시 Verified Complete 금지.
16. Evidence 충족 시에만 Verified Complete 허용.
17. VS Verified Complete가 A/S Case Close를 자동 실행하지 않음.
18. A/S Case Close는 별도 Action이어야 함.
19. VS Result는 Activity Ledger를 통해 Customer360에 표시.
20. TODAY 완료 Projection은 Verified Complete를 기준으로 함.
21. Customer360 → A/S → VS → Customer360 Return Context 유지.
22. TODAY → A/S/VS → TODAY Return Context 유지.
23. 이동중 State를 신규 구현하지 않음.
24. Offline Mode를 신규 구현하지 않음.
25. 기사 중복배정 Exact Rule을 임의 생성하지 않음.

## Gate
- Logical/Mock: GO
- Persistence: HOLD unless separately authorized
- Physical IAM/DB: HOLD

New Product Meaning Created = 0
