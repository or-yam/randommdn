import fs from 'fs';
import playwright from 'playwright';

const BASE_URL = 'https://developer.mozilla.org';

const scrapeLinksData = async (): Promise<{ href: string; text: string }[]> => {
  const data: { href: string; text: string }[] = [];
  const browser = await playwright['chromium'].launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(BASE_URL);

  await page.goto(`${BASE_URL}/en-US/docs/Web/JavaScript/Reference`);
  const sections = await page.$$('section');
  for (const section of sections) {
    const as = await section.$$('a');
    for (let a of as) {
      const href = await a.getAttribute('href');
      const text = await a.innerText();
      if (!href) {
        continue;
      }
      if (href[0] !== '#') {
        data.push({ href: `${BASE_URL}${href}`, text });
      }
    }
  }

  await browser.close();
  return data;
};

const saveToJsonFile = (dataObject: any[] | {}, fileName: string) => {
  const asJson = JSON.stringify(dataObject, null, 2);
  fs.writeFile(`${fileName}.json`, asJson, error => {
    if (error) throw error;
    console.log('Data written to file');
  });
};

const linksData = await scrapeLinksData();
saveToJsonFile(linksData, 'mdn-links');
