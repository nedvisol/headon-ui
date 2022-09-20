# Table of Contents
* [`HeadOnProvider`](#headonprovider)
* [`RenderView`](#renderview)
* [Component Registry](#componentregistry)

# `HeadOnProvider`
<a name="headonprovider"></a>

## Overview

The `<HeadOnProvider />` component initializes necessary components and make Head-On context available to components in your component tree

In most use-cases, this provider will be put at the top-level, so that any components in your application has access to the Head-On context.

## Props

```js
interface HeadOnProviderProps {
    options: HeadOnProviderPropsOptions,
    componentRegistry: ComponentRegistry,
    children: ReactNode
}
```
`options` - options and parameters for instantiating the Head-On context. Currently it takes two parameters:
* (Optional) `cmsClient` - an instance of a CMS client to be used for retrieving content data. Required for client-side rendering. If `ssr` is set to true, HeadOnProvider will not use `cmsClient`.
* (Optional) `ssr` - if set to `true`, it will not attempt to retrieve CMS content during rendering and will rely on CMS content being injected using SSR module. (see NextJS usage). Default is `false` (client-side rendering).

`componentRegistry` - a mapping between CMS content type and a React component. The CMS content type must match what CMS returns in the their API response. See specific Head-On CMS Client library information for more details. See [*Component Registry*](#componentregistry) section.

`children` - this is the top-level component of your application.

## Examples

### React Client-side rendering

Since Head-On CMS renders your components, if you use Redux or if you have any providers that your components (those are rendered by Head-On) require, they should be put *outside* of `<HeadOnProvider />`

```js
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HeadOnProvider } from '@headon/react';
import { componentTitleParagraph } from './component/componentTitleParagraph';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const cmsClient = new ContentfulCmsClient({
contenful: {
    space: '...',
    accessToken: '....'
}
});

export const componentRegistry:ComponentRegistry = {
    componentTitleParagraph: {
      componentType: componentTitleParagraph
    }
};

root.render(
  <HeadOnProvider options={{cmsClient}} componentRegistry={componentRegistry}>
    <App />
  </HeadOnProvider> 
);
```

### NextJS server-side rendering
```js
// pages/_app.tsx
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app';
import { componentTitleParagraph } from '../src/component/componentTitleParagraph';
import { HeadOnProvider, HeadOnProviderPropsOptions,  } from '@headon/react';
import { ComponentRegistry } from '@headon/core';
import { ContentfulCmsClient } from '@headon/contentful'
import {initializeServerSideHeadOn} from '@headon/next';

const componentRegistry:ComponentRegistry = {
  componentTitleParagraph: {
    componentType: componentTitleParagraph
  }
};



const cmsClient = new ContentfulCmsClient({
  contenful: {
    space: '...',
    accessToken: '...'
  }
});

const options:HeadOnProviderPropsOptions = {
  cmsClient
};

initializeServerSideHeadOn(options);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HeadOnProvider options={{ssr: true}} componentRegistry={componentRegistry}>
      <Component {...pageProps} />
    </HeadOnProvider>
  )
} 

export default MyApp
```


# `RenderView`
<a name="renderview"></a>

## Overview
This component is responsible for rendering the React component tree for a specific view name, or specific `HeadOnView` objects provided in the props. 

## Props

```js
export interface IRenderProps {
    name?: string,
    view?: HeadOnView
}
```
Either `name` or `view` has to be provided, but not both.
* (Optional) `name` - the name of the View stored in the headless CMS. The CMS client will query the CMS using provided `name` and render the components accordingly.
* (Optional) `view` - an object of `HeadOnView` type. Typically this is injected by the Head-On framework into the parent component. See [*Component Registry*](#componentregistry) section.

This component does not require (or support) any nested child elements.

## Examples

```js
import { RenderView } from '@headon/react';

function App() {
  return (
    <div className="App">      
        <RenderView name={'/home'}/>                  
    </div>
  );
}

export default App;
```

The most common way of using this component is to pass the "path" of the screen as a view name (using frameworks such as React router). However, it is not limited to this use-case. `<RenderView />` can be used anywhere in the application and accepts any View names as long as they exist in the CMS.

# Component Registry
<a name="componentregistry"></a>
Any components can be put in the Component Registry and will be rendered by Head-On CMS. We use mostly Function Components in the examples, regular Class Components will work as well.

The Component Registry is based on this interface:
```js
type ReactComponent = React.ComponentClass<any, any> | React.FC<any>;

interface ComponentRegistryEntry {
    componentType: ReactComponent
}


interface ComponentRegistry {
    [name: string]: ComponentRegistryEntry;
}
```

## Basic Example
```js
interface componentTitleParagraphProps {
    title: string,
    paragraph: string,    
}
const componentTitleParagraph(props):React.FC<componentTitleParagraphProps> = () => {
    const {title, paragraph} = props;
    return (
        <div>
            <h1>{title}</h1>
            <p>{paragraph}</p>
        </div>
    )
}

const componentRegistry:ComponentRegistry = {
  componentTitleParagraph: {
    componentType: componentTitleParagraph
  }
}; 
```
In the example above, `title` and `paragraph` properties will be injected in by Head-On CMS using the content data from the headless CMS. 

## `items` property attribute

When the content object in the CMS has nested objects, typically a list of objects (or a reference to a list of other objects). They will be injected into the React component as `items` prop of type `HeadOnView[]`.

The `items` prop should be used by nesting `<RenderView />` component inside your component and passing items as Views to be rendered.

For example:
```js
import { RenderView } from '@headon/react';
import {HeadOnElement} from '@headon/core';

interface componentFlexBoxProps {
    direction: string,
    items: HeadOnElement[],
}

export function componentFlexBox(props: componentFlexBoxProps) {
    const {direction, items} = props;
    return (
        <div style={{flexDirection: direction as 'row'|'column'}}>
            <RenderView view={{items}} />
        </div>
    )
}
```


## Availability of `children` property attribute
Since the component in Component Registry will be rendered on the fly, there will not be any child elements inside the component, and therefore, `children` prop will never have a value.
