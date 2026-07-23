# 📄 Spec Generation Workflow

Create a feature specification file and a clean git branch for a new step.

**Usage:** `/create-spec <step_number> <feature_name>`  
**Example:** `/create-spec 01 user-auth`

**Allowed Tools:** Read, Write, Glob, Bash (`git:*`)

---

## Step 1 — Check Working Directory Cleanliness

Run `git status` to verify there are no uncommitted, unstaged, or untracked changes.

If changes exist, stop immediately and output:

```text
Working directory is not clean. Please commit or stash your changes before proceeding.
DO NOT CONTINUE until the working directory is clean.
Step 2 — Parse Command Arguments
Extract the following parameters from user arguments:

step_number: Zero-padded 2-digit format (e.g., 1 → 01, 12 → 12).

feature_title: Human-readable title in Title Case (e.g., User Authentication).

feature_slug: Lowercase, kebab-case string (a-z, 0-9, -, max 40 chars; e.g., user-auth).

branch_name: Format feature/<feature_slug> (e.g., feature/user-auth).

If arguments are missing or ambiguous, ask the user for clarification before proceeding.

Step 3 — Ensure Branch Name Availability
Run git branch to check existing branches.

If branch_name exists, append a numeric suffix until unique: feature/user-auth-01, feature/user-auth-02, etc.

Step 4 — Sync with Main Branch
Execute:

Bash
git checkout main
git pull origin main
Step 5 — Create Feature Branch
Execute:

Bash
git checkout -b <branch_name>
Step 6 — Context & Codebase Research
Before drafting the spec, read and inspect:

.antigravity/rules.md

.antigravity/rules/django.md

.antigravity/rules/react.md

Existing specs in .antigravity/specs/active/ to avoid duplication.

Existing Django models, views, and React component structures related to the feature.

If the feature step is already marked complete, warn the user and abort:

Plaintext
Step <step_number> (<feature_title>) is already marked complete.
Step 7 — Write the Specification Document
Generate the spec document using this exact template. Note: Section 9 (Detailed Test Scenarios) MUST contain concrete, explicit test cases for this specific feature. Do NOT write generic placeholders.

Markdown
# Spec: <feature_title>

## 1. Overview
One paragraph describing the purpose, scope, and user value of this feature.

## 2. Dependencies
List required previous completed features or specs.

## 3. API Contracts (Django REST Framework)
- `METHOD /api/v1/endpoint/` — Description — Access Level (Public / Authenticated)
  - **Request Payload:** JSON Schema
  - **Success Response:** Status Code & Schema
  - **Error Responses:** 400/401/403/404 schemas

If no new endpoints: state "No API changes."

## 4. Database Schema Changes
- Models modified or created.
- Fields, indexes, and constraints added.
- Django migrations needed.

If none: state "No database changes."

## 5. Frontend Architecture (React + JSX)
- **Pages/Views:** Route or Tab state mapping.
- **State Management:**
  - Server State: TanStack Query hooks needed (`useQuery` / `useMutation`).
  - Client State: Zustand store modifications.
- **UI Components:** New shadcn/ui or custom components required.

## 6. Files to Modify
List every existing backend and frontend file that requires modifications.

## 7. Files to Create
List every new backend and frontend file to be created.

## 8. Rules for Implementation
- **Backend:** Follow `.antigravity/rules/django.md` (Bearer Auth, select_related/prefetch_related, ModelAdmin registration, no print statements).
- **Frontend:** Follow `.antigravity/rules/react.md` (JSX ONLY, path aliases `@/`, Axios client, lucide-react icons, no console.log).

## 9. Concrete Test Scenarios & Edge Cases (Mandatory for /test-feature)
Specify exact assertions and payloads to be validated for this specific feature:

### A. Backend API Test Cases (Django / DRF)
- [ ] **Happy Path (200/201):** Valid payload returns expected structure, writes correctly to DB.
- [ ] **Auth / Authorization (401/403):** Unauthenticated or wrong-role requests are blocked.
- [ ] **Input Validation (400):** Missing mandatory fields, bad email/phone formats, invalid data types.
- [ ] **Domain & Boundary Edge Cases:** 
  - Duplicate unique constraints (e.g., duplicate entries/bookings/emails).
  - Max/min field lengths and null/empty byte payloads.
  - Invalid foreign keys or non-existent IDs (404 handling).

### B. Frontend UI & State Test Cases (React)
- [ ] **Form Validation:** Client-side error messages appear on empty/invalid inputs before API hit.
- [ ] **API Failure Recovery:** Error toast/alert renders properly on 400/500 API responses without UI crash.
- [ ] **Loading & State:** Buttons show loading spinners during active queries/mutations.

## 10. Definition of Done
- [ ] Backend API endpoints pass all scenarios listed in Section 9A.
- [ ] Frontend UI passes all scenarios listed in Section 9B.
- [ ] Database migrations execute cleanly.
- [ ] `/test-feature <step_number>-<feature_slug>` runs and passes without errors.
- [ ] Security and quality audit passed via `/code-review-feature`.
Step 8 — Save the Specification
Save the generated spec file to:

Plaintext
.antigravity/specs/active/<step_number>-<feature_slug>.md
(Create .antigravity/specs/active/ directory if it does not exist).

Step 9 — User Status Report
Output a concise summary to the user:

Plaintext
Spec created:   .antigravity/specs/active/<step_number>-<feature_slug>.md
Branch created: <branch_name>

Review the spec at `.antigravity/specs/active/<step_number>-<feature_slug>.md`
and run `/plan-gen <step_number>-<feature_slug>` to generate the implementation plan.