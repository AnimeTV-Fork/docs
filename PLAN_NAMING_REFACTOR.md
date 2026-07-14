# Naming Refactor Plan — Clarity Between Shared, Anime, and Movies & TV

> **Status:** Phase A, B, C & D Complete
> **Created:** 2026-06-23  
> **Updated:** 2026-06-24  
> **Purpose:** Fix confusing names that make it hard to tell what belongs to anime, what belongs to movies, and what is shared between both.

---

## The Problem (Simple Explanation)

Right now, the app has **one screen layout** (one HTML page) that serves **two different modes**:
- **Anime mode** — browsing anime content
- **Movies & TV mode** — browsing movies and TV shows

The problem is that **everything is named "home_"** regardless of whether it's:
1. A **shared piece** used by both modes (like the top navigation bar)
2. Something **only for anime** (like "Recently Updated" anime lists)
3. Something **only for movies** (like TMDB trending movies)

This makes it confusing to understand what belongs where.

**Examples of the confusion:**
| Current Name | What It Actually Is |
|---|---|
| `home_header` | The top navigation bar — shared by BOTH modes |
| `home.js` (module 19) | The main controller — handles BOTH modes |
| `fmovies.js` (module 21) | Movies & TV specific logic |
| `home_page` | The main content area — could be anime OR movies depending on mode |
| `home_pagemovies` | Movies-only page — clear ✅ |
| `home_homepage` | The "Home" button — shared by both |

There's no clear naming pattern that tells you: "this is shared", "this is anime-only", or "this is movies-only."

---

## The Goal

After this refactor, anyone reading the code should immediately know:
- **"app_"** or **"shell_"** prefix = shared across all modes
- **"anime_"** prefix = anime-specific
- **"movies_"** or **"fmovies_"** prefix = Movies & TV specific

---

## Proposed Naming Convention

### Tier 1: Shared UI (Used By Both Modes)

These are the "skeleton" pieces that exist regardless of whether you're watching anime or movies.

| Current Name | Proposed Name | What It Is |
|---|---|---|
| `home_header` | `app_header` | The top navigation bar |
| `home_header_banner` | `app_header_banner` | The banner area inside the header |
| `home_time` | `app_clock` | The clock display |
| `home_search` | `app_nav_search` | Search button |
| `home_homepage` | `app_nav_home` | Home button |
| `home_mylist` | `app_nav_mylist` | My List button |
| `home_settings` | `app_nav_settings` | Settings button |
| `home_logo` | `app_nav_menu` | Menu/Logo button |
| `home_scroll` | `app_scroll` | The scrollable content area |
| `home_scroll_mask` | `app_scroll_mask` | Scroll container wrapper |
| `home_slide` | `app_slideshow` | The top banner slideshow |

### Tier 2: Anime-Specific

| Current Name | Proposed Name | What It Is |
|---|---|---|
| `home_schedule` | `anime_nav_schedule` | Anime airing schedule button |
| `home_pageschedule` | `anime_page_schedule` | Anime schedule page |
| (sections in init_homepage for anime) | `anime_section_*` | Anime-specific content sections |

### Tier 3: Movies & TV Specific

| Current Name | Proposed Name | What It Is |
|---|---|---|
| `home_movies` | `movies_nav_movies` | Movies tab button |
| `home_tvshows` | `movies_nav_tvshows` | TV Shows tab button |
| `home_browse` | `movies_nav_browse` | Browse tab button |
| `home_pagemovies` | `movies_page_movies` | Movies page |
| `home_pagetvshows` | `movies_page_tvshows` | TV Shows page |
| `home_pagebrowse` | `movies_page_browse` | Browse/Discovery page |

### Tier 4: File Names

| Current Name | Proposed Name | Reason |
|---|---|---|
| `19-home.js` | `19-app-shell.js` | It controls the shared app shell (navigation, settings, sidebar) — not just "home" |
| `21-fmovies.js` | `21-movies-source.js` | Clearer that this is the Movies & TV data source |
| (no file) | Consider `20-anime-home.js` in the future | Anime-specific home page logic (currently mixed into 19-home.js) |

---

## What Changes

### Phase A: Rename HTML Element IDs (Biggest Impact)

The `<div id="home_header">` in `main.html` becomes `<div id="app_header">`.

**All CSS files** that reference `#home_header` need updating:
- `fp.css` (portrait)
- `p.css` (portrait)
- `fm.css` (landscape for movies)
- Any other CSS files

**All JS files** that reference `$('home_header')` or `home_header` need updating:
- `19-home.js`
- `18-playback.js`

### Phase B: Rename the JavaScript Object

The `home` object in `19-home.js` could be renamed to `app` or `shell` since it's the main controller for both modes. The `home_header` property becomes `app.header`.

> ⚠️ **This is the riskiest part** — the `home` object is referenced in many places across the codebase.

### Phase C: Extract Anime Module (Like fmovies.js Already Does for Movies)

Right now, `19-home.js` is a **6,700-line monster** that mixes two very different things:
1. **App shell logic** — navigation, settings, sidebar, keyboard handling, page switching
2. **Anime-specific content** — parsing anime data, loading anime homepages, AniList integration, anime schedule

Meanwhile, `21-fmovies.js` is a clean, focused file that ONLY handles Movies & TV content. It doesn't manage navigation or settings — it just provides data when asked.

**The goal:** Make anime work the same way — create a new `20-anime-source.js` file that only handles anime content, just like `21-fmovies.js` only handles movies content.

#### What Moves OUT of `19-home.js` → Into `20-anime-source.js`

| Function/Property | What It Does | Why It's Anime-Specific |
|---|---|---|
| `hi_parse()` | Parses HTML pages from anime sources into card data | Only anime sources use HTML scraping |
| `hi_tipurl()` | Extracts URL paths from anime source links | Only used by anime parsers |
| `hi_animeid()` | Extracts anime ID from URL | Only relevant to anime |
| `flix_parse()` | Parses FlixHQ-style anime pages | Anime source specific |
| `recent_parse()` | Parses "Recently Updated" anime data | Anime content |
| `home_anilist_parse()` | Parses AniList API responses for anime slideshow | AniList = anime only |
| `home_anilist_parse_infobox()` | Builds anime info cards from AniList data | AniList = anime only |
| `home_anilist_load()` | Loads anime slideshow data from AniList | AniList = anime only |
| `anilist_trailer_cb()` | Handles anime trailer playback | Anime trailers |
| `anilist_trailer_topcb()` | Anime trailer scroll behavior | Anime trailers |
| `anilist_play_cb()` | Plays anime trailer | Anime trailers |
| `anilist_yt` | YouTube trailer state for anime | Anime trailers |
| `init_homepage()` (anime branch) | Sets up anime homepage sections (trending, popular, etc.) | The anime content loading |
| `schedule_init()` (anime branch) | Loads anime airing schedule from AniList | Anime schedule |

#### What STAYS in `19-home.js` (Shared App Shell)

| Function/Property | What It Does | Why It's Shared |
|---|---|---|
| `keycb()` | Handles d-pad/keyboard navigation | Works for all modes |
| `update_homepages()` | Switches between page tabs | Works for all modes |
| `header_items` | Navigation button references | Shared header |
| `homepages` | Page container references | Shared layout |
| `menus` | Menu item tracking | Shared navigation |
| `col_selected` / `row_selected` | Current focus position | Shared navigation |
| `sidebar` | Source switching, profiles | Shared feature |
| `settings` / `settings_keycb()` | App settings | Shared feature |
| `search` / `search_keycb()` | Search UI | Both modes use search |
| `init_mylist()` / `mylist_el` | Watchlist/favorites | Shared feature |
| `recent_init()` | Creates a scrollable section row (reusable layout helper) | Used by both anime and movies |

#### How It Would Work After Extraction

```
┌─────────────────────────────────────────────┐
│  19-app-shell.js (formerly 19-home.js)      │
│                                             │
│  • Navigation (header, d-pad, page switch)  │
│  • Settings                                 │
│  • Sidebar                                  │
│  • Search UI                                │
│  • My List                                  │
│  • Shared layout helpers (recent_init, etc) │
│                                             │
│  When anime mode → calls anime.init()       │
│  When movies mode → calls fmovies.init()    │
└─────────────────────────────────────────────┘
         ↓                        ↓
┌─────────────────┐    ┌─────────────────────┐
│ 20-anime-source │    │ 21-movies-source    │
│  (NEW file)     │    │ (formerly fmovies)  │
│                 │    │                     │
│ • Parse anime   │    │ • TMDB API calls    │
│ • AniList API   │    │ • Movie/TV parsing  │
│ • Anime slide   │    │ • Movies slideshow  │
│ • Anime schedule│    │ • Movies schedule   │
│ • Anime homepage│    │ • Movies homepage   │
│   sections      │    │   sections          │
└─────────────────┘    └─────────────────────┘
```

This makes the architecture **symmetrical** — both anime and movies are just "content providers" that plug into the shared app shell. Neither one lives inside the shell's file.

#### Why This Matters (Non-Technical)

Think of it like a TV with two channels:
- **Right now:** The TV's remote control code AND the anime channel's content are crammed into one huge instruction manual. The movies channel has its own clean booklet.
- **After refactor:** The remote control has its own manual. Each channel (anime, movies) has its own clean booklet. Much easier to find things and make changes without accidentally breaking something else.

---

## Risk Assessment

| Risk | Level | Why |
|---|---|---|
| Breaking CSS styling | Medium | Many CSS selectors use `#home_header` |
| Breaking JavaScript references | High | `home.home_header` and `$('home_header')` appear in many places |
| Breaking playback controls | Medium | Playback module references `home_header` for clock visibility |
| Build issues | Low | Build script just concatenates files — renaming is safe |

---

## Recommended Approach

1. **Do Phase A first** — Rename HTML IDs and update all CSS/JS references. This is the most impactful change for readability with manageable risk.

2. **Skip Phase B for now** — Renaming the `home` JavaScript object is high-risk and touches too many places. We can do it later when there's time for thorough testing.

3. **Phase C is a future goal** — Separating anime logic into its own file requires more architectural thought.

---

---

## Implementation Todo List (By Phase)

Each phase is **independent** — completing one does not require the others. You can do them in any order or skip phases entirely.

### Phase A: Rename HTML Element IDs ✅ (Completed 2026-06-23, Tested 2026-06-24)

- [x] Audit all `home_` IDs in `main.html` and categorize as shared/anime/movies
- [x] Rename shared IDs (`home_header` → `app_header`, `home_scroll` → `app_scroll`, etc.)
- [x] Rename anime-specific IDs (`home_schedule` → `anime_nav_schedule`, `home_pageschedule` → `anime_page_schedule`)
- [x] Rename movies-specific IDs (`home_movies` → `movies_nav_movies`, `home_pagemovies` → `movies_page_movies`, etc.)
- [x] Update all CSS files that reference old IDs (`fp.css`, `p.css`, `fm.css`, `m.css`)
- [x] Update all JS files that reference old IDs via `$('...')` calls (`19-home.js`, `18-playback.js`, `21-fmovies.js`)
- [x] Build and verify: `npm run build:webview`
- [x] Test anime mode (navigation, slideshow, settings, clock)
- [x] Test movies mode (tabs, content loading, search)
- [x] Test playback (clock hide/show)

### Phase B: Rename the JavaScript Object ✅ (Completed & Tested 2026-06-24)

- [x] Rename `id="home"` DOM element → `id="app_shell"` (HTML, CSS, JS)
- [x] Rename `const home = {...}` → `const app = {...}`
- [x] Find/replace all `home.` references across all modules (with negative lookbehind to protect property accesses like `listOrder.home`)
- [x] Update property names (`home.home_header` → `app.header`, `home.home_scroll` → `app.scroll`, `home.home_slide` → `app.slideshow`, etc.)
- [x] Rename `home.home` (DOM element property) → `app.el`
- [x] Build and verify: `npm run build:webview`
- [x] Test anime mode
- [x] Test movies mode
- [x] Test playback

### Phase C: Extract Anime Logic into Separate Module ✅ (Completed 2026-06-24)

- [x] Create new file `20-anime-source.js`
- [x] Move `hi_parse()`, `hi_tipurl()`, `hi_animeid()` into new file (as `anime.hiParse`, `anime.tipurl`, `anime.animeid`)
- [x] Move `flix_parse()`, `recent_parse()` into new file (as `anime.flixParse`, `anime.recentParse`)
- [x] Move anime homepage sections builder into new file (as `anime.getHomepageSections()`)
- [x] Keep `anilist_yt`, trailer callbacks, `anilistParse`, `anilistLoad` in app shell (shared slideshow feature used by multiple modes via AniList integration)
- [x] Keep `schedule_init()` in app shell (routes between fmovies and anime schedule)
- [x] Update `19-home.js` — `hi_parse`, `flix_parse`, `recent_parse` now delegate to `anime.*` methods
- [x] `init_homepage()` already calls `anime.getHomepageSections()` for anime content sections
- [x] Register new file in `scripts/build-webview.js` build order (after 19, before 21)
- [x] Build and verify: `npm run build:webview` — success
- [x] Test anime mode thoroughly (all homepage sections, slideshow, schedule, trailers)
- [x] Test movies mode (should be unaffected)

### Phase D: Rename File Names ✅ (Completed 2026-06-24)

- [x] Rename `19-home.js` → `19-app-shell.js`
- [x] Rename `21-fmovies.js` → `21-movies-source.js`
- [x] Update `scripts/build-webview.js` to reference new filenames
- [x] Build and verify: `npm run build:webview`
- [x] Verify no broken references

---

## How To Validate

After each phase:
1. Run `npm run build:webview` — must succeed
2. Test anime mode — navigation, slideshow, settings, clock all work
3. Test Movies & TV mode — all tabs, content loading, search work
4. Test playback — clock hide/show still works during video

---

## Summary

The core issue is that `home_header` sounds like it belongs to the "Home page" or the anime home, but it's actually the **app-wide navigation bar shared by everything**. Renaming it to `app_header` makes it immediately clear that it's a shared skeleton piece, not tied to any specific content mode.

The same logic applies throughout: anything shared should say "app_", anything anime-only should say "anime_", and anything movies-only should say "movies_".
