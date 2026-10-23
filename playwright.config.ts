import { defineConfig, devices } from '@playwright/test'

// Runs against the production build (`npm run build` first). e2e runs in all
// three engines; axe and perf specs are Chromium-only (see each file).
export default defineConfig({
  testDir: 'tests',
  testMatch: ['e2e/**/*.spec.ts', 'perf/**/*.spec.ts', 'visual/**/*.spec.ts'],
  timeout: 60_000,
  fullyParallel: true,
  workers: 3,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: { baseURL: 'http://localhost:4173', viewport: { width: 1440, height: 900 } },
  webServer: { command: 'npm run preview -- --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: true },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } }, testIgnore: ['perf/**'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } }, testIgnore: ['perf/**'] }
  ]
})
