# Build & Release Guide (Windows & Android)

Instructions to compile frontend assets and package the executable/installer files.

---

## Prerequisites

### General
* **Node.js & npm** (v18+)
* **Git**
* **PowerShell** or similar command-line shell

### Android TV Specifics
* **Java JDK 17**
* **Android SDK / Android Studio**
* **ADB (Android Debug Bridge)**

---

## Setup & Compilation

First, initialize dependencies and compile modern frontend TS files:

```bash
npm install
npm run build:all
```
* `npm run build:all` cleans builds, transpiles TypeScript, bundles the browser architecture layer, and outputs Preact SPA artifacts to `app/src/main/assets/view/*`.

---

## Windows Desktop (Electron Wrapper)

Make sure you compiled assets using `npm run build:all` before running these:

### 1. Build Standalone Folder
```bash
npm run pack-win
```
Outputs standalone directory containing executable (`AnimeTV.exe`):
* **x64**: `electron/builds/AnimeTV-win32-x64/`
* **ARM64**: `electron/builds/AnimeTV-win32-arm64/`

### 2. Generate Setup Wizard (`.exe`)
```bash
npm run build-win
```
Generates setup wizard installer `animetv-<version>-setup.exe` in `electron/builds/`.

### 3. Generate Portable ZIP Archive
```bash
npm run zip-win
```
Produces `AnimeTV-win32-x64-portable.zip` in `electron/builds/`.

---

## Android (TV & Phone APKs)

Ensure frontend files are compiled (`npm run build:all`).

### 1. Debug APK
```bash
npm run build-debug-apk
```
* **Or directly**: `.\gradlew.bat assembleDebug`
* **Output**: `app/build/outputs/apk/debug/`

### 2. Release APK
```bash
npm run build-release-apk
```
* **Or directly**: `.\gradlew.bat assembleRelease`
* **Output**: `app/build/outputs/apk/release/`

### 3. Local Deploy & Run
Install APK via ADB onto connected TV/device:
```bash
adb devices
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## Command Reference Cheat Sheet

| Platform | Script | Target |
| :--- | :--- | :--- |
| **All** | `npm run build:all` | Builds assets in `app/src/main/assets/view/*` |
| **Windows** | `npm run pack-win` | Produces raw executable standalone directories |
| **Windows** | `npm run build-win` | Produces setup wizard installer executable |
| **Windows** | `npm run zip-win` | Produces portable standalone ZIP archive |
| **Android** | `npm run build-debug-apk` | Builds debug APK |
| **Android** | `npm run build-release-apk`| Builds release APK |