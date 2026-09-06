# [OC-OPS] EVIDENCE / CURRENT / Inventory·Supply Reuse Recovery [2026-09-06]

## 목적
Owner 제공 Current Source Archive의 재고/발주/배송 자산을 v2 Canonical `PCS-104 / PCS-106` 기준과 대조한다.

## Current Source — 확인된 Physical/Domain 자산
Current backend에는 다음 domain/model이 실제 존재한다.

- InventoryLocation
- StockBalance
- StockTransaction
- InventoryReservation
- SerializedUnit
- Shipment / ShipmentItem
- InventoryAllocation
- InventoryShortage
- PurchaseOrder / PurchaseOrderLine
- InventoryTransfer / InventoryTransferLine

Current domain enum도 확인된다.
- PurchaseOrderStatus
- InventoryTransferStatus
- SerializedUnitStatus
- InventoryReservationStatus
- InventoryShortageStatus
- StockTransactionType / SourceType
- ShipmentStatus / DeliveryMethod
- InventoryAllocationStatus

또한 PurchaseOrder domain 테스트에는 주문 후 부분입고 → 최종입고와 과입고 차단, 부분입고 상태에서 취소 금지 등의 규칙이 존재한다.

## v2 Canonical

### PCS-104 택배 및 제품 수발주
- 고객·제조사 간 발송/수령/회수
- A/S Case 연결
- Serial/수량 연결
- 제조사 발송·회수
- 고객 발송/수령
- Logen Adapter 설계 가능, Production Binding HOLD

### PCS-106 재고관리
- 상품/SKU/Serial
- 입고/출고/보유/배정
- 수발주/설치/A/S와 연결
- Logical/Mock 허용
- Physical Schema/Migration은 기존 HOLD

## Reuse 판정

| Current Asset | Canonical Mapping | Decision | PM Note |
|---|---|---|---|
| PurchaseOrder / Line | PCS-104 발주/수발주 | REUSE | Domain rule 강함 |
| Shipment / Item | PCS-104 발송/수령 | REUSE | 고객/제조사 Context 보강 필요 |
| SerializedUnit | PCS-104/106 Serial | REUSE | Physical 승계는 별도 Gate |
| StockBalance | PCS-106 보유재고 | REUSE | Logical/UI 재사용 강함 |
| StockTransaction | PCS-106 입출고 History | REUSE | Source/Actor/Reason 정합 필요 |
| Reservation | PCS-106 배정 | MODIFY | 설치/AS/계약 Source Context 연결 보강 |
| Allocation | PCS-106 배정/할당 | MODIFY | Canonical 업무 Source와 정합 필요 |
| Shortage | PCS-106 부족재고 | MODIFY | TODAY/수발주 후속 Action 연계 검토 |
| InventoryTransfer | PCS-106 위치간 이동 | REUSE | v2 화면 구조는 재설계 |
| InventoryLocation | PCS-106 위치 | MODIFY | 센터/창고/기사 보유 등 Current 의미 확인 필요 |
| Current physical schema | v2 Physical DB | HOLD | 자동 Migration 금지 |

## Current Source의 강점
- 재고 수량
- Serial 단위
- 예약/할당
- 부족재고
- 발주
- 부분입고
- 배송
- 내부 이동

까지 이미 Domain으로 분리되어 있다.

따라서 새 OC v2에서 `PCS-104/106`을 처음부터 새로 설계할 이유는 적다.

## v2에서 반드시 보강할 것
1. Customer360 Context
2. A/S Case Context
3. VS Install/Visit Context
4. Contract/Fulfillment Source Ref
5. Return Context
6. 담당자/Action Projection to TODAY
7. 제조사 발송/회수 의미
8. 고객 발송/수령 의미
9. History 삭제 금지

## HOLD 유지
- Current Prisma model을 v2 Physical Schema로 자동 채택 금지
- Migration 실행 금지
- Logen Credential/Runtime 연결 금지
- Production Shipment Provider Binding 금지
- Shared Merchant/Person/IAM Physical 결정을 Inventory가 우회하여 확정 금지

## PM 판정
- PCS-104 = MODIFY, Core Domain은 강한 REUSE
- PCS-106 = MODIFY, Core Domain은 강한 REUSE
- Physical Migration = HOLD
- 신규 Product Meaning = 없음

New Product Meaning Created = 0
