# payplay-oc-v2

PayPlay Operations Center — customer 360 based internal operations system.

## Status

**Phase: Recovery / Pre-implementation.**
No application scaffolding exists yet. The technology stack is **not confirmed** and
no app structure is created until the Owner confirms it.

| Gate | State |
|---|---|
| Repository created | DONE (2026-09-05) |
| Recovery report | DONE — see `docs/RECOVERY_REPORT.md` |
| Tech stack decision | **PENDING (Owner)** |
| App structure | NOT STARTED (blocked by stack decision) |
| Code migration | NOT STARTED |
| DB migration | NOT STARTED |
| Provider / production binding | HOLD |
| Developer Start Gate | **CONDITIONAL GO** |

## What this repository is

This is not a new product. It is the reconstruction of the verified capabilities of the
existing PayPlay OC / TMS systems, realigned against the latest Owner Source, and then
implemented.

Existing deployed code is a **reuse reference, not an automatic source of truth**.

## Rules

1. Read the source priority order in `docs/SOURCE_PRIORITY.md` before any implementation.
2. Implement only IDs whose Google Sheet status is `CONFIRMED` or `CURRENT`.
   Never implement `OPEN`, `PROPOSAL`, or `HOLD`.
3. Never invent a new product meaning. Every completion report must end with
   `New Product Meaning Created = 0`.
4. Never delete an existing TMS capability solely because it is absent from the latest sheet.
5. When sources conflict, do not decide. Return `CONFLICT` and escalate to the Owner.

## Documents

| File | Purpose |
|---|---|
| `docs/SOURCE_PRIORITY.md` | Source of truth ranking and reading order |
| `docs/DECISIONS.md` | Confirmed Owner decisions, pending items, prohibitions |
| `docs/HANDOFF.md` | Development master: 6 categories, ID inventory, readiness, return format |
| `docs/RECOVERY_REPORT.md` | Existing code recovery, REUSE/MODIFY/NEW/HOLD, gap analysis, first batch |

Documents under `docs/` are written in Korean, matching the Owner Source terminology.
