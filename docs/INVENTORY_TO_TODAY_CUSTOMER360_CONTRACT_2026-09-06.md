# [OC] BASELINE / CURRENT / Inventory→TODAY→Customer360 Contract [2026-09-06]

## 목적
Current Inventory / PurchaseOrder / Shipment 자산을 PCS-104/106 Canonical Flow와 연결하되 TODAY와 Customer360의 Source/Projection 경계를 고정한다.

## Current source evidence
Current backend/frontend includes:
- InventoryLocation
- StockBalance
- StockTransaction
- SerializedUnit
- InventoryReservation
- InventoryAllocation
- InventoryShortage
- InventoryTransfer
- PurchaseOrder / Line
- Shipment / Item
- stock receive / adjust
- PO draft / order / cancel / line receipt
- shipment create / update / dispatch / in-transit / deliver / fail / retry / return

Decision: **MODIFY** with strong reuse.

## Source owner boundary
- PurchaseOrder / Shipment / Inventory = Source Transaction Owner
- TODAY = Work Projection only
- Customer360 = Customer relationship/history surface

TODAY가 재고/발주/배송 Source를 직접 mutate하지 않는다.

## Projection examples
TODAY may project:
- 오늘 발송 예정
- 입고 대기/처리 필요
- 재고 부족 Follow-up
- 고객 관련 회수/재발송 업무

Click → exact Source detail → command 실행 → Source result 기록 → Return Context 유지.

## Customer360 history
고객/매장과 직접 관련된 수발주·배송·Serial/Asset 처리 결과만 Activity Ledger를 통해 Customer360 이력으로 투영한다.

Inventory 전체 거래 로그를 Customer360 Master로 복제하지 않는다.

## Serial / Asset
- Current SerializedUnit 자산은 재사용 후보
- 고객 설치/A/S 연결 시 source reference를 유지
- Shared Merchant/Asset physical binding은 별도 Gate

## HOLD
- Current Physical Inventory schema를 v2 Schema로 자동 승계 금지
- DB Migration 금지
- Logen Production Binding 금지
- Provider credential 금지
- Physical Customer/Store/Asset final binding 금지

New Product Meaning Created = 0
