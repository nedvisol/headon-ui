<p align="center">
    <h1 align="center">Head-On UI</h1>
</p>

Head-On UI library enables web developer to build light weight web applications that uses a "headless" content management system (CMS) for managing content and UI experience. The web application built with Head-On UI will consume both layouts (UX) and content, via API, from "headless" CMS such as [Contentful](https://www.contentful.com/), [Strapi](https://strapi.io/), or any of their favorite content management systems.

# Get Started
<a name="get-started"></a>
Embed Head-On UI into your React app. (There are examples for Next in the documentation.)

Install Head-On via NPM to an existing React app
```shell
$ npm install @headon/core @headon/react
```

# API Overview

## `HeadOnProvider` 
Head-On UI uses `<HeadOnProvider />` component for initializing context and make Head-On available to the rest of your application.

```js
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {options,componentRegistry} from './HeadOnConfiguration';
import { HeadOnProvider } from '@headon/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <HeadOnProvider options={options} componentRegistry={componentRegistry}>
    <App />
  </HeadOnProvider> 
);
```

## `RenderView`
Render a set of components represented by metadata from the CMS, a "view", using `<RenderView />` component
```js
// App.tsx
import { RenderView } from '@headon/react';
import './App.css';

function App() {
  return (
    <div className="App">      
        <RenderView name={'/home'}/>                 
    </div>
  );
}

export default App;
```


See [more examples here](./examples/)

# Documentations
Proceed to [documentations](./docs/README.md)





