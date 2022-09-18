import { componentFlexBox } from './component/componentFlexBox';
import { componentTitleParagraph } from './component/componentTitleParagraph';
import { HeadOnProvider, ComponentRegistry, HeadOnProviderPropsOptions, RenderView } from '@headon/react';
import './App.css';
import { StaticCmsClient } from '@headon/core';


const componentRegistry:ComponentRegistry = {
  componentFlexBox: {
    componentType: componentFlexBox
  },
  componentTitleParagraph: {
    componentType: componentTitleParagraph
  }
};

// const contentfulCmsClient = new ContentfulCmsClient({
//   contenful: {
//     space: 's4d39om6y5tz',
//     accessToken: 'xgHbnagV0M76Us27v2YjVjyQPhKGLh5jqakZCIoaeZY'
//   }
// });

const cmsClient = new StaticCmsClient({static: {
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
      }
    ]
  }
}});


const options:HeadOnProviderPropsOptions = {
  cmsClient,
}

function App() {
  return (
    <div className="App">
      <HeadOnProvider options={options} componentRegistry={componentRegistry}>
        <RenderView name={'/home'}/>      
      </HeadOnProvider>
      
    </div>
  );
}

export default App;
