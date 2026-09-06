# [OC] REGISTER / CURRENT / Story·Task·AC Final Trace — 스토리·태스크·AC 최종 추적 [2026-09-06]

## 목적
Owner DEV MASTER의 Canonical ID가 구현 단위와 Acceptance로 끊기지 않고 이어지는지 최종 검수한다.

## Trace Rule
각 구현 가능 ID는 최소 다음 Chain을 가진다.
`Canonical ID → User/Operator Goal → Task → Flow/Screen → Rule/Permission → Acceptance → Source/Return → HOLD Dependency`

## Representative Trace

| Canonical | Goal | Main Task | Screen/Flow | Acceptance Source | Verdict |
|---|---|---|---|---|---|
| PCI-101 | 오늘 회사 업무 파악 | 업무/상태 확인 | 업무 홈 | foundation/core/interactive cases | PASS |
| PST-101 | 신규 상담 처리 | Intake 확인·Lead 연결 | 신규유입 | sales logical + integration | PASS |
| PST-301 | 가맹점 전체 맥락 확인 | 기본정보·Activity·Source 진입 | 고객360 | core/integration/prototype P-02 | PASS |
| PCS-101 | 내 업무 우선순위 처리 | Queue→Source→Return | TODAY | work-projection + interactive | PASS |
| PCS-102 | 현장업무 증빙 완료 | 도착→진단→Evidence→완료요청 | VS | CS/VS acceptance | PASS WITH HOLD |
| PCS-103 | A/S 접수·처리 | 진단→처리/VS Handoff→Case Close | A/S | CS/VS acceptance | PASS |
| PCS-104 | 제품 수발주 처리 | 발주/배송/수령/회수 | Operations | inventory projection acceptance | PASS WITH PROVIDER HOLD |
| PCS-105 | 미수 업무 후속관리 | 잔액확인→후속→완료확인 | Receivable | Receivable Contract AC | PASS WITH PROVIDER HOLD |
| PCS-106 | 재고/Serial 확인 | 입출고·배정·이동 | Inventory | inventory projection acceptance | PASS WITH PHYSICAL HOLD |
| PST-401/402 | 견적 작성·전송·계약전환 | 견적 CRUD/PDF/전송/전환 | Quote | AC-QTE-01~08 | PASS WITH POLICY HOLD |
| PCI-201/202 | 거래처 단일 Master 관리 | 등록·유형·상세·비활성 | Vendor | AC-VND-01~05 | PASS WITH PHYSICAL HOLD |
| PSET-102 | 업무권한 통제 | Menu/Row/Field/Action 설정 | Permission | AC-PERM-01~08 | PASS WITH IAM PHYSICAL HOLD |
| Contract/e-sign | 서명 진행 추적 | 문서선택→발송→결과→Activity | Contract/e-sign | AC-CAL + preservation audit | PASS WITH PROVIDER HOLD |

## Cross-cutting AC
모든 대표 Flow는 아래 공통 AC를 만족해야 한다.
1. Source Context와 Return Context 보존.
2. Empty와 Error 구분.
3. Permission denied 처리.
4. 실패/Partial이 Source 상태를 임의 완료시키지 않음.
5. Activity/Audit trace 보존.
6. HOLD 우회 구현 금지.
7. Canonical ID 변경 금지.
8. New Product Meaning Created = 0.

## Non-executable Trace
- PMG 개별 기능: Story/Task가 존재해도 Current Development AC로 실행 승격 금지.
- PSET-106: Security/Dev Gate 전 구현 AC 실행 금지.
- PHR-106: Canonical Source에 없으므로 생성/Trace 금지.

## Verdict
현재 구현 가능 P0/P1 Logical Scope에 **Story/Task/AC 단절로 인한 P0 Blocking은 확인되지 않음**.
Prototype에서 실제 화면 흐름과 Human Validation을 확인한 뒤 Final Developer Handoff에 첨부한다.

`New Product Meaning Created = 0`
