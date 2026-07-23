# 🔨 Execute Task Workflow

Execute the next available task from the active feature implementation plan in sequential order.

**Usage:** `/execute-task <step_number>-<feature_slug>`  
**Example:** `/execute-task 01-user-auth`

**Allowed Tools:** Read, Write, Edit, Glob, Bash

---

## Step 1 — Load Active Spec and Task List

1. Read `.antigravity/specs/active/<step_number>-<feature_slug>.md`.
2. Locate the **Implementation Plan & Task Breakdown** section.
3. Find the first unchecked task item `- [ ] Task X.Y`.

If all tasks are already marked as completed `- [x]`, stop and output:

```text
All implementation tasks for <step_number>-<feature_slug> are already complete!
Run /test-feature to trigger automated testing.


Step 2 — Identify Execution Domain & Rules

Determine if the selected task is a Backend or Frontend task.

Backend Task (Django / DRF)

Agent Role: Backend Coder

Rule File: Enforce .antigravity/rules/django.md

Constraints:

Header Bearer auth configuration.
Optimize ORM queries (select_related, prefetch_related).
Register models in admin.py.
NO raw print() statements (use logging).
Frontend Task (React + JSX)

Agent Role: Frontend Coder

Rule File: Enforce .antigravity/rules/react.md

Constraints:

JSX ONLY (.jsx, .js). ❌ TypeScript strictly forbidden.
Path alias @/ for all imports.
API calls via axiosClient & TanStack Query hooks.
State via Zustand.
Tailwind CSS + shadcn/ui + Lucide icons.
NO console.log() statements.
Step 3 — Perform Code Implementation

Read all relevant target files specified in the task.

Apply minimum necessary changes to fulfill the exact scope of - [ ] Task X.Y.

Do not modify unrequested files or add unrequested dependencies.

Step 4 — Code Verification & Syntax Check
Backend Changes

Execute migration checks or dry-run checks if applicable:

python manage.py check
Frontend Changes

Verify:

JSX syntax.
Import statements.
Path alias resolutions.

If syntax errors or import breaks occur, fix them before proceeding.

Step 5 — Update Task Status

In .antigravity/specs/active/<step_number>-<feature_slug>.md, update the status of the completed task:

- [x] Task X.Y: [Task Description]
Step 6 — Report Progress to User

Output a concise summary:

Task Completed: Task X.Y - [Task Description]

Files Modified:
- path/to/modified/file.py
- path/to/modified/file.jsx

Next Action: Run `/execute-task <step_number>-<feature_slug>` for the next task.