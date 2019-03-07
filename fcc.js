const puppeteer = require('puppeteer');
const homedir = require('os').homedir();
const path = require('path');

const url = process.argv[2];
const launchConfig = {
  defaultViewport: {
    width: 1200,
    height: 800,
  },
};

let browser, page;

(async () => {
  browser = await puppeteer.launch(launchConfig);
  page = await browser.newPage();
  await formatForScreenReading();
  await browser.close();
})();

const parseUrl = (url) => {
  let parsed = url.split('/');
  let fullTitle = parsed[3].split('-');
  let titleOnly = fullTitle.splice(0, fullTitle.length - 1).join('-');
  return titleOnly;
};

const formatForScreenReading = async () => {
  await page.goto(url);

  await page.evaluate(() => {
    let paragraphs = document.querySelectorAll('.postArticle--full .sectionLayout--insetColumn')[1];
    paragraphs.style.maxWidth = '750px';
  });
  
  const articleName = parseUrl(url);
  await page.pdf({path: path.resolve(`${homedir}`, 'Desktop', `${articleName}.pdf`)});
};