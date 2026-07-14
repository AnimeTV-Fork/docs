# Roadmap & Next Steps

Current development roadmap for AnimeTV.

## Phase 1: Core Shell Decoupling (In Progress)
- [x] Rename legacy monolithic views and extract modular source wrappers.
- [x] Move all scraper hooks from app-shell down into domain repositories.
- [ ] Implement fully typed TypeScript representations for TMDB and AniList feeds.

## Phase 2: Platform Engine Upgrades
- [ ] Migrate Android WebView backplane to ExoPlayer v2 / Media3.
- [ ] Upgrade Electron engine to v30+ for Windows.
- [ ] Implement local SQLite offline sync for watch history and cache.

## Suggested Documentation Tasks
To improve onboarding, we recommend adding:
1. **D-Pad Focus Navigation Guide**: Deep-dive into remote keyevent mappings, handling spatial focus in WebView, and custom CSS `:focus` states.
2. **Headless Scraping & JS Injection Reference**: Documenting how Android's WebView intercepts URL calls, executes script injections, and handles QUIC networking.
3. **CDN Stream Decryption Specifications**: Detailing reverse-engineered stream decryptor workflows (referrers, custom user-agents, token bypasses).
