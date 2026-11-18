/**
 * Visual Quality Gate Audit Script (Corrected Button Selector)
 * Captures:
 * 1. Initial storm scene (1920x1080)
 * 2. Close three-quarter diorama inspection view
 * 3. Gameplay execution: clicking fragments 1, 2, 3 to trigger Warmth, Life, Hope
 * 4. Finale sunrise & world expansion state
 * 5. Verifies GLB model rendering and console logs
 */

import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 5174;
const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('public', 'audit-artifacts');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json'
};

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    let filePath = path.join(DIST_DIR, reqPath);
    if (!fs.existsSync(filePath)) {
      const publicPath = path.join(path.resolve('public'), reqPath);
      if (fs.existsSync(publicPath)) {
        filePath = publicPath;
      }
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`Audit server running at http://127.0.0.1:${PORT}/`);
      resolve(server);
    });
  });
}

async function runAudit() {
  console.log('--- Starting ECHOCRAFT VR Visual Quality Gate Audit ---');
  const server = await startStaticServer();
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();
    const consoleLogs = [];
    const errors = [];
    const loadedAssets = [];

    page.on('response', (res) => {
      const url = res.url();
      if (url.includes('.glb') || url.includes('.uikitml') || url.includes('.scene.json')) {
        loadedAssets.push({ url, status: res.status() });
      }
    });

    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      consoleLogs.push({ type, text });
      if (type === 'error') errors.push(text);
    });

    page.on('pageerror', (err) => {
      errors.push(err.toString());
    });

    const targetUrl = `http://127.0.0.1:${PORT}/`;
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });

    await page.waitForSelector('canvas', { timeout: 15000 });
    console.log('✓ Canvas found.');

    // Look for Start / Begin button - matching "Step Inside the Story"
    const startBtn = await page.waitForSelector('#start-btn, button:has-text("Step Inside")', { timeout: 10000 });
    if (startBtn) {
      console.log('✓ Clicking "Step Inside the Story" button...');
      await startBtn.click();
      await page.waitForTimeout(3000); // Wait for overlay to fade out completely
    }

    // 1. Initial Storm Scene Presentation Screenshot (1920x1080)
    const shotInitial = path.join(OUTPUT_DIR, '01_initial_storm_1080p.png');
    await page.screenshot({ path: shotInitial });
    console.log(`✓ Captured 01 Initial Storm: ${shotInitial}`);

    // 2. Closer view - Orbit/Drag mouse slightly to see three-quarter angle
    const canvas = await page.$('canvas');
    if (canvas) {
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 - 200, box.y + box.height / 2 + 50, { steps: 20 });
        await page.mouse.up();
        await page.waitForTimeout(1000);
      }
    }
    const shotThreeQuarter = path.join(OUTPUT_DIR, '02_close_three_quarter_1080p.png');
    await page.screenshot({ path: shotThreeQuarter });
    console.log(`✓ Captured 02 Three-Quarter View: ${shotThreeQuarter}`);

    // 3. Trigger Memory Restoration via keyboard accessibility keys ('1', '2', '3')
    console.log('Triggering Fragment 1 (Warmth)...');
    await page.keyboard.press('1');
    await page.waitForTimeout(2000);

    console.log('Triggering Fragment 2 (Life)...');
    await page.keyboard.press('2');
    await page.waitForTimeout(2000);

    console.log('Triggering Fragment 3 (Hope)...');
    await page.keyboard.press('3');
    await page.waitForTimeout(4000); // Allow expansion transition to complete

    // 4. Capture Restored State / Finale
    const shotFinale = path.join(OUTPUT_DIR, '03_restored_sunrise_finale_1080p.png');
    await page.screenshot({ path: shotFinale });
    console.log(`✓ Captured 03 Restored Finale: ${shotFinale}`);

    // 5. Responsive check at 1366x768
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.waitForTimeout(1000);
    const shot768 = path.join(OUTPUT_DIR, '04_restored_finale_768p.png');
    await page.screenshot({ path: shot768 });
    console.log(`✓ Captured 04 Restored Finale 768p: ${shot768}`);

    console.log('\n--- GLB & Asset Load Report ---');
    loadedAssets.forEach((a) => console.log(`  - [Status ${a.status}] ${a.url}`));

    console.log(`\nTotal Console Logs: ${consoleLogs.length}`);
    const nonFavErrors = errors.filter((e) => !e.includes('favicon'));
    if (nonFavErrors.length > 0) {
      console.warn('Potential Errors Logged:', nonFavErrors);
    } else {
      console.log('✓ 0 critical JavaScript runtime errors observed.');
    }

    console.log('--- Visual Quality Gate Audit Completed ---');
  } catch (err) {
    console.error('Audit failed:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

runAudit();
