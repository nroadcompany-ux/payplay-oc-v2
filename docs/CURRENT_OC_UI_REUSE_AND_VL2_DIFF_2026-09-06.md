# [OC] REVIEW / CURRENT / Current UI Reuse + Visual Language v2 Diff [2026-09-06]

## 목적

Current `nroad-ecosystem/payplay` 계열 OC의 공용 UI 자산을 최대한 재사용하되, 최신 PayPlay Visual Language v2를 침범하지 않도록 **재사용 대상과 Visual 교정 대상을 분리**한다.

## 1. Current Shared UI Inventory

`frontend/oc/src/shared/ui`에서 확인된 공용 자산:

### Layout / Structure
- `PageHeader`
- `DetailPageLayout`
- `Section`
- `Divider`
- `Card`
- `Breadcrumb`
- `Tabs`
- `ListSection`
- `DefinitionList`
- `MetadataList`

### Table / List
- `DataTable`
- `FilterPanel`
- `Pagination`
- `ListState`
- `EmptyState`
- `EntityPageState`

### Form
- `TextField`
- `SelectField`
- `DateField`
- `CheckboxField`
- `TextArea`
- `Field`

### Action / Feedback
- `Button`
- `Dialog`
- `DialogActions`
- `ConfirmDialog`
- `InlineAlert`
- `Badge`
- `ToastStack`
- `Spinner`
- `Skeleton / PageSkeletons`
- `NetworkStatusBanner`

### Utility
- `Icon`
- `Text`
- `EditPageActions`

## 2. Reuse Decision

| Asset family | Decision | Rule |
|---|---|---|
| DataTable / Pagination | REUSE | Dense OC 업무화면에 적합. Visual token만 v2 적용 |
| FilterPanel | MODIFY | 회색 Surface/Card 남발 금지. White + Divider 중심 교정 |
| Form Fields | REUSE | 접근성/검증 자산 유지. Token/spacing만 v2 정합 |
| Dialog / Confirm | REUSE | Interaction pattern 유지 |
| Empty/Error/Loading | REUSE | State 의미 유지. Semantic color 최소화 |
| Breadcrumb | REUSE | HEADER SHALL Context와 중복되지 않도록 역할 정리 |
| PageHeader | MODIFY | HEADER SHALL과 Page Title hierarchy 분리 |
| Section | MODIFY | 기본 Gray/Card surface 사용 금지. Whitespace/Typography/Divider 중심 |
| Card | MODIFY | 독립 Object / Click Unit에서만 사용 |
| Tabs | MODIFY | Orange local selection만 사용, 과한 filled background 제거 |
| Badge | MODIFY | Semantic Green/Red/Amber는 상태 Label/Icon에만 최소 사용 |
| Skeleton | REUSE | 구조형 Loading 유지 |

## 3. Current Token Evidence

Current `tokens.css`에서 이미 맞는 부분:

- Primary Orange = `#FF6B00`
- White surface = `#FFFFFF`
- Neutral border = `#E5E8EB`
- spacing 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48
- compact control 36px / normal 44px
- radius / shadow / motion token 존재

즉 **색상 Token 자체를 처음부터 다시 만들 필요는 없다.**

## 4. Visual Language v2 Gap

### A. Canvas

Current global CSS는 body에 `surface-subtle` 배경을 사용한다.

v2 Current Rule:
- Page Canvas = White 중심
- 회색은 보조 텍스트 / Divider / Border 중심

Decision: **MODIFY**.

### B. Sidebar

Current source:
- 단일 Sidebar 약 240px
- 내부 Accordion 1/2Depth

v2:
- 1차 Sidebar + 2차 Sidebar
- Canonical Category와 하위 메뉴 분리
- White Canvas + 최소 Divider

Decision: **MODIFY**.

Current Sidebar component interaction/accessibility pattern은 참고 재사용하되 구조는 v2 Shell로 교체한다.

### C. HEADER SHALL (상단바)

Current Topbar:
- 날짜
- 사용자 Chip
- 모바일 메뉴 버튼

v2 HEADER SHALL:
- Context/Breadcrumb
- Search
- 날짜
- 현재시간
- User/Operator

Decision: **MODIFY**.

Current Topbar의 sticky / responsive / user pattern은 선택 재사용한다.

### D. Gray Surface

Current token/code에 다음 gray/soft surface가 많이 존재한다.

- `surface-subtle`
- `primary-soft`
- `info-soft`
- `warning-soft`
- `danger-soft`

v2에서는 배경 면적을 줄이고 Local State에만 사용한다.

Decision: **MODIFY**.

### E. Active Navigation

Current:
- Orange text
- Orange soft background
- Orange 3px indicator

v2:
- Orange는 Local Selection
- 전체 Gray/Orange 면 남발 금지

Decision: **MODIFY**.

Orange indicator는 재사용 가능하나 soft filled background는 Pilot QA 기준으로 최소화한다.

### F. Card

Current에는 범용 `Card`가 있다.

v2:
- Card는 독립 Object / Click Unit에서만 사용
- 단순 정보 구획을 Card로 만들지 않는다

Decision: **MODIFY**.

## 5. Important Token Conflict

Current token:
- `--pp-color-text-on-primary = #FFFFFF`

Pilot에서 사용하는 Orange CTA Text는 최신 Figma/Design Baseline과 최종 대조가 필요하다.

이 항목은 임의 변경하지 않고 Figma Pilot을 SSOT로 하여 Claude Code QA에서 확인한다.

## 6. Component Reuse Priority for v2

### Priority A — 바로 재사용

1. DataTable
2. Pagination
3. Form Fields
4. Dialog / Confirm
5. Empty / Error / Loading State
6. Toast
7. Skeleton
8. Icon

### Priority B — Visual Wrapper 수정 후 재사용

1. PageHeader
2. Section
3. FilterPanel
4. Tabs
5. Badge
6. Card
7. Breadcrumb

### Priority C — Shell은 신규 v2 구조

1. 1차 Sidebar
2. 2차 Sidebar
3. HEADER SHALL
4. Page Content Shell

Current Sidebar/Topbar를 그대로 복사하지 않는다.

## 7. Claude Code Rule

Claude Code는 Pilot 2화면 구현 시:

- Current source의 공용 컴포넌트 패턴을 참고/선택 재사용
- v2 Shell은 `payplay-oc-v2`의 Current Design Baseline 우선
- Current token에서 `#FF6B00`, neutral, spacing 등 유효 자산은 재사용
- Current gray surface density는 그대로 복사하지 않음
- Current Sidebar IA는 그대로 복사하지 않음
- Current Interaction/Accessibility 자산은 적극 재사용

## 8. QA

Figma ↔ Code QA 시 확인:

- White Canvas
- 2단 Sidebar
- HEADER SHALL
- 날짜/시간
- Canonical Menu
- `#FF6B00`
- Thin Neutral Divider
- Card 제한
- Gray Filled Section 제한
- Semantic Color 제한
- Focus/Keyboard
- 320px overflow / responsive behavior

New Product Meaning Created = 0
