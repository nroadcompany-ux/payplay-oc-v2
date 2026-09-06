# [OC-TEAM] EVIDENCE / CURRENT / Teamplay·Permission Gap Recovery [2026-09-06]

## 목적
Owner 제공 Current Source Archive의 Employee/Auth/Navigation 자산을 v2 Canonical `PHR-101~108 / PSET-102~105` 기준과 대조한다.

## Current Source — 확인된 Employee 자산
Backend EmployeeAccount는 다음을 직접 보유한다.

- Role: OWNER / ADMIN / STAFF / EXTERNAL / ROOKIE / GUEST
- Status: ACTIVE / REJECTED / DELETED
- Department: 경영지원팀 / CS팀 / 영업지원팀 / VS팀
- Position: 사원~대표
- Profile: 이름 / 전화 / 이메일
- Access 변경
- 조직정보 변경
- 로그인 가능 여부 검증
- OWNER 보호 Rule
- 자기 자신의 Access 변경 금지 Rule

Physical Model로 EmployeeAccount / EmployeeSession / EmployeeLoginHistory가 존재한다.

Frontend에는 `/users`, `/my-page`, `RequireNavAccess`, `minRole`, role 기반 visible nav가 존재한다.

## Current Navigation Permission
현재 구조는 주로 Role Threshold 방식이다.

예:
- 계약/재고/발주/배송 = STAFF 이상
- 시스템 설정 = ADMIN 이상
- 사용자 관리/전자서명 규칙/보안 = ADMIN 영역
- 개별 화면에서 `canEdit`, `canManage`, `canViewResidentNumber` 등 boolean capability 계산

판정: **Role/Menu Gate는 재사용 가능하지만 v2 Permission Model 전체를 충족하지 못한다.**

## v2 Canonical — Teamplay

### PHR-101 우리 팀
- 조직도 / 비상연락망
- 센터·소속·책임자·연락망
- 직영/외부 구분

### PHR-102 구성원
- 소속 / 직급 / 역할 / 근무형태
- 민감정보 제한

### PHR-103 역할·업무분장
- 책임 / 주요업무 / 지원 / 대체담당

### PHR-104 보고·협업
- 보고라인 / 협업관계

기타 PHR-105/107/108은 근무·휴가, 내 정보, 내 업무도구를 Current Source와 추가 Mapping한다.

`PHR-106`은 생성 금지.

## v2 Canonical — Permission
PSET-102는 아래 4축을 모두 가져야 한다.

1. Menu Access
2. Row Scope
3. Field Visibility
4. Action Permission

추가 원칙:
- Default Deny
- 민감정보 기본 제한
- 외부 파트너 / 내부 직원 / 내부 관리자 / 운영자 구분
- System/API/DB/Security는 일반 관리자 수정 금지
- Physical IAM은 HOLD

## Gap 판정

| 항목 | Current | v2 필요 | Decision |
|---|---|---|---|
| Employee Account | 존재 | Teamplay 기본 사용자 자산 | REUSE |
| Role | 6종 존재 | v2 사용자 유형과 Mapping 필요 | MODIFY |
| Department | 4개 enum | 실제 조직/센터 구조 확장 필요 | MODIFY |
| Position | 존재 | 활용 가능 | REUSE |
| Users 화면 | 존재 | 구성원/권한 화면으로 재구성 | MODIFY |
| My Page | 존재 | PHR-107 후보 | MODIFY |
| Menu Access | minRole / RequireNavAccess | v2 Menu Permission | REUSE+MODIFY |
| Row Scope | 미확인 | 필수 | NEW |
| Field Visibility | 화면별 일부 boolean만 존재 | 공통 정책 필요 | MODIFY |
| Action Permission | 화면별 일부 boolean 존재 | 공통 정책화 필요 | MODIFY |
| Default Deny | 전역 정책으로 명확하지 않음 | 필수 | NEW |
| Audit | LoginHistory/도메인 History 존재 | Permission Before/After + Decision Trace | MODIFY |
| Recovery | 설정 공통 Recovery 미확인 | PSET-105 필수 | NEW |
| Org Chart | direct current surface 미확인 | PHR-101 | NEW/MODIFY |
| 업무분장 | direct current domain 미확인 | PHR-103 | NEW |
| 보고·협업 | direct current domain 미확인 | PHR-104 | NEW |
| Physical IAM | Employee physical schema 존재 | v2 final Physical Architecture | HOLD |

## Role Mapping 주의
Current Role을 v2 사용자 유형에 1:1 고정 매핑하지 않는다.

Current:
- OWNER
- ADMIN
- STAFF
- EXTERNAL
- ROOKIE
- GUEST

v2 Permission 사용자 구분:
- 외부 파트너
- 내부 직원
- 내부 관리자
- 운영자

따라서 Current enum은 Recovery Source이고, v2 Permission Contract에서 Logical Mapping을 별도 둔다.

## PSET-103 Menu Settings
Current `navConfig.ts`는 Sidebar를 코드로 고정한다.

v2에서는:
- Canonical ID immutable
- Display Name 변경 가능
- Order 변경 가능
- Visibility 변경 가능
- Route Owner/Data Owner 변경 금지

따라서 Current nav config 자체는 **MODIFY** 대상이다.

## PSET-105 Audit/Recovery
Current에 재사용 가능한 History 자산:
- EmployeeLoginHistory
- ContractActivity
- StoreActivity
- LeadActivity

하지만 설정 변경 공통 Audit에는 아래가 추가로 필요하다.
- Before
- After
- Actor
- Timestamp
- Reason/Context
- Recovery Target

## PM 판정
- Teamplay Employee/Auth foundation = HIGH REUSE
- 조직/업무분장/보고 Surface = NEW/MODIFY
- PSET-102 = MODIFY, Row/Field/Action 정책 보강 필수
- PSET-103 = MODIFY
- PSET-105 = MODIFY + Recovery 신규 보강
- PSET-106 = HOLD
- Shared IAM Physical = HOLD

New Product Meaning Created = 0
