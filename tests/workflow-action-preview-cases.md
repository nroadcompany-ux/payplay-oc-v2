# [OC] Sprint 1 Workflow Action Preview Cases

Status: WORKING / LOGICAL MOCK ONLY

## Sales
1. PST-101 → PST-102 is manual preview only.
2. PST-102 → PST-103 is manual preview only.
3. PST-102 → PST-201 is manual preview only.
4. Quote → Contract returns a handoff preview and does not include internal approval.
5. Sales preview never creates a duplicate Customer Master.
6. Sales preview returns `persisted=false`.

## Service / VS
7. Partial Complete preview is allowed without closing the A/S Case.
8. Revisit preview is allowed without closing the A/S Case.
9. Verified Complete with 0/4 evidence returns Missing Evidence.
10. Verified Complete with 1/4 evidence returns Missing Evidence.
11. Verified Complete with 2/4 evidence returns Missing Evidence.
12. Verified Complete with 3/4 evidence returns Missing Evidence.
13. Verified Complete with 4/4 evidence is allowed.
14. A/S Case Close is a separate action from VS Verified Complete.
15. Service preview returns `persisted=false`.
16. Service preview keeps Activity Ledger append-only semantics.

## Operations
17. PCS-104 supply action preview does not bind Logen production.
18. PCS-105 receivable follow-up preview does not allocate a physical entity.
19. PCS-106 inventory preview does not create a physical schema.
20. Operations preview returns `physicalMutation=false`.
21. Operations preview returns `persisted=false`.
22. Operations return target remains Customer360 context.

## Settings / Permission / Audit
23. PSET-102 permission preview includes before/after audit values.
24. Default permission policy remains DENY.
25. PSET-103 displayName change preview is allowed.
26. PSET-103 Canonical ID change preview is denied.
27. Denied Canonical ID preview preserves the original value.
28. Mutable Settings preview exposes recovery availability.
29. PSET-106 remains HOLD and has no action preview.
30. Settings preview returns `persisted=false`.

## Design / Accessibility
31. Workflow actions use Orange400 only for the primary action.
32. Orange400 button text uses N950 dark text.
33. Secondary actions remain White + Neutral border.
34. Evidence state is not communicated by color alone.
35. Keyboard focus remains visible on action buttons and checkboxes.

## HOLD Regression
36. No Prisma model is introduced by this workflow batch.
37. No migration directory is introduced by this workflow batch.
38. No provider credential is introduced by this workflow batch.
39. No production endpoint is introduced by this workflow batch.
40. PMG / PSET-106 remain outside executable scope.

New Product Meaning Created = 0
