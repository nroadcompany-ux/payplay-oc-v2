# [OC-UI] GUIDE / CURRENT / Current Component → Visual Language v2 Wrapping [2026-09-06]

## 목적
Current OC의 검증된 공용 Component를 버리지 않고 PayPlay Visual Language v2에 맞게 Wrapping하는 기준을 고정한다.

## 재사용 우선 Component
- DataTable
- Pagination
- Dialog
- ConfirmDialog
- FormField
- Skeleton
- Loading / Empty / Error state
- Page Form Guard

## 재사용 원칙
Logic / Accessibility / Interaction / Validation은 가능한 한 재사용한다.

Visual은 Current UI를 그대로 복사하지 않고 v2 Token으로 교체한다.

## Visual Language v2 Wrapper Rule

### Canvas
- White Canvas
- Section gray fill 남발 금지

### Primary
- Orange `#FF6B00`
- Primary Action / Selection에만 사용

### Container
Card 허용:
- 독립 Object
- 클릭 Unit
- 별도 경계가 실제 의미를 가지는 Dialog/Object

단순 Section은 Card로 감싸지 않는다.

### Separation priority
1. Whitespace
2. Typography
3. Alignment
4. Thin Neutral Divider / Border

### Border
- 1px Neutral Gray 계열
- 큰 Section 전체 테두리보다 필요한 Edge/Divider 우선

### Semantic
Green / Red / Amber는:
- 상태 Icon
- 상태 Label
- 작은 Feedback
에만 제한한다.

### Header / Navigation
모든 Page는 공통:
- 1차 Sidebar
- 2차 Sidebar
- HEADER SHALL (상단바)
- Page Content

HEADER SHALL 최소:
- Context/Breadcrumb
- Search
- 날짜
- HH:mm 현재시간
- User/Operator

## Component별 적용

### DataTable
REUSE:
- sorting/filter/pagination interaction
- row selection
- keyboard/accessibility

MODIFY:
- header background는 White 우선
- row divider 최소화
- selected row만 local accent
- dense spacing

### Dialog / ConfirmDialog
REUSE:
- focus trap
- close/confirm interaction
- destructive confirmation behavior

MODIFY:
- Orange는 Primary confirm에만
- Destructive는 semantic red local use
- 과도한 shadow/color surface 금지

### FormField
REUSE:
- label/error/validation logic

MODIFY:
- Neutral border
- focus는 Orange local accent
- error는 red text/icon 중심

### Empty / Error / Loading
REUSE:
- state switching logic

MODIFY:
- 큰 colored panel 금지
- icon + typography + whitespace 중심

## Figma↔Code QA
각 Pilot/Page는 다음을 확인한다.
- Shell 일치
- Primary Orange 일치
- Gray surface 최소화
- Card 남발 없음
- State semantic local use
- Logic/Flow/Rule/AC 변경 없음

## 금지
- Current Sidebar IA 복사
- Current gray-heavy surface 복사
- Legacy role permission을 UI 재사용 이유로 그대로 승계
- Product Meaning 변경

New Product Meaning Created = 0
