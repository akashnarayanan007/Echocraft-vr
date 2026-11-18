/**
 * Automated Playwright Smoke Test for ECHOCRAFT VR
 * Validates:
 * - Application static assets and dist integrity
 * - Viewport rendering at 1920x1080 and 1366x768 via local static webserver
 * - Captures visual evidence in public/test-artifacts
 * - Monitors console warnings/errors
 */

import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 5173;
const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('public', 'test-artifacts');

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
  '.wasm': 'application/wasm'
};

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    const filePath = path.join(DIST_DIR, reqPath);

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
      console.log(`Static server running at http://127.0.0.1:${PORT}/`);
      resolve(server);
    });
  });
}

async function runSmokeTest() {
  console.log('--- Starting ECHOCRAFT VR Playwright Smoke Test ---');
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

    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      consoleLogs.push({ type, text });
      if (type === 'error') {
        errors.push(text);
      }
    });

    page.on('pageerror', (err) => {
      errors.push(err.toString());
    });

    const targetUrl = `http://127.0.0.1:${PORT}/`;
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait for canvas or UI container
    await page.waitForSelector('canvas', { timeout: 15000 });
    console.log('✓ WebGL/Three.js Canvas rendered successfully.');

    // Look for Start / Begin button if present
    const startBtn = await page.$('button:has-text("Begin The Memory")');
    if (startBtn) {
      console.log('✓ Found "Begin The Memory" button. Clicking to activate diorama...');
      await startBtn.click();
      await page.waitForTimeout(2000);
    } else {
      await page.waitForTimeout(2000);
    }

    // Capture 1080p screenshot
    const shot1080p = path.join(OUTPUT_DIR, 'smoke_1920x1080.png');
    await page.screenshot({ path: shot1080p });
    console.log(`✓ Captured 1080p screenshot: ${shot1080p}`);

    // Test responsive 1366x768
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.waitForTimeout(1000);
    const shot768p = path.join(OUTPUT_DIR, 'smoke_1366x768.png');
    await page.screenshot({ path: shot768p });
    console.log(`✓ Captured 768p screenshot: ${shot768p}`);

    // Verify UI / Narrative text
    const hasNarrative = await page.evaluate(() => {
      return document.body.innerText.includes('The Last Light') || document.body.innerText.includes('Memory');
    });
    console.log(`✓ Narrative / Title UI visible: ${hasNarrative}`);

    console.log(`✓ Total Console events captured: ${consoleLogs.length}`);
    const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('XRSystem') && !e.includes('navigator.xr'));
    if (criticalErrors.length > 0) {
      console.warn(`! Recorded ${criticalErrors.length} potential non-XR errors:`, criticalErrors);
    } else {
      console.log('✓ No critical application JavaScript runtime errors observed.');
    }

    console.log('--- Smoke Test Completed Successfully ---');
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

runSmokeTest();
