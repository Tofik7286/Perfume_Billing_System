# Spec: Create CRUD for Party

## 1. Overview
This feature implements comprehensive CRUD (Create, Read, Update, Delete) operations for the Party (customer/supplier) entity in the Perfume Billing System. Backend REST API endpoints are created using Django REST Framework (DRF) with Simple JWT Bearer authentication, request validation, search/ordering support, and safe deletion handling (blocked when linked invoices exist). On the frontend, the Parties tab in `MastersPage.jsx` and the existing `PartyModal.jsx` are migrated from localStorage-backed `AppContext` state into a fully reactive, API-driven UI powered by new TanStack Query hooks (`usePartiesQuery`, `useCreatePartyMutation`, `useUpdatePartyMutation`, `useDeletePartyMutation`) and a centralized Axios API client (`partyApi.js`). This mirrors the exact pattern established in `02-product-crud`.

## 2. Dependencies
- `01-user-authentication` — JWT authentication, custom `axiosClient` with Bearer headers, Zustand auth store.
- `02-product-crud` — Establishes the CRUD pattern (serializer, viewset, URL router, TanStack Query hooks) that this spec follows.

## 3. API Contracts (Django REST Framework)

- `GET /api/v1/parties/` — List all parties — Authenticated (`Authorization: Bearer <access_token>`)
  - **Query Parameters:** `search` (optional, matches `party_name` or `mobile_number`), `ordering` (optional, e.g., `party_name`, `-created_at`, `current_balance`)
  - **Success Response:** `200 OK`
    ```json
    [
      {
        "id": 1,
        "party_name": "A.K. Traders",
        "mobile_number": "9876543210",
        "alternate_mobile": null,
        "email_address": "ak@traders.com",
        "gst_number": "24AAAAC1234A1Z5",
        "pan_number": "ABCDE1234F",
        "address_line_1": "Shop No. 5, Market Road",
        "address_line_2": "Near Bus Stand",
        "landmark": "Opp. SBI Bank",
        "city": "Ahmedabad",
        "state": "Gujarat",
        "pincode": "380001",
        "country": "India",
        "current_balance": "5000.00",
        "created_by": 1,
        "created_by_username": "admin",
        "created_at": "2026-07-23T21:45:00Z"
      }
    ]
    ```

- `POST /api/v1/parties/` — Create new party — Authenticated (`Authorization: Bearer <access_token>`)
  - **Request Payload:**
    ```json
    {
      "party_name": "A.K. Traders",
      "mobile_number": "9876543210",
      "alternate_mobile": null,
      "email_address": "ak@traders.com",
      "gst_number": "24AAAAC1234A1Z5",
      "pan_number": "ABCDE1234F",
      "address_line_1": "Shop No. 5, Market Road",
      "address_line_2": "Near Bus Stand",
      "landmark": "Opp. SBI Bank",
      "city": "Ahmedabad",
      "state": "Gujarat",
      "pincode": "380001",
      "country": "India"
    }
    ```
  - **Success Response:** `201 Created` — Full party object (same as list item above)
  - **Error Responses:**
    - `400 Bad Request`: `{"party_name": ["Party with this name already exists."]}`
    - `400 Bad Request`: `{"mobile_number": ["This field may not be blank."]}`
    - `401 Unauthorized`: `{"detail": "Authentication credentials were not provided."}`

- `GET /api/v1/parties/{id}/` — Retrieve single party — Authenticated
  - **Success Response:** `200 OK` — Full party object
  - **Error Responses:**
    - `404 Not Found`: `{"detail": "Not found."}`
    - `401 Unauthorized`: `{"detail": "Authentication credentials were not provided."}`

- `PUT /api/v1/parties/{id}/` / `PATCH /api/v1/parties/{id}/` — Update party — Authenticated
  - **Request Payload:** Same as POST (all fields or subset for PATCH)
  - **Success Response:** `200 OK` — Updated party object
  - **Error Responses:**
    - `400 Bad Request`: `{"party_name": ["Party with this name already exists."]}`
    - `404 Not Found`: `{"detail": "Not found."}`
    - `401 Unauthorized`: `{"detail": "Authentication credentials were not provided."}`

- `DELETE /api/v1/parties/{id}/` — Delete party — Authenticated
  - **Success Response:** `204 No Content`
  - **Error Responses:**
    - `400 Bad Request`: `{"detail": "Cannot delete party because it has associated invoices. Archive or reassign them first."}`
    - `404 Not Found`: `{"detail": "Not found."}`
    - `401 Unauthorized`: `{"detail": "Authentication credentials were not provided."}`

## 4. Database Schema Changes
Uses the existing `Party` model in `backend/app/models.py`. No new model is needed.

Current `Party` model fields:
- `party_name`: `CharField(max_length=255)`
- `mobile_number`: `CharField(max_length=20)`
- `alternate_mobile`: `CharField(max_length=20, null=True, blank=True)`
- `email_address`: `EmailField(null=True, blank=True)`
- `gst_number`: `CharField(max_length=50, null=True, blank=True)`
- `pan_number`: `CharField(max_length=50, null=True, blank=True)`
- `address_line_1`: `CharField(max_length=255, null=True, blank=True)`
- `address_line_2`: `CharField(max_length=255, null=True, blank=True)`
- `landmark`: `CharField(max_length=255, null=True, blank=True)`
- `city`: `CharField(max_length=100, null=True, blank=True)`
- `state`: `CharField(max_length=100, null=True, blank=True)`
- `pincode`: `CharField(max_length=20, null=True, blank=True)`
- `country`: `CharField(max_length=100, default='India', null=True, blank=True)`
- `current_balance`: `DecimalField(max_digits=12, decimal_places=2, default=0.00)`
- `created_by`: `ForeignKey(User, on_delete=SET_NULL, null=True, blank=True)`
- `created_at`: `DateTimeField(auto_now_add=True)`

**Required model update:** Add `Meta` class to `Party` model to match `Product` model consistency:
```python
class Meta:
    ordering = ['-created_at']
    indexes = [
        models.Index(fields=['party_name']),
        models.Index(fields=['mobile_number']),
    ]
    verbose_name = 'Party'
    verbose_name_plural = 'Parties'
```
**Migration required:** Run `python manage.py makemigrations` and `python manage.py migrate` after adding the `Meta` class.

## 5. Frontend Architecture (React + JSX)

- **Pages/Views:** `MastersPage.jsx` (`activeTab === 'parties'`)
- **State Management:**
  - **Server State:** TanStack Query hooks in `src/hooks/queries/usePartyQuery.js`:
    - `usePartiesQuery(params)` — Fetches party list with optional search/ordering params; `queryKey: ['parties', params]`
    - `usePartyDetailQuery(id)` — Fetches single party; `queryKey: ['party', id]`; `enabled: Boolean(id)`
    - `useCreatePartyMutation()` — Creates party; invalidates `['parties']` on success
    - `useUpdatePartyMutation()` — Updates party; invalidates `['parties']` on success
    - `useDeletePartyMutation()` — Deletes party; invalidates `['parties']` on success
  - **Client State:** React local state in `MastersPage.jsx` for `partySearchQuery`, `isModalOpen`, `editingItem`, `globalError`. `AppContext` will retain `selectedLedgerParty` / `setSelectedLedgerParty` only.
- **UI Components:**
  - `src/components/Modals/PartyModal.jsx` — Updated to accept `isLoading` and `errorMessage` props; field mapping corrected between API (snake_case) and form (camelCase).
  - `src/pages/Masters/MastersPage.jsx` — Parties tab connected to TanStack Query hooks; `addParty`, `updateParty`, `deleteParty` from `AppContext` removed.

**Field Mapping — API (snake_case) ↔ Form (camelCase):**

| API Field (`partyApi.js` payload) | Form `formData` key (`PartyModal.jsx`) |
|---|---|
| `party_name` | `name` |
| `mobile_number` | `phone` |
| `alternate_mobile` | `alternatePhone` |
| `email_address` | `email` |
| `gst_number` | `gstNumber` |
| `pan_number` | `panNumber` |
| `address_line_1` | `addressLine1` |
| `address_line_2` | `addressLine2` |
| `landmark` | `landmark` |
| `city` | `city` |
| `state` | `state` |
| `pincode` | `pincode` |
| `country` | `country` |
| `current_balance` *(read-only, not sent on create/update)* | `balance` *(display only)* |

## 6. Files to Modify

- `backend/app/models.py` — Add `Meta` class (`ordering`, `indexes`, `verbose_name`) to `Party` model.
- `backend/app/admin.py` — Register `PartyAdmin` with `list_display`, `search_fields`, `list_filter`, `ordering`, `list_select_related`.
- `backend/backend/urls.py` — Include `app.party_urls` under `api/v1/`.
- `frontend/src/pages/Masters/MastersPage.jsx` — Replace `addParty`, `updateParty`, `deleteParty` from `AppContext` with `usePartyQuery` hooks; add party search bar; wire `PartyModal` with `isLoading` and `errorMessage`.
- `frontend/src/components/Modals/PartyModal.jsx` — Add `isLoading` and `errorMessage` props; fix `useEffect` field mapping to handle snake_case API data on edit.
- `frontend/src/context/AppContext.jsx` — Remove `parties` state, `addParty`, `updateParty`, `deleteParty`; retain `selectedLedgerParty` and `setSelectedLedgerParty`.

## 7. Files to Create

- `backend/app/party_serializers.py` — DRF `PartySerializer` (`ModelSerializer`) with:
  - `created_by_username` as `ReadOnlyField(source='created_by.username', default=None)`
  - `validate_party_name`: strip whitespace, reject empty, reject duplicate (case-insensitive, exclude self on PUT/PATCH)
  - `validate_mobile_number`: strip whitespace, reject empty
  - `read_only_fields`: `['id', 'created_by', 'created_by_username', 'created_at', 'current_balance']`
- `backend/app/party_views.py` — DRF `PartyViewSet(viewsets.ModelViewSet)` with:
  - `permission_classes = [IsAuthenticated]`
  - `filter_backends = [SearchFilter, OrderingFilter]`
  - `search_fields = ['party_name', 'mobile_number']`
  - `ordering_fields = ['party_name', 'current_balance', 'created_at']`
  - `ordering = ['-created_at']`
  - `get_queryset`: `Party.objects.select_related('created_by').all()`
  - `perform_create`: assigns `created_by = request.user`; logs creation
  - `destroy`: blocks deletion if `Invoice.objects.filter(party=instance).exists()`; returns `HTTP 400`; logs warning
- `backend/app/party_urls.py` — `DefaultRouter` registering `PartyViewSet` at `r'parties'`; exposed under `api/v1/parties/`
- `frontend/src/api/partyApi.js` — Axios API functions: `fetchParties(params)`, `fetchPartyById(id)`, `createParty(data)`, `updateParty({id, ...data})`, `deleteParty(id)`. The `createParty` and `updateParty` functions transform camelCase `formData` to snake_case API payload internally.
- `frontend/src/hooks/queries/usePartyQuery.js` — TanStack Query hooks mirroring `useProductQuery.js` with `['parties']` query key.

## 8. Rules for Implementation

- **Backend:** Follow `.antigravity/rules/django.md`:
  - `IsAuthenticated` permission class on all endpoints.
  - `select_related('created_by')` in `get_queryset`.
  - Use `logger.info()` / `logger.warning()` — no `print()` statements.
  - Wrap field-level validation in `validate_<field>()` methods in the serializer.
  - Register `PartyAdmin` in `admin.py` with full configuration.
  - Run `makemigrations` + `migrate` after model `Meta` update.
- **Frontend:** Follow `.antigravity/rules/react.md`:
  - JSX ONLY — `.jsx` and `.js` files. No TypeScript.
  - Path aliases `@/` for all imports.
  - All API calls go through `axiosClient` — no inline `axios` in components.
  - Use `lucide-react` icons only.
  - No `console.log` in production code.
  - Handle `isLoading`, `isError`, and empty data states in the Parties tab UI.
  - Cache invalidation via `queryClient.invalidateQueries({ queryKey: ['parties'] })` after mutations.

## 9. Concrete Test Scenarios & Edge Cases (Mandatory for /test-feature)

### A. Backend API Test Cases (Django / DRF)

- [ ] **Happy Path (200/201/204):**
  - `GET /api/v1/parties/`: Authenticated user fetches all parties → HTTP 200 with correct JSON structure.
  - `POST /api/v1/parties/`: Authenticated user creates party with `party_name` + `mobile_number` → HTTP 201; `created_by` auto-set to `request.user`; `current_balance` defaults to `0.00`.
  - `GET /api/v1/parties/{id}/`: Authenticated user retrieves party by ID → HTTP 200 with full party data.
  - `PUT /api/v1/parties/{id}/`: Authenticated user updates `city` and `gst_number` → HTTP 200 with updated fields.
  - `PATCH /api/v1/parties/{id}/`: Authenticated user partially updates `mobile_number` → HTTP 200.
  - `DELETE /api/v1/parties/{id}/`: Authenticated user deletes party with no linked invoices → HTTP 204 No Content.

- [ ] **Auth / Authorization (401):**
  - Unauthenticated requests to list, create, retrieve, update, or delete parties → HTTP 401 Unauthorized.

- [ ] **Input Validation (400):**
  - `POST` with empty `party_name` → HTTP 400: `{"party_name": ["This field may not be blank."]}`.
  - `POST` with empty `mobile_number` → HTTP 400: `{"mobile_number": ["This field may not be blank."]}`.
  - `POST` with `party_name` longer than 255 characters → HTTP 400.
  - `POST` omitting both `party_name` and `mobile_number` → HTTP 400 with both field errors.

- [ ] **Domain & Boundary Edge Cases:**
  - **Duplicate Party Name:** `POST` with a `party_name` matching an existing party (case-insensitive) → HTTP 400: `{"party_name": ["Party with this name already exists."]}`.
  - **Self-Exclusion on Update:** `PUT /api/v1/parties/{id}/` keeping the same `party_name` → HTTP 200 (not flagged as duplicate).
  - **Invoice Reference Protection:** `DELETE /api/v1/parties/{id}/` where party has at least one linked `Invoice` → HTTP 400: `{"detail": "Cannot delete party because it has associated invoices. Archive or reassign them first."}`.
  - **Search Filtering:** `GET /api/v1/parties/?search=Traders` returns only parties matching "Traders" in `party_name` or `mobile_number`.
  - **Non-existent ID:** `GET /api/v1/parties/99999/` → HTTP 404.

### B. Frontend UI & State Test Cases (React)

- [ ] **Form Validation:** Submitting `PartyModal.jsx` with empty `Party Name` or `Mobile Number` fields triggers HTML5 `required` validation before any API call is made.
- [ ] **API Failure Recovery:** Backend error messages (e.g., duplicate party name) render as visible error banner inside `PartyModal.jsx` without crashing the UI.
- [ ] **Loading & Mutation State:** Save/Update button in `PartyModal.jsx` shows a loading indicator and is disabled during active create/update mutations.
- [ ] **Edit Pre-population:** Opening the edit modal for a party pre-populates all form fields correctly, mapping API snake_case fields to camelCase `formData` keys.
- [ ] **Add Flow (Simplified):** When adding a new party, modal shows only `Party Name` and `Mobile Number` fields.
- [ ] **Edit Flow (Full):** When editing an existing party, modal shows all fields (Basic Details + Address Details sections).
- [ ] **Delete Confirmation:** Clicking delete on a party shows `window.confirm`; confirming calls `deletePartyMutation`; if blocked by backend, the `globalError` banner displays the error message.
- [ ] **Query Cache Invalidation:** After any create/update/delete mutation, `['parties']` cache is invalidated and the parties table refreshes instantly without page reload.
- [ ] **Search:** Typing in the parties search bar filters the list by `party_name` via the API `?search=` param.
- [ ] **Empty State:** When no parties exist, the table shows a clear "No parties found" message.

## 10. Definition of Done

- [ ] Backend API endpoints pass all scenarios listed in Section 9A.
- [ ] Frontend UI passes all scenarios listed in Section 9B.
- [ ] Database migrations for `Party` model `Meta` execute cleanly.
- [ ] `/test-feature 03-create-crud-for-party` runs and passes without errors.
- [ ] Security and quality audit passed via `/code-review-feature 03-create-crud-for-party`.

---

## 🛠️ Implementation Plan & Task Breakdown

### Phase 1: Database & Backend Core
- [ ] Task 1.1: Update `Party` model in `backend/app/models.py` — add `Meta` class (`ordering = ['-created_at']`, indexes on `party_name` and `mobile_number`, `verbose_name = 'Party'`, `verbose_name_plural = 'Parties'`).
- [ ] Task 1.2: Register `PartyAdmin` in `backend/app/admin.py` with `list_display = ['party_name', 'mobile_number', 'city', 'current_balance', 'created_by', 'created_at']`, `search_fields = ['party_name', 'mobile_number', 'gst_number']`, `list_filter = ['city', 'state']`, `ordering = ['-created_at']`, `list_select_related = ['created_by']`.
- [ ] Task 1.3: Run `python manage.py makemigrations` and `python manage.py migrate`.

### Phase 2: DRF API Layer
- [ ] Task 2.1: Create `backend/app/party_serializers.py` — implement `PartySerializer` with field-level validators for `party_name` (unique, case-insensitive, non-empty) and `mobile_number` (non-empty). Mark `id`, `created_by`, `created_by_username`, `created_at`, `current_balance` as read-only.
- [ ] Task 2.2: Create `backend/app/party_views.py` — implement `PartyViewSet` with `IsAuthenticated`, `SearchFilter` (`party_name`, `mobile_number`), `OrderingFilter` (`party_name`, `current_balance`, `created_at`), `select_related('created_by')`, `perform_create` with `created_by` assignment and `logger.info`, protected `destroy` with invoice check and `logger.warning`.
- [ ] Task 2.3: Create `backend/app/party_urls.py` — register `PartyViewSet` with `DefaultRouter` at `r'parties'`.
- [ ] Task 2.4: Update `backend/backend/urls.py` — add `path('api/v1/', include('app.party_urls'))`.
- [ ] Task 2.5: Write backend tests covering all Section 9A scenarios in `backend/app/tests.py`.

### Phase 3: Frontend API & State Layer
- [ ] Task 3.1: Create `frontend/src/api/partyApi.js` — implement `fetchParties`, `fetchPartyById`, `createParty`, `updateParty`, `deleteParty` using `axiosClient`. `createParty` and `updateParty` map camelCase form fields to snake_case API payload before the request.
- [ ] Task 3.2: Create `frontend/src/hooks/queries/usePartyQuery.js` — implement `usePartiesQuery`, `usePartyDetailQuery`, `useCreatePartyMutation`, `useUpdatePartyMutation`, `useDeletePartyMutation` with `['parties']` query key and cache invalidation on mutations.

### Phase 4: Frontend UI Integration
- [ ] Task 4.1: Update `frontend/src/components/Modals/PartyModal.jsx` — add `isLoading` and `errorMessage` props; update `useEffect` to map API snake_case response fields to camelCase `formData` on edit; show loading spinner on submit button; show error banner when `errorMessage` is truthy.
- [ ] Task 4.2: Update `frontend/src/pages/Masters/MastersPage.jsx` — import and use `usePartiesQuery`, `useCreatePartyMutation`, `useUpdatePartyMutation`, `useDeletePartyMutation`; remove `addParty`, `updateParty`, `deleteParty` from `useApp()` destructure; add `partySearchQuery` state and search bar for parties tab; pass `isLoading` and `errorMessage` to `<PartyModal>`; implement loading and empty states for the parties table.
- [ ] Task 4.3: Update `frontend/src/context/AppContext.jsx` — remove `parties` state (localStorage sync, initial state, CRUD functions: `addParty`, `updateParty`, `deleteParty`); remove `initialParties` import if unused; retain `selectedLedgerParty` and `setSelectedLedgerParty`.

### Phase 5: Testing & Verification
- [ ] Task 5.1: Execute `/test-feature 03-create-crud-for-party` to run all backend and frontend tests.
- [ ] Task 5.2: Verify zero failing assertions and fix any discovered defects.
- [ ] Task 5.3: Run `/code-review-feature 03-create-crud-for-party` for security and code quality audit.
