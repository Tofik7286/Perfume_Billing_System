# 🔍 Code Review Workflow (Command: `/code-review-feature`)

Perform automated security vulnerability scans and code quality audits before committing code to Git.

**Usage:** `/code-review-feature <step_number>-<feature_slug>`  
**Example:** `/code-review-feature 01-user-auth`

**Allowed Tools:** Read, Write, Edit, Glob, Bash (`git:*`)

---

## Step 1 — Inspect Changed Codebase

1. Run `git diff main...HEAD` to inspect all staged and unstaged code changes in the current feature branch.
2. Filter modified files into Backend (`.py`) and Frontend (`.jsx`, `.js`, `.css`).

---

## Step 2 — Security Audit Phase

Scan all changed files for critical security vulnerabilities:

1. **Secrets & Credentials Leakage:** Ensure no hardcoded JWT secrets, database passwords, or API keys exist.
2. **Authentication & Access Control:**
   - Verify every new DRF endpoint explicitly defines permission classes (`IsAuthenticated`, `IsAdminUser`, or `AllowAny`).
   - Check that React Axios requests properly transmit the Bearer token in headers.
3. **Database & Input Safety:**
   - Confirm ORM queries are parameterized (no unsafe raw SQL strings).
   - Confirm user input is validated before DB insertion or state update.

---

## Step 3 — Code Quality & Best Practices Audit

Check adherence to project standards defined in `.antigravity/rules/`:

1. **Frontend JSX Boundary:** Verify **ZERO TypeScript (`.ts`, `.tsx`)** files exist in `src/`.
2. **Clean Debugging Statements:** Ensure all `print()` statements in Django and `console.log()` statements in React are removed.
3. **ORM Performance:** Ensure `select_related()` and `prefetch_related()` are used on foreign key queries to prevent N+1 bottlenecks.
4. **Imports & Aliases:** Confirm path aliases `@/` are used for React imports instead of deep relative paths (`../../`).
5. **Styling & UI:** Verify Tailwind CSS utility classes and shadcn/ui components are used consistently.

---

## Step 4 — Auto-Remediation

If minor issues are identified (e.g., leftover `console.log`, missing `select_related`, or unused imports):
- Apply non-breaking automated code fixes directly.
- Log the remediated changes in the audit summary.

---

## Step 5 — Generate Audit Summary Report

Print a structured review report to the user:

```text
========================================
🔍 SELF CODE REVIEW REPORT
========================================
Feature: <feature_title>
Branch:  <branch_name>

🛡️ Security Review:  PASSED / ISSUES FOUND
  - [x] No hardcoded secrets detected
  - [x] Endpoint permissions verified
  - [x] Bearer token interceptor verified

⚡ Code Quality Review: PASSED / REMEDIATED
  - [x] Zero TypeScript files (JSX ONLY)
  - [x] Clean logging (No print / console.log)
  - [x] Django ORM N+1 query optimization verified
  - [x] Import path aliases (@/) verified

Auto-Remediations Applied: [List any auto-fixes or "None"]

STATUS: READY FOR GIT COMMIT & PUSH
========================================

Next Steps:
Run the following Git commands to finish the feature:
  1. git add .
  2. git commit -m "feat: <feature_description>"
  3. git push origin <branch_name>