# Naming Refactor Plan

This plan documents the completed structural refactoring separating the Shared App Shell, Anime, and Movies/TV.

---

## Naming Convention Rules

| Context | Prefix | Example |
| :--- | :--- | :--- |
| **Shared App Shell** | `app_` or `shell_` | `app_header`, `19-app-shell.js` |
| **Anime Only** | `anime_` | `anime_page_schedule`, `20-anime-source.js` |
| **Movies & TV Only** | `movies_` or `fmovies_` | `movies_page_movies`, `21-movies-source.js` |

---

## File Organization Refactor

```
┌─────────────────────────────────────────────┐
│  19-app-shell.js (formerly 19-home.js)      │
│                                             │
│  • Navigation (header, d-pad, page switch)  │
│  • Settings & Search UI                     │
│  • Watchlist & Shared layout helpers        │
└──────────────────────┬──────────────────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
┌───────────────────┐     ┌──────────────────────┐
│  20-anime-source  │     │   21-movies-source   │
│  • Anime scraping │     │  • TMDB mapping API  │
│  • Airing calendar│     │  • Movie parser      │
└───────────────────┘     └──────────────────────┘
```

### Module Refactoring Details

#### Moved to `20-anime-source.js` (Anime Specific)
* `anime.hiParse` (`hi_parse` legacy)
* `anime.tipurl` (`hi_tipurl` legacy)
* `anime.animeid` (`hi_animeid` legacy)
* `anime.flixParse` (`flix_parse` legacy)
* `anime.recentParse` (`recent_parse` legacy)
* `anime.getHomepageSections` (`init_homepage` anime handler)

#### Kept in `19-app-shell.js` (Shared Shell)
* Keyboard navigation logic (`keycb()`)
* Page state router (`update_homepages()`)
* Sidebar menu drawer configuration (`sidebar`)
* Global settings overlays (`settings`)
* Watchlist controller (`init_mylist()`)