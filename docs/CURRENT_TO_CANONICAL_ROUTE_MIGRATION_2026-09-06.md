# [OC] EVIDENCE / CURRENT / Existing Route → Canonical Migration [2026-09-06]

## 목적

Current `nroad-ecosystem/payplay` 계열 OC Route를 v2 Canonical Menu/Screen 의미에 매핑한다.

이 표는 **Route 재사용 판단표**이며 Canonical Product Meaning을 Current 구현이 덮어쓰지 않는다.

## Migration Table

| Current Route | Current Label/Meaning | v2 Canonical Target | Decision | Migration Rule |
|---|---|---|---|---|
| `/dashboard` | 업무 홈 | PCI-101 업무 홈 + PCS-101 TODAY Entry | MODIFY | Dashboard 자산은 재사용하되 TODAY는 Projection으로 분리 |
| `/notice/*` | 공지사항 | PCI-102 공지사항 | REUSE | Current route/component/API 우선 재사용 |
| `/consultation-requests` | 상담 신청 | PST-101 신규유입 | MODIFY | OSP/외부 Intake를 신규유입 Queue로 재명명/정합 |
| `/consultation-requests/:requestId` | 상담 신청 상세 | PST-101 신규유입 상세 Context | MODIFY | Lead 생성/연결 전 Intake Detail로 유지 |
| `/customer-on` | 리드 관리 | PST-102 가망고객 | MODIFY | Customer Master가 아니라 Customer360 기반 영업 Queue로 정합 |
| `/customer-on/:leadId` | 리드 상세 | PST-102 가망 상세 / Customer360 Return | MODIFY | 독립 Customer Master 생성 금지 |
| `/schedule` | 영업 일정 | PST-103 TM 영업 일정 + PST-201 방문 영업 일정 | MODIFY | 공통 Calendar가 아니라 업무별 View로 분리 |
| `/contract` | 계약 관리 | 계약 Core + PST-302/303 연결 | MODIFY | 계약 기본 자산 재사용. 변경·해지 4유형/만료 Queue 보강 |
| `/contract/new` | 계약 신규 | Quote→Contract / Contract Creation | MODIFY | Quote가 생기면 Handoff Context를 받아 계약 생성 |
| `/contract/:contractId` | 계약 상세 | Contract Detail | REUSE | Current Detail/Activity/Attachment/Comment 자산 재사용 |
| `/fulfillment` | 계약 이행 | PCS-102 신규설치 및 A/S 방문 일부 Source | MODIFY | Fulfillment와 VS 의미 구분. Evidence/Verified Complete 추가 |
| `/customer-requests` | 고객지원 요청 | PCS-103 A/S 접수 | MODIFY | CS Intake 중심으로 재구성 |
| `/customer-requests/:requestId` | 고객지원 상세 | PCS-103 A/S Case Detail | MODIFY | CS→VS 3-block Handoff, separate Close 추가 |
| `/inventory` | 재고 관리 | PCS-106 재고관리 | MODIFY | UI/Logical 재사용 가능. Physical migration HOLD |
| `/purchase-orders` | 발주 관리 | PCS-104 택배 및 제품 수발주 | MODIFY | 발주 Snapshot 재사용. Vendor Master 연결은 별도 |
| `/shipments` | 배송 관리 | PCS-104 택배 및 제품 수발주 | MODIFY | Shipment UI/API 자산 재사용. Logen Production HOLD |
| `/salelog` | 매장 관리 | PST-301 고객360 Store/Sales View 일부 | MODIFY | Store 중심 화면을 Customer360 보조 View로 흡수 |
| `/products` | 상품 관리 | OC Product/Commercial Policy Master 관련 Surface | MODIFY | Product Master 자산 재사용. Sidebar 위치는 Current v2 IA에 맞춤 |
| `/products/:productId` | 상품 상세 | Product Detail | REUSE | Current detail/editor patterns 재사용 |
| `/skus` | SKU 관리 | Product/SKU 관리 Surface | REUSE | Current CRUD 재사용 가능 |
| `/skus/:skuId` | SKU 상세 | SKU Detail | REUSE | Current detail/editor patterns 재사용 |
| `/users` | 사용자 관리 | PHR-102 구성원 + PSET-102 일부 | MODIFY | Employee UI 재사용. Teamplay/Permission Canonical 경계 분리 |
| `/security` | 보안 관리 | PSET-106 / Security Dev Gate | HOLD | Current route 존재해도 일반 관리자용 구현 금지 |
| `/contract-signature-config` | 전자서명 문서 규칙 | Contract Tool/Restricted Admin | MODIFY | Current eformsign 규칙 자산 재사용. Provider Production Binding HOLD |
| `/my-page` | 내 정보 | PHR-107 내 정보 | REUSE | Current Profile/Password 자산 재사용 |

## New Canonical Routes / Surfaces with no exact Current Route

아래는 Current source에 exact route가 확인되지 않았다.

| Canonical | Decision | Note |
|---|---|---|
| PCI-103 회사 360 | NEW | Current exact surface 없음 |
| PCI-104 운영 매뉴얼 | NEW | Current exact surface 없음 |
| PCI-201 거래처 관리 | NEW | Supplier snapshot은 있으나 Vendor Master route 없음 |
| PCI-202 거래처 상세 | NEW | Vendor Master Detail 필요 |
| PST-301 고객360 | NEW | Store/Lead/Activity를 조합한 Canonical Surface 신규 필요 |
| PST-401 견적서 관리 | NEW | Current Quote route/module 미확인 |
| PST-402 견적서 상세 | NEW | Current Quote detail 미확인 |
| PST-490 영업도구 | NEW | Tool Hub exact current route 없음 |
| PCS-101 TODAY | NEW | Dashboard source를 사용하지만 Canonical Projection Surface 신규 필요 |
| PCS-190 CS도구 | MODIFY | Legacy tool source selective recovery 필요 |
| PHR-101 우리 팀 | NEW | Users는 있으나 Team Overview exact surface 없음 |
| PHR-103 역할·업무분장 | NEW | exact current surface 없음 |
| PHR-104 보고·협업 | NEW | exact current surface 없음 |
| PHR-105 근무·휴가 | NEW | exact current surface 없음 |
| PHR-108 내 업무 도구 | NEW | exact current surface 없음 |
| PSET-101 운영 설정 | NEW | exact current surface 없음 |
| PSET-102 권한 설정 | MODIFY | Current minRole/access pattern을 확장 |
| PSET-103 화면·메뉴 설정 | NEW | navConfig는 코드 설정일 뿐 관리자 Surface 아님 |
| PSET-104 업무 Rule 설정 | NEW | Rule Registry UI exact current surface 없음 |
| PSET-105 변경 이력·복구 | NEW | Domain history는 있으나 Settings Audit/Recovery Surface 없음 |

## Legacy redirect caution

Current `LEGACY_REDIRECTS`에는 다음 과거 route 흡수가 존재한다.

- `consult → customer-on`
- `cancel-change → contract`
- `sales-requests → customer-requests`
- `namecard → customer-on`
- `meeting → schedule`
- `weekly → schedule`
- `parking → dashboard`
- `cctv → dashboard`
- `customers → salelog`
- `as → dashboard`
- `consultlog → dashboard`
- `remote → dashboard`

이 Redirect는 **Historical Recovery Evidence**다.

v2에서 동일 redirect를 자동 승계하지 않는다. Legacy Capability Loss Audit와 Owner Current Menu를 기준으로 개별 판정한다.

## Navigation rule

1. Current route name이 Canonical ID를 결정하지 않는다.
2. Canonical ID는 `menu-registry.json` / `SIDEBAR_IA_BASELINE.md`를 따른다.
3. Route Migration은 Source Context / Return Context를 보존한다.
4. Current implementation이 HOLD 기능을 활성화하지 않는다.
5. Exact route가 없는 Canonical Surface는 기존 UI pattern을 선택 재사용하되 Product Meaning은 Canonical Source에서 가져온다.

## Claude Code usage

Claude Code는 이 표를 사용해:

- Existing component/API reuse
- Route alias/redirect planning
- Pilot navigation wiring
- Current vs Canonical gap identification

을 수행할 수 있다.

단, 전체 Route Migration을 한 번에 실행하지 말고 Pilot/Domain 단위로 QA한다.

New Product Meaning Created = 0
