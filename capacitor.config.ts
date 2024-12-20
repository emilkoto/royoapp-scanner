import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.royousa.scanner',
  appName: 'royoapp-scanner',
  webDir: 'dist/royoapp-scanner/browser',
  server: {
    url: "http://192.168.1.149:4200",
    cleartext: true
  },
};

export default config;
