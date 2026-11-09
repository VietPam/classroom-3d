import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const PORT = 4173;
const PREVIEW_URL = `http://127.0.0.1:${PORT}`;
const ARTIFACT_DIR = '/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/710004a8-4f44-4af5-9dbd-f3664239bed1';

async function run() {
  console.log('🚀 Starting Vite preview server...');
  const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    cwd: '/home/antigravity/classroom-3d',
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log(`[Vite] ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[Vite ERR] ${d.toString().trim()}`));

  // Wait 2.5s for server to start
  await new Promise((r) => setTimeout(r, 2500));

  console.log('🌐 Launching Chromium browser with WebGL SwiftShader...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--ignore-gpu-blocklist',
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
    page.on('console', (msg) => {
      const txt = msg.text();
      if (!txt.includes('Failed to load resource')) {
        console.log(`[PAGE LOG] ${msg.type()}: ${txt}`);
      }
    });
    page.on('pageerror', (err) => console.error(`[PAGE ERROR] ${err.toString()}`));
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

    console.log(`📡 Navigating to ${PREVIEW_URL}...`);
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for canvas to be present and rendered
    await page.waitForSelector('canvas', { timeout: 15000 });
    console.log('✅ Canvas detected, waiting 3s for WebGL scene initialization...');
    await new Promise((r) => setTimeout(r, 3000));

    // 1. Initial State Screenshot
    const initialShot = path.join(ARTIFACT_DIR, 'chibi_verify_01_initial.png');
    await page.screenshot({ path: initialShot });
    console.log(`📸 Initial scene captured: ${initialShot}`);

    // 2. Trigger Quiz Showdown (Chạy Đua)
    console.log('🏃 Clicking [Chạy Đua] button...');
    const raceBtn = await page.waitForSelector('[data-testid="btn-start-race"]', { timeout: 5000 });
    if (raceBtn) {
      await raceBtn.click();
      console.log('✅ Clicked [Chạy Đua], capturing mid-run screenshot (bouncy 2-tier walk)...');
      await new Promise((r) => setTimeout(r, 1200)); // mid-flight running
      const runningShot = path.join(ARTIFACT_DIR, 'chibi_verify_02_walking_cycle.png');
      await page.screenshot({ path: runningShot });
      console.log(`📸 Walking cycle captured: ${runningShot}`);

      // Wait for students to arrive at pads and transition to THINKING pose
      console.log('⏳ Waiting for students to arrive at Quiz Pads (THINKING pose)...');
      await new Promise((r) => setTimeout(r, 3800));
      const padsShot = path.join(ARTIFACT_DIR, 'chibi_verify_03_at_quiz_pads.png');
      await page.screenshot({ path: padsShot });
      console.log(`📸 At quiz pads captured: ${padsShot}`);
      fs.copyFileSync(padsShot, '/home/antigravity/classroom-3d/docs/references/chibi_verify_03_at_quiz_pads.png');

      // 2b. Zoom in close to inspect facial details and limbs
      console.log('🔍 Zooming in to inspect characters closely...');
      await page.mouse.move(215, 600);
      for (let i = 0; i < 8; i++) {
        await page.mouse.wheel({ deltaY: -120 });
        await new Promise((r) => setTimeout(r, 80));
      }
      await new Promise((r) => setTimeout(r, 600));
      const closeupShot = path.join(ARTIFACT_DIR, 'chibi_verify_05_closeup_characters.png');
      await page.screenshot({ path: closeupShot });
      console.log(`📸 Close-up captured: ${closeupShot}`);
      fs.copyFileSync(closeupShot, '/home/antigravity/classroom-3d/docs/references/chibi_verify_05_closeup_characters.png');
    }

    // 3. Trigger Celebrate All (PartyPopper)
    console.log('🎉 Triggering celebrate all...');
    const celebrateBtn = await page.waitForSelector('[data-testid="btn-celebrate"]', { timeout: 5000 });
    if (celebrateBtn) {
      await celebrateBtn.click();
      await new Promise((r) => setTimeout(r, 1400));
      const celebrateShot = path.join(ARTIFACT_DIR, 'chibi_verify_04_celebrate.png');
      await page.screenshot({ path: celebrateShot });
      console.log(`📸 Celebrate captured: ${celebrateShot}`);
    }

    console.log('🌟 All verification screenshots successfully captured!');
  } finally {
    await browser.close();
    server.kill();
  }
}

run().catch((err) => {
  console.error('❌ Error during verification:', err);
  process.exit(1);
});
