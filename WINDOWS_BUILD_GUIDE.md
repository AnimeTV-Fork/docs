# AnimeTV Build & Release Guide (Windows & Android)

This guide provides step-by-step instructions on how to build, package, and test both the **Windows Desktop** and **Android TV / Google TV** versions of AnimeTV.

---

## 📋 Prerequisites

Before running any build commands, ensure your machine has the following tools installed and configured:

### For Both Builds
1. **Node.js & npm** (v18+ recommended)
2. **Git**
3. **PowerShell** or any Windows-compatible terminal.

### For Android Builds Only
1. **Java JDK** (JDK 17 recommended for modern Android Gradle builds).
2. **Android SDK Command-Line Tools** (or **Android Studio** which bundles the SDK and emulators).
3. **ADB (Android Debug Bridge)** (for deploying and testing directly on a connected TV, phone, or emulator).

---

## ⚙️ Initial Setup

To prepare the repository and install all required Node modules, run the following command from the project root:

```powershell
npm install
```

### Step 0: Compile Frontend Assets (Required for both Windows & Android)
AnimeTV is a hybrid application. Its core UI and logic must be compiled first:

```powershell
npm run build:all
```
* **What this does**: Cleans previous builds, compiles TypeScript source modules into JavaScript, builds the browser clean-architecture bundle, and bundles the Preact single-page application (SPA).

---

## 🪟 Windows Build & Release Commands

Ensure you have run `npm run build:all` first before executing these.

### 1. Package the Standalone Application Folders
Create the standalone folders containing the executables (`.exe`) and Electron runtime:

```powershell
npm run pack-win
```
* **Output Folders**:
  * **x64 Build**: [electron/builds/AnimeTV-win32-x64/](file:///c:/Users/dhull/OneDrive/Documents/GitHub/AnimeTV/electron/builds/AnimeTV-win32-x64)
  * **arm64 Build**: [electron/builds/AnimeTV-win32-arm64/](file:///c:/Users/dhull/OneDrive/Documents/GitHub/AnimeTV/electron/builds/AnimeTV-win32-arm64)

> [!TIP]
> You can test the application immediately by navigating to the **x64 Build** directory above and double-clicking `AnimeTV.exe`.

### 2. Generate the Windows Installer (`.exe` Setup Wizard)
Generate a user-friendly setup installer wizard (`animetv-<version>-setup.exe`):

```powershell
npm run build-win
```
* **What this does**: Runs `npm run pack-win` first and then uses `electron-installer-windows` to compile the setup program.
* **Output File**:
  * **Setup Installer**: [electron/builds/](file:///c:/Users/dhull/OneDrive/Documents/GitHub/AnimeTV/electron/builds/) (e.g., `animetv-5.14.6-setup.exe`)

### 3. Create a Portable ZIP Archive
To package the standalone `x64` directory into a portable `.zip` archive:

```powershell
npm run zip-win
```
* **Output File**:
  * **Portable ZIP**: [electron/builds/AnimeTV-win32-x64-portable.zip](file:///c:/Users/dhull/OneDrive/Documents/GitHub/AnimeTV/electron/builds/AnimeTV-win32-x64-portable.zip)

---

## 🤖 Android APK Build & Testing Commands

Ensure your frontend assets are compiled (`npm run build:all`) before building Android packages.

### 1. Build a Debug APK (For Local Testing)
Use this command to compile an APK with debugging enabled:

```powershell
npm run build-debug-apk
```
* **Alternative Direct Command**: `.\gradlew.bat assembleDebug`
* **Output File**:
  * **Debug APK**: Check [app/build/outputs/apk/debug/](file:///c:/Users/dhull/OneDrive/Documents/GitHub/AnimeTV/app/build/outputs/apk/debug) for the compiled `.apk`.

### 2. Build a Release APK (For Distribution)
Use this command to compile an optimized release APK:

```powershell
npm run build-release-apk
```
* **Alternative Direct Command**: `.\gradlew.bat assembleRelease`
* **Output File**:
  * **Release APK**: Check [app/build/outputs/apk/release/](file:///c:/Users/dhull/OneDrive/Documents/GitHub/AnimeTV/app/build/outputs/apk/release) for the compiled `.apk`.

### 3. Install & Test the APK on a Connected Device
If you have a physical Android TV, phone, or emulator connected via ADB:

```powershell
adb devices
adb install -r app/build/outputs/apk/debug/app-debug.apk
```
* **Note**: Replace `app-debug.apk` with the exact filename of the generated APK inside the output directory.

---

## ⚡ Quick Reference Cheat Sheet

| Platform | Command | Action | Primary Output |
| :--- | :--- | :--- | :--- |
| **All** | `npm run build:all` | Compiles UI/TypeScript code | `app/src/main/assets/view/*` |
| **Windows** | `npm run pack-win` | Generates standalone x64 and ARM64 folders | `electron/builds/AnimeTV-win32-*/` |
| **Windows** | `npm run build-win` | Creates Setup Installer | `electron/builds/animetv-<version>-setup.exe` |
| **Windows** | `npm run zip-win` | Packages x64 standalone into ZIP | `electron/builds/AnimeTV-win32-x64-portable.zip` |
| **Android** | `npm run build-debug-apk` | Builds Debug APK | `app/build/outputs/apk/debug/*.apk` |
| **Android** | `npm run build-release-apk` | Builds Release APK | `app/build/outputs/apk/release/*.apk` |

---

## 🔍 Troubleshooting & Notes

> [!NOTE]
> * **Version Syncing**: The desktop and Android build scripts sync their versions from [app/build.gradle](file:///c:/Users/dhull/OneDrive/Documents/GitHub/AnimeTV/app/build.gradle). Edit `versionName` and `versionCode` in that file to bump the versions.
> * **Code Signing**: The `assembleRelease` Gradle task currently uses the debug signing config from `app/build.gradle`. For public store releases, a developer should sign the APK using a secure production release keystore.
