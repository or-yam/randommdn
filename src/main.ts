import { getLinkMetaData, getSitemapLinks } from '../scraper/sitemap-scraper';
import { LinkMetaData } from '../scraper/types';
import storedData from './data.json';
import './style.css';

const appElement = document.getElementById('app')!;

const getRandomLink = async () => {
  const sitemapLinks = await getSitemapLinks();
  if (!sitemapLinks.length) {
    const index = Math.floor(Math.random() * storedData.length);
    return storedData[index];
  }
  const randomLink = sitemapLinks[Math.floor(Math.random() * sitemapLinks.length)];
  const linkMetaData = await getLinkMetaData(randomLink);
  return linkMetaData;
};

const createRandomLink = async () => {
  const prevLink = document.getElementById('link');
  if (prevLink) {
    prevLink.remove();
  }
  const linkContent: LinkMetaData = await getRandomLink();
  const link = document.createElement('a');
  link.id = 'link';
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.href = linkContent.url;
  link.innerText = linkContent.title;
  appElement.append(link);
};

const button = document.getElementById('btn')!;
button.onclick = createRandomLink;
