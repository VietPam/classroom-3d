import puppeteer from 'puppeteer-core';
import path from 'path';

const PROD_URL = 'https://classroom-3d.pages.dev';
const ARTIFACT_DIR = '/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/710004a8-4f44-4af5-9dbd-f3664239bed1';

async function run() {
  console.log('🌐 Launching Chromium for Production Verification...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--ignore-gpu-blocklist',
      '--ignore-certificate-errors',
      '--enable-webgl',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--disable-gpu-sandbox',
      '--window-size=430,932',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

    console.log(`📡 Navigating to ${PROD_URL}...`);
    await page.goto(PROD_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('canvas', { timeout: 15000 });
    console.log('✅ Canvas detected, waiting 3s for WebGL scene...');
    await new Promise((r) => setTimeout(r, 3000));

    // Open Simulator Dock
    console.log('🤖 Opening Simulator Dock on Production...');
    const simBtn = await page.waitForSelector('[data-testid="btn-toggle-simulator"]', { timeout: 5000 });
    await simBtn.click();
    await new Promise((r) => setTimeout(r, 1000));

    // Screenshot 1: Prod Simulator Dock
    const shot1 = path.join(ARTIFACT_DIR, 'prod_crowd_simulator_dock.png');
    await page.screenshot({ path: shot1 });
    console.log(`📸 Saved production screenshot 1: ${shot1}`);

    // Quick votes
    console.log('🗳️ Casting test votes on Prod...');
    await page.click('button[data-testid="btn-vote-5-C"]');
    await new Promise((r) => setTimeout(r, 300));
    await page.click('button[data-testid="btn-vote-5-A"]');
    await new Promise((r) => setTimeout(r, 500));

    // Screenshot 2: Prod with votes
    const shot2 = path.join(ARTIFACT_DIR, 'prod_crowd_votes_cast.png');
    await page.screenshot({ path: shot2 });
    console.log(`📸 Saved production screenshot 2: ${shot2}`);

    console.log('🎉 Production Live Verification Successful!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ Prod verification failed:', err);
  process.exit(1);
});
