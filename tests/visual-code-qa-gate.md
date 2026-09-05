# [OC] GATE / ACTIVE / Figma ↔ Code Visual QA Gate [2026-09-05]

## 목적

Claude Code 구현 결과가 Current Figma / Visual Language v2 / Canonical Product Meaning과 일치하는지 검수한다.

## A. Common Shell

- [ ] QA-VIS-001 1차 Sidebar 존재
- [ ] QA-VIS-002 2차 Sidebar 존재
- [ ] QA-VIS-003 HEADER SHALL (상단바) 존재
- [ ] QA-VIS-004 HEADER SHALL에 Context/Breadcrumb 존재
- [ ] QA-VIS-005 HEADER SHALL에 Search 존재
- [ ] QA-VIS-006 HEADER SHALL에 날짜 표시
- [ ] QA-VIS-007 HEADER SHALL에 현재시간 표시
- [ ] QA-VIS-008 HEADER SHALL에 User/Operator 영역 존재
- [ ] QA-VIS-009 Sidebar Category는 Canonical Menu Registry와 일치
- [ ] QA-VIS-010 Secondary Menu는 Canonical ID를 유지

## B. Visual Language v2

- [ ] QA-VIS-011 Page Canvas는 White
- [ ] QA-VIS-012 Primary Orange는 `#FF6B00`
- [ ] QA-VIS-013 이전 `#F07200` Current UI 사용 없음
- [ ] QA-VIS-014 회색 Section Background 남발 없음
- [ ] QA-VIS-015 독립 Object/Click Unit만 Neutral Border 사용
- [ ] QA-VIS-016 큰 Section은 Whitespace/Typography/Divider 중심
- [ ] QA-VIS-017 Orange는 Primary Action/Selection 중심
- [ ] QA-VIS-018 Semantic Green/Red/Amber는 상태 Label/Icon 수준
- [ ] QA-VIS-019 CTA Text Contrast 안전
- [ ] QA-VIS-020 Focus 표시 존재

## C. 업무 홈 · TODAY Pilot

- [ ] QA-TDY-001 PCI-101 / PCS-101 의미 유지
- [ ] QA-TDY-002 TODAY는 Work Projection으로 표시
- [ ] QA-TDY-003 Source Truth처럼 직접 수정하는 UI 없음
- [ ] QA-TDY-004 오늘/지연/보류/완료 Context 존재
- [ ] QA-TDY-005 내 업무/주의 필요/최근 완료 존재
- [ ] QA-TDY-006 Selected Work에 Customer/Source Context 존재
- [ ] QA-TDY-007 Source 진입 가능
- [ ] QA-TDY-008 Return Context 유지
- [ ] QA-TDY-009 VS 완료 Projection은 Verified Complete 기준
- [ ] QA-TDY-010 권한 없는 Action 노출 금지

## D. 고객360 Pilot

- [ ] QA-C360-001 PST-301 = Canonical Customer Surface 유지
- [ ] QA-C360-002 Customer Header 존재
- [ ] QA-C360-003 Store Context 표현
- [ ] QA-C360-004 최근 Activity 표현
- [ ] QA-C360-005 Attention / Next Action 표현
- [ ] QA-C360-006 A/S Source 진입
- [ ] QA-C360-007 Sales/Quote Source 진입
- [ ] QA-C360-008 Domain Action 이후 동일 Customer Context Return
- [ ] QA-C360-009 Activity Ledger를 Customer Master로 오인하는 UI 없음
- [ ] QA-C360-010 Restricted Finance Field 권한 처리 가능

## E. Product Meaning Guard

- [ ] QA-GRD-001 Canonical ID 변경 없음
- [ ] QA-GRD-002 Route Owner 변경 없음
- [ ] QA-GRD-003 Data Owner 변경 없음
- [ ] QA-GRD-004 신규 Customer Master 생성 없음
- [ ] QA-GRD-005 신규 Vendor Master 생성 없음
- [ ] QA-GRD-006 신규 Employee/Org Master 생성 없음
- [ ] QA-GRD-007 TODAY에서 Source Transaction 직접 Mutation 없음
- [ ] QA-GRD-008 VS Verified Complete와 A/S Case Close 분리
- [ ] QA-GRD-009 Sales State 자동전이 없음
- [ ] QA-GRD-010 Schedule 변경/취소 History 보존 구조 유지

## F. HOLD Guard

- [ ] QA-HOLD-001 Prisma Migration 없음
- [ ] QA-HOLD-002 Physical DB Schema 신규 확정 없음
- [ ] QA-HOLD-003 Provider Credential 없음
- [ ] QA-HOLD-004 Production Binding 없음
- [ ] QA-HOLD-005 Shared Person Physical 구현 없음
- [ ] QA-HOLD-006 Merchant Final Physical 구현 없음
- [ ] QA-HOLD-007 Shared IAM Physical 구현 없음
- [ ] QA-HOLD-008 PMG 개별 기능 구현 없음
- [ ] QA-HOLD-009 PSET-106 구현 없음
- [ ] QA-HOLD-010 PHR-106 생성 없음

## G. Build Gate

- [ ] QA-BLD-001 `pnpm-lock.yaml` 존재
- [ ] QA-BLD-002 `pnpm install` PASS
- [ ] QA-BLD-003 `pnpm typecheck` PASS
- [ ] QA-BLD-004 `pnpm build` PASS
- [ ] QA-BLD-005 Physical Binding Guard PASS
- [ ] QA-BLD-006 GitHub Actions CI PASS

## 완료 판정

- Visual QA: PASS / PASS WITH CORRECTION / FAIL
- Product Meaning: PASS / FAIL
- HOLD Guard: PASS / FAIL
- CI: PASS / FAIL
- Development Gate: GO / CONDITIONAL GO / HOLD

`New Product Meaning Created = 0`
