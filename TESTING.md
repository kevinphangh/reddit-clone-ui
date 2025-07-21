# Testing Guide

**Updated**: Nu med integration tests og Docker support!

Dette dokument beskriver hvordan du kører og skriver tests for VIA Forum projektet.

## 🧪 Frontend Testing

Frontend bruger **Vitest** og **React Testing Library**.

### Kør Tests

```bash
cd frontend

# Kør alle tests én gang
npm test -- --run

# Kør integration tests
npm test -- --run src/__tests__/integration/

# Kør tests i watch mode
npm test

# Kør tests med UI
npm run test:ui

# Kør tests med coverage
npm run test:coverage
```

### Integration Tests (NYT!)

Vi bruger nu **MSW (Mock Service Worker)** til at mocke API calls:

```typescript
// src/__tests__/integration/LoginFlow.test.tsx
describe('Login Flow Integration', () => {
  it('successfully logs in with valid credentials', async () => {
    // Tester hele login flowet med rigtige komponenter
  });
});
```

### Test Struktur

Tests ligger ved siden af komponenterne:
```
src/
  components/
    UnitySymbol.tsx
    __tests__/
      UnitySymbol.test.tsx
```

### Eksempel Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UnitySymbol } from '../UnitySymbol';

describe('UnitySymbol', () => {
  it('renders without crashing', () => {
    render(<UnitySymbol />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
```

## 🐍 Backend Testing

Backend bruger **pytest** og **pytest-asyncio**.

### Kør Tests

#### Med Docker (ANBEFALET - NYT!)

```bash
cd backend

# Kør tests i Docker container med Python 3.11
./test.sh

# Eller manuelt:
docker-compose -f docker-compose.test.yml build
docker-compose -f docker-compose.test.yml run --rm test
docker-compose -f docker-compose.test.yml down
```

#### Lokalt (kræver Python 3.11 eller 3.12)

```bash
cd backend

# Installer test dependencies
pip install -r requirements-test.txt

# Kør alle tests
pytest

# Kør tests med verbose output
pytest -v

# Kør tests med coverage
pytest --cov=app --cov-report=html
```

### Test Struktur

```
backend/
  tests/
    conftest.py       # Fixtures og setup
    test_auth.py      # Auth endpoint tests
    test_posts.py     # Posts endpoint tests
    test_users.py     # Users endpoint tests
```

### Fixtures

Almindelige fixtures i `conftest.py`:
- `async_session`: Database session
- `client`: Test HTTP client
- `test_user`: Verificeret test bruger
- `auth_headers`: Authorization headers
- `test_post`: Test post

### Eksempel Test

```python
async def test_create_post(client: AsyncClient, auth_headers):
    response = await client.post(
        "/api/posts/",
        json={
            "title": "Test Post",
            "content": "Test content",
            "type": "text"
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Test Post"
```

## 🔄 CI/CD Pipeline

Tests kører automatisk via GitHub Actions når du:
- Pusher til `main` eller `develop`
- Opretter en pull request

### Workflows

1. **CI/CD Pipeline** (`.github/workflows/ci.yml`)
   - Kører tests
   - Deployer til produktion hvis tests passed

2. **Run Tests** (`.github/workflows/test.yml`)
   - Kan køres manuelt
   - Kører på pull requests

## 📊 Test Coverage

### Frontend Coverage
```bash
cd frontend
npm run test:coverage
```

### Backend Coverage
```bash
cd backend
pytest --cov=app --cov-report=html
# Åbn htmlcov/index.html i browser
```

## ✅ Best Practices

### Frontend
- Test bruger interaktioner, ikke implementation details
- Brug `screen` queries frem for container queries
- Mock eksterne dependencies (API calls)
- Test accessibility med `getByRole`

### Backend
- Test endpoints, ikke interne funktioner
- Brug fixtures til genbrug
- Test både success og error cases
- Test authorization og validation

### Generelt
- Skriv beskrivende test navne
- Test edge cases
- Hold tests simple og fokuserede
- Kør tests før commit

## 🚨 Troubleshooting

### Frontend
- **"Cannot find module"**: Kør `npm install`
- **"No test found"**: Check fil navne ender med `.test.tsx`
- **Mock errors**: Se Vitest docs for mock syntax

### Backend
- **"Import error"**: Check PYTHONPATH eller brug `python -m pytest`
- **"Database error"**: Tests bruger in-memory SQLite
- **Async errors**: Brug `pytest-asyncio`

## 🎯 Hvad skal testes?

### Kritiske Features
- ✅ User registration med email verifikation
- ✅ Login/logout
- ✅ Create/edit/delete posts
- ✅ Commenting system
- ✅ Voting system
- ✅ User profiles
- ✅ Authorization (kan kun redigere egne posts)

### Edge Cases
- ✅ Validation errors (for lange titler, tomme felter)
- ✅ Unauthenticated access
- ✅ Non-existent resources (404s)
- ✅ Duplicate usernames/emails

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [pytest Documentation](https://docs.pytest.org/)
- [pytest-asyncio](https://pytest-asyncio.readthedocs.io/)