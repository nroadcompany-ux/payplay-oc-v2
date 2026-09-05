# [OC] BASELINE / CURRENT / PayPlay Visual Language v2 적용 기준 [2026-09-05]

## Canonical Source

- Notion: `[PP-DS] BASELINE / CURRENT / PayPlay Product UI Design Guide · 페이플레이 제품 UI 디자인 가이드 [2026-09-05]`
- Official Figma: `https://www.figma.com/design/Zw73ifeAhdK4fCTUNkp9qG?node-id=1-9`
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
- `orange/400`: `#F07200`
- Spacing: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`
- Radius: `8 / 12 / 16 / 20 / 24 / full`

## OC Runtime Grammar

1. White Canvas가 기본 Page Surface다.
2. OC는 Clean & Dense이지만 Visual Grammar는 전 PayPlay Product와 동일하다.
3. Card는 독립 Object / 사용자가 하나의 묶음으로 인식해야 하는 Object / Clickable Unit일 때만 사용한다.
4. 단순 숫자 요약, Label + Value, 최근 활동, 제목 + 설명, 단순 도움말은 Card로 감싸지 않는다.
5. Orange는 Brand / Primary Action / Selection / Important Highlight에만 사용한다.
6. Semantic Color는 Icon / Badge / Small Alert / Thin Border / Short Status Label에만 사용한다.
7. 상태가 달라도 Page Canvas와 Layout Grammar를 바꾸지 않는다.
8. Primary CTA는 Orange Filled, 기본 화면당 1개를 원칙으로 한다.
9. Orange400 + White Normal Text 사용 금지. Orange CTA Text는 contrast-safe dark token을 사용한다.
10. Retry를 Destructive Red Filled로 표현하지 않는다.
11. Normal Text Contrast 4.5:1, Large Text 3:1 이상.
12. Desktop Action Target 32x32 이상, Keyboard Focus 명확히 표현한다.

## Implementation Mapping

CSS variables in `frontend/oc/src/styles.css` are the runtime mapping for the Current DS tokens.

Current Pilot:
- `PCI-101 + PCS-101` Home/TODAY
- `PST-301` Customer360

Pilot가 Node QA를 통과한 후 동일 Family Grammar를 Sales / Service / Operations / Settings에 확산한다.

## HOLD / Product Meaning Guard

Design cleanup must never:
- lift PMG / PSET-106 HOLD,
- create physical DB schema,
- bind providers or production credentials,
- change Customer360 / TODAY / Activity Ledger ownership,
- merge VS completion with A/S Case Close,
- invent new Product Meaning.

`New Product Meaning Created = 0`
