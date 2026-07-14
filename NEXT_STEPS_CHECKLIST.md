# Next Steps Checklist — Post Clean Architecture

> **Status:** Clean architecture migration is ✅ **COMPLETE**.  
> **Current Phase:** Post-migration improvements & optional UI modernization.  
> **Strategy:** Incremental improvements — each item is independent and can be done in any order.  
> **Last Updated:** May 22, 2026

---

## ✅ Completed (Clean Architecture Migration)

- [x] Core layer (types, errors, utils) — `src/core/`
- [x] Domain layer (entities, repositories, use cases) — `src/domain/`
- [x] Data layer (datasources, repos, network, cache) — `src/data/`
- [x] Presentation layer (interceptor, state, CDN registry, navigation) — `src/presentation/`
- [x] DI Container — `src/di/container.ts`
- [x] Electron bridge (protocol handler, router) — `electron/src/bridge/`
- [x] Webview bridge (`window.AnimeTV`) — `src/webview/bridge.ts`
- [x] Android bridge — `src/webview/android-bridge.ts`
- [x] m.js modularization (27 modules) — `app/src/main/assets/view/modules/`
- [x] ESBuild pipeline — `scripts/build-webview.js`
- [x] Source providers wrapped (Gojo, Kaas, Wave) — `src/data/datasources/`
- [x] Plugin system — `src/data/plugins/`
- [x] State management (StateManager + events) — `src/presentation/state/`
- [x] Navigation controller + UI feedback — `src/presentation/navigation/`, `src/presentation/ui-feedback/`
- [x] API Facade — `src/webview/api-facade.ts`
- [x] Integration tests — `src/__integration__/`
- [x] Unit tests (100+ passing)

---

## 🔴 Priority 1: Testing & Stability

These items protect against regressions and improve confidence in the codebase.

- [ ] **E2E Tests with Playwright**
  - [ ] Set up Playwright config for Electron
  - [ ] Test: App launches without errors
  - [ ] Test: Home screen loads anime data
  - [ ] Test: Search returns results
  - [ ] Test: Episode list loads for an anime
  - [ ] Test: Stream playback initiates
  - [ ] Add to CI pipeline

- [x] **Increase unit test coverage**
  - [x] Add tests for `src/webview/bridge.ts` (getHomeData, searchAnilistNormalized) — `src/webview/bridge.spec.ts`
  - [x] Add tests for stream source fetching (sort, validate, fallback) — `src/webview/bridge.spec.ts`
  - [x] Add tests for AniList search query building — `src/webview/bridge.spec.ts`
  - [x] Add tests for Jikan datasource edge cases — `src/data/datasources/jikan-datasource.spec.ts`
  - [ ] Target: 80%+ coverage on `src/` TypeScript

---

## 🟡 Priority 2: TypeScript Migration of Legacy Modules

Migrate m.js modules to TypeScript one at a time. Each module becomes type-safe and testable while keeping the same runtime behavior.

- [ ] **`19-home.js`** → TypeScript
  - [ ] Extract types for home data structures
  - [ ] Use `window.AnimeTV.getHomeData()` / `window.AnimeTV.getTrending()`
  - [ ] Add unit tests

- [ ] **`22-search.js`** → TypeScript
  - [ ] Use `window.AnimeTV.searchAnime()` 
  - [ ] Add unit tests

- [ ] **`10-player.js`** → TypeScript
  - [ ] Use `window.AnimeTV.getStreamSources()`
  - [ ] Extract video player state management
  - [ ] Add unit tests

- [ ] **`12-api.js`** → TypeScript
  - [ ] Already partially migrated (APIFacade exists)
  - [ ] Remove remaining raw `_API` usage
  - [ ] Route all calls through `window.AnimeTV.facade`

- [ ] **`18-eplist.js`** → TypeScript
  - [ ] Use `window.AnimeTV.getEpisodes()`
  - [ ] Add unit tests

- [ ] **Other modules** (lower priority)
  - [ ] `04-miruro.js` — pipe/proxy logic
  - [ ] `09-stream.js` — stream resolution
  - [ ] `20-watchlist.js` — list management
  - [ ] `21-settings.js` — settings UI

---

## 🟡 Priority 3: Error Handling & Observability

- [ ] **Structured error handling**
  - [ ] Create error boundary wrapper for bridge calls
  - [ ] Add retry logic for transient network failures (AniList 502/503)
  - [ ] Add circuit breaker for repeatedly failing sources
  - [ ] Ensure all async bridge methods handle and log errors consistently

- [ ] **Performance monitoring**
  - [ ] Add timing instrumentation to bridge method calls
  - [ ] Track cache hit/miss rates
  - [ ] Log slow API calls (>3s)
  - [ ] Add memory usage tracking for Android WebView

---

## 🟢 Priority 4: Documentation & Developer Experience

- [ ] **API documentation**
  - [ ] Generate TypeDoc from `AnimeTVBridge` interface
  - [ ] Document all public bridge methods with examples
  - [ ] Add architecture decision records (ADRs) for key decisions

- [ ] **Developer onboarding**
  - [ ] Update README with architecture overview
  - [ ] Add CONTRIBUTING.md with build/test instructions
  - [ ] Add inline code examples for common tasks

- [ ] **Build system improvements**
  - [ ] Add `npm run typecheck` to CI
  - [ ] Add pre-commit hook for lint + type check
  - [ ] Automate version bumping in bridge

---

## 🟢 Priority 5: Optional — Preact SPA UI (Parked)

> **Decision:** Paused for now. Legacy m.js UI works fine. Can resume anytime.

The Preact SPA foundation is built but not wired into the app. If resumed later:

- [ ] Wire `spa.js` into `main.html` with feature flag toggle
- [ ] Build SPA bundle (`npm run build:spa`)
- [ ] Validate HomeScreen renders correctly alongside legacy
- [ ] Migrate PlaybackScreen
- [ ] Migrate SettingsScreen
- [ ] Remove legacy m.js screens once SPA equivalents are validated
- [ ] Full IIFE bundling (drop legacy m.js entirely)

**Existing SPA components (ready to use):**
- `src/webview/ui/screens/HomeScreen.tsx` ✅
- `src/webview/ui/screens/SearchScreen.tsx` ✅
- `src/webview/ui/screens/DetailsScreen.tsx` ✅
- `src/webview/ui/components/` (Router, Sidebar, AnimeCard, Section, Banner, Toast) ✅
- `src/webview/ui/hooks/` (useBridge, useSpatialNav) ✅
- `src/webview/ui/store.ts` (signals-based state) ✅

---

## Quick Reference: Key Files

| Purpose | File |
|---------|------|
| Bridge API (Electron) | `src/webview/bridge.ts` |
| Bridge API (Android) | `src/webview/android-bridge.ts` |
| Domain entities | `src/domain/entities/source.ts` |
| DI Container | `src/di/container.ts` |
| State Manager | `src/presentation/state/state-manager.ts` |
| Plugin Manager | `src/data/plugins/plugin-manager.ts` |
| Build script (webview) | `scripts/build-webview.js` |
| Build script (SPA) | `scripts/build-spa.js` |
| Test config | `vitest.config.mts` |
| Architecture docs | `ARCHITECTURE_ROADMAP.md` |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| May 2025 | Clean arch migration complete | All layers implemented, tested, deployed |
| May 2025 | Preact SPA paused | Legacy UI works; SPA is optional enhancement |
| May 2025 | Next focus: Testing + TS migration | Highest ROI without UI changes |
| May 2026 | Unit test coverage expanded | bridge.spec.ts + jikan-datasource.spec.ts added (60+ new tests) |
