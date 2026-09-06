# [OC] EVIDENCE / CURRENT / Current Component Reuse Inventory [2026-09-06]

## 목적
`nroad-ecosystem/payplay` Source Archive의 실제 OC 공용 UI/Feature 자산을 v2 구현에 선택 재사용하기 위한 목록이다.

## High Reuse — 구조/행동 재사용 우선
- `shared/ui/data-table/DataTable.tsx`
- `shared/ui/pagination/Pagination.tsx`
- `shared/ui/dialog/Dialog.tsx`
- `shared/ui/dialog/DialogActions.tsx`
- `shared/ui/confirm/ConfirmDialog.tsx`
- `shared/ui/form-field/*`
- `shared/ui/skeleton/*`
- `shared/lib/usePageFormGuard.ts`
- React Query entity query pattern
- Axios API client pattern
- List → Detail → Dialog interaction pattern
- Loading / Empty / Error / Confirm behavior

Decision: **REUSE** for behavior/interaction skeleton.

## Modify — Visual Language v2 적용 필요
- Store/Lead/Contract management tables
- Customer Support request list/detail
- Inventory / Purchase Order / Shipment dialogs
- Product/SKU forms
- User/Admin forms

Decision: **MODIFY**.

적용 규칙:
- White Canvas
- 2단 Sidebar + HEADER SHALL (상단바)
- Primary Orange `#FF6B00`
- Gray filled Card/Section 남발 금지
- 독립 Object/Click Unit에만 얇은 Neutral Border
- 기존 Current Sidebar/Nav CSS는 재사용 금지

## Do not copy directly
- Current Sidebar IA
- Current role-only permission UX
- Store 중심 Customer meaning
- Security/System admin surface
- Production provider/credential settings

## 개발 적용 원칙
새 UI primitive를 중복 구현하기 전에 Current 공용 Component를 먼저 검토한다. 단, Canonical Meaning/IA/Permission/Visual은 v2 Owner Source가 우선한다.

New Product Meaning Created = 0
