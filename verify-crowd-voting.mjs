import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const PORT = 4175;
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

    // Turn off autoplay if active so we have deterministic control
    const pauseBtn = await page.$('button[title*="Tạm dừng"]');
    if (pauseBtn) {
      console.log('⏸️ Pausing autoplay for deterministic test...');
      await pauseBtn.click();
      await new Promise((r) => setTimeout(r, 500));
    }

    // Screenshot 1: Initial state
    const shot1 = path.join(ARTIFACT_DIR, 'crowd_voting_01_initial.png');
    await page.screenshot({ path: shot1 });
    console.log(`📸 Saved screenshot 1: ${shot1}`);

    // Click simulator button to open dock
    console.log('🤖 Opening Simulator Dock...');
    const simToggleBtn = await page.waitForSelector('[data-testid="btn-toggle-simulator"]', { timeout: 5000 });
    await simToggleBtn.click();
    await new Promise((r) => setTimeout(r, 800));

    // Screenshot 2: Simulator Dock Open
    const shot2 = path.join(ARTIFACT_DIR, 'crowd_voting_02_simulator_dock.png');
    await page.screenshot({ path: shot2 });
    console.log(`📸 Saved screenshot 2: ${shot2}`);

    // Inject votes: +5 A, +10 C, +5 D
    console.log('🗳️ Injecting test votes: +5 A, +10 C, +5 D...');
    await page.click('button[data-testid="btn-vote-5-A"]');
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[data-testid="btn-vote-5-C"]');
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[data-testid="btn-vote-5-C"]'); // second +5 to make 10
    await new Promise((r) => setTimeout(r, 200));
    await page.click('button[data-testid="btn-vote-5-D"]');
    await new Promise((r) => setTimeout(r, 500));

    // Screenshot 3: Simulator Dock with Votes
    const shot3 = path.join(ARTIFACT_DIR, 'crowd_voting_03_votes_cast.png');
    await page.screenshot({ path: shot3 });
    console.log(`📸 Saved screenshot 3: ${shot3}`);

    // Close Simulator Dock so we can see the 3D scene clearly
    console.log('✖️ Closing Simulator Dock to view 3D showdown...');
    await page.click('[data-testid="btn-close-simulator"]');
    await new Promise((r) => setTimeout(r, 800));

    // Start Quiz Showdown!
    console.log('🏃 Starting Quiz Showdown with Hamilton Proportional Distribution...');
    const showdownBtn = await page.waitForSelector('[data-testid="btn-start-race"]', { timeout: 5000 });
    await showdownBtn.click();

    // Wait for students to sprint to the pads (~2.8s)
    console.log('⏳ Waiting 3.2s for students to run to pads...');
    await new Promise((r) => setTimeout(r, 3200));

    // Screenshot 4: Students at pads distributed proportionally according to votes!
    const shot4 = path.join(ARTIFACT_DIR, 'crowd_voting_04_students_at_pads.png');
    await page.screenshot({ path: shot4 });
    console.log(`📸 Saved screenshot 4: ${shot4}`);

    // Wait for reveal result
    console.log('⏳ Waiting 4.5s for result reveal...');
    await new Promise((r) => setTimeout(r, 4500));

    // Screenshot 5: Reveal result celebration
    const shot5 = path.join(ARTIFACT_DIR, 'crowd_voting_05_result_reveal.png');
    await page.screenshot({ path: shot5 });
    console.log(`📸 Saved screenshot 5: ${shot5}`);

    console.log('🎉 Crowd Voting & Simulator Verification Complete!');
  } finally {
    await browser.close();
    server.kill();
    console.log('🛑 Server and browser closed cleanly.');
  }
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
