# [OC] EVIDENCE / CURRENT / Current OC Source Recovery Delta [2026-09-06]

## 목적

Owner가 제공한 `nroad-ecosystem/payplay` 계열 Source Archive를 기준으로 현재 OC 코드 자산을 v2 Canonical Scope에 대조한다.

Primary decision vocabulary는 `REUSE / MODIFY / NEW / HOLD / CONFLICT`만 사용한다.

## 1. Current source identity

확인된 Source 구조:

- root workspace: `payplay`
- OC frontend: `frontend/oc`
- backend: `backend`
- database schema: `backend/prisma/schema.prisma`
- deployment: `.github/workflows/cd.yml`, `deploy/production/*`, `docs/deployment/*`
- OC production domain: `https://oc.payplay.kr`
- API production domain: `https://api.payplay.kr`

## 2. Current OC Route Inventory

Current React route에서 확인된 주요 화면:

- `/dashboard`
- `/notice/*`
- `/consultation-requests`
- `/consultation-requests/:requestId`
- `/customer-requests`
- `/customer-requests/:requestId`
- `/customer-on`
- `/customer-on/:leadId`
- `/contract`
- `/contract/new`
- `/contract/:contractId`
- `/schedule`
- `/salelog`
- `/fulfillment`
- `/inventory`
- `/purchase-orders`
- `/shipments`
- `/products`
- `/products/:productId`
- `/skus`
- `/skus/:skuId`
- `/users`
- `/security`
- `/contract-signature-config`
- `/my-page`

## 3. Current backend capability inventory

NestJS module에서 확인된 영역:

- authentication
- employee
- notice
- consultation-request
- lead
- contract
- customer-support
- fulfillment
- inventory
- product / SKU
- store
- notification
- health

주요 endpoint family도 실제 존재한다.

예:

- `/api/v1/leads`
- `/api/v1/lead-schedules`
- `/api/v1/contracts`
- `/api/v1/customer-support/requests`
- `/api/v1/fulfillment-orders`
- `/api/v1/stores`
- `/api/v1/products`
- `/api/v1/skus`
- `/api/v1/employees`
- `/api/v1/auth/sessions`
- `/api/v1/notifications`
- `/api/v1/contract-signature-config`
- `/api/v1/webhooks/eformsign`

## 4. Current physical model evidence

Current Prisma schema에는 다음 계열 model이 존재한다.

- EmployeeAccount / EmployeeSession / EmployeeLoginHistory
- Notice / NoticeAttachment
- ConsultationRequest
- SalesLead / LeadActivity / LeadSchedule
- CustomerSupportRequest / ProcessingNote
- Contract / ContractActivity / ContractComment / ContractAttachment
- ContractSignatureSubmission / ContractDocumentRule / EformsignTemplateBinding / ContractSignatureDocument
- FulfillmentOrder / FulfillmentItem / FulfillmentRequirement
- Store / StoreActivity / StoreSale
- Product / Sku / ContractLineItem / ProductComponent
- InventoryLocation / StockBalance / StockTransaction / InventoryReservation / SerializedUnit
- Shipment / ShipmentItem
- InventoryAllocation / InventoryShortage
- PurchaseOrder / PurchaseOrderLine
- InventoryTransfer / InventoryTransferLine
- Notification

중요: **Current source에 Physical Model이 존재한다는 사실만으로 v2 Physical Schema를 승계 확정하지 않는다.** Shared Person/Merchant/IAM 및 Inventory/Supply physical decisions는 기존 HOLD를 유지한다.

## 5. v2 Canonical Mapping — 1차

| Canonical | Current source evidence | Decision | PM note |
|---|---|---|---|
| PCI-101 업무 홈 | `/dashboard` | MODIFY | 기존 Dashboard 자산을 업무 홈 Canonical 목적에 맞춰 재구성 |
| PCI-102 공지사항 | `/notice/*` + Notice module | REUSE | Current React/Nest 자산 강함 |
| PCI-201 거래처 관리 | Store/Product/Contract 관계 자산은 있으나 Vendor Master 동일성 미확정 | CONFLICT | Vendor Master Canonical은 별도 확인 필요 |
| PST-101 신규유입 | `/consultation-requests` | MODIFY | Unified Intake / 신규유입 Queue로 매핑 가능 |
| PST-102 가망고객 | `/customer-on` Lead | MODIFY | Lead 자산 재사용, Customer Master 중복 생성 금지 |
| PST-103 TM 영업 일정 | LeadSchedule module + `/schedule` | MODIFY | 독립 공통 Calendar가 아닌 영업 일정 View로 제한 |
| PST-201 방문 영업 일정 | LeadSchedule / schedule 자산 | MODIFY | VS Assignment와 의미 분리 필요 |
| PST-301 고객360 | Store + timeline/activity 자산 | MODIFY | PST-301 Canonical Surface로 재구성; Store 자체를 Customer Master로 확정 금지 |
| PST-302 계약 심의 | Contract cancellation/termination + history | MODIFY | 최신 4유형 + History Rule 보강 필요 |
| PST-303 계약 만료 고객 | Contract source | MODIFY | 만료 기준일/기간 binding 별도 필요 |
| PST-401~402 견적 | Current source에서 직접 Quote route/module은 이번 1차 확인에서 미확정 | HOLD | 기존 Recovery와 함께 추가 검색 필요 |
| PCS-101 TODAY | `/dashboard` / schedule / notifications 자산 | MODIFY | Source Truth가 아닌 Projection으로 재구성 |
| PCS-102 VS 방문 | Fulfillment / schedule / store 자산 | MODIFY | Evidence/Verified Complete Rule 보강 필요 |
| PCS-103 A/S 접수 | `/customer-requests` + customer-support module | MODIFY | CS→VS Handoff 3-block 추가 필요 |
| PCS-104 택배·수발주 | `/purchase-orders` + `/shipments` | MODIFY | Logen Production Binding은 HOLD |
| PCS-105 결제·미수금 | StoreSale/Contract source 일부 | HOLD | Billing/Receivable exact entity/state 미확정 |
| PCS-106 재고관리 | `/inventory` + inventory module + physical models | MODIFY | Logical/UI 재사용 가능. v2 Physical Schema/Migration은 HOLD |
| PCS-190 CS도구 | CustomerSupport current + legacy tools 별도 | MODIFY | Cleaner/Recovery/Format endpoint 실행은 HOLD |
| PHR-101~108 팀플레이 | `/users`, `/my-page`, employee/auth module | MODIFY | Employee/Org Canonical로 재구성; PHR-106 생성 금지 |
| PSET-102 권한 설정 | nav access + employee access + security 자산 | MODIFY | Legacy permission 그대로 재사용 금지; v2 Row/Field/Action Policy 보강 |
| PSET-103 화면·메뉴 설정 | Current nav config 존재 | MODIFY | Canonical ID immutable Rule 적용 필요 |
| PSET-105 Audit/복구 | login history / activity pattern 일부 | MODIFY | Before/After + Recovery 공통 Audit 추가 필요 |
| PSET-106 System 설정 | `/security` 등 Current 자산 존재 | HOLD | 일반 관리자용 Current 구현 금지 |
| PMG | 일부 계약/지출/정산 계열 historical source 존재 가능 | HOLD | Current v2 PMG Proposal/HOLD 유지 |

## 6. Strong Reuse / Modify Candidates

### Strong current implementation evidence

- 공지사항
- 신규 상담 Intake
- Lead / Lead Schedule
- 계약 관리
- 고객지원 요청
- Fulfillment
- 재고
- 발주
- 배송
- 상품 / SKU
- Store
- 사용자 / 인증 / 보안
- 전자서명 문서 규칙 / eformsign 연동

이들은 **코드 존재 = Canonical Product Meaning 확정**이 아니다. v2 Owner Source에 맞춰 REUSE 또는 MODIFY한다.

## 7. Conflict / HOLD

아래는 Current source가 존재해도 그대로 승계하지 않는다.

- Current Sidebar / Navigation 구조
- Current Store 중심 Customer 구조
- Current employee/auth physical schema
- Current inventory physical schema
- Current security/admin surface
- Current eformsign provider binding
- Current production credentials
- Current deployment config
- Current common schedule semantics

Owner Current Decision과 v2 Canonical Rule이 우선한다.

## 8. Immediate development impact

Claude Code / v2 구현은 다음을 계속 진행할 수 있다.

- React/Vite common shell
- 2단 Sidebar
- HEADER SHALL (상단바)
- 업무 홈·TODAY Pilot
- 고객360 Pilot
- NestJS Logical/Mock API
- Existing current code selective reuse analysis
- UI/interaction/test/CI

계속 HOLD:

- DB migration
- Shared Person/Merchant/IAM physical
- Provider credential / production binding
- Inventory physical migration
- Logen production
- PMG
- PSET-106

## 9. Next Recovery Batch

1. Quote / 견적 Current source exact search
2. Vendor / 거래처 Master exact source search
3. Billing / Receivable Current source search
4. VS / A/S Evidence implementation search
5. Employee / Teamplay source mapping
6. Settings / Permission current-vs-v2 gap
7. eformsign / contract current capability preservation audit
8. Existing route → Canonical route migration table

New Product Meaning Created = 0
