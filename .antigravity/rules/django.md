# 🐍 Django & Django REST Framework (DRF) Guidelines

## 🎯 Core Principles
- Follow these guidelines strictly unless explicitly instructed otherwise.
- Never make assumptions about requirements. If any requirement is unclear or incomplete, ask questions before writing code.
- Prefer simplicity, readability, and maintainability over clever solutions.
- Do not create additional files, folders, apps, dependencies, or architectural changes unless explicitly requested.
- Write production-ready, scalable, and secure Django/DRF code.

---

## 🗄️ Step 1: Model Design & Queries

### Requirements & Standards
- Before writing model code, identify all required fields and ask for clarification if any definition is missing.
- Define explicit `Meta` options (`ordering`, `verbose_name`, `verbose_name_plural`, indexes, unique constraints).
- Use `TextChoices` or `IntegerChoices` for fixed values instead of plain `CharField` strings.
- Add model validation (`clean()`) only when business rules strictly belong inside the model.
- Always implement a clear `__str__()` method.

### Query & Database Optimization
- **Prevent N+1 Queries:** Use `select_related()` for foreign keys and `prefetch_related()` for M2M/Reverse relationships.
- Use `only()`, `defer()`, `exists()`, `count()`, `annotate()`, and `aggregate()` to push calculations into the database.
- Use `django.utils.timezone.now()` instead of `datetime.now()`.
- Wrap multi-operation write transactions in `django.db.transaction.atomic()`.
- Use Django ORM exclusively. **Raw SQL is strictly forbidden** unless explicitly requested.

### Async ORM Rules
- When asynchronous views are required, use Django Async ORM (`aget()`, `acreate()`, `aupdate()`, `adelete()`, `aexists()`, `acount()`).
- Do NOT mix synchronous ORM calls inside async views without proper sync-to-async wrappers.

---

## 🛠️ Step 2: Admin Configuration
- Every model must be registered in `admin.py` with a dedicated `ModelAdmin` class.
- Configure: `list_display`, `search_fields`, `list_filter`, `ordering`.
- Use `autocomplete_fields`, `list_select_related`, `readonly_fields`, and `date_hierarchy` where relevant.
- Verify migrations are ready (`python manage.py makemigrations` & `python manage.py migrate`).

---

## 🔌 Step 3: Django REST Framework (DRF) Standards

### Architecture & File Structure
Keep API code structured into:
- `serializers.py`
- `views.py`
- `urls.py`

*(Do not introduce additional architecture patterns/files unless explicitly required).*

### Authentication & Authorization
- **Mechanism:** Simple JWT using Header-based Bearer Authentication (`Authorization: Bearer <access_token>`).
- Always apply explicit DRF permission classes (`IsAuthenticated`, `IsAdminUser`, or `AllowAny`). Never leave endpoints unintentionally exposed.
- Never hardcode JWT secret keys; load configurations via `django.conf.settings` / environment variables.

### Serializers & Views
- Prefer `ModelSerializer`. Use standard `Serializer` only when non-model mapping is needed.
- Validate incoming data using `validate()` and field-level `validate_<field_name>()`.
- Choose the simplest view mechanism appropriate for the task: `APIView`, `GenericAPIView`, `ViewSet`, or `ModelViewSet`.
- Configure filtering using `filter_backends`, `search_fields`, and `ordering_fields`.

### Response Format & HTTP Status Codes
Always return standard HTTP status codes:
- `200 OK` / `201 Created` / `204 No Content`
- `400 Bad Request` / `401 Unauthorized` / `403 Forbidden` / `404 Not Found`

---

## 🔒 Step 4: Security, Logging & Error Handling

### Security & Input Safety
- Validate all user inputs rigorously.
- Never log sensitive information (passwords, JWT tokens, PII).
- Never disable built-in Django security settings without permission.

### Logging Standards
- Use Python's built-in `logging` module (`logger.info()`, `logger.warning()`, `logger.error()`, `logger.exception()`).
- **Never use raw `print()` statements** in production code.

### Exception Handling
- Catch explicit, expected exceptions. Broad `except Exception:` blocks are forbidden unless logging unexpected errors at top-level handlers.

---

## 🧪 Step 5: Testing Guidelines
- Write unit/integration tests for every API feature using `APITestCase` or `pytest-django`.
- Ensure tests cover:
  1. Unauthenticated access (401 response).
  2. Invalid inputs (400 validation response).
  3. Authorized success payload execution (200/201 response).

---

## ✅ Step 6: Feature Completion Checklist
Before marking any backend feature complete, verify:
- [ ] Models created with proper indexes, constraints, and `__str__()`.
- [ ] Admin registered with detailed `ModelAdmin`.
- [ ] Serializer validation implemented (`validate()`, `validate_<field>`).
- [ ] Query execution optimized (`select_related`, `prefetch_related`).
- [ ] DRF Permission classes and Bearer auth verified.
- [ ] Logging added and `print()` removed.
- [ ] Migration commands generated (`makemigrations`).
- [ ] Unit/Integration tests created and passing.