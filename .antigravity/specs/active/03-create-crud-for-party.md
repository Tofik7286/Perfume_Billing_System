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

> **Execution Order:** Tasks are strictly sequential. Do NOT begin a task until the previous one is complete and verified.  
> **Command context:** All `python manage.py` commands run from `D:\Project\Perfume_Billing_System\backend\`.  
> **Active branch:** `feature/create-crud-for-party`

---

### Phase 1: Database & Backend Core

#### [x] Task 1.1 — Add `Meta` class to `Party` model
- **File:** `backend/app/models.py`
- **Action:** Inside the `Party` class (after the `__str__` method), add:
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
- **Verify:** `Party._meta.ordering == ['-created_at']` and indexes are defined.
- **Do NOT** touch any other model in this file.

#### [x] Task 1.2 — Update `PartyAdmin` in `admin.py`
- **File:** `backend/app/admin.py`
- **Action:** The `PartyAdmin` already exists (lines 14–21) but is missing `list_select_related` and uses `ordering = ('party_name',)`. Update it to:
  ```python
  @admin.register(Party)
  class PartyAdmin(admin.ModelAdmin):
      list_display = ('id', 'party_name', 'mobile_number', 'city', 'current_balance', 'created_by', 'created_at')
      list_filter = ('city', 'state', 'created_at')
      search_fields = ('party_name', 'mobile_number', 'email_address', 'gst_number', 'pan_number')
      ordering = ('-created_at',)
      readonly_fields = ('created_at', 'current_balance')
      autocomplete_fields = ('created_by',)
      list_select_related = ('created_by',)
  ```
- **Verify:** Django admin page for Party loads without errors and `list_select_related` is set.

#### [x] Task 1.3 — Generate and apply migration
- **Commands:**
  ```powershell
  cd D:\Project\Perfume_Billing_System\backend
  python manage.py makemigrations app --name="party_meta_indexes"
  python manage.py migrate
  ```
- **Verify:** Migration file created in `backend/app/migrations/`. `python manage.py showmigrations app` shows all applied.

---

### Phase 2: DRF API Layer & Backend Tests

#### [x] Task 2.1 — Create `party_serializers.py`
- **File:** `backend/app/party_serializers.py` *(new)*
- **Class:** `PartySerializer(serializers.ModelSerializer)`
- **Key signatures:**
  ```python
  class PartySerializer(serializers.ModelSerializer):
      created_by_username = serializers.ReadOnlyField(source='created_by.username', default=None)

      class Meta:
          model = Party
          fields = [
              'id', 'party_name', 'mobile_number', 'alternate_mobile',
              'email_address', 'gst_number', 'pan_number',
              'address_line_1', 'address_line_2', 'landmark',
              'city', 'state', 'pincode', 'country',
              'current_balance', 'created_by', 'created_by_username', 'created_at',
          ]
          read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at', 'current_balance']

      def validate_party_name(self, value): ...   # strip, reject empty, reject duplicate (case-insensitive, exclude self on update)
      def validate_mobile_number(self, value): ... # strip, reject empty
  ```
- **Verify:** `PartySerializer(data={'party_name': '', 'mobile_number': '9876543210'}).is_valid()` returns `False` with `party_name` error.

#### [x] Task 2.2 — Create `party_views.py`
- **File:** `backend/app/party_views.py` *(new)*
- **Class:** `PartyViewSet(viewsets.ModelViewSet)`
- **Key signatures:**
  ```python
  import logging
  from rest_framework import viewsets, filters, status
  from rest_framework.permissions import IsAuthenticated
  from rest_framework.response import Response
  from .models import Party, Invoice
  from .party_serializers import PartySerializer

  logger = logging.getLogger(__name__)

  class PartyViewSet(viewsets.ModelViewSet):
      permission_classes = [IsAuthenticated]
      serializer_class = PartySerializer
      filter_backends = [filters.SearchFilter, filters.OrderingFilter]
      search_fields = ['party_name', 'mobile_number']
      ordering_fields = ['party_name', 'current_balance', 'created_at']
      ordering = ['-created_at']

      def get_queryset(self): ...        # Party.objects.select_related('created_by').all()
      def perform_create(self, serializer): ...  # save(created_by=request.user), logger.info
      def destroy(self, request, *args, **kwargs): ... # Invoice check → HTTP 400, logger.warning
  ```
- **Rules:** No `print()`. Use `logger.info` on create, `logger.warning` on blocked delete.
- **Verify:** `GET /api/v1/parties/` without token → `401`. With token → `200`.

#### [x] Task 2.3 — Create `party_urls.py`
- **File:** `backend/app/party_urls.py` *(new)*
- **Content:**
  ```python
  from django.urls import path, include
  from rest_framework.routers import DefaultRouter
  from .party_views import PartyViewSet

  router = DefaultRouter()
  router.register(r'parties', PartyViewSet, basename='party')

  urlpatterns = [
      path('', include(router.urls)),
  ]
  ```
- **Verify:** `router.urls` generates `parties/` and `parties/{pk}/` paths.

#### [x] Task 2.4 — Update `backend/backend/urls.py`
- **File:** `backend/backend/urls.py`
- **Action:** Add one line after the existing product URL include:
  ```python
  path('api/v1/', include('app.party_urls')),
  ```
- **Result:** `urlpatterns` will have three `api/v1/` includes — auth, products, parties.
- **Verify:** `python manage.py check` exits with no errors.

#### [x] Task 2.5 — Add `PartyAPITestCase` to `backend/app/tests.py`
- **File:** `backend/app/tests.py` *(append new class at end)*
- **Class:** `PartyAPITestCase(APITestCase)`
- **Test methods to implement** (covering all Section 9A scenarios):

  | Method | Description | Expected |
  |---|---|---|
  | `setUp` | Create user, 2 parties, set `list_url`, `detail_url` | — |
  | `test_list_parties_authenticated` | GET list with auth | `200`, count == 2 |
  | `test_list_parties_unauthenticated` | GET list, no token | `401` |
  | `test_create_party_success` | POST valid payload | `201`, `created_by_username` == user |
  | `test_create_party_unauthenticated` | POST, no token | `401` |
  | `test_create_party_empty_party_name` | POST `party_name=""` | `400`, `party_name` in errors |
  | `test_create_party_whitespace_party_name` | POST `party_name="   "` | `400` |
  | `test_create_party_empty_mobile_number` | POST `mobile_number=""` | `400`, `mobile_number` in errors |
  | `test_create_party_missing_required_fields` | POST `{}` | `400`, both field errors |
  | `test_create_party_duplicate_name_case_insensitive` | POST same name lowercase | `400` |
  | `test_update_party_same_name_no_duplicate_error` | PUT keeping same `party_name` | `200` |
  | `test_retrieve_party_success` | GET `{id}/` | `200`, correct `party_name` |
  | `test_retrieve_party_not_found` | GET `/parties/99999/` | `404` |
  | `test_update_party_success` | PUT with new city + gst | `200`, fields updated |
  | `test_patch_party_success` | PATCH `mobile_number` only | `200` |
  | `test_delete_party_no_invoices_success` | DELETE unreferenced | `204`, DB record gone |
  | `test_delete_party_with_invoices_blocked` | DELETE party with Invoice | `400`, detail contains "Cannot delete" |
  | `test_search_by_party_name` | GET `?search=Traders` | `200`, matching result only |
  | `test_search_by_mobile_number` | GET `?search=9876543210` | `200`, matching result only |
  | `test_create_party_name_exceeds_max_length` | POST 256-char name | `400` |

- **Run command to verify:**
  ```powershell
  python manage.py test app.tests.PartyAPITestCase --verbosity=2
  ```

---

### Phase 3: Frontend API & State Layer

#### [x] Task 3.1 — Create `frontend/src/api/partyApi.js`
- **File:** `frontend/src/api/partyApi.js` *(new)*
- **Pattern:** Mirror `productApi.js` exactly. Add an internal `toApiPayload(formData)` mapper.
- **Functions to export:**
  ```js
  const toApiPayload = (formData) => ({ ... }) // camelCase → snake_case

  export const fetchParties = async (params = {}) => { ... }       // GET /api/v1/parties/
  export const fetchPartyById = async (id) => { ... }              // GET /api/v1/parties/{id}/
  export const createParty = async (formData) => { ... }           // POST — uses toApiPayload
  export const updateParty = async ({ id, ...formData }) => { ... } // PUT — uses toApiPayload
  export const deleteParty = async (id) => { ... }                 // DELETE
  ```
- **`toApiPayload` mapping:**
  ```js
  const toApiPayload = (formData) => ({
    party_name:     formData.name,
    mobile_number:  formData.phone,
    alternate_mobile: formData.alternatePhone || null,
    email_address:  formData.email || null,
    gst_number:     formData.gstNumber || null,
    pan_number:     formData.panNumber || null,
    address_line_1: formData.addressLine1 || null,
    address_line_2: formData.addressLine2 || null,
    landmark:       formData.landmark || null,
    city:           formData.city || null,
    state:          formData.state || null,
    pincode:        formData.pincode || null,
    country:        formData.country || 'India',
  });
  ```
- **Rules:** Use `axiosClient` from `@/api/axiosClient`. No inline `axios`. No `console.log`.
- **Verify:** Function signatures match what `usePartyQuery.js` expects.

#### [x] Task 3.2 — Create `frontend/src/hooks/queries/usePartyQuery.js`
- **File:** `frontend/src/hooks/queries/usePartyQuery.js` *(new)*
- **Pattern:** Mirror `useProductQuery.js` exactly.
- **Hooks to export:**
  ```js
  export const usePartiesQuery = (params = {}) => useQuery({
    queryKey: ['parties', params],
    queryFn: () => fetchParties(params),
  });

  export const usePartyDetailQuery = (id) => useQuery({
    queryKey: ['party', id],
    queryFn: () => fetchPartyById(id),
    enabled: Boolean(id),
  });

  export const useCreatePartyMutation = () => useMutation({
    mutationFn: createParty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parties'] }),
  });

  export const useUpdatePartyMutation = () => useMutation({
    mutationFn: updateParty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parties'] }),
  });

  export const useDeletePartyMutation = () => useMutation({
    mutationFn: deleteParty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parties'] }),
  });
  ```
- **Rules:** Import from `@tanstack/react-query`. Import API functions from `@/api/partyApi`. No TypeScript.

---

### Phase 4: Frontend UI Integration (JSX)

#### [x] Task 4.1 — Update `frontend/src/components/Modals/PartyModal.jsx`
- **File:** `frontend/src/components/Modals/PartyModal.jsx` *(modify)*
- **Changes:**
  1. **Props signature:** Add `isLoading = false` and `errorMessage = ''` to destructured props.
  2. **`useEffect` field mapping fix:** When `editingItem` is from the API (snake_case), map correctly:
     ```js
     name:          editingItem.party_name      || editingItem.name          || '',
     phone:         editingItem.mobile_number   || editingItem.phone         || '',
     alternatePhone:editingItem.alternate_mobile|| editingItem.alternatePhone|| '',
     email:         editingItem.email_address   || editingItem.email         || '',
     gstNumber:     editingItem.gst_number      || editingItem.gstNumber     || '',
     panNumber:     editingItem.pan_number      || editingItem.panNumber     || '',
     addressLine1:  editingItem.address_line_1  || editingItem.addressLine1  || '',
     addressLine2:  editingItem.address_line_2  || editingItem.addressLine2  || '',
     landmark:      editingItem.landmark        || '',
     city:          editingItem.city            || '',
     state:         editingItem.state           || '',
     pincode:       editingItem.pincode         || '',
     country:       editingItem.country         || 'India',
     ```
  3. **Error banner:** Above the `<form>`, render when `errorMessage` is truthy:
     ```jsx
     {errorMessage && (
       <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
         {errorMessage}
       </div>
     )}
     ```
  4. **Submit button loading state:**
     ```jsx
     <button type="submit" disabled={isLoading} className="...">
       {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
       {editingItem ? 'Update' : 'Save'} Party
     </button>
     ```
     Import `Loader2` from `lucide-react`.
- **Do NOT** change any form field layout or existing validation logic.

#### [x] Task 4.2 — Update `frontend/src/pages/Masters/MastersPage.jsx`
- **File:** `frontend/src/pages/Masters/MastersPage.jsx` *(modify)*
- **Changes:**
  1. **Imports — add:**
     ```js
     import {
       usePartiesQuery,
       useCreatePartyMutation,
       useUpdatePartyMutation,
       useDeletePartyMutation,
     } from '@/hooks/queries/usePartyQuery';
     ```
  2. **Remove from `useApp()` destructure:** `parties`, `addParty`, `updateParty`, `deleteParty`.
  3. **Add state:** `const [partySearchQuery, setPartySearchQuery] = useState('');`
  4. **Add TanStack Query hooks:**
     ```js
     const {
       data: apiParties = [],
       isLoading: isPartiesLoading,
       isError: isPartiesError,
     } = usePartiesQuery({ search: partySearchQuery });

     const createPartyMutation = useCreatePartyMutation();
     const updatePartyMutation = useUpdatePartyMutation();
     const deletePartyMutation = useDeletePartyMutation();
     ```
  5. **`handleSaveParty`:** Replace `addParty`/`updateParty` calls with:
     ```js
     const handleSaveParty = (formData) => {
       setGlobalError('');
       if (editingItem) {
         updatePartyMutation.mutate({ id: editingItem.id, ...formData }, {
           onSuccess: () => handleCloseModal(),
           onError: (err) => {
             const detail = err.response?.data?.detail || err.response?.data?.party_name?.[0] || err.response?.data?.mobile_number?.[0] || 'Failed to update party.';
             setGlobalError(detail);
           },
         });
       } else {
         createPartyMutation.mutate(formData, {
           onSuccess: () => handleCloseModal(),
           onError: (err) => {
             const detail = err.response?.data?.detail || err.response?.data?.party_name?.[0] || err.response?.data?.mobile_number?.[0] || 'Failed to create party.';
             setGlobalError(detail);
           },
         });
       }
     };
     ```
  6. **`handleDelete` for parties:** Replace `deleteParty(id)` with:
     ```js
     deletePartyMutation.mutate(id, {
       onError: (err) => {
         const detail = err.response?.data?.detail || 'Failed to delete party.';
         setGlobalError(detail);
       },
     });
     ```
  7. **Parties search bar:** In the header controls section, add alongside the products search bar:
     ```jsx
     {activeTab === 'parties' && (
       <div className="relative flex-1 md:w-64">
         <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
         <input
           type="text"
           placeholder="Search parties..."
           className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
           value={partySearchQuery}
           onChange={(e) => setPartySearchQuery(e.target.value)}
         />
       </div>
     )}
     ```
  8. **Replace `parties` with `apiParties`** in all JSX table/list render sections for the parties tab. Add loading row:
     ```jsx
     {isPartiesLoading ? (
       <tr><td colSpan="4" className="p-8 text-center text-slate-400">
         <div className="flex items-center justify-center gap-2">
           <Loader2 size={24} className="animate-spin text-indigo-600" />
           <span>Fetching parties...</span>
         </div>
       </td></tr>
     ) : isPartiesError ? (
       <tr><td colSpan="4" className="p-8 text-center text-rose-500">Failed to load parties. Please refresh.</td></tr>
     ) : apiParties.length === 0 ? (
       <tr><td colSpan="4" className="p-8 text-center text-slate-500">No parties found. Click Add Party to create one.</td></tr>
     ) : (
       apiParties.map((party) => ( ... ))
     )}
     ```
  9. **Field access in party rows:** Use `party.party_name` and `party.mobile_number` and `party.current_balance` (API shape) instead of `party.name`, `party.phone`, `party.balance`.
  10. **`isPartyMutationLoading`:** `const isPartyMutationLoading = createPartyMutation.isPending || updatePartyMutation.isPending;`
  11. **Pass props to `<PartyModal>`:**
      ```jsx
      <PartyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingItem={editingItem}
        onSave={handleSaveParty}
        isLoading={isPartyMutationLoading}
        errorMessage={globalError}
      />
      ```
  12. **Import `Loader2`** from `lucide-react` if not already present.

#### [x] Task 4.3 — Update `frontend/src/context/AppContext.jsx`
- **File:** `frontend/src/context/AppContext.jsx` *(modify)*
- **Remove entirely:**
  - `parties` state declaration and `localStorage.getItem('perfume_parties')` init
  - `useEffect` that syncs `parties` to localStorage
  - `addParty` function
  - `updateParty` function
  - `deleteParty` function
  - `parties` from the `AppContext.Provider` value object
- **Remove import** of `initialParties` from `'../constants/initialData'` if it is no longer referenced anywhere in the file.
- **Keep intact:** `selectedLedgerParty`, `setSelectedLedgerParty`, all invoice/payment logic, `products` state, `billing` hook.
- **Verify:** No `parties`-related references remain; `AppContext` still exports `selectedLedgerParty`, `setSelectedLedgerParty`.

---

### Phase 5: Testing & Verification

#### [x] Task 5.1 — Run backend tests
- **Command:**
  ```powershell
  cd D:\Project\Perfume_Billing_System\backend
  python manage.py test app.tests.PartyAPITestCase --verbosity=2
  ```
- **Expected:** All `PartyAPITestCase` tests pass (`OK`). Zero failures or errors.

#### [x] Task 5.2 — Run all backend tests (regression check)
- **Command:**
  ```powershell
  python manage.py test app --verbosity=2
  ```
- **Expected:** All existing `UserAuthenticationTests` and `ProductAPITestCase` tests continue to pass. New `PartyAPITestCase` passes.

#### [x] Task 5.3 — Smoke test frontend
- Start backend: `python manage.py runserver`
- Start frontend: `npm run dev` (from `D:\Project\Perfume_Billing_System\frontend\`)
- Manually verify:
  - [ ] Parties tab loads data from API (not localStorage)
  - [ ] Search bar filters parties
  - [ ] Add Party → only Name + Mobile shown → saves to API → list refreshes
  - [ ] Edit Party → all fields pre-populated with API data → updates → list refreshes
  - [ ] Delete Party (no invoices) → `confirm` → deleted
  - [ ] Error messages from API appear in modal banner
  - [ ] `AppContext` no longer has party CRUD (no localStorage `perfume_parties` key written)

#### [x] Task 5.4 — Commit implementation
- **Command:**
  ```powershell
  cd D:\Project\Perfume_Billing_System
  git add backend/app/models.py backend/app/admin.py backend/app/party_serializers.py backend/app/party_views.py backend/app/party_urls.py backend/backend/urls.py backend/app/tests.py
  git add frontend/src/api/partyApi.js frontend/src/hooks/queries/usePartyQuery.js frontend/src/components/Modals/PartyModal.jsx frontend/src/pages/Masters/MastersPage.jsx frontend/src/context/AppContext.jsx
  git commit -m "feat(03): implement full CRUD API and UI for Party"
  ```

#### [x] Task 5.5 — Update progress tracker
- **File:** `.antigravity/memory/progress.md`
- Update `Current Task` to `Phase 5 — Complete` once all tests pass.
- Run `/test-feature 03-create-crud-for-party` then `/code-review-feature 03-create-crud-for-party`.
