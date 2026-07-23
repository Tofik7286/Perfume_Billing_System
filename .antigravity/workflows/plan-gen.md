# 📐 Plan Generation Workflow

Generate a step-by-step implementation plan based on an active feature specification.

**Usage:** `/plan-gen <step_number>-<feature_slug>`  
**Example:** `/plan-gen 01-user-auth`

**Allowed Tools:** Read, Write, Glob, Bash (`git:*`)

---

## Step 1 — Verify Active Feature Branch and Spec

1. Run `git branch --show-current` to ensure you are on the corresponding feature branch (e.g., `feature/user-auth`).
2. Read the active specification file from `.antigravity/specs/active/<step_number>-<feature_slug>.md`.
3. If the spec file does not exist, stop and alert the user:
   ```text
   Specification file .antigravity/specs/active/<step_number>-<feature_slug>.md not found.
   Please run /create-spec first.
Step 2 — Analyze Codebase & Architecture Context
Read the following system configuration files before writing the plan:

.antigravity/rules.md

.antigravity/rules/django.md

.antigravity/rules/react.md

Relevant backend files (models.py, serializers.py, views.py, urls.py)

Relevant frontend files (src/api/, src/store/, src/components/, src/pages/)

Ensure all architecture constraints are satisfied:

Backend: Header-based Bearer authentication, N+1 query safety (select_related/prefetch_related), standard DRF views/serializers, model admin registration.

Frontend: JSX ONLY (.jsx, .js), path aliases @/, Axios client integration, TanStack Query for server state, Zustand for client state, Tailwind CSS v3 + shadcn/ui.

Step 3 — Generate Technical Task Breakdown
Break down the specification into small, deterministic, and sequential implementation tasks.

Add an Implementation Plan section to the bottom of the spec file (.antigravity/specs/active/<step_number>-<feature_slug>.md):

Markdown
---

## 🛠️ Implementation Plan & Task Breakdown

### Phase 1: Database & Backend Core
- [ ] Task 1.1: Define or update Django models in `app_name/models.py` with indexes, `Meta` options, and `__str__()`.
- [ ] Task 1.2: Register models in `app_name/admin.py` with custom `ModelAdmin` configurations.
- [ ] Task 1.3: Generate and apply Django database migrations (`makemigrations` and `migrate`).

### Phase 2: DRF API Layer
- [ ] Task 2.1: Implement input/output serializers in `app_name/serializers.py` with validation logic.
- [ ] Task 2.2: Implement DRF views in `app_name/views.py` with Bearer auth permissions and optimized ORM queries.
- [ ] Task 2.3: Configure URL patterns in `app_name/urls.py` and register with main project router.

### Phase 3: Frontend API & State Layer
- [ ] Task 3.1: Create API request functions in `src/api/<domain>Api.js` using `axiosClient`.
- [ ] Task 3.2: Implement TanStack Query custom hooks (`src/hooks/use<Feature>Query.js`).
- [ ] Task 3.3: Implement or update Zustand store in `src/store/` for client state management.

### Phase 4: Frontend UI Components (JSX)
- [ ] Task 4.1: Create atomic UI components in `src/components/` using Tailwind CSS and shadcn/ui primitives.
- [ ] Task 4.2: Implement feature page container in `src/pages/<Feature>/<Feature>Page.jsx`.
- [ ] Task 4.3: Connect page UI to TanStack Query hooks, handling loading Skeletons and error banners.

### Phase 5: Verification & Quality Assurance
- [ ] Task 5.1: Run `/test-feature` to execute automated unit/integration tests.
- [ ] Task 5.2: Run `/code-review-feature` to perform security and code quality audits.
Step 4 — Save Updated Specification File
Append the generated Implementation Plan to .antigravity/specs/active/<step_number>-<feature_slug>.md.

Step 5 — Report to the User
Print a concise summary:

Implementation plan generated for: .antigravity/specs/active/<step_number>-<feature_slug>.md

Tasks are broken down into 5 sequential phases.
Run `/execute-task` to begin building the feature step-by-step.