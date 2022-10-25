import data from './data.json';
import './style.css';

const numberOfOptions = data.length;

const appElement = document.getElementById('app')!;

const getRandomLink = () => {
  const prevLink = document.getElementById('link');
  if (prevLink) {
    prevLink.remove();
  }
  const index = Math.floor(Math.random() * numberOfOptions);
  const { href, innerText } = data[index];
  const link = document.createElement('a');
  link.id = 'link';
  link.target = '_blank';
  link.href = href;
  link.innerText = innerText;
  appElement.append(link);
};

const button = document.getElementById('btn')!;
button.onclick = getRandomLink;
