/**
 * Verification Script for 2.5D Hybrid Classroom Stage
 * Runs vite preview and captures a headless screenshot with Google Chrome
 */
import { spawn } from 'child_process';

const PORT = 4188;
const URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_IMAGE = '/tmp/stage2d_verification.png';

async function main() {
  console.log(`🚀 Starting Vite preview on port ${PORT}...`);
  const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log(`[Vite] ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[Vite ERR] ${d.toString().trim()}`));

  await new Promise((r) => setTimeout(r, 1500));

  try {
    console.log(`📸 Capturing screenshot via Chrome: ${URL}...`);
    const chrome = spawn('google-chrome', [
      '--headless',
      '--disable-gpu',
      '--window-size=430,932',
      `--screenshot=${OUTPUT_IMAGE}`,
      URL,
    ]);

    await new Promise((resolve, reject) => {
      chrome.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Chrome exited with code ${code}`));
      });
    });

    console.log(`✅ Verification screenshot saved to: ${OUTPUT_IMAGE}`);
  } finally {
    server.kill();
    console.log('🛑 Vite preview server stopped.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
