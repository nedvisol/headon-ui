import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app';
import { componentFlexBox } from '../src/component/componentFlexBox';
import { componentTitleParagraph } from '../src/component/componentTitleParagraph';
import { HeadOnProvider, HeadOnProviderPropsOptions,  } from '@headon/react';
import { ComponentRegistry, StaticCmsClient } from '@headon/core';
//import { ContentfulCmsClient } from '@headon/contentful'
import {initializeServerSideHeadOn} from '@headon/next';
import { STATIC_CONTENT } from '../src/component/static-content';



const componentRegistry:ComponentRegistry = {
  componentFlexBox: {
    componentType: componentFlexBox
  },
  componentTitleParagraph: {
    componentType: componentTitleParagraph
  }
};


const cmsClient = new StaticCmsClient({static: STATIC_CONTENT});

// In the real world, you would use integrated CMS client like the below
// const cmsClient = new ContentfulCmsClient({
//   contenful: {
//     space: '...',
//     accessToken: '...'
//   }
// });

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
