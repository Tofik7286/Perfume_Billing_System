# Spec: Product Management & CRUD Operations

## 1. Overview
This feature implements comprehensive CRUD (Create, Read, Update, Delete) operations for Products in the Perfume Billing System. Backend REST API endpoints are created using Django REST Framework (DRF) with Simple JWT Bearer authentication, request validation, searching, ordering, and safe handling of invoice dependencies. On the frontend, the Product tab in `MastersPage.jsx` and the modal component `ProductModal.jsx` are transformed from static mock state into a reactive UI powered by custom TanStack Query hooks (`useProductsQuery`, `useCreateProductMutation`, `useUpdateProductMutation`, `useDeleteProductMutation`) and centralized Axios API calls (`productApi.js`).

## 2. Dependencies
- `01-user-authentication` (JWT authentication, custom `axiosClient` with Bearer headers, Zustand auth store).

## 3. API Contracts (Django REST Framework)
- `GET /api/v1/products/` — List all products — Authenticated (`Authorization: Bearer <access_token>`)
  - **Query Parameters:** `search` (optional string), `is_active` (optional boolean), `ordering` (optional string, e.g., `product_name`, `-created_at`)
  - **Success Response:** `200 OK`
    ```json
    [
      {
        "id": 1,
        "product_name": "Royal Oud 100ml",
        "price": "1250.00",
        "is_active": true,
        "created_by": 1,
        "created_by_username": "admin",
        "created_at": "2026-07-23T21:45:00Z"
      }
    ]
    ```

- `POST /api/v1/products/` — Create new product — Authenticated (`Authorization: Bearer <access_token>`)
  - **Request Payload:**
    ```json
    {
      "product_name": "Royal Oud 100ml",
      "price": 1250.00,
      "is_active": true
    }
    ```
  - **Success Response:** `201 Created`
    ```json
    {
      "id": 1,
      "product_name": "Royal Oud 100ml",
      "price": "1250.00",
      "is_active": true,
      "created_by": 1,
      "created_by_username": "admin",
      "created_at": "2026-07-23T21:45:00Z"
    }
    ```
  - **Error Responses:**
    - `400 Bad Request`: `{"product_name": ["Product with this name already exists."], "price": ["Price must be greater than zero."]}`
    - `401 Unauthorized`: `{"detail": "Authentication credentials were not provided."}`

- `GET /api/v1/products/{id}/` — Retrieve product details — Authenticated (`Authorization: Bearer <access_token>`)
  - **Success Response:** `200 OK`
  - **Error Responses:**
    - `404 Not Found`: `{"detail": "Product not found."}`
    - `401 Unauthorized`: `{"detail": "Authentication credentials were not provided."}`

- `PUT /api/v1/products/{id}/` / `PATCH /api/v1/products/{id}/` — Update product — Authenticated (`Authorization: Bearer <access_token>`)
  - **Request Payload:**
    ```json
    {
      "product_name": "Royal Oud 100ml (Premium Edition)",
      "price": 1450.00,
      "is_active": true
    }
    ```
  - **Success Response:** `200 OK`
  - **Error Responses:**
    - `400 Bad Request`: `{"price": ["Ensure this value is greater than or equal to 0.00."]}`
    - `404 Not Found`: `{"detail": "Product not found."}`

- `DELETE /api/v1/products/{id}/` — Delete product — Authenticated (`Authorization: Bearer <access_token>`)
  - **Success Response:** `204 No Content`
  - **Error Responses:**
    - `400 Bad Request`: `{"detail": "Cannot delete product because it is associated with existing invoices. Deactivate it instead."}`
    - `404 Not Found`: `{"detail": "Product not found."}`
    - `401 Unauthorized`: `{"detail": "Authentication credentials were not provided."}`

## 4. Database Schema Changes
- Uses existing `Product` model in `backend/app/models.py`:
  - `product_name`: `models.CharField(max_length=255)`
  - `price`: `models.DecimalField(max_digits=10, decimal_places=2)`
  - `is_active`: `models.BooleanField(default=True)`
  - `created_by`: `models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')`
  - `created_at`: `models.DateTimeField(auto_now_add=True)`
- Add `Meta` class options to `Product` model if not present (ordering by `-created_at`, indexes on `product_name` and `is_active`).
- Generate migrations if `Meta` indexes/ordering are updated (`python manage.py makemigrations` and `python manage.py migrate`).

## 5. Frontend Architecture (React + JSX)
- **Pages/Views:** `MastersPage.jsx` (`activeTab === 'products'`)
- **State Management:**
  - **Server State:** TanStack Query hooks in `src/hooks/queries/useProductQuery.js`:
    - `useProductsQuery(searchQuery)` — Fetches product list
    - `useCreateProductMutation()` — Handles product creation
    - `useUpdateProductMutation()` — Handles product modification
    - `useDeleteProductMutation()` — Handles product deletion
  - **Client State:** React local state in `MastersPage.jsx` and `ProductModal.jsx` for modal open/close, editing product selection, search input, and error messages.
- **UI Components:**
  - `src/components/Modals/ProductModal.jsx` — Form with validation for Name, Price/Rate, and Is Active toggle.
  - `src/pages/Masters/MastersPage.jsx` — Product table and mobile card view connected to TanStack Query hooks.

## 6. Files to Modify
- `backend/app/models.py` — Add explicit `Meta` options (ordering, indexes) to `Product` model.
- `backend/app/admin.py` — Ensure `ProductAdmin` list display, search fields, and ordering are configured properly.
- `backend/app/urls.py` — Register product router/endpoints under `/api/v1/products/`.
- `frontend/src/pages/Masters/MastersPage.jsx` — Connect Product table and actions to TanStack Query hooks instead of context mock state.
- `frontend/src/components/Modals/ProductModal.jsx` — Wire form inputs, loading state, and save handling to TanStack Query mutations.

## 7. Files to Create
- `backend/app/product_serializers.py` — DRF `ProductSerializer` with validation for unique product names and non-negative prices.
- `backend/app/product_views.py` — DRF `ProductViewSet` (or `APIView` / `GenericAPIView` handlers) with search, filter, `created_by` auto-assignment, and protected delete handling.
- `backend/app/tests/test_products.py` — DRF `APITestCase` unit/integration test suite for product CRUD operations.
- `frontend/src/api/productApi.js` — API request helper functions for products (`fetchProducts`, `fetchProductById`, `createProduct`, `updateProduct`, `deleteProduct`).
- `frontend/src/hooks/queries/useProductQuery.js` — TanStack Query hooks (`useProductsQuery`, `useCreateProductMutation`, `useUpdateProductMutation`, `useDeleteProductMutation`).

## 8. Rules for Implementation
- **Backend:** Follow `.antigravity/rules/django.md` (Bearer Auth, `IsAuthenticated` permission class, `select_related('created_by')`, proper serializer validation, logging, no print statements).
- **Frontend:** Follow `.antigravity/rules/react.md` (JSX ONLY (`.jsx`, `.js`), path aliases `@/`, `axiosClient` with Bearer headers, `lucide-react` icons, no `console.log`).

## 9. Concrete Test Scenarios & Edge Cases (Mandatory for /test-feature)

### A. Backend API Test Cases (Django / DRF)
- [x] **Happy Path (200/201/204):**
  - `GET /api/v1/products/`: Authenticated user fetches product list and gets HTTP 200 with complete product data.
  - `POST /api/v1/products/`: Authenticated user creates a product with valid payload (`product_name`, `price`). `created_by` is set automatically to `request.user` and returns HTTP 201.
  - `GET /api/v1/products/{id}/`: Authenticated user retrieves product details by ID and gets HTTP 200.
  - `PUT / PATCH /api/v1/products/{id}/`: Authenticated user updates product name or price and gets HTTP 200 with updated fields.
  - `DELETE /api/v1/products/{id}/`: Authenticated user deletes an unreferenced product and gets HTTP 204 No Content.
- [x] **Auth & Authorization (401):**
  - Unauthenticated requests to list, create, update, or delete products return HTTP 401 Unauthorized.
- [x] **Input Validation (400):**
  - Creating or updating a product with an empty `product_name` returns HTTP 400 Bad Request.
  - Creating or updating a product with a negative price (e.g., `-100.00`) or non-numeric price returns HTTP 400 Bad Request.
  - Creating a product with missing mandatory fields returns HTTP 400 Bad Request.
- [x] **Domain & Boundary Edge Cases:**
  - **Duplicate Product Name:** Creating a product with a name that already exists (case-insensitive check) raises a serializer validation error and returns HTTP 400 Bad Request.
  - **Invoice Reference Protection:** Attempting to delete a product that is linked to existing `InvoiceItem` records returns HTTP 400 Bad Request with a clear message suggesting deactivation.
  - **Name Boundary:** Product name exceeding 255 characters returns HTTP 400 Bad Request.
  - **Search Filtering:** `GET /api/v1/products/?search=Rose` returns only products matching "Rose".

### B. Frontend UI & State Test Cases (React)
- [x] **Form Validation:** Client-side validation in `ProductModal.jsx` prevents submission with empty name or invalid price rate before API call.
- [x] **API Failure Recovery:** Error messages returned by backend (e.g., duplicate product name or negative price) render as visible alert banners inside `ProductModal.jsx` or as error alerts in `MastersPage.jsx`.
- [x] **Loading & Mutation State:** Save/Update button in `ProductModal.jsx` displays loading state and disables submission during active mutations.
- [x] **Query Cache Invalidation:** Creating, updating, or deleting a product invalidates the TanStack Query `['products']` cache key and updates the UI instantly without page reload.

## 10. Definition of Done
- [x] Backend API endpoints pass all scenarios listed in Section 9A.
- [x] Frontend UI passes all scenarios listed in Section 9B.
- [x] Database migrations execute cleanly.
- [x] `/test-feature 02-product-crud` runs and passes without errors.
- [ ] Security and quality audit passed via `/code-review-feature`.

---

## 🛠️ Implementation Plan & Task Breakdown

### Phase 1: Database & Backend Core
- [x] Task 1.1: Update `Product` model in `backend/app/models.py` with explicit `Meta` options (`ordering = ['-created_at']`, indexes on `product_name` and `is_active`, `__str__`).
- [x] Task 1.2: Verify and update `ProductAdmin` in `backend/app/admin.py` with autocomplete, ordering, list display, and search fields.
- [x] Task 1.3: Generate and apply database migrations (`python manage.py makemigrations` & `python manage.py migrate`).

### Phase 2: DRF API Layer & Backend Unit Tests
- [x] Task 2.1: Implement `ProductSerializer` in `backend/app/product_serializers.py` with validation for unique product names (case-insensitive) and non-negative price values.
- [x] Task 2.2: Implement `ProductViewSet` in `backend/app/product_views.py` with `IsAuthenticated` permission class, `SearchFilter`, `OrderingFilter`, automatic `created_by` assignment on create, `select_related('created_by')`, and protected delete handling for products associated with `InvoiceItem`.
- [x] Task 2.3: Configure product URL patterns in `backend/app/urls.py` using `DefaultRouter` mounted under `/api/v1/products/`.
- [x] Task 2.4: Create automated unit/integration tests in `backend/app/tests.py` covering:
  - Happy Path (200 OK list/retrieve, 201 Created, 200 OK update, 204 No Content delete)
  - Authentication checks (401 Unauthorized for unauthenticated endpoints)
  - Serializer validation failures (400 Bad Request for negative price, missing fields, duplicate names)
  - Protected delete checks (400 Bad Request when product is linked to an invoice item)
  - Search filtering by product name

### Phase 3: Frontend API & State Layer
- [x] Task 3.1: Create `frontend/src/api/productApi.js` using centralized `axiosClient` (`getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`).
- [x] Task 3.2: Implement TanStack Query custom hooks in `frontend/src/hooks/queries/useProductQuery.js` (`useProductsQuery`, `useCreateProductMutation`, `useUpdateProductMutation`, `useDeleteProductMutation`) with automatic `['products']` query cache invalidation on successful mutations.

### Phase 4: Frontend UI Integration (JSX)
- [x] Task 4.1: Update `frontend/src/components/Modals/ProductModal.jsx` to handle backend form submission, client-side input validation, error alert banners, and active mutation loading states.
- [x] Task 4.2: Update `frontend/src/pages/Masters/MastersPage.jsx` (Products tab) to replace mock state with real API data using `useProductsQuery`, adding search filtering, loading Skeletons, empty state handling, and edit/delete actions connected to query mutations.

### Phase 5: Rigorous Automated Testing & Verification
- [x] Task 5.1: Execute `/test-feature 02-product-crud` to run all backend and frontend edge case tests.
- [x] Task 5.2: Verify zero failing assertions, clean execution, and fix any auto-discovered defects.
- [ ] Task 5.3: Run `/code-review-feature 02-product-crud` to perform security and code quality audits.
