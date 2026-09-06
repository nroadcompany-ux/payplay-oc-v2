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

## 5. v2 Canonical Mapping — 2차 검증 반영

| Canonical | Current source evidence | Decision | PM note |
|---|---|---|---|
| PCI-101 업무 홈 | `/dashboard` | MODIFY | 기존 Dashboard 자산을 업무 홈 Canonical 목적에 맞춰 재구성 |
| PCI-102 공지사항 | `/notice/*` + Notice module | REUSE | Current React/Nest 자산 강함 |
| PCI-201 거래처 관리 | PurchaseOrder에 `supplierName`, `supplierContact` snapshot은 존재하나 Vendor/Partner Master module/route는 확인되지 않음 | NEW | Canonical Vendor Master UI/Logical은 신규 구현 필요. Physical Entity 설계는 별도 Gate |
| PST-101 신규유입 | `/consultation-requests` | MODIFY | Unified Intake / 신규유입 Queue로 매핑 가능 |
| PST-102 가망고객 | `/customer-on` Lead | MODIFY | Lead 자산 재사용, Customer Master 중복 생성 금지 |
| PST-103 TM 영업 일정 | LeadSchedule module + `/schedule` | MODIFY | 독립 공통 Calendar가 아닌 영업 일정 View로 제한 |
| PST-201 방문 영업 일정 | LeadSchedule / schedule 자산 | MODIFY | VS Assignment와 의미 분리 필요 |
| PST-301 고객360 | Store + `StoreActivity` / timeline / sales 자산 | MODIFY | PST-301 Canonical Surface로 재구성; Store 자체를 Customer Master로 확정 금지 |
| PST-302 계약 심의 | Contract cancellation / termination + activity/history | MODIFY | 최신 4유형 + History Rule 보강 필요 |
| PST-303 계약 만료 고객 | Contract source | MODIFY | 만료 기준일/기간 binding 별도 필요 |
| PST-401~402 견적 | Current source에서 Quote route/module/controller/model 미확인. docs 내 제품/계약 설계 참조만 존재 | NEW | Canonical Quote UI/Logical 신규 구현 필요. 실제 가격/수수료 Effective Policy는 기존 HOLD |
| PCS-101 TODAY | `/dashboard` / schedule / notifications 자산 | MODIFY | Source Truth가 아닌 Projection으로 재구성 |
| PCS-102 VS 방문 | Fulfillment / schedule / store 자산은 존재하나 VS 전용 Evidence / Verified Complete 구현은 확인되지 않음 | MODIFY | 방문/이행 자산 재사용 + Evidence Gate 신규 보강. 이동중/Offline/중복배정 Exact Rule HOLD |
| PCS-103 A/S 접수 | `/customer-requests` + customer-support module. 상태 `RECEIVED / IN_PROGRESS / ON_HOLD / COMPLETED`, 담당자, Processing Note 존재 | MODIFY | CS Intake/기록은 강한 재사용 후보. CS→VS `What we know / tried / need` Handoff와 별도 Case Close 보강 필요 |
| PCS-104 택배·수발주 | `/purchase-orders` + `/shipments`, PurchaseOrder/Shipment physical models | MODIFY | Current UI/API 자산 강함. Logen Production Binding은 HOLD |
| PCS-105 결제·미수금 | Contract Payment Fields(`depositAmount`, `monthlyFee`, `paymentMonths`, `installCost`, notes) + StoreSale는 있으나 Receivable Queue/Allocation exact module 없음 | MODIFY | 금액/매출 자산 재사용 가능. Canonical Restricted Summary + Receivable Queue 보강 필요. Real settlement/provider HOLD |
| PCS-106 재고관리 | `/inventory` + inventory module + Stock/Serial/Transfer/Reservation physical models | MODIFY | Logical/UI 재사용 가능. v2 Physical Schema/Migration은 HOLD |
| PCS-190 CS도구 | CustomerSupport current + legacy tools 별도 | MODIFY | Cleaner/Recovery/Format endpoint 실행은 HOLD |
| PHR-101~108 팀플레이 | `/users`, `/my-page`, EmployeeAccount/Auth/Session/LoginHistory | MODIFY | Current 직원/인증 자산 재사용. 조직/업무분장/협업 Canonical Surface 보강. PHR-106 생성 금지 |
| PSET-102 권한 설정 | `minRole`, `RequireNavAccess`, employee access update, `/security` 존재 | MODIFY | Current는 Menu/Role Gate 중심. v2 Row Scope / Field Visibility / Action Permission 추가 필요. Legacy 권한 그대로 재사용 금지 |
| PSET-103 화면·메뉴 설정 | `navConfig.ts`에 Current Sidebar config 존재 | MODIFY | Current config는 Recovery Source일 뿐 Canonical IA가 아님. Canonical ID immutable + Display Name/Order/Visibility Rule 적용 |
| PSET-105 Audit/복구 | EmployeeLoginHistory + Contract/Store/Lead Activity pattern 존재 | MODIFY | Domain History 자산 재사용 가능. 설정 Before/After + Recovery 공통 Audit 신규 보강 필요 |
| PSET-106 System 설정 | `/security` 등 Current 자산 존재 | HOLD | 일반 관리자용 Current 구현 금지 |
| PMG | Current 통합 source에서는 일부 계약/지출/정산 관련 historical 흔적 외 Canonical PMG 실행 근거 없음 | HOLD | Current v2 PMG Proposal/HOLD 유지 |

## 6. Current Navigation Gap

`frontend/oc/src/app/navigation/navConfig.ts`는 현재 다음 구조다.

- 업무 홈
- 공지사항
- 고객 업무
  - 영업·계약
  - 공급·물류
  - 고객·매장
- 관리 도구
  - 상품 관리
  - SKU 관리
  - 시스템 설정

이 구조는 **Current Implementation Recovery Source**다.

v2 Canonical 6대 Category:

- 회사정보
- 영업관리
- 고객관리
- 팀플레이
- 경영관리
- 설정관리

와 직접 동일하지 않으므로 Current Sidebar를 그대로 복사하지 않는다.

## 7. Current permission evidence

Current code에는 다음 권한 자산이 있다.

- `EmployeeRole`
- `minRole`
- `RequireNavAccess`
- 사용자 접근상태 변경
- 보안 화면
- 관리자 전용 전자서명 문서 규칙

판정: **MODIFY**.

v2에서는 반드시 아래를 추가한다.

1. Menu Permission
2. Row Scope
3. Field Visibility
4. Action Permission
5. Default Deny
6. Audit decision trace

## 8. Current customer-support evidence

현재 Customer Support Detail은 다음을 직접 지원한다.

- 요청 상세 조회
- 상태 변경
- 담당자 배정/해제
- Processing Note 작성/수정/삭제
- Request 삭제
- 목록 Return Context 보존

이는 PCS-103의 강한 Current Recovery Source다.

다만 현재 코드만으로는 아래를 확인하지 못했다.

- CS→VS 3-block Handoff
- Remote impossible reason
- VS Evidence checklist
- Verified Complete Gate
- VS Result → Activity Ledger → Customer360
- VS Complete와 A/S Case Close 분리 명령

따라서 기존 코드를 그대로 Current Canonical로 승격하지 않는다.

## 9. Vendor Master gap

PurchaseOrder는 공급사 정보를 `supplierName`, `supplierContact` snapshot으로 직접 저장한다.

이는 발주 시점 Snapshot으로는 재사용 가능하지만, v2의 `PCI-201 거래처 관리` Canonical Vendor Master를 대신하지 못한다.

판정:

- PurchaseOrder supplier snapshot = **REUSE** within PCS-104
- PCI-201 Vendor Master implementation = **NEW**
- Vendor Physical Entity finalization = 별도 Physical Gate

## 10. Quote gap

Current route/module/controller/model 전수 검색에서 독립 Quote implementation은 확인되지 않았다.

따라서 `PST-401~402 견적서 관리/상세`는 Current source reuse를 전제로 하지 않는다.

판정:

- Quote Screen / Logical Contract = **NEW**
- Product/Commercial Policy 연결 = 기존 Canonical 문서 기준
- Real pricing/provider/effective commission values = HOLD

## 11. Billing / Receivable gap

Current source에는 Contract 결제 조건 및 StoreSale가 존재한다.

확인된 결제 조건 예:

- 계약금
- 월납입금
- 납입기간
- 설치비용
- 결제 메모

그러나 `PCS-105 결제 및 미수금 관리`의 Canonical Receivable Queue / Allocation / Follow-up structure는 직접 확인되지 않았다.

판정: **MODIFY**.

기존 금액/매출 자산은 참고하되, 미수금 Queue의 Logical Meaning은 v2 Canonical Source를 따른다.

## 12. Strong Reuse / Modify Candidates

### REUSE가 강한 Current 자산

- 공지사항
- Employee Auth/Session/Login History
- Product / SKU 기본 CRUD
- Purchase Order / Shipment 기초 흐름
- Inventory 조회/조정/입고/이동 기초 자산
- Contract 기본 CRUD/Activity/Attachment/Comment
- eformsign 문서 규칙/Submission 관련 자산 — 단 Provider Production Binding은 별도

### MODIFY가 강한 Current 자산

- Dashboard → 업무 홈/TODAY
- Consultation Request → 신규유입
- Lead / LeadSchedule → 가망/TM/방문영업
- Store / StoreActivity → Customer360
- CustomerSupport → A/S Intake
- Fulfillment/Schedule → VS
- Contract/StoreSale → 결제·미수금
- Employee/Users → Teamplay
- Current Role/Nav Access → PSET-102

## 13. Conflict / HOLD

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

## 14. Immediate development impact

Claude Code / v2 구현은 다음을 계속 진행할 수 있다.

- React/Vite common shell
- 2단 Sidebar
- HEADER SHALL (상단바)
- 업무 홈·TODAY Pilot
- 고객360 Pilot
- NestJS Logical/Mock API
- Existing current code selective reuse analysis
- UI/interaction/test/CI
- Current CustomerSupport / Lead / Contract / Inventory UI pattern selective reference

계속 HOLD:

- DB migration
- Shared Person/Merchant/IAM physical
- Provider credential / production binding
- Inventory physical migration
- Logen production
- PMG
- PSET-106

## 15. Next Recovery Batch

1. Existing route → Canonical route migration table
2. Current component reuse inventory — table/filter/form/detail/dialog
3. Current design-system tokens vs PayPlay Visual Language v2 diff
4. eformsign / contract capability preservation audit
5. Current CustomerSupport → CS/VS detailed gap table
6. Current Inventory/Supply → PCS-104/106 detailed reuse table
7. Current Users/Auth → Teamplay/PSET permission boundary table
8. Claude Code Pilot result diff 검수

New Product Meaning Created = 0
