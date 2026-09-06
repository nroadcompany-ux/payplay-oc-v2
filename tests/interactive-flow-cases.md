# [OC] TEST / ACTIVE / Interactive Flow & Visual Guard Cases [2026-09-05]

## Scope
Logical/Mock interaction only. No physical DB, provider, credential, production binding, or HOLD uplift.

## Source / Return Interaction

1. `PCI-101 Home → PCS-101 TODAY` preserves Work Projection boundary.
2. `PCS-101 TODAY → PCS-103 A/S Source` stores return target as TODAY context.
3. `PCS-101 TODAY → PST-401 Sales Source` stores return target as TODAY context.
4. `PST-301 Customer360 → PCS-103 A/S` preserves Customer360 as canonical customer context.
5. `PST-301 Customer360 → PST-401 Sales` does not create a duplicate Customer Master.
6. `PCS-103 A/S → PCS-102 VS` represents CS→VS handoff only after existing handoff context.
7. `PCS-102 VS → PST-301 Customer360` represents Activity Ledger/history return, not direct customer transaction mutation.
8. `PST-401 Sales → PST-301 Customer360` preserves manual sales transition rule.
9. `PCS-104/105/106 Operations → PST-301 Customer360` remains Logical/Mock only.
10. A routed Source page with `returnTo` exposes an explicit Return action.
11. Return action navigates to the stored prior context without mutating Source state.
12. Direct menu navigation does not fabricate a return context.

## Permission / Settings Guard

13. `PSET-102` remains Default Deny contract: Menu + Row Scope + Field Visibility + Action Permission.
14. `PSET-103` Canonical ID remains immutable; only displayName/order/visibility are mutable.
15. `PSET-105` requires Before/After audit and recovery semantics.
16. `PSET-106` remains HOLD and is never promoted by UI convenience.

## Visual Language v2 Regression Guard

17. Page canvas is N0/White; N50 is local only.
18. Simple metrics are separated by whitespace/divider rather than individual cards.
19. Orange400 `#F07200` is limited to action/selection/highlight.
20. Orange Filled CTA uses contrast-safe dark text, not white normal text.
21. Success/Error/Warning must not change the full-page background.
22. OC uses Clean & Dense density while preserving shared PayPlay typography/spacing/radius grammar.
23. Desktop actionable targets are at least 32×32; primary navigation/action targets are designed at 44px+ where practical.
24. Color-only state communication is prohibited.

## HOLD Regression

25. No Prisma physical model or migration added.
26. No Logen production binding added.
27. No real provider/credential/production binding added.
28. No Shared Person/Merchant/IAM physical architecture inferred.
29. No PMG or PSET-106 implementation promoted.
30. No new Product Meaning created.
