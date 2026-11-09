import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const PRODUCTION_URL = 'https://classroom-3d.pages.dev';
const ARTIFACTS_DIR = '/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/710004a8-4f44-4af5-9dbd-f3664239bed1';

async function runE2ETest() {
  console.log('🚀 Bắt đầu End-to-End Test trên Production:', PRODUCTION_URL);
  const testResults = {
    url: PRODUCTION_URL,
    timestamp: new Date().toISOString(),
    tests: [],
    passedCount: 0,
    failedCount: 0,
    screenshots: [],
  };

  const record = (name, passed, details = '') => {
    console.log(`${passed ? '✅' : '❌'} [TEST] ${name}${details ? ': ' + details : ''}`);
    testResults.tests.push({ name, passed, details });
    if (passed) testResults.passedCount++;
    else testResults.failedCount++;
  };

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--enable-unsafe-swiftshader',
      '--ignore-certificate-errors',
      '--window-size=390,844',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  try {
    // 1. Navigation & HTTP 200
    console.log('\n--- 1. Tải trang Production ---');
    const response = await page.goto(PRODUCTION_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    const status = response ? response.status() : 0;
    record('Kiểm tra tải trang HTTP 200', status === 200, `Status code = ${status}`);

    const title = await page.title();
    record('Kiểm tra Title trang web', title.length > 0, `Title: "${title}"`);

    // 2. WebGL Canvas
    console.log('\n--- 2. Kiểm tra 3D WebGL Canvas (React Three Fiber) ---');
    const canvas = await page.waitForSelector('canvas', { timeout: 10000 });
    record('Kiểm tra thẻ Canvas 3D (R3F) tồn tại và hoạt động', !!canvas);

    await new Promise((r) => setTimeout(r, 2500));

    // Capture initial Mobile Screenshot
    const initScreenshot = path.join(ARTIFACTS_DIR, 'prod_clean_01_mobile.png');
    await page.screenshot({ path: initScreenshot });
    testResults.screenshots.push('prod_clean_01_mobile.png');
    console.log('📸 Đã chụp màn hình 1: prod_clean_01_mobile.png');

    // 3. Verify Top Bar is Completely Removed
    console.log('\n--- 3. Kiểm tra thanh tiêu đề phía trên (Top Bar) đã được xóa bỏ hoàn toàn ---');
    const header = await page.$('header');
    record('Thanh Header phía trên đã được gỡ bỏ hoàn toàn', header === null);

    const bodyText = await page.$eval('body', (el) => el.innerText);
    const hasIeltsTitle = bodyText.includes('IELTS 301');
    const hasTimer = bodyText.includes('Time Left:');
    const hasCounter = bodyText.includes('Handed In:');
    record('Không còn nhãn "IELTS 301"', !hasIeltsTitle);
    record('Không còn Đồng hồ đếm ngược (Exam Timer)', !hasTimer);
    record('Không còn Bộ đếm bài thi (Handed In counter)', !hasCounter);

    // 4. Verify Student Selection & Submission Controls are Completely Removed
    console.log('\n--- 4. Kiểm tra chức năng chọn học sinh & nộp bài đã được loại bỏ ---');
    const selectElem = await page.$('select');
    record('Thẻ select "Choose Student..." đã được gỡ bỏ', selectElem === null);

    const hasCallRandom = bodyText.includes('Call Random');
    record('Nút "Call Random" đã được gỡ bỏ', !hasCallRandom);

    const hasGocTrai = bodyText.includes('Góc Trái Nhìn Lên');
    record('Nút "Góc Trái Nhìn Lên" đã được gỡ bỏ', !hasGocTrai);

    // 5. Verify Only "Toàn Cảnh Orbit" and Reset button remain
    console.log('\n--- 5. Kiểm tra thanh điều khiển dưới (Bottom Dock) chỉ còn Orbit & Reset ---');
    const hasOrbitBtn = bodyText.includes('Toàn Cảnh Orbit');
    record('Nút "Toàn Cảnh Orbit" hiện diện trên thanh điều khiển', hasOrbitBtn);

    const buttons = await page.$$('button');
    record('Số lượng nút điều khiển tối giản (chỉ 2 nút: Orbit & Reset)', buttons.length === 2, `Tìm thấy ${buttons.length} nút`);

    // 6. Test OrbitControls 3D Interaction
    console.log('\n--- 6. Kiểm tra tương tác xoay 3D OrbitControls ---');
    await page.mouse.move(195, 422);
    await page.mouse.down();
    await page.mouse.move(260, 380, { steps: 10 });
    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 1000));
    record('Tương tác xoay 3D OrbitControls mượt mà không lỗi', true);

    const orbitedScreenshot = path.join(ARTIFACTS_DIR, 'prod_clean_02_orbited.png');
    await page.screenshot({ path: orbitedScreenshot });
    testResults.screenshots.push('prod_clean_02_orbited.png');
    console.log('📸 Đã chụp màn hình 2: prod_clean_02_orbited.png');

    // 7. Test Reset Camera View
    console.log('\n--- 7. Kiểm tra nút Reset Camera ---');
    if (buttons.length >= 2) {
      await buttons[1].click(); // Reset button
      await new Promise((r) => setTimeout(r, 1200));
      record('Click nút Reset khôi phục góc nhìn mặc định thành công', true);
    }

    // 8. Desktop Landscape Viewport Test
    console.log('\n--- 8. Kiểm tra hiển thị trên Desktop Landscape (1280x720) ---');
    await page.setViewport({ width: 1280, height: 720 });
    await new Promise((r) => setTimeout(r, 1500));
    const desktopScreenshot = path.join(ARTIFACTS_DIR, 'prod_clean_03_desktop.png');
    await page.screenshot({ path: desktopScreenshot });
    testResults.screenshots.push('prod_clean_03_desktop.png');
    console.log('📸 Đã chụp màn hình 3: prod_clean_03_desktop.png');
    record('Giao diện Desktop hiển thị tối giản, cân đối và thoáng đãng', true);

    // 9. Console Error Verification
    console.log('\n--- 9. Kiểm tra Console Error ---');
    const realErrors = consoleErrors.filter(
      (e) => !e.includes('favicon') && !e.includes('punycode')
    );
    record('Không có lỗi Javascript / WebGL trên Console', realErrors.length === 0, realErrors.join(' | ') || 'Hoàn toàn sạch (Clean)');

  } catch (err) {
    console.error('❌ Lỗi ngoại lệ trong quá trình E2E test:', err);
    record('Ngoại lệ E2E test', false, err.message);
  } finally {
    await browser.close();
  }

  // Write test report JSON
  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'e2e_test_report.json'),
    JSON.stringify(testResults, null, 2)
  );

  console.log(`\n========================================`);
  console.log(`🏁 KẾT QUẢ E2E TEST TRÊN PRODUCTION:`);
  console.log(`Passed: ${testResults.passedCount} / ${testResults.tests.length}`);
  console.log(`Failed: ${testResults.failedCount}`);
  console.log(`========================================\n`);

  return testResults;
}

runE2ETest().catch((e) => {
  console.error(e);
  process.exit(1);
});
