/**
 * useRevenueCat — subscription management hook
 * ─────────────────────────────────────────────
 * Phase 3C: This hook is the single integration point for RevenueCat.
 *
 * CURRENT STATE: Mock mode
 *   - purchase() immediately grants premium (no real payment)
 *   - restore() checks the persisted isPremium flag
 *
 * TO WIRE UP REAL PAYMENTS (after installing RevenueCat SDK):
 *   1. npm install @revenuecat/purchases-capacitor
 *   2. Replace MOCK_MODE = false
 *   3. Add your RevenueCat API keys below
 *   4. Uncomment the real implementation blocks
 *
 * Product IDs (must match App Store Connect + Google Play Console):
 *   iOS:     com.localese.app.premium.monthly / com.localese.app.premium.annual
 *   Android: premium_monthly / premium_annual
 */

import { useStore } from '../store/index.js';

// ── Config ────────────────────────────────────────────────────────────────────
const MOCK_MODE = true; // flip to false once RevenueCat SDK is installed

const RC_CONFIG = {
  // Get these from app.revenuecat.com → Project → API Keys
  iosApiKey:     'appl_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  androidApiKey: 'goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  entitlementId: 'premium', // the entitlement name in RevenueCat dashboard
};

export const PRODUCT_IDS = {
  monthly: 'com.localese.app.premium.monthly',
  annual:  'com.localese.app.premium.annual',
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useRevenueCat() {
  const { isPremium, setPremium } = useStore();

  /**
   * Initialize RevenueCat — call once on app start (e.g. in App.jsx useEffect).
   * Safe to call multiple times.
   */
  const initialize = async () => {
    if (MOCK_MODE) return;

    // REAL IMPLEMENTATION:
    // const { Purchases } = await import('@revenuecat/purchases-capacitor');
    // const isIos = window.Capacitor?.getPlatform() === 'ios';
    // await Purchases.configure({
    //   apiKey: isIos ? RC_CONFIG.iosApiKey : RC_CONFIG.androidApiKey,
    // });
    // const { customerInfo } = await Purchases.getCustomerInfo();
    // setPremium(customerInfo.entitlements.active[RC_CONFIG.entitlementId] !== undefined);
  };

  /**
   * Fetch current offerings from RevenueCat.
   * Returns { monthly: Package, annual: Package } or null in mock mode.
   */
  const getOfferings = async () => {
    if (MOCK_MODE) {
      return {
        monthly: { identifier: PRODUCT_IDS.monthly, product: { priceString: '₹299/mo' } },
        annual:  { identifier: PRODUCT_IDS.annual,  product: { priceString: '₹1,999/yr' } },
      };
    }

    // REAL IMPLEMENTATION:
    // const { Purchases } = await import('@revenuecat/purchases-capacitor');
    // const { current } = await Purchases.getOfferings();
    // if (!current) return null;
    // const pkgs = current.availablePackages;
    // return {
    //   monthly: pkgs.find(p => p.identifier === PRODUCT_IDS.monthly),
    //   annual:  pkgs.find(p => p.identifier === PRODUCT_IDS.annual),
    // };
  };

  /**
   * Purchase a subscription package.
   * @param {'monthly'|'annual'} planKey
   * @returns {{ success: boolean, error?: string }}
   */
  const purchase = async (planKey) => {
    if (MOCK_MODE) {
      // Simulate a brief network delay so the UX feels real
      await new Promise(r => setTimeout(r, 600));
      setPremium(true);
      return { success: true };
    }

    // REAL IMPLEMENTATION:
    // try {
    //   const { Purchases } = await import('@revenuecat/purchases-capacitor');
    //   const offerings = await getOfferings();
    //   const pkg = offerings[planKey];
    //   if (!pkg) return { success: false, error: 'Package not found' };
    //   const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    //   const hasPremium = customerInfo.entitlements.active[RC_CONFIG.entitlementId] !== undefined;
    //   setPremium(hasPremium);
    //   return { success: hasPremium };
    // } catch (err) {
    //   if (err.code === '1') return { success: false, error: 'cancelled' }; // user cancelled
    //   return { success: false, error: err.message };
    // }
  };

  /**
   * Restore purchases — call when user taps "Restore purchases".
   * @returns {{ success: boolean, hasPremium: boolean }}
   */
  const restore = async () => {
    if (MOCK_MODE) {
      return { success: true, hasPremium: isPremium };
    }

    // REAL IMPLEMENTATION:
    // try {
    //   const { Purchases } = await import('@revenuecat/purchases-capacitor');
    //   const { customerInfo } = await Purchases.restorePurchases();
    //   const hasPremium = customerInfo.entitlements.active[RC_CONFIG.entitlementId] !== undefined;
    //   setPremium(hasPremium);
    //   return { success: true, hasPremium };
    // } catch (err) {
    //   return { success: false, hasPremium: false };
    // }
  };

  return {
    isPremium,
    initialize,
    getOfferings,
    purchase,
    restore,
    isMockMode: MOCK_MODE,
  };
}
