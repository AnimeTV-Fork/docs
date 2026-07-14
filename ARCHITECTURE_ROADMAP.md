# Architecture Roadmap — Clean Architecture Complete

> **Status:** ✅ **MIGRATION COMPLETE** — All 8 phases of the clean architecture refactor are done.  
> **Version:** v5.10.2  
> **Strategy:** Strangler Fig pattern — legacy JS platform adapters are retained, wrapped by typed bridges.

## Architecture (as of v5.10.2)

### ✅ All Layers Complete

| Layer | Status | Location |
|-------|--------|----------|
| **Core** (types, errors, utils) | ✅ Complete | `src/core/` |
| **Domain** (entities, repos, use cases) | ✅ Complete | `src/domain/` |
| **Data** (datasources, repos, network, cache) | ✅ Complete | `src/data/` |
| **Presentation** (interceptor, state, CDN registry) | ✅ Complete | `src/presentation/` |
| **DI Container** | ✅ Complete | `src/di/container.ts` |
| **Electron Bridge** (adapters) | ✅ Complete | `electron/src/bridge/` |
| **Webview Bridge** (`clean-arch.js`) | ✅ Complete | `src/webview-entry.ts` → `app/src/main/assets/view/clean-arch.js` |
| **m.js Modularization** | ✅ Complete | `app/src/main/assets/view/modules/` (27 files) |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  WebView (Android TV / Electron BrowserWindow)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  m.js (built from 27 modules/)                            │  │
│  │  clean-arch.js (window.AnimeTV bridge)                    │  │
│  └─────────────────────┬─────────────────────────────────────┘  │
│                         │ window.AnimeTV.*                       │
├─────────────────────────┼───────────────────────────────────────┤
│  Presentation Layer     │                                       │
│  ├── RequestRouter (intercepts all HTTP from webview)           │
│  ├── CDN Registry                                               │
│  └── AppState                                                   │
├─────────────────────────┼───────────────────────────────────────┤
│  Domain Layer           │                                       │
│  ├── Entities (Anime, Source, Episode)                          │
│  ├── Use Cases (GetEpisodes, SearchAnime, ResolveStream, etc)   │
│  └── Repository Interfaces                                      │
├─────────────────────────┼───────────────────────────────────────┤
│  Data Layer             │                                       │
│  ├── Repository Implementations                                 │
│  ├── DataSources (MiruroPipe, ServerConfig, Jikan, OneAnime)    │
│  ├── Network (HttpClient, InterceptorHttpClient)                │
│  └── Cache (LocalStorageCache w/ TTL)                           │
├─────────────────────────┼───────────────────────────────────────┤
│  Platform (Electron)    │                                       │
│  ├── bridge/container.js (DI wiring)                            │
│  ├── bridge/router.js   (protocol handler)                      │
│  ├── presentation/interceptor.js                                │
│  └── data/datasources/ (concrete implementations)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## What's Next — Priority Roadmap

### 🔴 Phase 1: Immediate (High Impact, Low Risk)

#### 1.1 Source Providers → Clean Architecture ✅ COMPLETE

**Done:**
- ✅ TypeScript datasource interfaces: `GojoDataSource`, `KaasDataSource`, `WaveDataSource`
- ✅ Adapter factories (`createGojoDataSource(legacy)`, etc.) that wrap legacy objects
- ✅ Unit tests: 34 tests covering all three providers
- ✅ Webview bridge exposes `window.AnimeTV.getGojo()` / `.getKaas()` / `.getWave()`
- ✅ Electron container exposes `registerProvider('gojo', legacyModule)` for runtime wiring
- ✅ `MiruroSourceDataSource` interface + `createMiruroSourceImpl()` adapter (mirrors `04-miruro.js` pattern)
- ✅ `05-gojo.js`, `06-kaas.js`, `07-wave.js` refactored with thin bridge adapters (`_gojo_bridge`, `_kaas_bridge`, `_wave_bridge`) calling through `window.AnimeTV.getXxx()`
- ✅ `SourceProvider` unified interface defined in `src/domain/repositories/source-provider.ts` for polymorphic access
- ✅ `SourceProviderRegistry` with `register()` / `get()` / `getAll()` — registered in DI container
- ✅ Barrel exports updated in `src/data/index.ts` and `src/domain/index.ts`

#### 1.2 `_API` Object → Presentation Actions ✅ COMPLETE

**Done:**
- ✅ `NavigationController` extracted (`src/presentation/navigation/navigation-controller.ts`) — typed history stack, pushState, goBack, reload, checkUpdate, installApk delegation
- ✅ `UIFeedback` helper extracted (`src/presentation/ui-feedback/ui-feedback.ts`) — toast (native + DOM), listPrompt, textPrompt, confirm, alert, async callback registry
- ✅ Platform adapters: `NavigationAdapter`, `UIFeedbackAdapter`, `ElectronDialogAdapter` interfaces for testability
- ✅ `APIFacade` created (`src/webview/api-facade.ts`) — wires `_JSAPI`/`_ISELECTRON`/`listOrder` globals to clean-arch modules
- ✅ `window.AnimeTV.facade` property added to `AnimeTVBridge` interface — exposes `.navigation` + `.uiFeedback`
- ✅ `webview-entry.ts` exports `initAPIFacade()` / `createAPIFacade()` for lazy init from `12-api.js`
- ✅ `_API` remains untouched as thin facade for backward compatibility (Strangler Fig pattern)
- ✅ 39 unit tests (17 navigation + 22 UI feedback) — all passing
- ✅ Barrel exports updated in `src/presentation/index.ts`

#### 1.3 Remove Deleted Electron Domain Files ✅ COMPLETE
```
D electron/src/domain/entities/source-entity.js
D electron/src/domain/usecases/get-sources.js
D electron/src/domain/usecases/resolve-stream.js
```
~~These are deleted but still showing in git status.~~ The logic has been migrated to `electron/src/bridge/sources.js`.
- ✅ Deletion already committed in `80bd26a` (refactor: modularize m.js into 27 modules + cleanup orphans)

---

### 🟡 Phase 2: Medium Term (Structural Improvements)

#### 2.1 Webview Module Build → ESBuild ✅ COMPLETE

**Done:**
- ✅ `build:webview` now uses esbuild's `transform` API (minification, dead code elimination, ES2020 target)
- ✅ 27 modules concatenated → fed to esbuild → produces minified `m.js` (690 KB → 373 KB, **46% reduction**)
- ✅ No IIFE wrapping yet (globals like `_API`, `pb`, `home` still accessible to `clean-arch.js`)
- ✅ Legacy `--concat` mode preserved for backward compatibility
- ✅ `--no-minify` mode for debugging (readable output)
- ✅ `--verify` mode checks output contains expected globals
- ✅ Entry point: `src/webview/m-entry.js` (module import manifest for future bundler migration)
- ✅ New npm scripts: `build:webview:debug`, `build:webview:concat`, `build:webview:verify`

**Remaining (incremental, future):**
- Move remaining webview logic to TypeScript (per-module, as needed)
- Switch to IIFE/bundle format once modules use proper imports/exports
- Get full type-checking across webview modules

#### 2.2 State Management ✅ COMPLETE

Previously state was scattered across:
- `_JSAPI.storeGet/storeSet` (persistent key-value)
- `pb.data`, `home.data`, `_MAL.data` (in-memory objects)
- `list` object (watchlist/history)

**Done:**
- ✅ `UnifiedAppState` interface defined with typed sections: `stream`, `domains`, `preferences`, `watchlist`, `history`, `auth`, `playback`, `home`, `config`, `subtitleCache` (`src/presentation/state/state-sections.ts`)
- ✅ `StateManager` created — wraps persistence + in-memory state with `get/set/update/reset/hydrate/flush/snapshot/restore` (`src/presentation/state/state-manager.ts`)
- ✅ `PersistenceAdapter` interface abstracts storage backend (localStorage, SharedPreferences, IndexedDB, etc.)
- ✅ Selective persistence — only user-relevant sections (`preferences`, `watchlist`, `history`, `auth`, `playback`, `config`, `domains`) are persisted; transient data (`stream`, `home`, `subtitleCache`) stays in-memory only
- ✅ `StateEventEmitter` with typed events, wildcard (`*`) subscriptions, `once()`, auto-unsubscribe (`src/presentation/state/state-events.ts`)
- ✅ Schema evolution support — `hydrate()` merges stored data with current defaults (new fields get defaults automatically)
- ✅ 31 unit tests covering all StateManager features (state CRUD, events, persistence, snapshot/restore)
- ✅ Barrel exports updated in `src/presentation/index.ts`
- ✅ Legacy `AppStore` (reducer-based) preserved for backward compatibility

#### 2.3 Testing Strategy
- **Unit tests**: TypeScript layers already testable with Vitest ✅
- **Integration tests**: Test Electron bridge adapters against mocked datasources ✅
  - `src/__integration__/bridge-container.integration.spec.ts` — Container wiring, MiruroPipe adapter, auth stub
  - `src/__integration__/bridge-providers.integration.spec.ts` — Gojo, Kaas, Wave provider adapters
  - `src/__integration__/bridge-state.integration.spec.ts` — StateManager + EventEmitter + persistence
  - `src/__integration__/helpers/mock-factories.ts` — Shared mock factories for all legacy module shapes
  - Scripts: `npm run test:integration` / `npm run test:unit`
- **E2E tests**: Playwright to drive the Electron window (future)

---

### 🟢 Phase 3: Long Term (Architecture Evolution)

#### 3.1 Android WebView Bridge ✅ COMPLETE
The Android side (`AnimeApi.java`, `AnimeView.java`) still uses `_JSAPI` directly. Create a parallel bridge layer (similar to Electron's) that:
- ✅ Implements the same `window.AnimeTV.*` interface
- ✅ Delegates to native Android datasources

**Done:**
- ✅ `src/webview/android-bridge.ts` — Full Android bridge implementation (710+ lines)
  - `AndroidJSAPI` interface: typed contract for all `@JavascriptInterface` methods in `AnimeView.java`
  - `AndroidStorageAdapter`: wraps `_JSAPI.storeGet/storeSet/storeDel` (SharedPreferences)
  - `AndroidVideoController`: typed wrapper around ExoPlayer video methods
  - `createAndroidBridge()`: factory producing `AndroidAnimeTVBridge` (extends `AnimeTVBridge`)
  - `isAndroidEnvironment()`: auto-detects Android WebView (`_JSAPI` present, `_ISELECTRON` absent)
  - `initAndroidBridge()`: registers on `window.AnimeTV` (same slot as generic bridge)
- ✅ Same `window.AnimeTV.*` interface as generic bridge:
  - Source utilities (`getDnsArray`, `getSourceByIndex`, `getSourceNames`, etc.)
  - Data operations via Android's `shouldInterceptRequest()` (`/__miruro_pipe/`, `/__proxy/`)
  - Jikan/MAL fallback, AniList search, cache, source provider datasources
- ✅ Android-specific extensions beyond base bridge:
  - Storage adapter (SharedPreferences), video controller (ExoPlayer)
  - Brightness/volume, orientation, MAL login, voice search, intent URIs
  - SHA1/AES crypto, profile management, stream config, DNS/HTTP config
- ✅ `src/webview-entry.ts` updated — conditional bridge loading (Android vs. Electron/generic)
- ✅ `src/webview/android-bridge.spec.ts` — 64 unit tests (all passing)
  - Environment detection, interface compliance, delegation verification
  - Storage adapter, video controller, all Android-specific extensions

#### 3.2 Source Provider Plugin System ✅
Make source providers hot-swappable:
- ✅ Define a `SourceProviderPlugin` contract → `src/domain/repositories/source-provider-plugin.ts`
- ✅ Load providers from remote config (already partially done with `server.json`) → `src/data/plugins/plugin-config-sync.ts`
- ✅ Allow disabling/enabling providers without app update → `src/data/plugins/plugin-manager.ts`

**Implementation details:**
- `SourceProviderPlugin` extends `SourceProvider` with lifecycle hooks (`initialize`/`dispose`), metadata, and status
- `SourceProviderPluginManager` manages load/unload/enable/disable with priority-sorted access
- `createProviderPlugin()` adapter wraps existing providers as plugins (backward-compatible)
- `PluginAwareRegistry` provides drop-in replacement for `SourceProviderRegistry`
- `PluginConfigSync` bridges `server.json` remote config with the plugin manager (periodic refresh)
- DI container wires everything automatically; `serverConfig` dep enables the system

#### 3.3 Webview → Full SPA ✅ COMPLETE
Replaced the concatenated vanilla JS with a lightweight Preact SPA:
- **Framework**: Preact 10 + @preact/signals for reactive state (~14KB gzip total)
- **Component architecture**: App shell, Router, Screen components (HomeScreen, etc.)
- **Reactive store**: Signals-based state management bridging StateManager → UI
- **Spatial navigation**: TV remote-friendly focus management via `useSpatialNav` hook
- **Build**: `npm run build:spa` → single IIFE bundle (`spa.js` + `spa.css`)
- **Location**: `src/webview/ui/` (components, hooks, store, types, styles)
- **Tests**: 20 unit tests for store actions, navigation, and focus management
- **Production size**: ~33KB JS + ~9KB CSS (minified, ~14KB gzip estimated)
- Coexists with existing m.js — can be adopted incrementally per screen

---

## m.js Module Map

| Module | Lines | Responsibility |
|--------|-------|---------------|
| `00-config.js` | 58 | Global constants, platform detection |
| `01-anilist-cache.js` | 73 | AniList response caching |
| `02-jikan-fallback.js` | 88 | Jikan API fallback for metadata |
| `03-source-domain.js` | 141 | Source selection, domain checking |
| `04-miruro.js` | 1,810 | Miruro source provider |
| `05-gojo.js` | 465 | Gojo source provider |
| `06-kaas.js` | 827 | KicakassAnime source provider |
| `07-wave.js` | 944 | Aniwave/Anix source provider |
| `08-network.js` | 154 | XHR helpers, proxy ajax |
| `09-utils.js` | 138 | DOM utilities, string formatting |
| `10-animeflix.js` | 120 | AnimeFlix integration |
| `11-input.js` | 104 | Keyboard/remote input handling |
| `12-api.js` | 1,979 | Central API/controller object |
| `13-list.js` | 100 | History & watchlist |
| `14-vtt.js` | 676 | Subtitle (WebVTT) parser |
| `15-banner-cache.js` | 123 | Banner image caching |
| `16-logo-fetcher.js` | 185 | Anime logo fetcher |
| `17-rating.js` | 87 | Rating system UI |
| `18-playback.js` | 5,466 | Video player & controls |
| `19-home.js` | 5,594 | Home screen, navigation, profiles |
| `20-args.js` | 73 | Deep link argument handling |
| `21-mal.js` | 2,742 | MyAnimeList integration |
| `22-list-order.js` | 890 | List sorting & filtering |
| `23-touch.js` | 166 | Touch gesture helpers |
| `24-init.js` | 14 | App initialization |
| `25-aniskip.js` | 286 | AniSkip submit panel |
| `26-chromecast.js` | 45 | Chromecast integration |

---

## Build Commands

```bash
# Full build (TypeScript clean-arch + webview modules → m.js)
npm run build:all

# Rebuild m.js with esbuild (minified, 46% smaller)
npm run build:webview

# Rebuild m.js without minification (for debugging)
npm run build:webview:debug

# Legacy concatenation (no esbuild, byte-identical to old behavior)
npm run build:webview:concat

# Verify m.js output contains expected globals
npm run build:webview:verify

# Split m.js back into modules (one-time or after manual m.js edit)
node scripts/build-webview.js --split

# Run tests
npm test

# Type check
npm run typecheck
```

---

## Developer Workflow

1. **Edit module files** in `app/src/main/assets/view/modules/`
2. **Run** `npm run build:webview` (or `npm start` which does build:all)
3. **m.js is regenerated** from modules — never edit m.js directly
4. **For TypeScript changes** in `src/`, the `build:clean` and `build:browser` scripts handle compilation

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| esbuild transform (not bundle) for webview modules | Minification + dead code elimination without breaking global variable sharing; 46% size reduction; `--concat` fallback available |
| No IIFE wrapping (yet) | `clean-arch.js` references globals (`pb`, `_API`, `home`) — will switch to IIFE once modules use proper imports/exports |
| Modules track in git, m.js is a build artifact | Developers work on focused files; CI regenerates the monolith |
| TypeScript for new code only | Gradual migration; don't rewrite working legacy JS |
| Bridge pattern (window.AnimeTV) | Decouples clean-arch from legacy without breaking changes |
| Legacy JS platform adapters kept | Battle-tested code wrapped by typed bridges — rewriting adds risk without benefit |

---

## Post-Migration: What's Next

The clean architecture migration is **100% complete**. All future work is additive improvement, not migration debt.

### Recommended Next Steps (by priority)

| # | Item | Impact | Effort |
|---|------|--------|--------|
| 1 | **Incremental SPA adoption** — Replace m.js screens one-by-one with Preact components (HomeScreen already built) | 🔴 High — modern reactive UI, better DX | Medium |
| 2 | **Remove `main.vars` legacy sync** — Have preload dispatch directly to the store instead of mutating `main.vars` | 🟡 Medium — cleaner data flow | Low |
| 3 | **E2E tests (Playwright)** — Smoke tests: launch → browse → play stream | 🟡 Medium — regression confidence | Medium |
| 4 | **Webview module TS migration** — Move individual m.js modules to TypeScript (start with `00-config.js`, `09-utils.js`, `14-vtt.js`) | 🟢 Low — type safety for remaining JS | Low per module |
| 5 | **IIFE wrapping for m.js** — Once modules use proper imports/exports, switch build to IIFE bundle format | 🟢 Low — bundle isolation | Low (after #4) |
