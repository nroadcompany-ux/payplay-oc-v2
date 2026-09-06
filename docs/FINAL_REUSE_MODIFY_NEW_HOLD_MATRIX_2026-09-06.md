# [OC] REGISTER / CURRENT / Final REUSE·MODIFY·NEW·HOLD Matrix — 최종 재사용 판정표 [2026-09-06]

## 원칙
Current Source 존재 여부와 Canonical Product Meaning을 분리한다. Current Source가 있어도 Canonical과 다르면 MODIFY이며, Physical/Provider/Production 영역은 기존 HOLD를 유지한다.

## Final Matrix

### REUSE
- PCI-102 공지사항 — Current route/module 강함
- Product Detail / SKU 기본 CRUD 자산
- Contract Detail 기본 CRUD / Activity / Attachment / Comment
- Employee Auth / Session / Login History foundation
- PurchaseOrder / Shipment 기본 Transaction pattern
- Inventory 기본 조회/입고/조정/이동 pattern
- eformsign 문서규칙/Submission 보존 자산 — Production Binding 제외
- PHR-107 내 정보의 Profile/Password pattern
- 공용 DataTable / Pagination / Dialog / Confirm / FormField / Skeleton / Guard logic

### MODIFY
- PCI-101 업무 홈
- PST-101 신규유입
- PST-102 가망고객
- PST-103 TM 영업 일정
- PST-201 방문 영업 일정
- PST-301 고객360
- PST-302 계약 심의
- PST-303 계약 만료 고객
- PCS-101 TODAY
- PCS-102 VS
- PCS-103 A/S 접수
- PCS-104 택배 및 제품 수발주
- PCS-105 결제 및 미수금
- PCS-106 재고관리
- PCS-190 CS도구
- PHR-102 구성원 및 Teamplay foundation
- PSET-102 권한 설정
- PSET-103 화면·메뉴 설정
- PSET-105 변경 이력·복구
- Contract/e-sign → Activity Ledger/Customer360 연결

### NEW — Logical/UI
- PCI-103 회사 360
- PCI-104 운영 매뉴얼
- PCI-201 거래처 관리
- PCI-202 거래처 상세
- PST-401 견적서 관리
- PST-402 견적서 상세
- PST-490 영업도구 Hub
- PST-301 고객360 Canonical Surface 자체
- PCS-101 TODAY Canonical Projection Surface 자체
- PHR-101 우리 팀 Overview
- PHR-103 역할·업무분장
- PHR-104 보고·협업
- PHR-105 근무·휴가
- PHR-108 내 업무 도구
- PSET-101 운영 설정
- PSET-103 Admin Surface
- PSET-104 업무 Rule Registry/UI
- PSET-105 공통 Audit/Recovery Surface

### HOLD
- PMG-101~104
- PMG-201~202
- PMG-HOLD 채널·광고
- PSET-106
- Shared Person / Merchant / IAM Physical Architecture
- Physical Storage / DB Migration
- Inventory Physical Schema/Migration
- Logen Production Binding
- Real Provider / Credential / Production Binding
- PCS-190 real Cleaner/Recovery/Format endpoint
- VS 이동중 State
- VS Offline Mode
- 기사 중복배정 Exact Rule
- PMG-104 Formula
- Physical Vendor Entity finalization
- Real Payment/Settlement Provider

## 금지
- `PHR-106` 재생성 금지
- Current Sidebar 전체 복사 금지
- Store를 Customer Master로 승격 금지
- Legacy permission allow-all 재사용 금지
- e-sign 완료를 Contract 전체 완료와 동일시 금지
- TODAY에서 Source Transaction 직접 변경 금지

Verdict: **FINAL MATRIX COMPLETE**

`New Product Meaning Created = 0`
