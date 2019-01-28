/*
 * Render
 */

'use strict';

const os          = require('os');
const http        = require('http');
const final       = require('finalhandler');
const puppeteer   = require('puppeteer');
const serveStatic = require('serve-static');


async function main() {
  if (process.argv.length < 3) {
    os.exit(1);
  }

  const schoolId = process.argv[2];
  const port = 3003;

  let server = null;
  try {
    server = startServer(port);
  }
  catch(e) {
    os.exit(1);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport(calcDims(80));
  await page.evaluateOnNewDocument(schid => {
    window.endpoint = `/data/${schid}.json`;
    window.staticRender = true;
  }, schoolId);
  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join('screens', `${schoolId}.png`) });
  await browser.close();

  server.close();

}; main();


function startServer(port) {
  const serveFile = serveStatic('build', {index: ['index.html']});

  return (
    http
      .createServer((req, res) => serveFile(req, res, final(req, res)))
      .listen(port)
  );
}


function calcDims(scale) {
  return {
    width: 9 * scale,
    height: 6 * scale,
  };
}

