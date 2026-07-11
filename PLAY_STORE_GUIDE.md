# Bhasha — Google Play Store Guide

## Prerequisites

- Android Studio Hedgehog (2023.1.1) or later
- Java 17 (bundled with Android Studio)
- Google Play Developer account ($25 one-time fee)
- Capacitor Android platform added: `npx cap add android`

---

## Building a Release AAB

Google Play requires Android App Bundle (`.aab`) format, not APK.

### 1. Generate a release keystore (one-time)

```bash
keytool -genkey -v \
  -keystore ~/bhasha-release.keystore \
  -alias bhasha \
  -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -dname "CN=Bhasha, OU=App, O=Bhasha, L=Mumbai, S=MH, C=IN"
```

**Store the keystore and passwords somewhere safe — losing these means you can never update the app.**

### 2. Configure signing in the Android project

Open `android/app/build.gradle` and add the signing config:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file(System.getenv("BHASHA_KEYSTORE_PATH") ?: "/Users/YOU/bhasha-release.keystore")
            storePassword System.getenv("BHASHA_STORE_PASSWORD") ?: "YOUR_STORE_PASSWORD"
            keyAlias "bhasha"
            keyPassword System.getenv("BHASHA_KEY_PASSWORD") ?: "YOUR_KEY_PASSWORD"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Use environment variables, not hard-coded passwords, in the gradle file.**

### 3. Sync and build

```bash
# Sync web assets
npm run cap:sync

# Open Android Studio
npx cap open android
```

In Android Studio:
- Build → Generate Signed Bundle / APK
- Select "Android App Bundle"
- Choose the keystore file you created
- Select "release" build variant
- Click Finish

The `.aab` file is at: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Google Play Console Setup

### Create the app
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create app → App name: "Bhasha: Learn Indian Languages"
3. Free app, contains in-app purchases
4. Developer Programme Policies → agree

### Store listing
Copy from `APP_STORE_LISTING.md` → Google Play section.

**Short description (80 chars):**
```
Hindi, Telugu, Kannada, Bengali & Marathi. Real phrases, native audio.
```

**Screenshots required:**
- Phone: at least 2 screenshots (min 320px, max 3840px on any side)
- Tablet 7": recommended
- Feature graphic: 1024×500px (required for featuring)

### In-App Products → Subscriptions

Create two subscriptions:

| Field | Monthly | Annual |
|---|---|---|
| Product ID | `premium_monthly` | `premium_annual` |
| Name | Bhasha Premium Monthly | Bhasha Premium Annual |
| Description | Unlock all 4 stages | Best value — save 44% |
| Billing period | 1 month | 1 year |
| Price (INR) | ₹299 | ₹1,999 |
| Free trial | 7 days | 7 days |
| Grace period | 3 days | 3 days |

After creating, activate both products.

### RevenueCat — Android
1. Go to [app.revenuecat.com](https://app.revenuecat.com)
2. Your project → Google Play → add Android app with package: `com.bhasha.app`
3. Link your Google Play service account (follow RevenueCat docs)
4. Add products: map `premium_monthly` and `premium_annual` to the `premium` entitlement
5. Copy your Android API key → paste in `useRevenueCat.js` → `androidApiKey`

### Data safety form
In Play Console → Data safety:
- Data collected: **None** (all progress is stored locally)
- Data shared: No
- Data encrypted in transit: Yes (HTTPS for audio + analytics)
- Users can request deletion: Yes (uninstall the app)

### Content rating
Complete the questionnaire:
- Category: Reference / Educational
- Violence: No
- Sexuality: No
- Language: No
- Controlled substances: No
- Result expected: **Everyone**

---

## Release tracks

Google Play has 4 tracks — always start internal:

1. **Internal testing** (up to 100 testers, instant, no review)
   - Upload your AAB here first
   - Test critical flows, especially purchase/restore

2. **Closed testing (Alpha)** (~1 day review)
   - Named tester groups — for beta users

3. **Open testing (Beta)** (~1–2 days review)
   - Public link, unlimited testers

4. **Production** (3–7 days review for first submission)
   - Gradual rollout recommended: start at 10% → 50% → 100%

---

## Android-specific testing checklist

- [ ] App launches on Android 8.0+ (Capacitor 7 min SDK 21)
- [ ] Audio plays via `<audio>` tag (Android WebView supports MP3)
- [ ] Soft keyboard doesn't break layout (Capacitor Keyboard plugin handles this)
- [ ] Back button on Android goes back in lesson flow, not exits app
- [ ] Subscription purchase works with Sandbox account
- [ ] Restore purchases works
- [ ] App appears correct on 360dp width (common Android phone)
- [ ] Dark mode doesn't invert the app (we use `color-scheme: light` only)
- [ ] No ANR (Application Not Responding) — test on a low-end device

### Back button handling (Android)

Add to `App.jsx` or a layout component:

```js
import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { useNavigate } from 'react-router-dom';

// Handle Android hardware back button
useEffect(() => {
  const handler = CapApp.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      CapApp.exitApp();
    }
  });
  return () => handler.remove();
}, []);
```

---

## Useful Android Studio commands

| Action | How |
|---|---|
| Open logcat | View → Tool Windows → Logcat |
| Filter Bhasha logs | Logcat filter: `package:com.bhasha.app` |
| Inspect WebView | Chrome DevTools → `chrome://inspect/#devices` |
| Profile performance | Run → Profile with Profiler |
| Clear app data | Device → Settings → Apps → Bhasha → Clear data |
