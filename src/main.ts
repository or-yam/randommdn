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
    const response = await fetch("/api/getRandomLink");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const linkMetaData: LinkMetaData = await response.json();
    return linkMetaData;
  } catch (error) {
    console.warn("API request failed, falling back to local data:", error);
    const index = Math.floor(Math.random() * scrapeData.length);
    return scrapeData[index];
  }
};

const setLoadingAnimation = (showLoadingAnimation: boolean) => {
  resultsContainer.style.display = showLoadingAnimation ? "none" : "block";
  loaderElement.style.display = showLoadingAnimation ? "block" : "none";
  buttonElement.disabled = showLoadingAnimation;
  buttonElement.setAttribute("aria-busy", showLoadingAnimation.toString());

  if (showLoadingAnimation) {
    buttonElement.textContent = "Loading...";
    buttonElement.setAttribute("aria-label", "Loading random topic");
  } else {
    buttonElement.textContent = "Get Random Topic";
    buttonElement.setAttribute("aria-label", "Get a random MDN documentation topic");
  }
};

const createRandomLink = async () => {
  if (buttonElement.disabled) return;
  setLoadingAnimation(true);
  try {
    const { url, title, description, tag }: LinkMetaData = await getRandomLink();
    linkElement.href = replaceXmlSpecialChars(url || DEFAULT_LINK_DATA.url);
    linkElement.innerText = replaceXmlSpecialChars(title || DEFAULT_LINK_DATA.title);
    linkElement.setAttribute(
      "aria-label",
      `Open MDN documentation: ${replaceXmlSpecialChars(title || DEFAULT_LINK_DATA.title)}`
    );
    descriptionElement.innerText = replaceXmlSpecialChars(description || DEFAULT_LINK_DATA.description);
    tagElement.innerText = replaceXmlSpecialChars(`-${tag || DEFAULT_LINK_DATA.tag}-`);
  } finally {
    setLoadingAnimation(false);
    linkElement.focus();
  }
};

window.onload = () => {
  createRandomLink();
  buttonElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      createRandomLink();
    }
  });
};

buttonElement.onclick = createRandomLink;
