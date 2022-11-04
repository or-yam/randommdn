import axios from 'axios';
import { LinkMetaData } from '../scraper/types';
import storedData from './data.json';
import './style.css';

const appElement = document.getElementById('app')!;

const getRandomLink = async (): Promise<LinkMetaData> => {
  const linkMetaData = (await axios.get<LinkMetaData>('/api/getRandomLink')).data;
  if (!linkMetaData.url) {
    const index = Math.floor(Math.random() * storedData.length);
    return storedData[index];
  }
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
