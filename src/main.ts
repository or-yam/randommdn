import axios from 'axios';
import { LinkMetaData } from '../scraper/types';
import storedData from './data.json';
import './style.css';

const getRandomLink = async (): Promise<LinkMetaData> => {
  try {
    const linkMetaData = (await axios.get<LinkMetaData>('/api/getRandomLink')).data;
    return linkMetaData;
  } catch (error) {
    console.log('Data from stored json', error);
    const index = Math.floor(Math.random() * storedData.length);
    return storedData[index];
  }
};

const buttonElement = document.getElementById('btn')! as HTMLButtonElement;
const linkElement = document.getElementById('link')! as HTMLAnchorElement;
const descriptionElement = document.getElementById('description')! as HTMLParagraphElement;
const tagElement = document.getElementById('tag')! as HTMLHeadingElement;

const createRandomLink = async () => {
  const linkContent: LinkMetaData = await getRandomLink();

  linkElement.href = linkContent.url || 'https://developer.mozilla.org';
  linkElement.innerText = linkContent.title || 'MDN Web Docs';
  descriptionElement.innerText =
    linkContent.description ||
    'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.';
  tagElement.innerText = `-${linkContent.tag}-` || '-WEB-';

  linkElement.style.display = 'block';
};

buttonElement.onclick = createRandomLink;
