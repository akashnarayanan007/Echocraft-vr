import { chromium } from 'playwright';

async function testLiveProduction() {
  console.log('--- Testing Live Vercel Production Deployment ---');
  const liveUrl = 'https://echocraft-vr.vercel.app/';
  console.log(`Navigating to ${liveUrl}...`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=gl', '--no-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  const consoleLogs = [];
  const errors = [];
  const loadedAssets = [];

  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });

  page.on('response', resp => {
    const url = resp.url();
    if (url.includes('.glb') || url.includes('.uikitml') || url.includes('.scene.json')) {
      loadedAssets.push({ url, status: resp.status() });
    }
  });

  const response = await page.goto(liveUrl, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`HTTP Status: ${response.status()}`);

  await page.waitForTimeout(3000);

  // Take initial storm screenshot
  await page.screenshot({ path: 'public/production_deployed_intro.png' });
  console.log('✓ Captured production intro screenshot.');

  // Click start overlay button
  const startBtn = await page.$('button#start-btn');
  if (startBtn) {
    console.log('Clicking "Step Inside the Story" button on live deployment...');
    await startBtn.click();
    await page.waitForTimeout(3000);
  }

  // Check WebGL canvas
  const canvas = await page.$('canvas');
  console.log(`WebGL Canvas found: ${!!canvas}`);

  await page.screenshot({ path: 'public/production_deployed_storm_hero.png' });

  // Trigger memories via keyboard
  console.log('Triggering Warmth (1)...');
  await page.keyboard.press('Digit1');
  await page.waitForTimeout(1500);

  console.log('Triggering Life (2)...');
  await page.keyboard.press('Digit2');
  await page.waitForTimeout(1500);

  console.log('Triggering Hope (3)...');
  await page.keyboard.press('Digit3');
  await page.waitForTimeout(3500);

  await page.screenshot({ path: 'public/production_deployed_sunrise_live.png' });
  console.log('✓ Captured production sunrise screenshot.');

  // Test reset
  console.log('Triggering Reset (R)...');
  await page.keyboard.press('KeyR');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'public/production_deployed_reset_live.png' });
  console.log('✓ Captured production reset screenshot.');

  console.log('\n--- Key Asset Requests ---');
  for (const a of loadedAssets) {
    console.log(`  [${a.status}] ${a.url}`);
  }

  console.log(`\nConsole logs count: ${consoleLogs.length}`);
  console.log(`Console error count: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  await browser.close();
  console.log('--- Production Test Completed Successfully ---');
}

testLiveProduction().catch(err => {
  console.error('Production test failed:', err);
  process.exit(1);
});
