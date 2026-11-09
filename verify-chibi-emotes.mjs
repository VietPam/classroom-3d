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

  await new Promise((r) => setTimeout(r, 2500));

  console.log('🌐 Launching Chromium browser with WebGL SwiftShader...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    ignoreHTTPSErrors: true,
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
      '--ignore-certificate-errors',
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

    await page.waitForSelector('canvas', { timeout: 15000 });
    console.log('✅ Canvas detected, waiting 3s for WebGL scene...');
    await new Promise((r) => setTimeout(r, 3000));

    // 1. Initial State
    const initialShot = path.join(ARTIFACT_DIR, 'chibi_verify_initial_20.png');
    await page.screenshot({ path: initialShot });
    console.log(`📸 Initial scene: ${initialShot}`);

    // 2. Test WAVE Emote
    console.log('👋 Clicking [Chào] (WAVE)...');
    const waveBtn = await page.waitForSelector('[data-testid="btn-emote-wave"]', { timeout: 5000 });
    if (waveBtn) {
      await waveBtn.click();
      await new Promise((r) => setTimeout(r, 1200));
      const waveShot = path.join(ARTIFACT_DIR, 'chibi_verify_emote_wave.png');
      await page.screenshot({ path: waveShot });
      console.log(`📸 WAVE emote captured: ${waveShot}`);
      fs.copyFileSync(waveShot, '/home/antigravity/classroom-3d/docs/references/chibi_verify_emote_wave.png');
    }

    // 3. Test RAISE_HAND Emote
    console.log('🙋 Clicking [Phát Biểu] (RAISE_HAND)...');
    const raiseBtn = await page.waitForSelector('[data-testid="btn-emote-raise"]', { timeout: 5000 });
    if (raiseBtn) {
      await raiseBtn.click();
      await new Promise((r) => setTimeout(r, 1200));
      const raiseShot = path.join(ARTIFACT_DIR, 'chibi_verify_emote_raise_hand.png');
      await page.screenshot({ path: raiseShot });
      console.log(`📸 RAISE_HAND emote captured: ${raiseShot}`);
      fs.copyFileSync(raiseShot, '/home/antigravity/classroom-3d/docs/references/chibi_verify_emote_raise_hand.png');
    }

    // 4. Test DANCE Emote
    console.log('💃 Clicking [Vũ Đạo] (DANCE)...');
    const danceBtn = await page.waitForSelector('[data-testid="btn-emote-dance"]', { timeout: 5000 });
    if (danceBtn) {
      await danceBtn.click();
      await new Promise((r) => setTimeout(r, 1400));
      const danceShot = path.join(ARTIFACT_DIR, 'chibi_verify_emote_dance.png');
      await page.screenshot({ path: danceShot });
      console.log(`📸 DANCE emote captured: ${danceShot}`);
      fs.copyFileSync(danceShot, '/home/antigravity/classroom-3d/docs/references/chibi_verify_emote_dance.png');
    }

    // 5. Test SHOCKED Emote
    console.log('😱 Clicking [Hốt Hoảng] (SHOCKED)...');
    const shockBtn = await page.waitForSelector('[data-testid="btn-emote-shocked"]', { timeout: 5000 });
    if (shockBtn) {
      await shockBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
      const shockShot = path.join(ARTIFACT_DIR, 'chibi_verify_emote_shocked.png');
      await page.screenshot({ path: shockShot });
      console.log(`📸 SHOCKED emote captured: ${shockShot}`);
      fs.copyFileSync(shockShot, '/home/antigravity/classroom-3d/docs/references/chibi_verify_emote_shocked.png');
    }

    console.log('🌟 All 4 emote verification screenshots successfully captured!');
  } finally {
    await browser.close();
    server.kill();
  }
}

run().catch((err) => {
  console.error('❌ Error during emote verification:', err);
  process.exit(1);
});
