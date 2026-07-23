# 🗺️ Project Architecture Index

## 1. High-Level Blueprint
- **Stack:** Django (DRF) + React (JSX + Vite, No TS)
- **Auth:** Header-based JWT (`Authorization: Bearer <token>`)
- **UI:** Tailwind CSS + shadcn/ui + Lucide Icons
- **State:** Zustand (Client State) + TanStack Query (Server State)

## 2. Module Pointer Map
> **Instruction for AI:** Only load modules related to the current active task!

| Module | Schema File Pointer | API Spec File Pointer | Status |
| :--- | :--- | :--- | :--- |
| **Auth** | `.antigravity/memory/schema/auth.md` | `.antigravity/memory/apis/auth-api.md` | Initial |