const puppeteer = require('puppeteer');

const runBrowser = async (url) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    await browser.close();
    return { success: true };
  } catch (e) {
    return e;
  }
};

module.exports = runBrowser;
