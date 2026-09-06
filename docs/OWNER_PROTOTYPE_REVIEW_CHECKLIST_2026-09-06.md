# [OC-PROTOTYPE] GATE / WORKING / Owner Prototype Review Checklist — 대표 검수 체크 [2026-09-06]

## 검수 목적
성재님이 코드 개발 전 대표 업무 Flow가 실제 운영 흐름에 맞는지만 확인한다. 픽셀 단위 디자인 확정이 아니라 **업무 의미 / 찾기 쉬움 / Source-Return / 예외 처리**를 확인한다.

## 검수 시작
Figma: https://www.figma.com/design/SkArbeMMTWzUFP7eEawBis

### P-01 업무 홈 / TODAY
Start: `2:2`
- [ ] 오늘 해야 할 일이 한눈에 보인다.
- [ ] 업무 카드를 눌러 Source Detail로 이동하는 것이 자연스럽다.
- [ ] Source에서 돌아올 위치가 명확하다.

### P-02 고객360 / A/S / VS
Start: `2:34`
- [ ] 고객360에서 고객 전체 맥락을 파악할 수 있다.
- [ ] A/S 접수 → CS 진단 → VS 인계가 자연스럽다.
- [ ] What we know / tried / need가 충분하다.
- [ ] VS Evidence 완료와 A/S Case Close가 분리되어 이해된다.

### P-03 영업 / 견적 / 계약
Start: `10:182`
- [ ] 신규유입/가망/TM/방문 흐름이 자연스럽다.
- [ ] 견적→계약 전환 위치가 이해된다.
- [ ] 자동 상태전이보다 운영자 수동 판단 중심이 맞다.

### P-04 계약 / 전자서명
Start: `43:2`
- [ ] 계약별 발송 문서 선택이 이해된다.
- [ ] 필수/선택 문서 구분이 충분하다.
- [ ] 전자서명 완료와 계약 전체 완료가 다르다는 것이 명확하다.

### P-05 수발주 / 배송 / 재고
Start: `10:243`
- [ ] 발주/배송/재고의 Source가 구분된다.
- [ ] Customer360/TODAY는 업무 요약/Projection이라는 것이 이해된다.

### P-06 Teamplay / Permission
Start: `2:172`
- [ ] Menu / Row / Field / Action 4축이 이해된다.
- [ ] 권한 거부/마스킹/감사 이력 동작이 자연스럽다.

### P-07 Common Shell
Start: `43:77`
- [ ] 1차 6대 카테고리가 자연스럽다.
- [ ] 2차 메뉴가 현재 카테고리에 맞게 보인다.
- [ ] HEADER SHALL (상단바)의 Context/Search/날짜/시간/User가 충분하다.
- [ ] Loading/Empty/Error/Permission Denied 구분이 이해된다.

## Owner 반환 형식
아래 3가지만 주면 된다.

- `PASS`: 그대로 진행 가능한 Flow
- `수정`: 바꿔야 할 화면/문구/순서
- `추가 확인`: 실제 운영 담당자 확인이 필요한 부분

## Gate Rule
모든 Material 수정 반영 후 Prototype Gate를 Final PASS로 바꾸고 Final Developer Handoff PASS 후 Claude Code 개발을 재개한다.

`New Product Meaning Created = 0`
