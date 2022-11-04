import playwright from 'playwright';
import { saveToJsonFile } from './save-file';
import { LinkMetaData } from './types';

const BASE_URL = 'https://developer.mozilla.org';

const scrapeLinksData = async (): Promise<LinkMetaData[]> => {
  const data: LinkMetaData[] = [];
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
        data.push({ url: `${BASE_URL}${href}`, title: text, description: '', tag: '' });
      }
    }
  }

  await browser.close();
  return data;
};

export default async () => {
  const linksData = await scrapeLinksData();
  saveToJsonFile(linksData, 'mdn-links');
};
