import { BaseCmsClient, ComponentRegistry, HeadOnElement, HeadOnView, StaticCmsClient } from "@headon/core";
import { HeadOnProviderPropsOptions } from "@headon/react";
import { prependListener } from "process";
import { componentFlexBox } from "./component/componentFlexBox";
import { componentTitleParagraph } from "./component/componentTitleParagraph";

import Strapi, {StrapiOptions} from "strapi-sdk-js";

// export const componentRegistry:ComponentRegistry = {
//     componentFlexBox: {
//       componentType: componentFlexBox
//     },
//     componentTitleParagraph: {
//       componentType: componentTitleParagraph
//     }
//   };
  
  // const contentfulCmsClient = new ContentfulCmsClient({
  //   contenful: {
  //     space: 's4d39om6y5tz',
  //     accessToken: 'xgHbnagV0M76Us27v2YjVjyQPhKGLh5jqakZCIoaeZY'
  //   }
  // });
  

  export const componentRegistry:ComponentRegistry = {
    'layout.component-flex-box': {
      componentType: componentFlexBox
    },
    'components.component-title-paragraph': {
      componentType: componentTitleParagraph
    }
  };
  

  export type StrapiCmsClientOptions = {
    strapi: StrapiOptions
  }

  type StrapiView = {
    attributes: {
      urlSlug: string
      items: StrapiComponent[]  
    }
  }

  type StrapiComponent = {
    [propName: string]: any,
    id: number,
    __component: string
  }

  class StrapiCmsClient extends BaseCmsClient {

    private strapiClient;

    constructor(private options: StrapiCmsClientOptions) {
      super();
      this.strapiClient = new Strapi(this.options.strapi);
    }

    initialize(): Promise<void> {
      return Promise.resolve();
    }

    private parseForComponentItems(items: StrapiComponent[]): HeadOnElement[] {
      return items.map(item => {

        const componentType = item.__component;
        const props:any = item;
        delete props.id;
        delete props.__component;
        return {
          componentType,
          props
        };
      })
    }

    private parseForView(view: StrapiView):HeadOnView {
      return {
        urlSlug: view.attributes.urlSlug,
        items: this.parseForComponentItems(view.attributes.items)
      }
    }

    async getViewByName(name: string): Promise<HeadOnView> {
      return (await this.getMultipleViews([name]))[name];
    }
    async getMultipleViews(names: string[]): Promise<{ [name: string]: HeadOnView; }> {
      const cmsData = await this.strapiClient.find<StrapiView[]>('views',{
        filters: {
          $or: names.map(name => ({ urlSlug: { $eq: name } }))
        },
        populate: ['*', 'items.*']
      })
      console.log('cmsdata',cmsData);
      const results:{[name: string]: HeadOnView} = {};
      cmsData.data.forEach(cmsEntry => {
          results[cmsEntry.attributes.urlSlug] = this.parseForView(cmsEntry);
      })
       
      console.log('results',results);
      return results;
    }
    
  }

  const strapiOptions:StrapiCmsClientOptions = {
    strapi: {
      url: 'http://localhost:1337'
    }
  }

  const cmsClient = new StrapiCmsClient(strapiOptions);

  
  
 export const options:HeadOnProviderPropsOptions = {
    cmsClient,
}