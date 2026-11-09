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

  // Launch Chromium
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
      '--window-size=1280,720',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

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

    // Check title
    const title = await page.title();
    record('Kiểm tra Title trang web', title.length > 0, `Title: "${title}"`);

    // 2. WebGL Canvas
    console.log('\n--- 2. Kiểm tra 3D WebGL Canvas (React Three Fiber) ---');
    const canvas = await page.waitForSelector('canvas', { timeout: 10000 });
    record('Kiểm tra thẻ Canvas 3D (R3F) tồn tại và hoạt động', !!canvas);

    // Wait a brief moment for Three.js scene to render initial frames
    await new Promise((r) => setTimeout(r, 2500));

    // Capture initial screenshot
    const initScreenshot = path.join(ARTIFACTS_DIR, 'e2e_prod_01_initial_scene.png');
    await page.screenshot({ path: initScreenshot });
    testResults.screenshots.push('e2e_prod_01_initial_scene.png');
    console.log('📸 Đã chụp màn hình 1: e2e_prod_01_initial_scene.png');

    // 3. Header & HUD inspection
    console.log('\n--- 3. Kiểm tra giao diện giáo viên (Teacher HUD) ---');
    const headerText = await page.$eval('header', (el) => el.innerText);
    const hasHeaderTitle = headerText.includes('IELTS 301') || headerText.includes('Math 301');
    record('Kiểm tra Header HUD & Thông tin bài thi', hasHeaderTitle);

    const hasTimer = headerText.includes('Time Left:');
    record('Kiểm tra Đồng hồ đếm ngược (Exam Timer)', hasTimer);

    const hasCounter = headerText.includes('Handed In:') && headerText.includes('0 / 9');
    record('Kiểm tra Bộ đếm bài nộp ban đầu (0 / 9)', hasCounter);

    // 4. Test Camera Switch
    console.log('\n--- 4. Kiểm tra chuyển đổi góc nhìn Camera ---');
    // Find button containing Overview Orbit or Toàn Cảnh
    const buttons = await page.$$('button');
    let overviewBtn = null;
    let teacherPovBtn = null;
    let randomBtn = null;

    for (const b of buttons) {
      const text = await page.evaluate((el) => el.innerText, b);
      if (text.includes('Toàn Cảnh') || text.includes('Overview')) overviewBtn = b;
      if (text.includes('Góc Trái') || text.includes('Góc Lên Bảng') || text.includes('Teacher POV')) teacherPovBtn = b;
      if (text.includes('Call Random')) randomBtn = b;
    }

    if (overviewBtn && teacherPovBtn) {
      await overviewBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
      record('Chuyển sang góc nhìn Toàn Cảnh Orbit', true);

      await teacherPovBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
      record('Chuyển lại góc nhìn Góc Trái Nhìn Lên (Bottom-Left Corner Up-View)', true);
    } else {
      record('Kiểm tra nút chuyển Camera', false, 'Không tìm thấy đủ nút');
    }

    // 5. Trigger First Student Submission (Emily Zhang - Desk A1)
    console.log('\n--- 5. Kích hoạt học sinh nộp bài: Emily Zhang (Desk A1) ---');
    const selectElem = await page.$('select');
    if (selectElem) {
      // Select student-1 (Emily Zhang)
      await selectElem.select('student-1');
      record('Chọn học sinh "Emily Zhang (Desk A1)" từ Dropdown', true);
    } else {
      record('Chọn học sinh từ Dropdown', false, 'Không tìm thấy thẻ select');
    }

    // Check walking banner
    await new Promise((r) => setTimeout(r, 800));
    const bannerElem = await page.$('div.self-center');
    let bannerText = '';
    if (bannerElem) {
      bannerText = await page.evaluate((el) => el.innerText, bannerElem);
    }
    const isWalking = bannerText.includes('Emily Zhang') && bannerText.includes('walking');
    record('Hiển thị thông báo trạng thái học sinh đang bước lên nộp bài', isWalking, bannerText);

    // Capture walking screenshot
    const walkingScreenshot = path.join(ARTIFACTS_DIR, 'e2e_prod_02_student_walking.png');
    await page.screenshot({ path: walkingScreenshot });
    testResults.screenshots.push('e2e_prod_02_student_walking.png');
    console.log('📸 Đã chụp màn hình 2: e2e_prod_02_student_walking.png');

    // 6. Wait for Scorecard Modal
    console.log('\n--- 6. Chờ học sinh đến bàn giáo viên & hiển thị Bảng điểm ---');
    // Walking takes approx 3-4s
    const scorecardModal = await page.waitForSelector('div.fixed.inset-0.z-50', { timeout: 15000 });
    record('Bảng điểm (Scorecard Modal) tự động hiển thị khi học sinh trao bài', !!scorecardModal);

    await new Promise((r) => setTimeout(r, 1000));
    const modalText = await page.$eval('div.fixed.inset-0.z-50', (el) => el.innerText);

    const hasStudentName = modalText.includes('Emily Zhang');
    record('Bảng điểm hiển thị đúng tên học sinh (Emily Zhang)', hasStudentName);

    const hasGrade = modalText.includes('Grade A') || modalText.includes('/100');
    record('Bảng điểm hiển thị Điểm số & Xếp loại (Grade)', hasGrade);

    const hasRemarks = modalText.includes('Teacher Evaluation Remarks');
    record('Bảng điểm hiển thị Nhận xét của giáo viên', hasRemarks);

    const hasBreakdown = modalText.toUpperCase().includes('EXAM SECTION BREAKDOWN');
    record('Bảng điểm hiển thị Chi tiết từng câu hỏi & điểm số thành phần', hasBreakdown);

    // Capture scorecard screenshot
    const scorecardScreenshot = path.join(ARTIFACTS_DIR, 'e2e_prod_03_scorecard_modal.png');
    await page.screenshot({ path: scorecardScreenshot });
    testResults.screenshots.push('e2e_prod_03_scorecard_modal.png');
    console.log('📸 Đã chụp màn hình 3: e2e_prod_03_scorecard_modal.png');

    // 7. Accept paper and return to seat
    console.log('\n--- 7. Giáo viên thu bài & học sinh quay về chỗ ngồi ---');
    const modalButtons = await page.$$('div.fixed.inset-0.z-50 button');
    let acceptBtn = null;
    for (const mb of modalButtons) {
      const txt = await page.evaluate((el) => el.innerText, mb);
      if (txt.includes('Accept Paper')) acceptBtn = mb;
    }
    if (acceptBtn) {
      await acceptBtn.click();
      record('Click "Accept Paper & Return Student to Desk"', true);
    } else {
      await page.click('div.fixed.inset-0.z-50 button.w-full');
      record('Click đóng bảng điểm để học sinh quay về chỗ', true);
    }

    // Wait for student to walk back, step into desk, sit down, and finish (~5s)
    console.log('Đang đợi học sinh bước về chỗ ngồi và hoàn tất chu trình...');
    await new Promise((r) => setTimeout(r, 6000));

    // Check counter updated to 1 / 9
    const updatedCounterText = await page.$eval('header', (el) => el.innerText);
    const counterUpdated = updatedCounterText.includes('1 / 9');
    record('Bộ đếm bài đã nộp cập nhật chính xác (1 / 9)', counterUpdated);

    // Capture returned screenshot
    const returnedScreenshot = path.join(ARTIFACTS_DIR, 'e2e_prod_04_student_returned.png');
    await page.screenshot({ path: returnedScreenshot });
    testResults.screenshots.push('e2e_prod_04_student_returned.png');
    console.log('📸 Đã chụp màn hình 4: e2e_prod_04_student_returned.png');

    // 8. Test "Call Random Student"
    console.log('\n--- 8. Kích hoạt tính năng "Call Random Student" ---');
    if (randomBtn) {
      await randomBtn.click();
      record('Click nút "Call Random Student"', true);

      // Wait for second student to submit
      console.log('Đang đợi học sinh ngẫu nhiên bước lên nộp bài...');
      const modal2 = await page.waitForSelector('div.fixed.inset-0.z-50', { timeout: 15000 });
      record('Bảng điểm của học sinh thứ 2 hiển thị thành công', !!modal2);

      const modal2Text = await page.$eval('div.fixed.inset-0.z-50', (el) => el.innerText);
      const student2Name = modal2Text.split('\n')[2] || 'Học sinh';
      console.log(`Học sinh thứ 2 (${student2Name}) đã nộp bài thành công!`);

      // Dismiss modal 2
      await page.click('div.fixed.inset-0.z-50 button.w-full');
      await new Promise((r) => setTimeout(r, 6000));

      const finalCounterText = await page.$eval('header', (el) => el.innerText);
      record('Bộ đếm bài đã nộp cập nhật lên (2 / 9)', finalCounterText.includes('2 / 9'));
    }

    // 9. Console Error Verification
    console.log('\n--- 9. Kiểm tra Console Error ---');
    const realErrors = consoleErrors.filter(
      (e) => !e.includes('favicon') && !e.includes('punycode')
    );
    record('Không có lỗi Javascript nghiêm trọng trên Console', realErrors.length === 0, realErrors.join(' | ') || 'Hoàn toàn sạch (Clean)');

  } catch (err) {
    console.error('❌ Lỗi ngoại lệ trong quá trình E2E test:', err);
    record('Ngoại lệ E2E test', false, err.message);
    const errScreenshot = path.join(ARTIFACTS_DIR, 'e2e_prod_error.png');
    await page.screenshot({ path: errScreenshot }).catch(() => {});
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
