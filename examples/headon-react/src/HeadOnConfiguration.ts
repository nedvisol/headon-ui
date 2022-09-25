import { componentFlexBox } from './component/componentFlexBox';
import { componentTitleParagraph } from './component/componentTitleParagraph';
import {  ComponentRegistry } from '@headon/react';
import { StaticCmsClient } from '@headon/core';
import { componentCounterControls } from './component/componentCounterControls';
import { componentCounterDisplay } from './component/componentCounterDisplay';

export const componentRegistry:ComponentRegistry = {
    componentFlexBox: {
      componentType: componentFlexBox
    },
    componentTitleParagraph: {
      componentType: componentTitleParagraph
    },
    componentCounterControls: {
      componentType: componentCounterControls
    },
    componentCounterDisplay: {
      componentType: componentCounterDisplay
    }
  };
  
  // const contentfulCmsClient = new ContentfulCmsClient({
  //   contenful: {
  //     space: '...',
  //     accessToken: '...'
  //   }
  // });
  
  export const cmsClient = new StaticCmsClient({static: {
    'custom': {
      urlSlug: 'custom',
      items: [
        {
          componentType: 'componentTitleParagraph',
          props: {
            title: 'From route name',
            paragraph: 'Lorem ipsum'
          }
        }
      ]
    },
    '/home': {
      urlSlug: '/home',
      items: [
        {
          componentType: 'componentTitleParagraph',
          props: {
            title: 'Example title',
            paragraph: 'Lorem ipsum'
          }
        },
        {
          componentType: 'componentFlexBox',        
          props: {          
            direction: 'row',
            cssClass: 'home3col',
            items:[
              {
                componentType: 'componentTitleParagraph',
                props: {
                  title: 'Example title TWO',
                  paragraph: 'Lorem ipsum'
                }
              },
              {
                componentType: 'componentTitleParagraph',
                props: {
                  title: 'Example title THREE',
                  paragraph: 'Lorem ipsum'
                }
              },
            ]
          }
        },
        {
          componentType: 'componentCounterControls',
          props: {
          }
        },
        {
          componentType: 'componentCounterDisplay',
          props: {
          }
        },

      ]
    }
  }});