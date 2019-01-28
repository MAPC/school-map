/*
 * Render
 */

'use strict';

const http        = require('http');
const path        = require('path');
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

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport(calcDims(100));
  await page.evaluateOnNewDocument(schid => {
    window.endpoint = `/data/${schid}.json`;
    window.staticRender = true;
  }, schoolId);
  await page.goto(`http://localhost:${server.address().port}`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join('screens', `${schoolId}.png`) });
  await browser.close();

  server.close();

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
    width: 10 * scale,
    height: 6 * scale,
  };
}

