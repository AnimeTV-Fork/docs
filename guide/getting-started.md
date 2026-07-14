# Introduction to AnimeTV

AnimeTV is an Android TV application for watching anime series and movies on Android TV, Google TV, Android Phones/Tablets, and Windows Desktop.

## Project Structure

```
├── app/              # Android TV app (Java + WebView + CronetEngine + ExoPlayer)
├── electron/         # Desktop app (Electron wrapper for Windows)
├── src/              # Clean architecture TypeScript core
├── scripts/          # Concatenation and esbuild tools
├── tools/            # Development/debug utilities (not shipped)
└── dist/             # Built outputs
```

## Hybrid Design
AnimeTV runs web-based frontend assets inside native container shells (Android WebView or Electron BrowserWindow). The app intercepts HTTP requests, handles DNS-over-HTTPS (DoH), and utilizes TypeScript components to drive native player frameworks like ExoPlayer.