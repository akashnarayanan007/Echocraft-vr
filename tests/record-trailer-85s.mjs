import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 5179;
const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('public', 'audit-artifacts', 'trailer-raw');

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

server.listen(PORT, '127.0.0.1', async () => {
  console.log('Trailer capture server running on port', PORT);
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: OUTPUT_DIR,
        size: { width: 1920, height: 1080 }
      }
    });

    const page = await context.newPage();
    console.log('Navigating to game...');
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 15000 });

    const startBtn = await page.waitForSelector('#start-btn, button:has-text("Step Inside")', { timeout: 10000 });
    if (startBtn) {
      await startBtn.click();
      await page.waitForTimeout(2000);
    }

    const canvas = await page.$('canvas');
    const box = canvas ? await canvas.boundingBox() : null;

    // Act 1: 00:00 - 00:10 (10s) The Forgotten Light
    console.log('[00:00 - 00:10] Act 1: The Forgotten Light (Storm sea, dark beacon)');
    if (box) {
      // Gentle subtle pan to set the cinematic mood
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 40, box.y + box.height / 2 + 10, { steps: 25 });
      await page.mouse.up();
    }
    await page.waitForTimeout(8000);

    // Act 1.5: 00:10 - 00:22 (12s) A World Without Memories (Show fragments & shrines)
    console.log('[00:10 - 00:22] Act 1.5: A World Without Memories (Diorama orbit, glowing plinths)');
    if (box) {
      await page.mouse.move(box.x + box.width / 2 - 40, box.y + box.height / 2 + 10);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 - 15, { steps: 35 });
      await page.mouse.up();
    }
    await page.waitForTimeout(10000);

    // Act 2: 00:22 - 00:36 (14s) Warmth Restored
    console.log('[00:22 - 00:36] Act 2: Warmth Restored (Placing amber fragment)');
    await page.keyboard.press('1');
    await page.waitForTimeout(3000); // Wave expands, beacon awakens
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 60, box.y + box.height / 2 + 15, { steps: 30 });
      await page.mouse.up();
    }
    await page.waitForTimeout(9000);

    // Act 3: 00:36 - 00:50 (14s) Life Restored
    console.log('[00:36 - 00:50] Act 3: Life Restored (Placing emerald fragment)');
    await page.keyboard.press('2');
    await page.waitForTimeout(3000); // Emerald shockwave, flora blooms
    if (box) {
      await page.mouse.move(box.x + box.width / 2 - 60, box.y + box.height / 2 + 15);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 - 10, { steps: 30 });
      await page.mouse.up();
    }
    await page.waitForTimeout(9000);

    // Act 4: 00:50 - 01:04 (14s) Hope Restored
    console.log('[00:50 - 01:04] Act 4: Hope Restored (Placing cyan fragment)');
    await page.keyboard.press('3');
    await page.waitForTimeout(4000); // Azure wave, storm clearing, dawn begins
    if (box) {
      await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 - 10);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 30, box.y + box.height / 2 + 10, { steps: 30 });
      await page.mouse.up();
    }
    await page.waitForTimeout(8000);

    // Act 5: 01:04 - 01:19 (15s) The Last Light (Golden sunrise & monumental expansion)
    console.log('[01:04 - 01:19] Act 5: The Last Light (Sunrise transformation, full glory)');
    if (box) {
      await page.mouse.move(box.x + box.width / 2 - 30, box.y + box.height / 2 + 10);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 120, box.y + box.height / 2 + 25, { steps: 40 });
      await page.mouse.up();
    }
    await page.waitForTimeout(13000);

    // Act 6: 01:19 - 01:25 (6s) Final Beauty Shot (Smooth hold for title card resolve)
    console.log('[01:19 - 01:25] Act 6: Final Beauty Shot');
    await page.waitForTimeout(6000);

    console.log('Finalizing capture...');
    const video = page.video();
    await page.close();
    await context.close();
    await browser.close();

    if (video) {
      const videoPath = await video.path();
      console.log('Master 85s trailer footage recorded to:', videoPath);
      const masterWebm = path.join(OUTPUT_DIR, 'trailer_gameplay_85s.webm');
      fs.copyFileSync(videoPath, masterWebm);
      console.log('Exported master footage to:', masterWebm);
    }
  } catch (e) {
    console.error('Error during recording:', e);
  } finally {
    server.close();
  }
});
