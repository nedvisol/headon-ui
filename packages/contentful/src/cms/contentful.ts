import * as Contentful from 'contentful';
import { HeadOnElement, HeadOnView, BaseCmsClient } from '@headon/core';

export type ContentfulCmsClientOptions = {
    contenful: {
        space: string;
        accessToken: string;
    };
}

interface ICfView {
    urlSlug: string,
    items: Contentful.Entry<any>[]
}

export class ContentfulCmsClient extends BaseCmsClient {

    private contentfulClient:Contentful.ContentfulClientApi;
    private initialized: boolean = false;

    constructor(options: ContentfulCmsClientOptions) {
        super();
        if (!options.contenful || !options.contenful.space || !options.contenful.accessToken) {
            throw Error('missing space ID or access token');
        }
        const {space, accessToken} = options.contenful;
        this.contentfulClient = Contentful.createClient({space, accessToken})        
    }    

    async initialize(): Promise<void> {
        return;
    }

    private parseForElement(cfEntryItems: Contentful.Entry<any>[]): HeadOnElement[] {

        return cfEntryItems.map<HeadOnElement>(cfEntryItem => ({
            componentType: cfEntryItem.sys.contentType.sys.id,
            props: { 
                ...cfEntryItem.fields,   
                items: cfEntryItem.fields.items?this.parseForElement(cfEntryItem.fields.items):null
            }                                             
        }));
    }


    private parseForView(cfEntry: Contentful.Entry<ICfView>):HeadOnView {
        const {fields} = cfEntry;
        const view:HeadOnView = {
            urlSlug: fields.urlSlug,
            items: this.parseForElement(fields.items)
        };
        return view;
    }

    async getViewByName(name: string): Promise<HeadOnView> {
        const results = await this.getMultipleViews([name]);

        return results[name];
    }

    async getMultipleViews(names: string[]): Promise<{[name: string]: HeadOnView}> {
        if (!this.initialized) {
            await this.initialize();
            this.initialized = true;
        }

        const cmsEntries = await this.contentfulClient.getEntries<ICfView>({
            content_type: 'view',
            'fields.urlSlug[in]': names.join(','),
            include: 10
        });

        const results:{[name: string]: HeadOnView} = {};
        cmsEntries.items.forEach(cmsEntry => {
            results[cmsEntry.fields.urlSlug] = this.parseForView(cmsEntry);
        })

        return results;
    }
}