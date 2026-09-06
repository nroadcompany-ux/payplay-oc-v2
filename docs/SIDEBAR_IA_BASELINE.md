# [OC] BASELINE / CURRENT / 2단 Sidebar Canonical IA [2026-09-05]

## 목적

이 문서는 PayPlay OC의 공통 2단 Sidebar를 Canonical Menu ID 기준으로 구현하기 위한 Navigation Baseline이다.

- 1차 Sidebar = 업무영역(Category)
- 2차 Sidebar = 해당 Category의 Canonical Menu
- HEADER SHALL (상단바) = 공통 Context / Search / Date / Time / User Surface
- 화면의 Product Meaning / Data Owner / Route Owner를 Navigation이 재정의하지 않는다.

## 1차 Sidebar — Canonical Category

Source: `contracts/menu-registry.json`

| Category ID | 표시명 | 상태 | 비고 |
|---|---|---|---|
| company | 회사정보 | CURRENT | 구현 가능 |
| sales | 영업관리 | CURRENT | 구현 가능 |
| customer | 고객관리 | CURRENT | 구현 가능 |
| teamplay | 팀플레이 | CURRENT | 구현 가능 |
| management | 경영관리 | HOLD | PMG 개별 기능 구현 금지 |
| settings | 설정관리 | CURRENT | PSET-106 제외 |

> `홈`은 별도 Master Category를 새로 만드는 의미가 아니다. `PCI-101 업무 홈`으로 진입하는 Product Entry 표현으로만 사용할 수 있다.

## 2차 Sidebar — 회사정보

| ID | 메뉴 | 상태 |
|---|---|---|
| PCI-101 | 업무 홈 | CONFIRMED |
| PCI-102 | 공지사항 | CONFIRMED |
| PCI-103 | 회사 360 | CURRENT |
| PCI-104 | 운영 매뉴얼 | CURRENT |
| PCI-201 | 거래처 관리 | CONFIRMED |
| PCI-202 | 거래처 상세 | CONFIRMED |

## 2차 Sidebar — 영업관리

| ID | 메뉴 | 상태 |
|---|---|---|
| PST-101 | 신규유입 | CONFIRMED |
| PST-102 | 가망고객 | CONFIRMED |
| PST-103 | TM 영업 일정 | CURRENT |
| PST-201 | 방문 영업 일정 | CURRENT |
| PST-401 | 견적서 관리 | CONFIRMED |
| PST-402 | 견적서 상세 | CONFIRMED |
| PST-302 | 계약 심의(변경·해지) | CURRENT |
| PST-303 | 계약 만료 고객 | CURRENT |
| PST-490 | 영업도구 | CONFIRMED |

## 2차 Sidebar — 고객관리

| ID | 메뉴 | 상태 |
|---|---|---|
| PST-301 | 고객 360 | CONFIRMED |
| PCS-101 | TODAY | CONFIRMED |
| PCS-102 | 신규설치 및 A/S 방문 / VS | CURRENT |
| PCS-103 | A/S 접수 | CURRENT |
| PCS-104 | 택배 및 제품 수발주 | CURRENT |
| PCS-105 | 결제 및 미수금 관리 | CURRENT |
| PCS-106 | 재고관리 | CONFIRMED |
| PCS-190 | CS도구 | CONFIRMED |

## 2차 Sidebar — 팀플레이

| ID | 메뉴 | 상태 |
|---|---|---|
| PHR-101 | 우리 팀 | CONFIRMED |
| PHR-102 | 구성원 | CURRENT |
| PHR-103 | 역할·업무분장 | CONFIRMED |
| PHR-104 | 보고·협업 | CONFIRMED |
| PHR-105 | 근무·휴가 | CONFIRMED |
| PHR-107 | 내 정보 | CONFIRMED |
| PHR-108 | 내 업무 도구 | CONFIRMED |

`PHR-106`은 생성 금지다.

## 2차 Sidebar — 경영관리

상위 Container는 존재하지만 개별 기능은 현재 PROPOSAL/HOLD다.

| ID | 메뉴 | 상태 |
|---|---|---|
| PMG-100 | 경영관리 Container | CURRENT / NON-EXECUTABLE |
| PMG-101 | 경영 현황 | PROPOSAL/HOLD |
| PMG-102 | 정산 관리 | PROPOSAL/HOLD |
| PMG-103 | 지출결의 | PROPOSAL/HOLD |
| PMG-104 | 수수료·보상 | PROPOSAL/HOLD |
| PMG-201 | 차량관리 | PROPOSAL/HOLD |
| PMG-202 | 주차관리 | PROPOSAL/HOLD |
| PMG-HOLD | 채널·광고 | HOLD |

Current 구현에서는 HOLD 개별 메뉴를 실행 가능한 Route로 만들지 않는다.

## 2차 Sidebar — 설정관리

| ID | 메뉴 | 상태 |
|---|---|---|
| PSET-101 | 운영 설정 | CONFIRMED |
| PSET-102 | 권한 설정 | CONFIRMED |
| PSET-103 | 화면·메뉴 설정 | CONFIRMED |
| PSET-104 | 업무 Rule 설정 | CURRENT |
| PSET-105 | 변경 이력·복구 | CONFIRMED |
| PSET-106 | System 설정 | HOLD |

PSET-106은 Current Navigation에서 실행 가능 기능으로 구현하지 않는다.

## Navigation Rule

1. Canonical ID는 Immutable이다.
2. 설정에서 변경 가능한 값은 Display Name / Order / Visibility다.
3. Navigation은 Data Owner를 변경하지 않는다.
4. Navigation은 Route Owner를 변경하지 않는다.
5. TODAY / 신규유입 / 가망 / TM / 방문영업은 Projection 또는 Queue이며 별도 Master가 아니다.
6. 고객 Master = PST-301 고객360.
7. 거래처 Master = PCI-201 거래처 관리.
8. 직원/조직 Master = PHR-101 우리 팀 계열.
9. 화면 진입 시 Source Context, Return Context를 유지한다.
10. HOLD Menu는 임의로 활성 Route를 만들지 않는다.

## Visual Rule

- 1차 Sidebar는 Category 인지와 빠른 전환에 집중한다.
- 2차 Sidebar는 현재 Category의 메뉴를 Text 중심으로 보여준다.
- Active는 `#FF6B00`을 Local Selection으로만 사용한다.
- Sidebar 전체를 Orange/Gray 면으로 칠하지 않는다.
- White Canvas + 최소 Neutral Divider를 유지한다.
- 메뉴 수가 많으면 Scroll을 사용하되 Category/ID를 재구성하지 않는다.

## Current Pilot Mapping

- `업무 홈 · TODAY`: PCI-101 Entry + PCS-101 Work Projection
- `고객360`: PST-301 Canonical Customer Surface

Pilot 승인 후 동일 Shell을 전체 Current Family로 확산한다.

`New Product Meaning Created = 0`
