# Bhasha — App Store Submission Checklist

## Before first TestFlight build

### Code
- [ ] `capacitor.config.ts` — confirm `server.url` block is commented out
- [ ] `index.html` — replace `YOUR_DOMAIN` with your Plausible domain
- [ ] `useRevenueCat.js` — set `MOCK_MODE = false` and add real API keys
- [ ] `APP_STORE_LISTING.md` — confirm product IDs match App Store Connect
- [ ] Run `npm run build` — confirm 0 errors
- [ ] Run `npm run cap:sync` — confirm iOS project is up to date
- [ ] Run Lighthouse on the web build (`npm run preview`) — aim for 90+ Performance

### Assets
- [ ] `assets/icon.svg` exported to `assets/icon.png` (1024×1024, no transparency)
- [ ] `assets/splash.svg` exported to `assets/splash.png` (2732×2732)
- [ ] Run `npx capacitor-assets generate --ios` — check `ios/App/App/Assets.xcassets`
- [ ] App icon appears correctly in Xcode → Assets → AppIcon (all slots filled)
- [ ] Splash screen shows for 1.2s on cold launch

### Xcode setup
- [ ] Open `ios/App/App.xcworkspace` (not `.xcodeproj`)
- [ ] Bundle ID: `com.bhasha.app`
- [ ] Signing team set and certificate valid
- [ ] Deployment target: iOS 14.0+
- [ ] Version: `1.0.0`, Build: `1`
- [ ] `NSMicrophoneUsageDescription` not needed (we don't use microphone)
- [ ] `NSCameraUsageDescription` not needed (no camera)
- [ ] Info.plist — add `ITSAppUsesNonExemptEncryption = NO` (no custom encryption)

### In-App Purchases (App Store Connect)
- [ ] Subscription Group created: "Bhasha Premium"
- [ ] Monthly product: `com.bhasha.app.premium.monthly` — Active
- [ ] Annual product: `com.bhasha.app.premium.annual` — Active
- [ ] 7-day free trial configured on both
- [ ] RevenueCat entitlement `premium` configured with both products
- [ ] RevenueCat iOS API key added to `useRevenueCat.js`

---

## TestFlight

### Upload build
1. In Xcode: Product → Archive
2. Distribute App → App Store Connect → Upload
3. Wait ~15 min for processing
4. In App Store Connect → TestFlight → add testers

### Internal testing (immediate, no review)
- Add up to 25 Apple IDs in TestFlight → Internal Testers
- Test all critical paths:
  - [ ] Fresh install → onboarding shows
  - [ ] Pick language → lands on Learn page
  - [ ] Complete Stage 1, Lesson 1 (all vocab + exercises)
  - [ ] XP and streak update correctly
  - [ ] Stage 2 shows paywall (premium locked)
  - [ ] Purchase flow (use Sandbox account) → Stage 2 unlocks
  - [ ] Restore purchases → premium restored
  - [ ] Audio plays on all flashcards (tap 🔊)
  - [ ] Reference tab → category → word detail → audio plays
  - [ ] Kill app → relaunch → lands on Learn page for same language
  - [ ] Privacy policy loads at /privacy

### External testing (requires Apple review, ~1-2 days)
- [ ] Add beta testers (up to 10,000 via public link)
- [ ] Write beta testing notes (what to test, known issues)
- [ ] Submit for Beta App Review

---

## App Store Review Submission

### App Store Connect — App Information
- [ ] App name: `Bhasha: Learn Indian Languages`
- [ ] Subtitle: `Hindi, Telugu & 3 more`
- [ ] Primary category: Education
- [ ] Secondary category: Reference
- [ ] Content rights: No third-party content (we own all copy and audio)
- [ ] Age rating: 4+ (complete questionnaire — all No/None)
- [ ] Privacy policy URL: `https://bhasha.app/privacy` (or Vercel URL)

### Version Information
- [ ] Description: copied from `APP_STORE_LISTING.md`
- [ ] Keywords: `hindi,telugu,kannada,bengali,marathi,indian language,learn hindi,language learning,india`
- [ ] Support URL: your email or website
- [ ] Marketing URL: (optional — your landing page)
- [ ] Promotional text: set (updatable without review)

### Screenshots — required resolutions
- [ ] iPhone 6.7" — 5 screenshots (1290×2796 or 1320×2868)
- [ ] iPhone 6.5" — 5 screenshots (1284×2778 or 1242×2688)
- [ ] iPad 12.9" — if supporting iPad (2048×2732)

### Build
- [ ] Select the TestFlight build that passed internal testing
- [ ] Confirm "Export Compliance" — uses HTTPS only, no custom encryption → No

### Review notes
Copy from `APP_STORE_LISTING.md` → "App Review Notes" section.
- [ ] Paste review notes in "Notes" field
- [ ] No demo account needed (app works without login)

### Submission
- [ ] "Submit for Review"
- [ ] Expected review time: 24–48 hours (first submission often faster)

---

## Post-approval checklist

- [ ] Set release date (manual release recommended for first version)
- [ ] Send TestFlight testers a heads-up
- [ ] Post on social: product launch announcement
- [ ] Monitor Plausible dashboard for web traffic
- [ ] Monitor RevenueCat dashboard for subscriptions / trial starts
- [ ] Set up App Store Connect → Payments & Financial Reports (for revenue tracking)
- [ ] Reply to first App Store reviews within 24h

---

## Google Play — parallel checklist

- [ ] Android Studio: generate signed APK / AAB (Build → Generate Signed Bundle)
- [ ] Keystore stored safely (not in repo)
- [ ] Play Console: create new app → upload AAB
- [ ] Store listing: copy from `APP_STORE_LISTING.md` → Google Play section
- [ ] Content rating questionnaire: complete (Education, no violence/adult)
- [ ] Pricing: Free with in-app purchases
- [ ] Create subscription products matching `APP_STORE_LISTING.md`
- [ ] Target API level: 34+ (Android 14)
- [ ] Minimum SDK: 21 (Android 5.0) — Capacitor 7 requirement
- [ ] Data safety form: complete (we collect no personal data, store locally only)
- [ ] Internal track → Closed testing → Production (each requires review)
