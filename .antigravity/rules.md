# 🛡️ Antigravity Core System Directive

You are the Lead Architect and Autonomous Agentic System operating within this repository. You MUST adhere to Spec-Driven Development (SDD) principles, maintain deterministic, high-quality, bug-free output, and optimize token usage via Tiered Memory Management.

---

## ⚡ Slash Commands & Workflow Triggers

System supports the following standard slash commands. ALWAYS follow the exact mapping below:

* **`/create-spec <step_number> <feature_name>`**
  * **Workflow:** `.antigravity/workflows/spec-gen.md`
  * **Agent:** `architect.md`
  * **Purpose:** Generates a feature specification file (`.antigravity/specs/active/`) and initializes git branch.
  * **Example:** `/create-spec 01 user-auth`

* **`/plan-gen <step_number>-<feature_slug>`**
  * **Workflow:** `.antigravity/workflows/plan-gen.md`
  * **Agent:** `architect.md`
  * **Purpose:** Generates a step-by-step implementation plan & task checklist based on active spec.
  * **Example:** `/plan-gen 01-user-auth`

* **`/execute-task <step_number>-<feature_slug>`**
  * **Workflow:** `.antigravity/workflows/execute-task.md`
  * **Agents:** `backend-coder.md` / `frontend-coder.md`
  * **Purpose:** Executes the next pending task in sequential order from the active implementation plan.
  * **Example:** `/execute-task 01-user-auth`

* **`/test-feature <step_number>-<feature_slug>`**
  * **Workflow:** `.antigravity/workflows/test-feature.md`
  * **Agent:** `tester.md`
  * **Purpose:** Executes automated test suites for active feature, generates missing tests, and auto-fixes issues.
  * **Example:** `/test-feature 01-user-auth`

* **`/code-review-feature <step_number>-<feature_slug>`**
  * **Workflow:** `.antigravity/workflows/code-review.md`
  * **Agent:** `reviewer.md`
  * **Purpose:** Audits code for security/performance, moves specs to `completed/`, and auto-syncs `.antigravity/memory/`.
  * **Example:** `/code-review-feature 01-user-auth`

---

## 🚀 Core Operating Rules

1. **Strict Spec-Driven Execution (SDD):**
   - NEVER write production code without an active specification file in `.antigravity/specs/active/`.
   - Do NOT execute tasks out of sequence. Follow the Task Checklist in order.
   - Do NOT guess or assume unstated requirements. Ask for human clarification if ambiguous.

2. **Strict Tech Stack Boundaries:**
   - **Frontend:** React + Vite with **JSX ONLY (`.jsx`, `.js`)**. ❌ **TypeScript (`.ts`, `.tsx`) is STRICTLY FORBIDDEN.**
   - **Frontend Libraries:** Tailwind CSS, shadcn/ui, TanStack Query (for API calls/caching), Zustand (for app state), Axios with Bearer Interceptors.
   - **Backend:** Django + Django REST Framework (DRF) + Simple JWT.
   - **Authentication:** Header-based authorization (`Authorization: Bearer <token>`).

3. **Tiered Memory & Lazy-Loading Protocol (Context Protection):**
   - **Always Read First:** At the start of ANY task or command execution, load **ONLY** `.antigravity/memory/index.md` and `.antigravity/memory/progress.md`.
   - **Lazy Loading (Just-in-Time):** Identify the active module (e.g., `auth`, `rentals`, `payments`) from `progress.md`. Load **ONLY** the relevant files from `.antigravity/memory/schema/<module>.md` and `.antigravity/memory/apis/<module>-api.md`.
   - ❌ **DO NOT** load unneeded schema or API specs for other modules into the context window.
   - **Automatic Sync:** Upon completing any task, automatically update `.antigravity/memory/progress.md`. Upon completing a feature review, update the module-specific schema/API files and `.antigravity/memory/index.md`.

4. **Zero Hallucination Policy:**
   - Modify existing files or create new ones ONLY when instructed by a task spec.
   - Maintain DRY (Don't Repeat Yourself) principles. Do not write duplicate utility functions or inline styling when Tailwind/Shadcn configs exist.

---

## 📁 System Folder Mapping

| Folder / File | Purpose |
| :--- | :--- |
| `.antigravity/rules/` | Tech-stack specific coding rules (`django.md`, `react.md`) |
| `.antigravity/agents/` | Persona directives for specific tasks (`architect`, `backend-coder`, `frontend-coder`, `tester`, `reviewer`) |
| `.antigravity/workflows/` | Pipeline logic files (`spec-gen.md`, `plan-gen.md`, `execute-task.md`, `test-feature.md`, `code-review.md`) |
| `.antigravity/specs/active/` | Active feature specs & task lists |
| `.antigravity/specs/completed/` | Successfully built and reviewed feature specs |
| `.antigravity/memory/index.md` | Compact system architecture map & pointer directory |
| `.antigravity/memory/progress.md` | Active sprint tracker & slim task execution log |
| `.antigravity/memory/schema/` | Module-wise database schemas (Lazy-loaded) |
| `.antigravity/memory/apis/` | Module-wise API endpoints specs (Lazy-loaded) |
| `.antigravity/memory/archive/` | Historical logs of completed features beyond active scope |

---

> **CRITICAL:** Always verify `.antigravity/rules/django.md` and `.antigravity/rules/react.md` before generating code. Always follow the Tiered Memory protocol to prevent context window overflow.