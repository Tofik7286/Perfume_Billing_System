# Spec: User Authentication (Added via Backend Admin Panel)

## 1. Overview
This feature implements JWT-based authentication for the Perfume Billing System. Users (staff and admin personnel) are created and managed exclusively by system administrators via the Django backend admin panel (`/admin/`). The backend uses Django REST Framework and `djangorestframework-simplejwt` to provide secure authentication, token issuance (access and refresh tokens), token validation, token refreshing, and profile retrieval endpoints. On the frontend, a centralized Axios client with automatic Bearer token interceptors, a Zustand authentication store (`useAuthStore.js`), and TanStack Query hooks are integrated into `LoginPage.jsx` to manage user sessions and login states cleanly.

## 2. Dependencies
None (Initial base feature).

## 3. API Contracts (Django REST Framework)
- `POST /api/v1/auth/token/` — User Login & Token Generation — Public
  - **Request Payload:**
    ```json
    {
      "username": "admin",
      "password": "secretpassword"
    }
    ```
  - **Success Response:** `200 OK`
    ```json
    {
      "access": "eyJhbGciOiJIUzI1NiIsIn...",
      "refresh": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "first_name": "Admin",
        "last_name": "User",
        "is_staff": true,
        "is_superuser": true
      }
    }
    ```
  - **Error Responses:**
    - `400 Bad Request`: `{"detail": "Username and password are required."}`
    - `401 Unauthorized`: `{"detail": "No active account found with the given credentials"}`

- `POST /api/v1/auth/token/refresh/` — Refresh Access Token — Public
  - **Request Payload:**
    ```json
    {
      "refresh": "eyJhbGciOiJIUzI1NiIsIn..."
    }
    ```
  - **Success Response:** `200 OK`
    ```json
    {
      "access": "eyJhbGciOiJIUzI1NiIsIn..."
    }
    ```
  - **Error Responses:**
    - `401 Unauthorized`: `{"detail": "Token is invalid or expired", "code": "token_not_valid"}`

- `GET /api/v1/auth/me/` — Retrieve Authenticated User Info — Authenticated (`Authorization: Bearer <access_token>`)
  - **Request Payload:** None
  - **Success Response:** `200 OK`
    ```json
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "first_name": "Admin",
      "last_name": "User",
      "is_staff": true,
      "is_superuser": true
    }
    ```
  - **Error Responses:**
    - `401 Unauthorized`: `{"detail": "Authentication credentials were not provided."}`

## 4. Database Schema Changes
- Uses Django built-in `django.contrib.auth.models.User`.
- User creation managed exclusively through Django Admin Panel (`/admin/`) or `python manage.py createsuperuser`.
- No new models or custom schema migrations required.

## 5. Frontend Architecture (React + JSX)
- **Pages/Views:** `LoginPage.jsx` (unauthenticated view) and main app layout (authenticated view).
- **State Management:**
  - **Server State:** TanStack Query hook `useLoginMutation` in `src/hooks/queries/useAuthQuery.js`.
  - **Client State:** Zustand store `src/store/useAuthStore.js` managing `user`, `accessToken`, `refreshToken`, `isAuthenticated`, `login`, `logout` actions with `localStorage` persistence.
- **UI Components:**
  - Centralized Axios client (`src/api/axiosClient.js`) configured with `VITE_API_BASE_URL` and Bearer request/response interceptors.
  - `LoginPage.jsx` with input handling, loading spinner, error banners, and form submission binding.

## 6. Files to Modify
- `backend/backend/settings.py` — Configure `REST_FRAMEWORK` permissions, Simple JWT settings, and CORS.
- `backend/backend/urls.py` — Add `/api/v1/auth/` routes.
- `backend/requirements.txt` — Add `djangorestframework-simplejwt`.
- `frontend/src/pages/Login/LoginPage.jsx` — Replace mock logic with backend JWT login integration.
- `frontend/src/App.jsx` — Wrap app with authentication guard using Zustand store.

## 7. Files to Create
- `backend/app/auth_views.py` — Implement `CustomTokenObtainPairView` and `UserProfileView`.
- `backend/app/auth_serializers.py` — Implement `CustomTokenObtainPairSerializer` and `UserSerializer`.
- `backend/app/urls.py` — Route mappings for auth endpoints.
- `frontend/src/api/axiosClient.js` — Axios instance with Bearer interceptors.
- `frontend/src/api/authApi.js` — API request helper functions for auth.
- `frontend/src/store/useAuthStore.js` — Zustand auth store.
- `frontend/src/hooks/queries/useAuthQuery.js` — TanStack Query hooks for login and profile fetch.

## 8. Rules for Implementation
- **Backend:** Follow `.antigravity/rules/django.md` (Bearer Auth, Simple JWT, standard DRF responses, explicit permission classes, logging, no print statements).
- **Frontend:** Follow `.antigravity/rules/react.md` (JSX ONLY (`.jsx`, `.js`), path aliases `@/`, Axios client, lucide-react icons, no console.log).

## 9. Definition of Done
- [x] Backend API endpoints (`/api/v1/auth/token/`, `/api/v1/auth/token/refresh/`, `/api/v1/auth/me/`) pass authentication and validation checks.
- [x] Database migrations execute cleanly.
- [x] Frontend UI renders correctly with proper loading states and error banners.
- [x] Test coverage verified via `/test-feature`.
- [x] Security and quality audit passed via `/code-review-feature`.

---

## 🛠️ Implementation Plan & Task Breakdown

### Phase 1: Database & Backend Core
- [x] Task 1.1: Verify standard Django `User` model configuration and `requirements.txt` dependencies (`djangorestframework-simplejwt`).
- [x] Task 1.2: Register core models in `backend/app/admin.py` with custom `ModelAdmin` configurations for admin user management.
- [x] Task 1.3: Configure `backend/backend/settings.py` for Simple JWT authentication (`REST_FRAMEWORK` defaults, `SIMPLE_JWT` settings, and CORS).

### Phase 2: DRF API Layer
- [x] Task 2.1: Implement serializers in `backend/app/auth_serializers.py` (`CustomTokenObtainPairSerializer` & `UserSerializer`).
- [x] Task 2.2: Implement auth views in `backend/app/auth_views.py` (`CustomTokenObtainPairView`, `TokenRefreshView`, `UserProfileView`).
- [x] Task 2.3: Configure URL patterns in `backend/app/urls.py` and mount under `/api/v1/auth/` in `backend/backend/urls.py`.

### Phase 3: Frontend API & State Layer
- [x] Task 3.1: Create centralized Axios client in `frontend/src/api/axiosClient.js` with Bearer token interceptor and 401 response handling.
- [x] Task 3.2: Create API request functions in `frontend/src/api/authApi.js` (`loginUser`, `refreshToken`, `getMe`).
- [x] Task 3.3: Implement Zustand store in `frontend/src/store/useAuthStore.js` with session state, actions, and `localStorage` persistence.
- [x] Task 3.4: Implement TanStack Query custom hooks in `frontend/src/hooks/queries/useAuthQuery.js` (`useLoginMutation`, `useProfileQuery`).

### Phase 4: Frontend UI Components (JSX)
- [x] Task 4.1: Update `frontend/src/pages/Login/LoginPage.jsx` to integrate real backend JWT login using `useLoginMutation` with loading states and error alerts.
- [x] Task 4.2: Update `frontend/src/App.jsx` to protect application routes using Zustand auth state (`isAuthenticated`, `logout`, user session).

### Phase 5: Verification & Quality Assurance
- [x] Task 5.1: Run `/test-feature 01-user-authentication` to execute automated unit/integration tests for auth endpoints and UI flow.
- [x] Task 5.2: Run `/code-review-feature 01-user-authentication` to perform security, quality, and rule compliance audits.
