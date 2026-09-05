# SOURCE PRIORITY — 기준 소스 우선순위

| 항목 | 내용 |
|---|---|
| Document ID | PPOC2-SRC-001 |
| Status | WORKING |
| Last Reviewed | 2026-09-05 |
| 목적 | 구현 판단 시 어떤 문서를 우선하는지 고정한다. 임의 판단 방지. |

---

## 1. 우선순위 (Owner 지시 기준)

| 순위 | 소스 | 실제 확인된 자산 |
|---|---|---|
| 1 | Google Sheet `OC 사이드바-0904` | `[제작기획] 페이플레이 OC 사이드바 - 0904` (Sheet ID `1WDWPPZaVZOv-Rli6mgeo6CuvTKyLwSthWL_6vpvK69M`, 최종수정 2026-09-05 10:41) |
| 2 | `07 : OC 개발 기획 (카테고리 기준)` | 위 Sheet 내 **DEV MASTER v0.2 — 6대 카테고리 / Owner Decision 반영 / 2026-09-05** 탭 |
| 3 | Notion `17. OC Development Handoff — 개발자 전달본 v0.1` | **v0.2가 존재한다.** 아래 §2 참조 |
| 4 | 연결 상세기획 (Customer 360 / Sales Flow / TODAY / CS&VS / Organization) | Notion `[R&A] PayPlay OC` 하위 + `payplay-product-docs/10_OC/**` |
| 5 | 최신 Owner Decision | `docs/DECISIONS.md` |
| 6 | 기존 TMS / 기존 OC Source | `nroadcompany-ux/payplay-tms` (최신 main), `payplay-product-docs/10_OC/01_RECOVERY/**` |
| 7 | 현재 구현 코드 | **재사용 Reference. 자동 정답 아님.** |

---

## 2. v0.1 → v0.2 지시 정정 (중요)

지시서는 Notion `17. ... v0.1`을 3순위로 명시했으나, 실제 워크스페이스에는
**`18. OC Development Handoff — 개발자 전달본 v0.2` (최종수정 2026-09-05 11:13)** 가 존재한다.

"최신 Owner Source보다 과거 문서를 우선하지 말 것" 규칙에 따라 **v0.2를 3순위로 적용한다.**

- v0.2: <https://app.notion.com/p/3d253327fb8681bb995fd90ec4df1f3d>
- v0.1: <https://app.notion.com/p/3d253327fb8681479b75d6e0944a27ec> (Reference)
- `[중복 생성본 — 사용 금지] OC Development Handoff v0.1 Copy 1/2/3` — **사용 금지**
- Sheet 내 `DEV MASTER v0.1` 탭 — `[구버전 참고용 / 개발 사용 금지]` 라벨. 사용 금지
- Sheet 내 `07 백업 - 2026-09-05 구조개편 전` — 구버전 참고용. 개발 기준 사용 금지

---

## 3. 개발자 판독 순서 (Handoff v0.2 §11 / §12)

```
07 Sheet Master (ID·상태)
  → 09 : Developer Readiness (착수 가능 여부)
  → 10 : Existing Code Recovery (물리 재사용 판정)
  → Development Documentation Master / Documentation Delta & Trace
  → Existing Detailed Specs
  → Handoff v0.2
  → 구현
```

---

## 4. Google Sheet 탭 인벤토리 (확인 완료)

| 탭 성격 | 역할 | 상태 |
|---|---|---|
| 용어 및 규칙의 정의 | 고객 360 / TODAY / Lead 360 / TM 1차 / 현장영업 2차 / VS / CS 정의 | 기준 |
| 업무 ID | Prefix 정의 (PCI/PST/PCS/PHR/PPT) | 기준 |
| 기존 0904 (정우용 작) | 구 사이드바 계층 | Reference |
| 변경 → (수정 요청사항) | Owner 수정 요청 원본 | Reference |
| 기획문서 | 허브 / 바로가기 | Reference |
| **07 : OC 개발 기획 (카테고리 기준) — DEV MASTER v0.2** | **개발 Master** | **기준** |
| DEV MASTER v0.1 | 구버전 | 사용 금지 |
| 조직도 및 업무분장표 | 조직·보고·협업·책임 (2026-09-05, Owner 김성재) | 기준 |
| LEGACY RECOVERY QUEUE v0.1 | REC-L01~L26 Loss Audit | 기준 |
| **09 : Developer Readiness (MATRIX v0.2)** | 착수 판정 Master | **기준** |
| **10 : Existing Code Recovery (MATRIX v0.1)** | 물리 재사용 판정 | **기준** |

---

## 5. 로컬 Recovery Source 위치

| 자산 | 위치 |
|---|---|
| Legacy TMS (최신 main) | `nroadcompany-ux/payplay-tms` — 단일 SPA (`index.html` 179KB / `app.js` 1.85MB / `db.js` 175KB) + `db/migrations/*.sql` 60여 개 |
| OC 기획 문서 세트 | `nroadcompany-ux/payplay-product-docs` → `10_OC/**` (APPROVED/SOT 문서 6종 포함) |
| OC 스캐폴드 | `nroadcompany-ux/payplay_os` → `apps/ppoc` (골격 21파일, 기능 없음) |

> `~/projects/payplay-tms` 로컬 클론은 origin/main 대비 **269 커밋 뒤처짐**. 판정 근거로 사용 금지.

---

## 6. 충돌 처리 규칙

- 소스 간 충돌 시 개발자가 판단하지 않는다. 해당 ID를 `CONFLICT` / `NOT READY` / `HOLD` 중 하나로 반환한다.
- 질문으로 신규 Rule을 만들지 않는다.
- Pending은 소스코드 편의를 이유로 Decision으로 간주하지 않는다.
