/*
 * Render
 */

'use strict';

const fs          = require('fs');
const http        = require('http');
const path        = require('path');
const sharp       = require('sharp');
const final       = require('finalhandler');
const puppeteer   = require('puppeteer');
const serveStatic = require('serve-static');

const { argv, exit } = process;


async function main() {
  if (argv.length < 3) {
    exit(1);
  }

  const schoolId = argv[2];

  let server = null;
  try {
    server = startServer();
  }
  catch(e) {
    exit(1);
  }

  const tmpPath = path.join('tmp', `${schoolId}.png`);
  const outPath = path.join('screens', `${schoolId}.png`);
  const dimScale = 100;
  const dims = calcDims(dimScale);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport(dims);
  await page.evaluateOnNewDocument(schid => {
    window.endpoint = `/data/${schid}.json`;
    window.staticRender = true;
  }, schoolId);
  await page.goto(`http://localhost:${server.address().port}`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: tmpPath });
  await browser.close();

  server.close();

  await (
    sharp(tmpPath)
      .extract({
        left: 0,
        top: 0,
        width: dims.width,
        height: Math.round(dims.height * .666),
      })
      .toFile(outPath)
  );

  fs.unlinkSync(tmpPath);

}; main();


function startServer() {
  const serveFile = serveStatic('build', {index: ['index.html']});

  return (
    http
      .createServer((req, res) => serveFile(req, res, final(req, res)))
      .listen(0) // listen 0 for random port
  );
}


function calcDims(scale) {
  return {
    width: 9 * scale,
    height: 6 * scale,
  };
}

