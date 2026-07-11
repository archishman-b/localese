import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.localese.app',
  appName: 'Localese',
  webDir: 'dist',

  // Server config — remove the `url` field before building for production.
  // Keep it during development to enable live-reload on device.
  // server: {
  //   url: 'http://YOUR_LOCAL_IP:5173',
  //   cleartext: true,
  // },

  ios: {
    // Allow serving the bundled audio files
    contentInsetAdjustmentBehavior: 'automatic',
    // Required for Web Speech API fallback
    allowsLinkPreview: false,
    scrollEnabled: true,
  },

  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // set true for debugging, false for production
  },

  plugins: {
    // SplashScreen config — controlled via @capacitor/splash-screen
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
    },

    // StatusBar — use default (light content on dark bar) or match brand
    StatusBar: {
      style: 'DEFAULT',
      backgroundColor: '#E86A3A',
    },

    // Keyboard — avoid layout shifts when soft keyboard opens
    Keyboard: {
      resize: 'body',
      style: 'LIGHT',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
