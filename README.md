# Random MDN

<center>
<img alt="logo" src="logo.png" width="100" height="100"/>
</center>

## Web app that generates a random link from the [MDN Web documentation]("https://developer.mozilla.org/en-US/")

## What is MDN

> MDN Web Docs is an open-source, collaborative project documenting Web platform technologies, including CSS, HTML, JavaScript, and Web APIs. We also provide an extensive set of learning resources for beginning developers and students.
>
> MDN's mission is to provide a blueprint for a better internet and empower a new generation of developers and content creators to build it.
>
> [MDN website](https://developer.mozilla.org/en-US/about)

## Tools and design

The app generated using [Vite](https://vitejs.dev/) with [Typescript](https://www.typescriptlang.org/) and uses [Vercel](https://vercel.com/docs/concepts/functions/serverless-functions) serverless functions to fetch and filter MDN sitemap file.

<img alt="system-design" src="design.png" />

- For generating the Json file I used [Playwright](https://playwright.dev/) to scrape MDN's Javascript references page

> The idea of using the sitemap file came from this [random-mdn twitter-bot](https://github.com/random-mdn/random-mdn-bot)

## Running the app

1. Clone the repository
2. run `npm i`

### Without serverless functions

- run `npm run dev`

### With serverless functions (you'll need to signup to Vercel first)

- run `npm run serverless-dev`
