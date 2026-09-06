# [OC-COMPANY] BASELINE / WORKING / Vendor Master Contract — 거래처 관리 계약 [2026-09-06]

## Scope

Canonical: `PCI-201 거래처 관리`, `PCI-202 거래처 상세`.
Current source에는 PurchaseOrder supplier snapshot은 있으나 통합 Vendor Master가 확인되지 않아 Canonical Vendor Master는 **NEW**다.

## Master Principle

하나의 거래처 Master에서 유형으로 구분한다.

- 파트너사
- 제조사
- 공급사
- 발주사
- VAN / PG / POS / 프로그램사
- 설치/AS 협력사
- 영업협력사
- 물류사

동일 회사의 역할별 중복 Master 생성 금지.

## Required Logical Fields

- vendorId
- 법인/상호명
- 사업자번호
- 대표자
- 담당자 목록
- 연락처/이메일
- 주소
- vendorTypes[]
- activeStatus
- 계약/협약 reference
- 제공 Product/Service reference
- 정산/발주 메모 reference
- created/updated/audit

## Relationships

Vendor Master → PurchaseOrder supplier snapshot
Vendor Master → Product/SKU supplier relation
Vendor Master → Contract/Service partner reference
Vendor Master → Installation/AS partner reference
Vendor Master → Activity/Audit

## Rules

1. PO의 supplierName/contact는 거래 당시 Snapshot으로 보존한다.
2. Vendor Master 수정이 과거 PO Snapshot을 소급 변경하지 않는다.
3. Vendor Type은 다중 선택 가능하다.
4. Customer Master와 Vendor Master를 동일 Entity로 임의 통합하지 않는다.
5. Physical schema는 Shared architecture 검토 후 확정한다.
6. 삭제보다 Inactive를 우선하고 거래 History는 보존한다.

## Screen Contract

List:
- 검색
- 유형 필터
- 상태 필터
- 최근 거래/업무 reference
- 신규 등록

Detail:
- 기본정보
- 유형
- 담당자
- 연관 상품/서비스
- 발주/배송/계약 Reference
- Activity
- 수정/비활성

## Acceptance

- AC-VND-01 동일 거래처의 복수 유형을 한 Master에서 표현한다.
- AC-VND-02 과거 PO Snapshot은 Master 변경 후에도 유지된다.
- AC-VND-03 Customer Master를 중복 생성하지 않는다.
- AC-VND-04 Inactive 거래처도 History 조회 가능하다.
- AC-VND-05 물리 Entity/DB migration은 별도 Gate 전 생성하지 않는다.

Decision: `PCI-201/202 = NEW (Logical/UI)` / Physical Vendor Entity = HOLD until architecture gate.

`New Product Meaning Created = 0`
