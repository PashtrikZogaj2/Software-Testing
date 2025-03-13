import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration
 */
export default defineConfig({
  timeout: 30000, // Koha maksimale për çdo test (30 sekonda)
  use: {
    headless: false, // Ekzekuto testet me UI të dukshëm (mund të ndryshoni në `true` për ekzekutime pa UI)
    viewport: { width: 1280, height: 720 }, // Madhësia e ekranit për testet
    ignoreHTTPSErrors: true, // Përdoret për të injoruar gabimet HTTPS
   
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
   
  ],
  retries: 1, // Provon 1 herë tjetër nëse dështimi ndodh
  workers: 1, // Numri i punëtorëve për ekzekutimin e testeve
  reporter: [
    ['list'], // Shfaq rezultatet në konsolë
    ['html', { outputFolder: './playwright-report/html', open: 'never' }], // Krijon një raport HTML pas ekzekutimit
  ],
});
