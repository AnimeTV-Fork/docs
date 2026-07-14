# Clean Architecture Implementation

The `src/` directory implements a **Clean Architecture** model decoupled from platforms.

## Dependency Rules & Layers

```
src/
├── core/              ← Primitives, typed errors, FP helpers (Result<T,E>, Option<T>)
├── domain/            ← Entities (Anime, Episode), repo interfaces, usecases
├── data/              ← Datasource interfaces/impls, caches, API repositories
├── presentation/      ← UI state, CDM Registry, route maps
└── di/                ← Container configuration
```

### Flow Diagram

```
┌─────────────────────────────────────────┐
│              Presentation               │
│ (interceptor, appState, preact screens) │
└────────────────────┬────────────────────┘
                     │ calls
                     ▼
┌─────────────────────────────────────────┐
│                 Domain                  │
│       (usecases, entity mappings)       │
└────────────────────┬────────────────────┘
                     │ implements
                     ▼
┌─────────────────────────────────────────┐
│                  Data                   │
│ (repositories, Jikan, MiruroPipe, caches)│
└─────────────────────────────────────────┘
```

## Legacy Modularization (`m.js`)

Legacy monolithic code resides in `app/src/main/assets/view/modules/`. It is dynamically bridged into clean TypeScript handlers via `window.AnimeTV.*`.

### Module Index Map

| ID | File | Role |
| :--- | :--- | :--- |
| `00` | `00-config.js` | Constants and OS flag detection |
| `01` | `01-anilist-cache.js` | Response cache store |
| `02` | `02-jikan-fallback.js` | Jikan API fallback metadata query |
| `03` | `03-source-domain.js` | Source URLs configuration |
| `04` | `04-miruro.js` | Miruro provider bindings |
| `05` | `05-gojo.js` | Gojo video source parser |
| `06` | `06-kaas.js` | KickassAnime provider |
| `07` | `07-wave.js` | Aniwave and Anix scraping provider |
| `08` | `08-network.js` | Ajax network helpers |
| `09` | `09-utils.js` | String formatting, list formatting utilities |
| `10` | `10-animeflix.js` | Integration interface |
| `11` | `11-input.js` | Remote control spatial logic |
| `12` | `12-api.js` | Facade controller interfacing with webview |
| `13` | `13-list.js` | Local watch history & bookmarks storage |
| `14` | `14-vtt.js` | WebVTT subtitle formatting parser |
| `15` | `15-banner-cache.js` | Slideshow backdrop banner image storage |
| `16` | `16-logo-fetcher.js` | Anime logo assets fetch utility |
| `17` | `17-rating.js` | User rating system bindings |
| `18` | `18-playback.js` | Video engine integration wrapper |
| `19` | `19-app-shell.js` | Global navigation controller |
| `20` | `20-anime-source.js` | Scrapers and metadata mappings for anime |
| `21` | `21-movies-source.js` | TMDB API mappings & movie playback logic |
| `22` | `22-list-order.js` | Sorting algorithm helpers |
| `23` | `23-touch.js` | Touch gestures integration for phones |
| `24` | `24-init.js` | Entry initialization routine |
| `25` | `25-aniskip.js` | Intro/outro skipping engine |
| `26` | `26-chromecast.js` | Casting module bridge |

## Build Scripts

| Command | Goal |
| :--- | :--- |
| `npm run build:all` | Compiles clean architecture layer and packages Preact webview code |
| `npm run build:webview` | Concat + minify files to generated `m.js` using esbuild |
| `npm run build:webview:debug` | Concat files to `m.js` without minification |