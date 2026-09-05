# RECOVERY REPORT — 1차 복원 보고

| 항목 | 내용 |
|---|---|
| Document ID | PPOC2-REC-001 |
| Status | WORKING |
| 작성일 | 2026-09-05 |
| 범위 | Repo 초기화 · Existing Source Recovery · REUSE/MODIFY/NEW/HOLD 판정 · 영향 분석 · Gap · 첫 Batch 제안 |
| 판정 기준 | `07 Master v0.2 상태 → 09 Developer Readiness → 10 Existing Code Recovery → 실제 코드 재검증` |

> 본 보고서는 **구현 착수 전 판단자료**다. 화면·정책을 확정하지 않는다.

---

## 1. Existing Source Recovery 요약

### 1.1 확인된 자산

| Repository | 성격 | 실측 |
|---|---|---|
| `payplay-tms` | **Legacy 실운영 Source (Primary)** | 단일 SPA. `app.js` 1.85MB / `index.html` 179KB / `db.js` 175KB / `db/migrations/*.sql` 60여 개 / `relay/logen-poller` / Supabase Edge Function 2종 |
| `payplay-product-docs` | OC 기획·Recovery 문서 | `10_OC/**` 21문서 (APPROVED·SOT 6종) |
| `payplay_os` | OC 스캐폴드 | `apps/{ppoc,os,osp,admin}` — **각 21파일 골격. 업무 기능 0** |
| `payplay-OSP` | 외부 유입/Lead 생성 | OC 범위 아님 (Service Boundary상 별개) |
| `payplay` | 지출결의·Decision Guard 소형 앱 | OC 범위 아님 |

### 1.2 Legacy TMS 실제 메뉴 인벤토리 (`DEFAULT_NAV` 전수, 33 항목)

| 섹션 | 항목 |
|---|---|
| 홈 | 홈 대시보드 · 공지사항 · 업무 관리 |
| 영업팀 · 리드→계약 | 리드 관리 · 계약 관리 · 판매 기록 · 계약 만료 관리 · 상품/수당 관리 · 마진계산기 |
| 고객지원팀 | 홈페이지 신청함 · 방문 일정(설치·A/S) · 배송 관리(택배) · 재고 관리 · 수발주 관리 · **A/S 입고(제조사)** · POS 청소 관리 · 가맹점 매출 조회(준비중) · 신규 매장 셋업(준비중) |
| 협업·내 업무 | AI 업무 도우미 · 할일관리 · 업무 게시판 · 팀 채팅 · **일정·미팅** · 프로젝트관리 · 전자계약서 |
| 마케팅 서비스 | 블로그 마케팅 자동화(MJ) |
| 인사·행정 (admin) | 노무 관리 · **차량 관리** · 회사 정보 |
| EDI 경영 (admin) | 정산 관리 · 지출결의 · 거래처 등록 · 견적서 관리 · 채널 관리 · 광고 관리 |
| 관리 설정 (admin) | 사용자 관리 · 보안 관리 |

**흡수 페이지 (메뉴에서 빠졌으나 라우팅 유지):**
`미팅관리`·`위클리미팅` → 일정 탭 / **`주차 관리`·`CCTV 모니터링` → 회사 정보 탭** / `명함관리` → 리드 관리 탭 / `페이플레이 네트워크`

**TMS에서 이미 제거된 기능 (라우터가 대시보드로 리다이렉트):**
`CS 접수센터(as)` · `상담 기록(consultlog)` · `원격 지원(remote)` · `고객 정보(customers)`

### 1.3 Legacy DB 자산 (최신 `db.js` 참조 실측 — 50 테이블)

| 도메인 | 테이블 (참조 횟수) |
|---|---|
| 고객·매장 | `biz_stores`(34) · `biz_store_consultations`(10) · `biz_leads`(10) · `store_daily_sales` |
| 영업·계약 | `biz_quotes`(16) · `biz_quote_templates`(5) · `biz_econtract`(5) · `biz_products`(4) · `biz_commission_grades`(2) · `biz_namecards`(9) |
| 운영·일정 | `biz_daily_ops`(18) · `biz_ops_notes`(4) · `biz_ops_comments`(4) · `biz_schedules`(5) · `biz_meetings`(5) · `biz_holidays`(4) |
| CS·물류 | `biz_customer_requests`(3) · `biz_shipments`(9) · `biz_purchase_orders`(11) · `biz_manufacturer_as`(10) · `biz_inventory`(5) · `biz_inventory_log`(5) · `biz_cleanup_log`(5) · `biz_remote_sessions`(9) |
| 재무 | `biz_settlements`(9) · `biz_expense_requests`(5) |
| 거래처 | `biz_vendors_master`(6) · `biz_vendors`(5) |
| 협업 | `biz_posts`(13) · `biz_post_comments`(3) · `biz_post_subtasks`(4) · `biz_tasks`(5) · `biz_tasks_my`(5) · `biz_task_sections`(2) · `biz_projects`(10) · `biz_project_tasks`(4) · `biz_chat_messages`(10) · `biz_chat_channels`(5) · `biz_chat_read_status`(3) |
| 인사 | `biz_attendance`(7) · `biz_leave_requests`(6) |
| 마케팅 | `biz_campaigns`(5) · `biz_campaign_files`(1) · `biz_ad_categories`(4) · `biz_csm_articles`(7) |
| 보안·설정 | `biz_users`(17) · `biz_login_sessions`(12) · `biz_ip_whitelist`(3) · `biz_audit_logs`(1) · `biz_settings`(2) · `biz_notifications`(3) · `biz_team_dashboard`(2) |

---

## 2. 기능별 판정 — REUSE / MODIFY / NEW / HOLD

Sheet `10 : Existing Code Recovery` 판정에 **본 Recovery의 실제 코드 재검증 결과**를 병기한다.

| ID | Current 기능 | Existing Asset | Sheet 판정 | 본 검증 | 비고 |
|---|---|---|---|---|---|
| PCI-101 | 업무 홈 | `biz_team_dashboard` · `biz_daily_ops` | MODIFY | **확인** | Legacy 화면 결합도 높음. Projection 재조립 필요 |
| PCI-102 | 공지사항 | `biz_posts` · `biz_csm_articles` | (Sheet 미기재) | **MODIFY** | Legacy `notice` 메뉴 + 게시물 자산 존재 |
| PCI-103/104 | 회사 360 / 운영 매뉴얼 | Legacy `company` 페이지 | (Sheet 미기재) | **MODIFY** | 주차·CCTV 탭 흡수 구조 주의 |
| PCI-201/202 | 거래처 Master | `biz_vendors_master` · `biz_vendors` | REUSE+MODIFY | **확인** | **중복 Vendor 구조 2종** — 단일 Master 통합 필요 |
| PST-101/102 | 신규유입 / 가망고객 | `biz_leads` · `biz_store_consultations` · `biz_stores` | MODIFY | **확인** | 중복 고객원장 방지. 고객360 View/Queue로 재구성 |
| PST-103 | TM 영업 일정 | `biz_schedules` | MODIFY | **확인** | 범용 일정 테이블. 독립 Calendar 신설 금지 |
| PST-201 | 방문 영업 일정 | `biz_daily_ops(category=방문)` · `biz_schedules` | MODIFY | **확인** | Assignment 전용 구조 부재 → NEW |
| PST-301 | **고객 360** | `biz_stores` + 통합 View 자산 | MODIFY | **⚠ CONFLICT** | §4.1 참조 — Legacy 최신 커밋이 고객 360을 **폐지** |
| PST-401/402 | 견적서 | `biz_quotes` · `biz_quote_templates` | REUSE+MODIFY | **확인 (자산 보강)** | Sheet 미기재 `biz_quote_templates`(5), `biz_products`(4) 추가 확인 |
| PST-302/303 | 계약 심의 / 만료 | `contract_status` · `biz_econtract` | MODIFY | **확인** | 기존 상태값 자유 text → 표준화 선행 |
| PST-490 | 영업도구 | `biz_margin_settings` + 마진계산기 | PARTIAL REUSE | **확인** | 마진만 재사용. Tool Registry는 NEW |
| PCS-101 | TODAY | `biz_daily_ops` · team dashboard | MODIFY | **확인** | `biz_daily_ops` 책임 혼재 (방문영업·VS·CS 공용) |
| PCS-102 | VS 방문 | `biz_daily_ops` 방문 UI · `ppos_installations` | MODIFY+NEW | **확인** | 배정/Evidence/Verified Complete 전부 NEW |
| PCS-103 | A/S 접수 | `biz_customer_requests` | REUSE+MODIFY | **⚠ 하향** | Legacy `CS 접수센터(as)` 메뉴는 **이미 제거됨**. 참조도 3회로 낮음 → 실질 **MODIFY+NEW** |
| PCS-104 | 택배·수발주 | `biz_shipments` · `biz_manufacturer_as` · `biz_purchase_orders` · `relay/logen-poller` | STRONG REUSE | **확인 (최강 자산)** | 로젠 폴러/릴레이 코드 실재. 재작성 금지 |
| PCS-105 | 결제·미수금 | `biz_settlements` · payment_status | MODIFY | **확인** | Provider 제외 Logical만 |
| PCS-106 | 재고관리 | `biz_inventory` 존재 충돌 | **CONFLICT** | **부분 해소 → §4.2** | `biz_inventory`(5) + `biz_inventory_log`(5) 참조 **실재 확인**. 단 `create table` migration 부재 |
| PCS-190 | CS도구 | `biz_remote_sessions` · `biz_cleanup_log` | PARTIAL REUSE | **확인 (자산 보강)** | Sheet 미기재 `biz_cleanup_log`(5) = POS 청소 실자산 |
| PHR-* | 팀플레이 | `profiles` · `biz_tasks_my` · `biz_projects` · `biz_meetings` | MODIFY | **⚠ 정정** | 최신 `db.js`는 `profiles`가 아니라 **`biz_users`(17)** 를 사용. `profiles`는 migration(0034)에만 존재 |
| PMG-* | 경영관리 | `biz_settlements` · `biz_expense_requests` | HOLD | **HOLD 유지** | 자산은 있으나 Sheet가 PROPOSAL |
| PSET-101~105 | 설정관리 | `biz_settings` · `biz_audit_logs` · `biz_login_sessions` · `biz_ip_whitelist` | (Sheet 미기재) | **MODIFY+NEW** | Audit/보안 자산 실재. **Legacy RLS는 재사용 금지** |

### 2.1 판정 집계

| 판정 | 개수 | ID |
|---|---|---|
| STRONG REUSE | 1 | PCS-104 |
| REUSE + MODIFY | 3 | PCI-201/202 · PST-401/402 · PCS-103(하향 검토) |
| MODIFY | 14 | PCI-101~104 · PST-101/102/103/201/301/302/303 · PCS-101/105 · PHR-* |
| MODIFY + NEW | 3 | PCS-102 · PCS-103 · PSET-101~105 |
| NEW | 5 | VS Assignment·Evidence·Verified Complete · Activity Ledger · Tool Registry(PST-490/PCS-190) · Permission Enforcement · Settings Audit/Rollback |
| HOLD | 8 | PMG-101~104 · PMG-201/202 · PMG-HOLD · PSET-106 |
| CONFLICT | 2 | PST-301(고객 360 정책) · PCS-106(재고 물리) |

---

## 3. Route / API / DB Model / Permission 영향 분석

> **전제:** 기술 스택 미확정(ODR-01). 아래는 스택 비의존 **Logical 설계 영향**이며 물리 경로는 스택 확정 후 확정한다.

### 3.1 Domain 분할과 Logical Route

| Domain | Logical Route | 대상 ID |
|---|---|---|
| `company` | `/company/home` `/company/notices` `/company/360` `/company/manuals` `/company/partners` `/company/partners/:id` | PCI-101~104, 201, 202 |
| `sales` | `/sales/intake` `/sales/leads` `/sales/tm-schedule` `/sales/visit-schedule` `/sales/quotes` `/sales/quotes/:id` `/sales/contract-review` `/sales/contract-expiry` `/sales/tools` | PST-101~103, 201, 401/402, 302, 303, 490 |
| `customer` | `/customer/360/:id` `/customer/today` `/customer/vs-visits` `/customer/as-cases` `/customer/shipments` `/customer/payments` `/customer/inventory` `/customer/tools` | PST-301, PCS-101~106, 190 |
| `teamplay` | `/team` `/team/members` `/team/roles` `/team/reporting` `/team/attendance` `/team/me` `/team/tools` | PHR-101~105, 107, 108 |
| `management` | — | PMG-* 전체 **HOLD. Route 생성 금지** |
| `settings` | `/settings/operations` `/settings/permissions` `/settings/menus` `/settings/rules` `/settings/audit` | PSET-101~105 (`PSET-106` HOLD) |
| `shared` | Activity Ledger · Projection · Permission Guard · Tool Registry | 공통 |
| `legacy-adapters` | Logen Adapter · Legacy table adapter | PCS-104 등 |

### 3.2 API 경계

| 경계 | 내용 |
|---|---|
| Master Write | `customer` (고객 360), `company` (거래처), `teamplay` (구성원) 만이 Master Write를 가진다 |
| View/Queue Read | `sales`의 신규유입·가망고객·TM/방문 일정은 **고객 360 Projection Read**. 자체 고객 Write 금지 |
| Command 분리 | VS 현장 처리 결과 ≠ A/S Case Close. **별도 Command.** 자동 종료 금지 |
| Ledger 경유 | VS 결과 → Activity Ledger → 고객 360 이력. 직접 이력 Write 금지 |
| Provider 차단 | 결제·정산·전자서명·물류(Logen 운영)·원격지원 실 endpoint는 전부 Mock/Placeholder |

### 3.3 DB Model 영향

| 구분 | 내용 |
|---|---|
| **생성 금지 (Pending)** | Person Master 물리 테이블 · Merchant Account 독립 테이블 · User/Auth/Session/Membership Physical Schema |
| **신규 필요 (Logical)** | `activity_ledger` · `vs_assignment` · `vs_evidence` · `tool_registry` · `setting_registry` · `setting_change_log` |
| **통합 필요** | `biz_vendors` + `biz_vendors_master` → 단일 거래처 Master (유형 컬럼으로 구분) |
| **표준화 선행** | `contract_status` 자유 text → 해지/명의변경/양도양수/계약변경 4유형 표준값 |
| **책임 분리 필요** | `biz_daily_ops` 가 방문영업·VS·CS·TODAY를 공용 → Projection Source 분리 |
| **물리 확정 금지** | `biz_inventory` 계열 (PCS-106 CONFLICT 해소 전) |
| **Migration 금지** | 재고 · Logen Production · Shared IAM/Person/Merchant |

### 3.4 Permission 영향

| 역할 | 범위 |
|---|---|
| 외부 파트너 | 배정된 업무 범위만. 금액·인사·경영 접근 불가 |
| 내부 직원 | 담당 업무 + 본인 셀프서비스. 민감 HR·금액 제한 |
| 내부 관리자 | 운영 CRUD + 설정관리(운영/권한/메뉴/이력) |
| 운영자 | 업무 Rule 설정 + 제한적 System 영역 |
| 개발·보안 | `PSET-106` 전용. 별도 Gate |

**필수 Enforcement (전부 NEW):**
- Row Scope — `PST-201` 계약고객은 **영업자 본인 계약만** 조회
- Field Scope — 금액·인사 민감 필드 마스킹 (`store-sales`는 Legacy에서도 admin 전용)
- Restricted Domain — FINANCE / PEOPLE-HR / COMPENSATION / MANAGEMENT / DECISION
- Audit — 모든 설정 변경 Before/After + 복구

> ⚠ **Legacy 권한 구조 재사용 금지.** Legacy RLS는 `PSET-102` 요건을 충족하지 못한다.
> Legacy 자산 `biz_login_sessions`·`biz_ip_whitelist`·`biz_audit_logs`는 **패턴 참조**로만 사용한다.

---

## 4. Current Master ↔ Legacy Gap

### 4.1 ⚠ CONFLICT-01 — 고객 360 정책 정면 충돌

| 소스 | 입장 |
|---|---|
| 최신 Owner Source (07 v0.2 / Handoff v0.2) | `PST-301 고객 360` = **CONFIRMED 단일 고객 Master.** "고객 정보를 확인할 땐 무조건 고객 360을 클릭한다" |
| Legacy TMS 최신 커밋 `d1e2325` | **"고객 360 폐지 → 판매 상세로 통합 (탭)"** |
| Legacy TMS 주석 | "고객 정보(customers) 폐쇄 — 고객 360 중복(2026-07-08 사장님)" |

Legacy는 2026-07-08 Owner 지시로 고객 360을 **없애는 방향**으로 진행했고, 2026-09-05 Owner Source는 고객 360을 **단일 기준점으로 복원**한다.

**판정: `CONFLICT`. 개발자가 판단하지 않는다.** → `ODR-06`
"현재 배포 OC를 정답으로 간주하지 말 것" 규칙상 **최신 Owner Source(고객 360 복원)가 우선**이나, Legacy 폐지 결정도 Owner 지시였으므로 명시적 재확인이 필요하다.

### 4.2 CONFLICT-02 — `PCS-106` 재고 물리 구조 (부분 해소)

| 근거 | 결과 |
|---|---|
| Sheet 판정 | `CONFLICT` — "Snapshot audit는 없음, Field Visit audit는 실사용 18회 주장" |
| **본 Recovery 실측** | 최신 `db.js`에 `biz_inventory` **5회**, `biz_inventory_log` **5회** 참조. Legacy 메뉴에 `재고 관리` 실재 |
| Migration 확인 | `create table biz_inventory` **없음.** `0010_dedupe_inventory.sql` · `0044_pipeline_stage_inventory_realtime.sql` 만 존재 |

**해소 결과:** 코드 자산 존재는 **확정**. 물리 스키마 출처는 **미확정** (migration 밖에서 생성됨).
→ Logical inventory/SKU/Serial flow 구현은 가능. **Physical schema/migration 확정은 계속 금지.**

### 4.3 Legacy 존재 ↔ 최신 Master 미반영 (Loss Risk)

| Legacy 기능 | Recovery Queue | 최신 Master 반영 | 처리 |
|---|---|---|---|
| 판매 기록 (`salelog`) | REC-L01 OPEN | PARTIAL | 고객360/계약 이력 통합 검토. 별도 메뉴 필요성 미확정 |
| 상품/수당 관리 (`product`) | REC-L02 OPEN | PARTIAL | 견적 Rule·수수료/상품 Master 경계 검토 |
| 홈페이지 신청함 (`customer-requests`) | REC-L03 OPEN | PARTIAL | 신규유입 View 통합 여부 검토 |
| AI 업무 도우미 (`aihelper`) | REC-L07 INTEGRATE | PARTIAL | 기존 Source 통합. **신규 AI 기능 생성 금지** |
| 할일관리 (`mytask`) | REC-L08 MOVE | PARTIAL | 팀플레이 하위. 고객업무 TODAY와 **분리 유지** |
| 업무 게시판 (`flowboard`) | REC-L09 MOVE | **NO** | 팀플레이 하위 후보. 공지사항과 동일시 금지 |
| 팀 채팅 (`chat`) | REC-L10 HOLD | **NO** | 신규 채팅 임의 생성 금지 |
| 프로젝트관리 (`project`) | REC-L12 MOVE | **NO** | 팀플레이 하위 후보. 독립 PM 신규 설계 금지 |
| 전자계약서 (`econtract`) | REC-L13 OPEN | PARTIAL | 고객 계약 ↔ 개인 계약 용도 분리 확인 필요 |
| 블로그 마케팅 자동화 (`vendors`) | REC-L14 HOLD | **NO** | OC 직접 복원 금지 |
| CCTV (`cctv`) | REC-L15 HOLD | **NO** | 삭제 금지. 민감권한 필요 |
| 채널 관리 (`channel`) | REC-L20 HOLD | **NO** | Ownership 확정 전 승격 금지 |
| 광고 관리 (`ads`) | REC-L21 HOLD | **NO** | OSP Ownership 침범 금지 |
| 자산·비품 | REC-L26 OPEN | PARTIAL | 고객공급 재고 ↔ 회사 내부 자산 구분 필요 |
| **명함관리 (`namecard`)** | **Queue 미등록** | **NO** | ⚠ **신규 Loss Risk** — `biz_namecards`(9회) 실자산. REC 항목 부재 → `ODR-04` |
| **수수료 등급 (`biz_commission_grades`)** | **Queue 미등록** | PMG-104 HOLD | ⚠ Formula 미확정 HOLD이나 Legacy 등급 자산 실재 → `ODR-05` |
| **공휴일 (`biz_holidays`)** | **Queue 미등록** | PHR-105 부분 | 근무·휴가 계산 기반 자산 |
| **신규 매장 셋업 (`setup`)** | REC-L06 INTEGRATE | 신규설치 Flow | Legacy에서도 "준비중" 상태 |
| **가맹점 매출 조회 (`store-sales`)** | REC-L05 INTEGRATE | 고객360 Projection | Legacy에서도 "준비중" + admin 전용 |

### 4.4 최신 Master 신규 ↔ Legacy 부재 (신규 개발 필요)

| 최신 Master | Legacy 상태 |
|---|---|
| VS Assignment / Evidence / Verified Complete | **부재.** `installer_id`/`engineer_id`/`assigned_to` 실사용 흔적 없음 |
| Activity Ledger | **부재** |
| Tool Registry (`PST-490`/`PCS-190` 카드형 Hub + 빈 슬롯 CRUD) | **부재.** 마진계산기만 단품 존재 |
| Settings Registry / Audit / Rollback (`PSET-101~105`) | **부분.** `biz_settings`·`biz_audit_logs` 있으나 Registry·복구 체계 부재 |
| 최신 Permission Enforcement (Row/Field Scope) | **부재.** Legacy RLS 취약 |
| CS→VS 3-block Handoff | **부재** |
| 계약 심의 4유형 표준 | **부분.** `contract_status` 자유 text |

### 4.5 ID 체계 이동 (지시서 용어 ↔ v0.2 Master)

| 지시서 용어 | v0.2 실제 | 조치 |
|---|---|---|
| 조직도 | `PHR-101 우리 팀` (조직도는 3Depth) | v0.2 ID 사용. 표시명은 `PSET-103`으로 조정 가능 |
| 업무 분장표 | `PHR-103 역할·업무분장` | 동일 |
| 파트너사 | `PCI-201/202 거래처 관리` 의 **한 유형** | `PPT-101/102`는 v0.1 전용. **신규 파트너사 독립 Master 생성 금지** |
| — | `PHR-106 인사 이력` | v0.2에서 **삭제됨.** Canonical ID 복원 금지 |

---

## 5. 분리 보고 — 차량 / 주차 / 일정·미팅 / 제조사 입고 A/S

지시서 6항: **과거 존재 여부**와 **현재 채택 여부**를 분리한다.

| 기능 | 과거(Legacy) 존재 | 실측 근거 | 현재 채택 | 구현 가능 |
|---|---|---|---|---|
| **차량 관리** | **존재 (독립 메뉴)** | `hr-admin` 섹션 `{ id: 'vehicle', label: '차량 관리', role: 'admin' }`. UI에 차량명·번호판·피보험자 검색(`vhSearch`), 차량 1(박재훈)/차량 2(아반테)/차량 3(레이) 창고 배정. **전용 테이블 없음** | `PMG-201 회사운영 > 차량 관리` — **PROPOSAL** | ❌ **구현 금지** |
| **주차 관리** | **존재 (흡수 페이지)** | `NAV_ALIAS_LABEL.parking = '주차 관리'`, `회사 정보` 탭으로 흡수. "현대테라타워 주차 배정 현황 및 등록 차량" 안내. **카카오 주차는 iframe 불가 → 외부 링크**. 전용 테이블 없음 | `PMG-202 회사운영 > 주차 관리` — **PROPOSAL** | ❌ **구현 금지** |
| **일정·미팅** | **존재 (독립 메뉴 + 흡수)** | `collab` 섹션 `{ id: 'schedule', label: '일정·미팅' }`. `미팅관리`·`위클리미팅` 흡수. `biz_schedules`(5) · `biz_meetings`(5) | **독립 메뉴 미채택.** TM 영업 일정(PST-103) / 방문 영업 일정(PST-201) / VS(PCS-102) / TODAY(PCS-101)로 **업무별 분산** | ⚠ **공통 일정 페이지 생성 금지.** 업무별 일정 View만 구현 |
| **제조사 입고 A/S** | **존재 (독립 메뉴)** | `team-support` 섹션 `{ id: 'as-receive', label: 'A/S 입고 (제조사)' }`. `biz_manufacturer_as`(10) + migration `0011_create_manufacturer_as.sql` | **독립 메뉴 미채택.** `A/S 접수(PCS-103) Case` + `택배 및 제품 수발주(PCS-104)` + `고객 360 이력`으로 **연결** | ✅ **구현 가능** — 단, 독립 메뉴 분리 금지. `biz_manufacturer_as` 자산은 삭제 금지 |

**요약**
- 차량·주차: Legacy 실재 → 최신 Master가 **위치는 확정**(경영관리>회사운영), **상태는 PROPOSAL** → 삭제 금지 + 구현 금지.
- 일정·미팅: Legacy 실재 → 최신 Master가 **독립 메뉴를 명시적으로 거부** → 업무별 일정으로 흡수.
- 제조사 입고 A/S: Legacy 실재 → 최신 Master가 **독립 메뉴 거부, 기능은 유지** → PCS-103/104 안에서 구현.

---

## 6. Owner Decision Required

`docs/DECISIONS.md` §6 참조. 착수 차단 순으로:

| # | 항목 | 차단 범위 |
|---|---|---|
| **ODR-01** | **기술 스택 확정** | **전체 구현 차단** |
| **ODR-06** | 고객 360 정책 충돌 (Legacy 폐지 vs 최신 복원) | PST-301 + 파생 View 전체 |
| ODR-02 | `oc.payplay.kr` 현재 배포 Repository 확정 | Existing Code 물리 재사용 정밀도 |
| ODR-03 | `PCS-106` 재고 물리 스키마 출처 | PCS-106 Migration |
| ODR-04 | `biz_namecards` (명함관리) 처리 방향 | Loss Risk 해소 |
| ODR-05 | `biz_commission_grades` 처리 방향 | PMG-104 재판정 |

---

## 7. 첫 구현 Batch 제안

지시서 후보 우선순위 7종을 v0.2 ID로 매핑한 결과 **전부 `CONFIRMED`/`CURRENT` + `READY WITH DEPENDENCY`** 로, 착수 가능하다.
단, Handoff v0.2 §10 실행 순서(`Foundation → Company → Sales → Customer → Teamplay → Settings`)에 따라 Foundation을 선행한다.

### Batch 0 — Foundation (선행 필수, 화면 없음)

| WP | 내용 | 판정 |
|---|---|---|
| WP-F01 | Domain 골격 `company/sales/customer/teamplay/settings` + `shared` + `legacy-adapters` | NEW |
| WP-F02 | Permission Guard — 4역할 + Row/Field Scope + Restricted Domain | NEW |
| WP-F03 | Activity Ledger 골격 (고객 360 이력 단일 유입구) | NEW |
| WP-F04 | Menu Canonical ID Registry (`PSET-103` 대비, Display/Order/Visibility 분리) | NEW |
| WP-F05 | Audit Log + Before/After + 복구 골격 (`PSET-105` 대비) | NEW |

> ⚠ WP-F02는 Shared IAM 물리 확정 금지(P-003) 하에서 **Logical Permission 계약**만 정의한다.

### Batch 1 — 지시서 후보 7종

| 순서 | 지시서 후보 | v0.2 ID | 상태 | Readiness | 판정 | 제외 Dependency |
|---|---|---|---|---|---|---|
| 1 | 파트너사 | **PCI-201 / PCI-202** 거래처 관리·상세 | CONFIRMED | RWD | REUSE+MODIFY | Physical schema/API binding |
| 2 | 신규유입 | **PST-101** | CONFIRMED | RWD | MODIFY | OSP intake / shared customer binding |
| 3 | 가망고객 | **PST-102** | CONFIRMED | RWD | MODIFY | Customer360 shared binding |
| 4 | 고객 360 골격 | **PST-301** | CONFIRMED | RWD | MODIFY | Shared Person/Merchant/IAM physical — **ODR-06 선결** |
| 5 | TODAY 골격 | **PCS-101** | CONFIRMED | RWD | MODIFY | VS 이동중·오프라인·중복배정 Rule 제외 |
| 6 | 조직도 | **PHR-101** 우리 팀 | CONFIRMED | RWD | MODIFY | Physical Member/IAM binding |
| 7 | 업무 분장표 | **PHR-103** 역할·업무분장 | CONFIRMED | RWD | MODIFY | 동일 |

### Batch 1 구현 범위 제한

- 전부 **Logical / Mock** 범위. Physical binding·Provider 연결 없음.
- `PST-101/102`는 고객 360의 **View/Queue**로 구현. 별도 고객 Master 생성 금지.
- `PST-301`은 **골격만** — 기본정보 + 현재 진행업무 + 최근 이력. 역할별 View는 후속.
- `PCS-101`은 **골격만** — `예정/진행/보류/완료` 상태 + 날짜별 열람. VS Verified Complete 연동은 후속.
- `PHR-101/103`은 Sheet `조직도 및 업무분장표` 탭(2026-09-05, Owner 김성재)을 Source로 사용. **HR Restricted 필드 제외.**
- 고양센터·대구센터 인력 배치는 Sheet상 `OPEN` → 구현 시 빈 상태로 두고 임의 배치 금지.

### Batch 1 제외 (명시)

`PMG-*` 전체 · `PSET-106` · 채널·광고 · 팀채팅 · 프로젝트관리 · 업무 게시판 · 블로그 마케팅 자동화 · WDI 독립코드 · 재고 Migration · Logen Production Binding · CS도구 실 endpoint.

---

## 8. 변경 예정 파일 목록

현 시점 실제 변경 파일은 **문서 4종 + README**뿐이다. 앱 구조는 ODR-01 확정 전까지 생성하지 않는다.

| 파일 | 상태 |
|---|---|
| `README.md` | 수정 |
| `docs/SOURCE_PRIORITY.md` | 신규 |
| `docs/DECISIONS.md` | 신규 |
| `docs/HANDOFF.md` | 신규 |
| `docs/RECOVERY_REPORT.md` | 신규 |

**ODR-01 확정 후 생성 예정 (아직 생성하지 않음):**
`<stack>` 설정 파일 · `src/domains/{company,sales,customer,teamplay,settings}/` · `src/shared/{permission,ledger,registry,audit}/` · `src/legacy-adapters/` · `db/migrations/` (Logical only)

---

`New Product Meaning Created = 0`
