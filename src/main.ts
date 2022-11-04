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
const resultsContainer = document.getElementById('results')! as HTMLDivElement;
const loaderElement = document.getElementById('loader')! as HTMLDivElement;

const createRandomLink = async () => {
  resultsContainer.style.display = 'none';
  loaderElement.style.display = 'block';

  const linkContent: LinkMetaData = await getRandomLink();

  linkElement.href = linkContent.url || 'https://developer.mozilla.org';
  linkElement.innerText = linkContent.title || 'MDN Web Docs';
  descriptionElement.innerText =
    linkContent.description ||
    'The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.';
  tagElement.innerText = linkContent.tag ? `-${linkContent.tag}-` : '-WEB-';
  resultsContainer.style.display = 'block';
  loaderElement.style.display = 'none';
};

buttonElement.onclick = createRandomLink;
