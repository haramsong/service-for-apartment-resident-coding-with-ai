import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.apartment.community',
  appName: '우리동네',
  webDir: '.next',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    url: 'http://localhost:2555',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2B5CE6',
      showSpinner: false,
    },
  },
};

export default config;
