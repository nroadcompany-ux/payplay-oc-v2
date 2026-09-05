# [OC] TEST / ACTIVE / Foundation Contract Cases [2026-09-05]

## T-01 Canonical Menu ID
Given `PSET-103` changes a menu display name/order/visibility, when the change is applied, then the canonical Sheet ID, route owner and data owner remain unchanged and an audit record is required.

## T-02 Permission — Row Scope
Given a user has no explicit row scope grant, when a domain list is evaluated, then access is denied by default. Legacy allow-all RLS must not be treated as a valid permission source.

## T-03 Permission — Field Visibility
Given a field is sensitive, when no explicit visibility grant exists, then the field is hidden.

## T-04 Permission — Action
Given a user can view a record but lacks action permission, when an edit/complete/delete action is evaluated, then the action is denied without changing source data.

## T-05 Activity Ledger Append-only
Given an existing activity event, when a schedule is changed or cancelled, then the prior event is preserved and a new event is appended rather than overwriting history.

## T-06 Customer360 Boundary
Given a domain transaction completes, when Customer360 history is refreshed, then the result appears through Activity Ledger without creating a second customer master.

## T-07 TODAY Projection Boundary
Given a TODAY item points to a source transaction, when the user opens it, then the user is routed to the source detail; TODAY itself must not directly mutate the source transaction.

## T-08 TODAY VS Completion
Given a VS job has field work result but required Evidence is incomplete, when TODAY completion is evaluated, then the item cannot become completed. `Verified Complete` is required.

## T-09 Sales State Transition
Given a lead/opportunity state, when no user action occurs, then the state does not automatically advance.

## T-10 HOLD Guard
Given an implementation references `PSET-106`, PMG scope, physical IAM/Person/Merchant, real provider, inventory physical migration, Logen production, or Cleaner/Recovery/Format endpoint, then the batch is rejected as HOLD.

## Gate

- Expected pass: T-01~T-10
- Physical integration: not tested in this batch because it remains HOLD.
- Technology stack: not selected in this batch (`ODR-01 OPEN`).

`New Product Meaning Created = 0`
