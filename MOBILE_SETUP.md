# Bhasha — Mobile Setup Guide (iOS + Android)

## Prerequisites

| Requirement | For |
|---|---|
| Xcode 15+ | iOS builds |
| iOS 14+ device / simulator | iOS testing |
| Android Studio Hedgehog+ | Android builds |
| Node 20+ | Everything |
| CocoaPods (`sudo gem install cocoapods`) | iOS dependency management |

---

## One-time Setup

### 1. Install Capacitor dependencies
```bash
cd "Desi Duolingo"
npm install
```

### 2. Add iOS and Android platforms
```bash
npx cap add ios
npx cap add android
```

This creates `ios/` and `android/` directories. **Do not manually edit files in these — they're generated.**

### 3. First sync
```bash
npm run cap:sync
```

---

## Daily workflow

### Build and open in Xcode
```bash
npm run cap:ios
```
Then in Xcode: select your device → ▶ Run

### Build and open in Android Studio
```bash
npm run cap:android
```
Then in Android Studio: Run → Select device

### Run directly on connected device (no IDE)
```bash
# iOS (device must be trusted)
npm run cap:run:ios

# Android (USB debugging must be on)
npm run cap:run:android
```

---

## Live reload during development

For fast iteration, you can serve the web app locally and point Capacitor to it.

1. Start Vite dev server: `npm run dev`
2. Find your local IP: `ifconfig | grep "inet "` (Mac)
3. In `capacitor.config.ts`, uncomment the `server` block and replace `YOUR_LOCAL_IP`:
   ```ts
   server: {
     url: 'http://192.168.1.42:5173',
     cleartext: true,
   },
   ```
4. Run `npx cap sync` (no build needed — it points to your dev server)
5. Open in Xcode/Android Studio and run

**Remember to comment the `server` block out again before building for release!**

---

## App icon and splash screen

After running `npm install`, generate icons from the SVG source:

```bash
# Install asset generator
npm install --save-dev @capacitor/assets

# Generate all sizes from source files
npx capacitor-assets generate --ios --android
```

Source files needed (in `assets/` directory — see Phase 3B):
- `assets/icon.png` — 1024×1024, no rounded corners (Apple/Google add them)
- `assets/splash.png` — 2732×2732, logo centered in a 1200×1200 safe zone
- `assets/splash-dark.png` — dark-mode version (optional)

---

## iOS App Store — signing

1. Open `ios/App/App.xcworkspace` in Xcode
2. Select the `App` target → Signing & Capabilities
3. Set Team to your Apple Developer account
4. Bundle Identifier: `com.bhasha.app`
5. Enable "Automatically manage signing"

---

## Android Play Store — signing

The release keystore is generated once and must be kept safe:

```bash
keytool -genkey -v \
  -keystore bhasha-release.keystore \
  -alias bhasha \
  -keyalg RSA -keysize 2048 \
  -validity 10000

# Store the keystore in a safe location (NOT in the repo)
```

In `android/app/build.gradle`, add the signing config referencing this keystore.

---

## Audio files on mobile

The `public/audio/` directory (1486 MP3 files) is copied into the app bundle automatically during `cap sync`. No CDN needed — audio plays offline.

---

## Useful commands

| Command | What it does |
|---|---|
| `npm run cap:sync` | Build + sync web assets to native projects |
| `npm run cap:ios` | Sync + open Xcode |
| `npm run cap:android` | Sync + open Android Studio |
| `npx cap copy` | Copy web assets only (skip plugin installs) |
| `npx cap update` | Update native plugin versions |
| `npx cap doctor` | Diagnose environment issues |
