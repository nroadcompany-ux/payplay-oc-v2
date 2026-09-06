# [OC] BASELINE / CURRENT / PayPlay Visual Language v2 적용 기준 [2026-09-05]

## Canonical Source

- Notion: `[PP-DS] BASELINE / CURRENT / PayPlay Product UI Design Guide · 페이플레이 제품 UI 디자인 가이드 [2026-09-05]`
- Notion URL: `https://app.notion.com/p/PP-DS-BASELINE-CURRENT-PayPlay-Product-UI-Design-Guide-UI-2026-09-05-39b53327fb8681279850f4b0ea2dca49`
- Official Design System Figma: `https://www.figma.com/design/Zw73ifeAhdK4fCTUNkp9qG`
- OC Figma: `https://www.figma.com/design/SkArbeMMTWzUFP7eEawBis`
- Current Visual Language: **v2 only**
- OC Variant: **Clean & Dense**

## Source Boundary

- Figma = Visual Source
- Notion Policy / Rule / Flow / AC = Product Meaning Source
- Figma SAMPLE / POLICY CANDIDATE = hardcode 금지
- Legacy / 과거 P0/P1/P2 Visual = Current 디자인 기준으로 사용 금지
- Logic / Flow / Policy / Permission은 기존 Source에서 유지하고 Visual Presentation만 v2 적용

## Current Tokens

- `neutral/0`: `#FFFFFF`
- `neutral/50`: `#F7F7F7`
- `neutral/100`: `#EBEBEB`
- `neutral/500`: `#666666`
- `neutral/600`: `#444444`
- `neutral/950`: `#080808`
- `primary/orange`: **`#FF6B00`**
- Spacing: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`
- Radius: `8 / 12 / 16 / 20 / 24 / full`

> `#F07200`은 이전 Candidate/Legacy visual 값으로 취급한다. 신규 Current 구현에서는 사용하지 않는다.

## OC Common App Shell — CURRENT

모든 Current OC Desktop 화면은 아래 공통 구조를 사용한다.

`Primary Sidebar → Secondary Sidebar → HEADER SHALL (상단바) → Page Content`

### Primary Sidebar

- Canonical 업무영역 전환용 1차 Navigation
- Category Source는 `contracts/menu-registry.json`
- 임의 Category 생성 금지
- 경영관리(`management`)는 현재 HOLD이며 구현 Surface로 승격하지 않는다.

### Secondary Sidebar

- 선택된 Canonical Category의 하위 Menu
- Canonical Menu ID와 Owner를 유지한다.
- Display Name / Order / Visibility만 설정으로 바뀔 수 있다.
- Canonical ID / Route Owner / Data Owner는 변경 불가다.

### HEADER SHALL (상단바)

최소 구성:
- 현재 Context / Breadcrumb
- Search
- 현재 날짜
- 현재 시간
- User / Operator Area

HEADER SHALL은 화면별 업무 Source를 소유하지 않는 공통 Navigation/Context Surface다.

## OC Runtime Grammar

1. White Canvas가 기본 Page Surface다.
2. OC는 Clean & Dense이지만 Visual Grammar는 전 PayPlay Product와 동일하다.
3. Card는 독립 Object / 사용자가 하나의 묶음으로 인식해야 하는 Object / Clickable Unit일 때만 사용한다.
4. 단순 숫자 요약, Label + Value, 최근 활동, 제목 + 설명, 단순 도움말은 Card로 감싸지 않는다.
5. Orange는 Brand / Primary Action / Selection / Important Highlight에만 사용한다.
6. Semantic Color는 Icon / Badge / Small Alert / Thin Border / Short Status Label에만 사용한다.
7. 상태가 달라도 Page Canvas와 Layout Grammar를 바꾸지 않는다.
8. Primary CTA는 Orange Filled, 기본 화면당 1개를 원칙으로 한다.
9. `#FF6B00` CTA의 Text는 contrast-safe dark token을 사용한다.
10. Retry를 Destructive Red Filled로 표현하지 않는다.
11. Normal Text Contrast 4.5:1, Large Text 3:1 이상.
12. Desktop Action Target 32x32 이상, Keyboard Focus 명확히 표현한다.
13. 구획 우선순위는 `Whitespace → Typography → Alignment → 최소 Divider`다.
14. 회색 Section/Card Background를 레이아웃 구분 목적으로 남발하지 않는다.
15. 얇은 Neutral Border는 독립 Object / Click Unit에 한정한다. 큰 Section은 가능한 Bottom Divider를 사용한다.

## Implementation Mapping

CSS variables in `frontend/oc/src/styles.css` are the runtime mapping for Current DS tokens.

Current Visual Pilot:
- `PCI-101 + PCS-101` 업무 홈 · TODAY — APPROVED FOR FAMILY SPREAD
- `PST-301` 고객360 — APPROVED FOR FAMILY SPREAD

Pilot 적용 내용:
- 2단 Sidebar
- HEADER SHALL (상단바)
- 날짜 / 시간
- White Canvas
- `#FF6B00`
- 얇은 Neutral Border / Divider
- Product Meaning 변경 없음

이 Grammar를 Sales / Service / Operations / Settings / Teamplay Family에 확산한다.

## HOLD / Product Meaning Guard

Design cleanup must never:
- lift PMG / PSET-106 HOLD,
- create physical DB schema,
- bind providers or production credentials,
- change Customer360 / TODAY / Activity Ledger ownership,
- merge VS completion with A/S Case Close,
- invent new Product Meaning.

`New Product Meaning Created = 0`
