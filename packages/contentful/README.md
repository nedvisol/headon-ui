# `@headon/contentful`

Head-On UI library enables web developer to build light weight web applications that uses a "headless" content management system (CMS) for managing content and UI experience. The web application built with Head-On UI will consume both layouts (UX) and content, via API, from "headless" CMS such as [Contentful](https://www.contentful.com/), [Strapi](https://strapi.io/), or any of their favorite content management systems.

This package includes a library for Contentful client adapter.

See more details on [Head-On UI main README.md](https://github.com/nedvisol/headon-ui#readme)

## Usage

```js
const contentfulCmsClient = new ContentfulCmsClient({
    contenful: {
      space: '...',
      accessToken: '...'
    }
});
```
* `space` is Contentful space ID
* `accessToken` is Contentful access token from API key console