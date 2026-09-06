# [OC-SETTINGS] BASELINE / WORKING / Permission Detailed Contract — 권한 상세 계약 [2026-09-06]

## Scope

Canonical: `PSET-102 권한 설정`.
Current source의 Role/minRole/nav access는 재사용하되 v2 Permission은 4축으로 확장한다.

## Permission Axes

1. Menu Access
2. Row Scope
3. Field Visibility
4. Action Permission

Default Deny를 기본으로 한다.

## Actor Classes

- 외부 파트너
- 내부 직원
- 내부 관리자
- 운영자

Current EmployeeRole은 Recovery Source이며 Canonical Actor/Permission과 1:1 동일하다고 가정하지 않는다.

## Menu Access

- category/menu visible
- direct route access
- disabled/HOLD route access denied
- hidden menu direct URL도 동일 권한 검사

## Row Scope

Candidate scopes:
- SELF
- ASSIGNED
- TEAM
- ORG
- ALL
- NONE

정확한 조직 Physical binding은 Shared IAM/Person HOLD를 침범하지 않는다.

## Field Visibility

필드 단위:
- visible
- masked
- hidden

민감정보는 메뉴 접근 허용만으로 자동 노출하지 않는다.

## Action Permission

예:
- create
- edit
- assign
- change_status
- approve/confirm where Current scope supports it
- export
- delete/deactivate
- close
- recover

조회 권한과 변경 권한은 분리한다.

## Audit

권한 변경에는:
- actor
- target
- before
- after
- reason
- timestamp
- recovery reference

가 필요하다.

## Rules

1. Legacy allow-all/RLS 구조 그대로 승계 금지.
2. Menu access가 있어도 Row/Field/Action이 별도 Deny일 수 있다.
3. PSET-106 System/API/DB/security 변경은 일반 관리자에게 부여 금지.
4. HOLD 메뉴는 권한 설정으로 우회 활성화할 수 없다.
5. 권한 변경은 Audit/Before-After/복구 가능해야 한다.
6. 실제 Shared IAM physical schema는 별도 Gate.

## Acceptance

- AC-PERM-01 숨겨진 메뉴 URL 직접 접근도 차단된다.
- AC-PERM-02 Row Scope 밖 데이터가 목록/검색/직접 URL에서 노출되지 않는다.
- AC-PERM-03 Hidden Field는 API/UI 모두에서 정책에 맞게 처리된다.
- AC-PERM-04 Read 허용 + Edit 금지가 가능하다.
- AC-PERM-05 역할 변경 전후 Audit가 남는다.
- AC-PERM-06 HOLD 기능은 어떤 일반 권한으로도 활성화되지 않는다.
- AC-PERM-07 PSET-106은 일반 관리자에게 노출/수정되지 않는다.
- AC-PERM-08 Default Deny가 적용된다.

Decision: `PSET-102 = MODIFY` / Shared IAM Physical Architecture = HOLD.

`New Product Meaning Created = 0`
