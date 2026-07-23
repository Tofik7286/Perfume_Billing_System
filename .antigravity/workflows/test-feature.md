# 🧪 Test Feature Workflow (Command: `/test-feature`)

Execute automated test suites for the active feature, generate missing tests, and auto-fix failing code.

**Usage:** `/test-feature <step_number>-<feature_slug>`  
**Example:** `/test-feature 01-user-auth`

**Allowed Tools:** Read, Write, Edit, Glob, Bash

---

## Step 1 — Verify Active Feature Context

1. Read `.antigravity/specs/active/<step_number>-<feature_slug>.md`.
2. Inspect all modified files listed in the feature spec.
3. Verify that all implementation tasks `- [x]` are complete before testing.

---

## Step 2 — Backend Test Suite Execution (Django / DRF)

1. Check for existing tests in `app_name/tests/` or `app_name/tests.py`.
2. **Generate Missing Test Cases:**
   - Write tests using DRF's `APITestCase` covering:
     - `401 Unauthorized`: Request without valid Bearer token.
     - `400 Bad Request`: Invalid payload or missing required fields.
     - `200 OK` / `201 Created`: Successful API execution.
     - Permission boundaries and model constraints.
3. **Execute Backend Tests:**
   Run:
   ```bash
   python manage.py test <app_name>
Step 3 — Frontend Test Verification (React + JSX)
Verify component rendering and form validation logic for newly implemented React components.

Verify custom TanStack Query hook mock responses and error state handling.

Step 4 — Self-Correction Repair Loop (Max 3 Attempts)
If any backend or frontend test fails:

Capture error traceback and failing assertion logs.

Analyze root cause (e.g., serializer validation mismatch, missing ORM field, unhandled HTTP status code).

Apply targeted code fix directly to the codebase.

Rerun test execution command.

Repeat up to 3 iterations. If tests still fail after 3 attempts, halt and request human intervention with a diagnostic log.

Step 5 — Report Test Summary
Print a structured summary report to the user:

Plaintext
========================================
🧪 AUTOMATED TEST SUITE REPORT
========================================
Feature: <feature_title>
Status:  PASSED / FAILED

Backend Tests:  [X] Passed | [Y] Failed
Frontend Tests: [X] Passed | [Y] Failed

All test scenarios verified successfully!
Run `/code-review-feature <step_number>-<feature_slug>` to perform security & quality review.
========================================