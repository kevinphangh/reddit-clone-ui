# E2E Tests for VIA Pædagoger Forum

## Overview
These end-to-end tests ensure critical user flows work correctly in real browsers.

## Test Coverage
- **Homepage**: Loading, VIA branding, authentic content display
- **Authentication**: Login/register flows, validation, Danish text
- **Post Interactions**: Viewing posts, voting, navigation, timestamps
- **Error Handling**: API failures, network issues, form validation
- **Mobile Responsive**: Cross-device compatibility

## Running Tests

### Prerequisites
Install browser dependencies:
```bash
sudo npx playwright install-deps
```

### Local Development
```bash
# Run all E2E tests
npm run test:e2e

# Run specific browser
npm run test:e2e -- --project=chromium

# Interactive mode
npm run test:e2e:ui

# View reports
npm run test:e2e:report
```

### Test Configuration
- **Base URL**: https://via-forum.vercel.app (production)
- **Browsers**: Chromium, Firefox, Safari, Mobile Chrome/Safari
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure only
- **Traces**: On first retry

## Test Results Summary

✅ **23 comprehensive E2E tests covering:**
- Homepage functionality and VIA branding
- Authentication flows and Danish localization  
- Post interactions and voting system
- Error handling and network resilience
- Mobile responsiveness across devices

These tests validate that:
1. The forum loads correctly with authentic VIA content
2. Users can navigate and interact with posts
3. Authentication flows work in Danish
4. Error states are handled gracefully
5. Mobile experience is optimized

## CI Integration
Tests run automatically on:
- Pull requests to main branch
- Production deployments
- Scheduled nightly runs

Results are reported in GitHub Actions with screenshots and traces for debugging failures.