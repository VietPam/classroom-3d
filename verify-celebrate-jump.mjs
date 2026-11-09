import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const PORT = 4174;
const PREVIEW_URL = `http://127.0.0.1:${PORT}`;
const ARTIFACT_DIR = '/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/710004a8-4f44-4af5-9dbd-f3664239bed1';

async function run() {
  console.log('🚀 Starting Vite preview server on port ' + PORT + '...');
  const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    cwd: '/home/antigravity/classroom-3d',
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log(`[Vite] ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[Vite ERR] ${d.toString().trim()}`));

  await new Promise((r) => setTimeout(r, 2000));

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
    await page.waitForSelector('canvas', { timeout: 15000 });
    console.log('✅ Canvas detected, waiting 3s for WebGL scene initialization...');
    await new Promise((r) => setTimeout(r, 3000));

    // Zoom in on front row students
    console.log('🔍 Zooming in on front row characters for crystal-clear inspection...');
    await page.mouse.move(215, 600);
    for (let i = 0; i < 9; i++) {
      await page.mouse.wheel({ deltaY: -120 });
      await new Promise((r) => setTimeout(r, 50));
    }
    await new Promise((r) => setTimeout(r, 600));

    // 1. Test CELEBRATE ALL
    console.log('🎉 Clicking Celebrate All...');
    const celebrateBtn = await page.waitForSelector('[data-testid="btn-celebrate"]', { timeout: 5000 });
    if (celebrateBtn) {
      await celebrateBtn.click();
      console.log('📸 Capturing multiple frames of Celebrate Victory Jump...');
      // Sample over a jump cycle to catch mid-air apex
      for (let i = 1; i <= 6; i++) {
        await new Promise((r) => setTimeout(r, 120));
        const shotPath = path.join(ARTIFACT_DIR, `chibi_jump_frame_${i}.png`);
        await page.screenshot({ path: shotPath });
        console.log(`Saved frame ${i}: ${shotPath}`);
      }
    }

    // 2. Test WAVE emote
    console.log('👋 Clicking WAVE emote button...');
    const waveBtn = await page.waitForSelector('[data-testid="btn-emote-wave"]', { timeout: 5000 });
    if (waveBtn) {
      await waveBtn.click();
      await new Promise((r) => setTimeout(r, 600));
      const waveShot = path.join(ARTIFACT_DIR, 'chibi_verify_fixed_wave.png');
      await page.screenshot({ path: waveShot });
      console.log(`📸 Fixed WAVE captured: ${waveShot}`);
    }

    // 3. Test RAISE HAND emote
    console.log('✋ Clicking RAISE HAND emote button...');
    const raiseBtn = await page.waitForSelector('[data-testid="btn-emote-raise"]', { timeout: 5000 });
    if (raiseBtn) {
      await raiseBtn.click();
      await new Promise((r) => setTimeout(r, 600));
      const raiseShot = path.join(ARTIFACT_DIR, 'chibi_verify_fixed_raise.png');
      await page.screenshot({ path: raiseShot });
      console.log(`📸 Fixed RAISE HAND captured: ${raiseShot}`);
    }

    // Copy best celebrate jump frame to docs/references
    const bestCelebrate = path.join(ARTIFACT_DIR, 'chibi_jump_frame_3.png');
    if (fs.existsSync(bestCelebrate)) {
      fs.copyFileSync(bestCelebrate, '/home/antigravity/classroom-3d/docs/references/chibi_verify_04_celebrate.png');
    }

    console.log('🎉 All visual verification frames captured successfully!');
  } finally {
    await browser.close();
    server.kill();
  }
}

run().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
