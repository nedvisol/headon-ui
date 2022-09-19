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


# Table of Contents
* [Get Started](#get-started)
* [Overview](#overview)
* [Architecture Concepts](#concepts)
* [Use with Redux](#redux)
* [Integration with Contentful](#contentful)



# Overview
<a name="overview"></a>
The primary objective of Head-On UI is to help web developers create an interactive web application using Open Source frameworks such as React and NextJS, while using "headless" content management system (CMS) for managing the content and the layout of the application. We define headless CMS as a CMS that expose the content via API as JSON (or even XML!), rather than fully-rendered HTML markups. 

Head-On UI does not only inject content (text, labels, etc) into your application, but it also helps you manage the layout as well. The benefit of this is that both the content *and* the layout of your application can be modified on-the-fly without modification to the source code (which leads to rebuild and redeployment.) Non-technical users such as web content manager can manage the content and layout of your React (or NextJS) application as well.

# Architecture Concepts
<a name="concepts"></a>
The concept of Head-On UI is simple: it reads (or requests) metadata from the CMS and take that as an instruction on how to render the component tree.

## CMS Content Types and Content Objects
Compatible headless CMS's will have a concept of Content Types and Content Objects. Content Type is a template you can create content objects from. To use Object-Oriented Programming terms, Content Type is a class where Content Object is an instance of a class. A content objects can have properties and can reference other content objects (parent-child relationship.) The idea is to build a set of content objects in the CMS to represent React components to be rendered. 



