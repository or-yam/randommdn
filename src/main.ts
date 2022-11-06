import axios from "axios";
import { LinkMetaData } from "../scraper/types";
import scrapeData from "./data.json";
import { replaceXmlSpecialChars } from "./replaceSpecialChars";
import "./style.css";

const DEFAULT_LINK_DATA: LinkMetaData = {
  url: "https://developer.mozilla.org",
  title: "MDN Web Docs",
  description:
    "The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.",
  tag: "WEB",
};

const buttonElement = document.getElementById("btn")! as HTMLButtonElement;
const linkElement = document.getElementById("link")! as HTMLAnchorElement;
const descriptionElement = document.getElementById("description")! as HTMLParagraphElement;
const tagElement = document.getElementById("tag")! as HTMLHeadingElement;
const resultsContainer = document.getElementById("results")! as HTMLDivElement;
const loaderElement = document.getElementById("loader")! as HTMLDivElement;

const getRandomLink = async (): Promise<LinkMetaData> => {
  try {
    const linkMetaData = (await axios.get<LinkMetaData>("/api/getRandomLink")).data;
    return linkMetaData;
  } catch (error) {
    console.log("Retrieved data from scraped json", error);
    const index = Math.floor(Math.random() * scrapeData.length);
    return scrapeData[index];
  }
};

const setLoadingAnimation = (showLoadingAnimation: boolean) => {
  resultsContainer.style.display = showLoadingAnimation ? "none" : "block";
  loaderElement.style.display = showLoadingAnimation ? "block" : "none";
};

const createRandomLink = async () => {
  setLoadingAnimation(true);
  const { url, title, description, tag }: LinkMetaData = await getRandomLink();
  linkElement.href = replaceXmlSpecialChars(url || DEFAULT_LINK_DATA.url);
  linkElement.innerText = replaceXmlSpecialChars(title || DEFAULT_LINK_DATA.title);
  descriptionElement.innerText = replaceXmlSpecialChars(description || DEFAULT_LINK_DATA.description);
  tagElement.innerText = replaceXmlSpecialChars(`-${tag || DEFAULT_LINK_DATA.tag}-`);
  setLoadingAnimation(false);
};

window.onload = createRandomLink;
buttonElement.onclick = createRandomLink;
