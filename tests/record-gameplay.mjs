import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 5178;
const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('public', 'audit-artifacts', 'video');

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
  console.log('Capture server running on port', PORT);
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
    console.log('Navigating to target...');
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 15000 });

    const startBtn = await page.waitForSelector('#start-btn, button:has-text("Step Inside")', { timeout: 10000 });
    if (startBtn) {
      await startBtn.click();
      await page.waitForTimeout(2000);
    }

    // 00:00 - 00:08 Opening Storm
    console.log('Recording Segment: Opening Storm...');
    await page.waitForTimeout(6000);

    // 00:08 - 00:18 Warmth Restoration
    console.log('Recording Segment: Warmth...');
    await page.keyboard.press('1');
    await page.waitForTimeout(6000);

    // 00:18 - 00:28 Life Restoration
    console.log('Recording Segment: Life...');
    await page.keyboard.press('2');
    await page.waitForTimeout(6000);

    // 00:28 - 00:40 Hope Restoration
    console.log('Recording Segment: Hope...');
    await page.keyboard.press('3');
    await page.waitForTimeout(8000);

    // 00:40 - 00:55 Sunrise Finale inspection (orbit mouse slightly)
    console.log('Recording Segment: Sunrise Finale...');
    const canvas = await page.$('canvas');
    if (canvas) {
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 - 150, box.y + box.height / 2 + 30, { steps: 30 });
        await page.mouse.up();
      }
    }
    await page.waitForTimeout(6000);

    console.log('Closing page to finalize video file...');
    const video = page.video();
    await page.close();
    await context.close();
    await browser.close();

    if (video) {
      const videoPath = await video.path();
      console.log('Video saved to:', videoPath);
      // Copy to public/audit-artifacts/echocraft_gameplay_demo.webm
      const finalWebm = path.join(path.resolve('public'), 'audit-artifacts', 'echocraft_gameplay_demo.webm');
      fs.copyFileSync(videoPath, finalWebm);
      console.log('Exported official gameplay demo to:', finalWebm);
    }
  } catch (e) {
    console.error('Error during recording:', e);
  } finally {
    server.close();
  }
});
