# ⚛️ React + Vite Development Guidelines (JSX Only)

## 🎯 Core Principles
- **Strictly No TypeScript:** Use **JSX ONLY (`.jsx`, `.js`)**. Files ending in `.ts` or `.tsx` are forbidden.
- Follow these guidelines strictly unless explicitly instructed otherwise.
- Never make assumptions about requirements. Ask questions before writing code if specs are unclear.
- Prefer simplicity, scannability, and modularity over complex abstractions.
- Write production-ready, scalable, and secure React code.

---

## 📁 1. Project Architecture & Folder Structure

Imports MUST use path aliases (`@/`) mapped to `src/`.

```text
src/
├── assets/          # Static assets (images, svgs)
├── api/             # Centralized Axios client and API request functions
├── components/      # Modular UI components
│   ├── ui/          # Atomic components (shadcn/ui, buttons, inputs)
│   ├── layout/      # Layout shells (Header, Sidebar, DashboardLayout)
│   └── modals/      # Overlay dialog popups
├── constants/       # Static configuration and enum constants
├── hooks/           # Custom React hooks & TanStack Query hooks
├── store/           # Zustand global state stores (Auth, UI state)
├── pages/           # Feature pages (e.g., src/pages/Billing/BillingPage.jsx)
├── utils/           # Helper pure JS functions (formatters, validators)
└── App.jsx          # Root component & Provider wrapper
Naming Conventions
Component Files & Folders: PascalCase.jsx (e.g., DashboardLayout.jsx, BillingPage.jsx).

Non-Component Files: camelCase.js (e.g., useBilling.js, formatters.js, authStore.js).

Export Rules: export default ComponentName for components; named exports for hooks, stores, and utilities.

🌐 2. API Layer & Axios Configuration
Centralized Client (src/api/axiosClient.js):

Use an Axios instance configured with baseURL: import.meta.env.VITE_API_BASE_URL.

Bearer Interceptor Rule:

Attach JWT token automatically via Request Interceptor using Zustand auth store state (Authorization: Bearer <token>).

Handle 401 Unauthorized responses in Response Interceptors to automatically trigger token refresh or user logout.

Keep raw API requests inside src/api/<domain>Api.js functions (never write inline axios calls in components).

🔄 3. State Management Strategy
Server State (TanStack Query)
Use TanStack Query for all remote data fetching, caching, loading states, and mutations.

Custom query hooks MUST reside in src/hooks/queries/ or src/hooks/use<Feature>Query.js.

Always handle isLoading, isError, and data states cleanly in UI using Skeletons/Spinners.

Perform cache invalidation using queryClient.invalidateQueries({ queryKey: [...] }) inside mutations.

Client State (Zustand)
Use Zustand ONLY for client-side global state (e.g., authenticated user session, active sidebar tab, modal visibility, theme preferences).

Keep store files modular inside src/store/ (e.g., useAuthStore.js, useUIStore.js).

🎨 4. UI Library & Styling Guidelines
Tailwind CSS v3: Use utility classes directly in JSX className attributes.

UI Components: Use shadcn/ui primitives located in src/components/ui/.

Icons: Use lucide-react directly (e.g., import { Search, Bell } from 'lucide-react').

Avoid writing raw custom CSS unless creating complex reusable keyframe animations in index.css.

📝 5. Forms & Input Handling
Controlled inputs using standard React useState or custom form logic for simple forms.

Always prevent default event submission (e.preventDefault()).

Always validate required fields before submitting to API/Query mutations.

Display error feedback clearly using alert banners or inline field error labels.

🚀 6. Performance & Quality Standards
Keep components small and focused on a single responsibility.

Use useMemo for expensive calculations (e.g., invoice total summaries, filtered arrays).

Use useCallback when passing callbacks to heavy child components.

Never use console.log() in production code. Use a structured logger or remove debugging statements.

✅ 7. Feature Completion Checklist
Before marking any frontend feature complete, verify:

[ ] Code is written in JSX (.jsx, .js) ONLY. Zero TypeScript used.

[ ] Path aliases (@/) are used for all relative imports.

[ ] API integration uses axiosClient with Bearer interceptors.

[ ] Remote data managed via TanStack Query (useQuery/useMutation).

[ ] Local UI state managed via Zustand or React state.

[ ] Loading Skeletons and Error states rendered properly.

[ ] Tailwind CSS + shadcn/ui styles applied cleanly.

[ ] No console.log or unused imports remaining.