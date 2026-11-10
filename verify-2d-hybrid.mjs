import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';

const PORT = 4178;
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

    console.log(`📡 Navigating to 2.5D Hybrid Stage: ${PREVIEW_URL}...`);
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Turn off autoplay for deterministic control
    const pauseBtn = await page.$('button[title*="Tạm dừng"]');
    if (pauseBtn) {
      console.log('⏸️ Pausing autoplay for deterministic test...');
      await pauseBtn.click();
      await new Promise((r) => setTimeout(r, 500));
    }

    // Screenshot 1: Initial 2.5D Stage (20 Chibi at desks, crisp smartboard)
    const shot1 = path.join(ARTIFACT_DIR, 'stage2d_01_initial_desks.png');
    await page.screenshot({ path: shot1 });
    console.log(`📸 Saved screenshot 1: ${shot1}`);

    // Open Simulator Dock
    console.log('🤖 Opening Simulator Dock...');
    const simToggleBtn = await page.waitForSelector('[data-testid="btn-toggle-simulator"]', { timeout: 5000 });
    await simToggleBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    // Screenshot 2: Simulator Dock over 2.5D Stage
    const shot2 = path.join(ARTIFACT_DIR, 'stage2d_02_simulator_dock.png');
    await page.screenshot({ path: shot2 });
    console.log(`📸 Saved screenshot 2: ${shot2}`);

    // Cast votes: +5 A, +10 C, +5 D
    console.log('🗳️ Casting test votes: +5 A, +10 C, +5 D...');
    await page.click('button[data-testid="btn-vote-5-A"]');
    await new Promise((r) => setTimeout(r, 150));
    await page.click('button[data-testid="btn-vote-5-C"]');
    await new Promise((r) => setTimeout(r, 150));
    await page.click('button[data-testid="btn-vote-5-C"]');
    await new Promise((r) => setTimeout(r, 150));
    await page.click('button[data-testid="btn-vote-5-D"]');
    await new Promise((r) => setTimeout(r, 500));

    // Screenshot 3: Simulator with votes cast
    const shot3 = path.join(ARTIFACT_DIR, 'stage2d_03_votes_cast.png');
    await page.screenshot({ path: shot3 });
    console.log(`📸 Saved screenshot 3: ${shot3}`);

    // Close Simulator Dock
    console.log('✖️ Closing Simulator Dock...');
    await page.click('[data-testid="btn-close-simulator"]');
    await new Promise((r) => setTimeout(r, 600));

    // Start Race!
    console.log('🏃 Starting Race to Pads with Hamilton Distribution...');
    const raceBtn = await page.waitForSelector('[data-testid="btn-start-race"]', { timeout: 5000 });
    await raceBtn.click();

    // Wait 2s for students to arrive at pads
    await new Promise((r) => setTimeout(r, 2000));

    // Screenshot 4: 20 Chibi Students arrived at pads!
    const shot4 = path.join(ARTIFACT_DIR, 'stage2d_04_students_at_pads.png');
    await page.screenshot({ path: shot4 });
    console.log(`📸 Saved screenshot 4: ${shot4}`);

    // Wait for reveal
    console.log('⏳ Waiting for Result Reveal & Celebration...');
    await new Promise((r) => setTimeout(r, 4200));

    // Screenshot 5: Reveal result + Jump celebrate + Confetti
    const shot5 = path.join(ARTIFACT_DIR, 'stage2d_05_celebrate_confetti.png');
    await page.screenshot({ path: shot5 });
    console.log(`📸 Saved screenshot 5: ${shot5}`);

    // Test optional ?3d=1 mode
    console.log('📡 Testing optional 3D fallback mode (?3d=1)...');
    await page.goto(`${PREVIEW_URL}/?3d=1`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('canvas', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2500));

    // Screenshot 6: 3D Mode
    const shot6 = path.join(ARTIFACT_DIR, 'stage2d_06_optional_3d_mode.png');
    await page.screenshot({ path: shot6 });
    console.log(`📸 Saved screenshot 6: ${shot6}`);

    console.log('🎉 2.5D Hybrid Architecture Verification Completed Successfully!');
  } finally {
    await browser.close();
    server.kill();
    console.log('🛑 Server and browser stopped cleanly.');
  }
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
