# [OC-OPS] TEST / CURRENT / Inventory·Supply Projection Acceptance [2026-09-06]

## 범위
PCS-104 택배·수발주 / PCS-106 재고 Source Transaction을 TODAY와 Customer360에 Projection하는 Logical 기준.

## Acceptance Cases

1. Purchase Order가 Source Transaction Owner다.
2. Shipment가 배송 상태 Source Owner다.
3. Inventory가 Stock/Serial Source Owner다.
4. TODAY가 Purchase Order 원본 상태를 직접 수정하지 않는다.
5. TODAY가 Shipment 원본 상태를 직접 수정하지 않는다.
6. TODAY가 Inventory 원본 수량을 직접 수정하지 않는다.
7. Customer360이 Inventory 원본을 소유하지 않는다.
8. 관련 Customer/Store가 있는 업무만 Customer360 Activity에 Projection한다.
9. PO 생성/수정 Activity는 sourceTransactionRef를 가진다.
10. Shipment 생성/상태변경 Activity는 shipmentRef를 가진다.
11. Serial/Asset 관련 업무는 Asset/Serial 참조를 보존한다.
12. Stock adjustment는 이유/Actor/시간을 보존한다.
13. Reservation/Allocation은 Source Domain에서 처리한다.
14. Shortage는 Source Domain 결과를 TODAY 후속업무로 Projection할 수 있다.
15. Transfer는 출발/도착/수량 Context를 보존한다.
16. TODAY 완료는 Source에서 확인된 결과에 기반한다.
17. Customer360 → 수발주 상세 → Return Context 유지.
18. TODAY → 물류/재고 상세 → TODAY Return Context 유지.
19. Logen Runtime/Credential을 연결하지 않는다.
20. Current Physical Inventory Schema를 v2 Schema로 자동 승계하지 않는다.
21. Prisma Migration을 생성하지 않는다.
22. Production Provider Binding을 생성하지 않는다.

## Current reuse guidance
- PurchaseOrder / Shipment UI·API pattern: REUSE/MODIFY
- Inventory / Serial / Transfer UI·API pattern: REUSE/MODIFY
- TODAY/Customer360 Projection layer: NEW logical integration
- Physical migration/provider: HOLD

New Product Meaning Created = 0
