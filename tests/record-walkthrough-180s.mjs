import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 5180;
const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('public', 'audit-artifacts', 'walkthrough-raw');

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
  console.log('180s Walkthrough capture server running on port', PORT);
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

    // 00:00 - 00:20 (20s) Section 1: Intro (Onboarding screen view, then click Step Inside)
    console.log('[00:00 - 00:20] Sec 1: Introduction (Onboarding title screen, entering experience)');
    await page.waitForTimeout(5000); // Show onboarding screen
    const startBtn = await page.waitForSelector('#start-btn, button:has-text("Step Inside")', { timeout: 10000 });
    if (startBtn) {
      await startBtn.click();
      await page.waitForTimeout(2000);
    }
    await page.waitForTimeout(13000); // 20s total

    const canvas = await page.$('canvas');
    const box = canvas ? await canvas.boundingBox() : null;

    // 00:20 - 00:44 (24s) Section 2: World & Objective (Slow inspection orbit of island, altars, plinths)
    console.log('[00:20 - 00:44] Sec 2: World & Objective (Inspecting diorama, beacon, sockets)');
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 80, box.y + box.height / 2 + 20, { steps: 40 });
      await page.mouse.up();
    }
    await page.waitForTimeout(10000);
    if (box) {
      await page.mouse.move(box.x + box.width / 2 - 80, box.y + box.height / 2 + 20);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2 - 10, { steps: 40 });
      await page.mouse.up();
    }
    await page.waitForTimeout(14000); // 24s total

    // 00:44 - 00:68 (24s) Section 3: VR Interaction & Controls (Demonstrating direct interaction, wrong placement recovery)
    console.log('[00:44 - 00:68] Sec 3: VR Interaction & Controls (Demonstrating grab, movement, plinth return)');
    if (box) {
      // Pick up and move warmth fragment away (drag test)
      const fragX = box.x + box.width * 0.42;
      const fragY = box.y + box.height * 0.62;
      await page.mouse.move(fragX, fragY);
      await page.mouse.down();
      await page.mouse.move(fragX - 120, fragY - 100, { steps: 30 });
      await page.waitForTimeout(2000);
      await page.mouse.up(); // Releasing outside shrine triggers smooth pedestal return
    }
    await page.waitForTimeout(10000);
    if (box) {
      // Re-orient camera toward shrines
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 30, box.y + box.height / 2 + 10, { steps: 25 });
      await page.mouse.up();
    }
    await page.waitForTimeout(12000); // 24s total

    // 00:68 - 00:92 (24s) Section 4: First Memory: Warmth (Socket placement, amber shockwave, lantern rekindling)
    console.log('[00:68 - 00:92] Sec 4: First Memory: Warmth (Socketing amber fragment, wave expansion)');
    await page.keyboard.press('1');
    await page.waitForTimeout(4000); // Shockwave expansion & audio feedback
    if (box) {
      // Slow pan showing rotating beacon and lightened sea
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 - 15, { steps: 35 });
      await page.mouse.up();
    }
    await page.waitForTimeout(20000); // 24s total

    // 00:92 - 01:16 (24s) Section 5: Second Memory: Life (Socket placement, emerald shockwave, flora bloom)
    console.log('[00:92 - 01:16] Sec 5: Second Memory: Life (Socketing emerald fragment, greenery bloom)');
    await page.keyboard.press('2');
    await page.waitForTimeout(4000); // Emerald shockwave & growth
    if (box) {
      // Zoom or orbit in slightly to highlight blooming cliffside moss & flowers
      await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 - 15);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 70, box.y + box.height / 2 + 20, { steps: 35 });
      await page.mouse.up();
    }
    await page.waitForTimeout(20000); // 24s total

    // 01:16 - 01:40 (24s) Section 6: Third Memory: Hope (Socket placement, cyan shockwave, storm dissolve)
    console.log('[01:16 - 01:40] Sec 6: Third Memory: Hope (Socketing cyan fragment, dawn transformation)');
    await page.keyboard.press('3');
    await page.waitForTimeout(5000); // Azure wave, rain fading, sky opening to sunrise
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 - 10, { steps: 35 });
      await page.mouse.up();
    }
    await page.waitForTimeout(19000); // 24s total

    // 01:40 - 01:62 (22s) Section 7: Finale & Room-Scale Expansion (Showcasing transformed world & tech stack)
    console.log('[01:40 - 01:62] Sec 7: Finale & Room-Scale Expansion (Transformed island, turquoise ocean, scale growth)');
    if (box) {
      // Majestic panoramic sweep across the fully restored morning island
      await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 - 10);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 130, box.y + box.height / 2 + 25, { steps: 50 });
      await page.mouse.up();
    }
    await page.waitForTimeout(22000); // 22s total

    // 01:62 - 01:80 (18s) Section 8: Replay & Reset (Press R, show world reset back to Stage 0, closing view)
    console.log('[01:62 - 01:80] Sec 8: Replay & Reset (Demonstrating reset to Stage 0, closing view)');
    await page.keyboard.press('r'); // Triggers resetExperience()
    await page.waitForTimeout(3000); // Reverts diorama, resets gems to altars
    if (box) {
      await page.mouse.move(box.x + box.width / 2 - 130, box.y + box.height / 2 + 25);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 35 });
      await page.mouse.up();
    }
    await page.waitForTimeout(15000); // 18s total

    console.log('Capture finished. Finalizing raw WebM...');
    const video = page.video();
    await page.close();
    await context.close();
    await browser.close();

    if (video) {
      const videoPath = await video.path();
      const masterWebm = path.join(OUTPUT_DIR, 'walkthrough_raw_180s.webm');
      fs.copyFileSync(videoPath, masterWebm);
      console.log('Exported raw 180s walkthrough video to:', masterWebm);
    }
  } catch (e) {
    console.error('Error during recording:', e);
  } finally {
    server.close();
  }
});
