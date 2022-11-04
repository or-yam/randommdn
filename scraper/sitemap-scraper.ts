import axios from 'axios';
import { ungzip } from 'node-gzip';

const BASE_URL = 'https://developer.mozilla.org';
const SITEMAP_URL = `${BASE_URL}/sitemaps/en-US/sitemap.xml.gz`;
const WEB_PATH = `${BASE_URL}/en-US/docs/Web`;
const LINK_REGEX = /<loc>(.*?)<\/loc>/g;
const TITLE_REGEX = /<h1>(.*?)<\/h1>/i;
const DESCRIPTION_REGEX = /<meta name="description" content="(.*?)"\/>/i;
const SECTION_REGEX = /Web\/(.*?)\//;

export const getSitemapLinks = async (): Promise<string[]> => {
  try {
    const { data: sitemap } = await axios.get<ArrayBuffer>(SITEMAP_URL, { responseType: 'arraybuffer' });
    const sitemapArray = (await ungzip(sitemap)).toString().split('\n');
    const webDocsLinks = sitemapArray
      .filter(link => LINK_REGEX.test(link))
      .map(link => link.replace('<url><loc>', '').split('</loc>')[0])
      .filter(link => link.startsWith(WEB_PATH));
    return webDocsLinks;
  } catch (error) {
    console.log(error);
    return [];
  }
};

interface LinkMetaData {
  tag: string;
  title: string;
  description: string;
  url: string;
}
export const getLinkMetaData = async (link: string): Promise<LinkMetaData> => {
  try {
    const tag = link.match(SECTION_REGEX)?.[1] || '';
    const htmlDocument: string = (await axios.get<Document>(link)).data.toString();
    const title = htmlDocument.match(TITLE_REGEX)?.[1] || 'Unknown reference';
    const description = htmlDocument.match(DESCRIPTION_REGEX)?.[1] || 'Missing description';
    return { tag, title, description, url: link };
  } catch (error) {
    console.log(error);
    return { tag: '', title: '', description: '', url: link };
  }
};
