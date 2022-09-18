import { HeadOnView } from "../model/core";
import { BaseCmsClient } from "./base";

export type StaticCmsClientOptions = {
    static: {
        [name: string]: HeadOnView
    }
}

export class StaticCmsClient extends BaseCmsClient {

    constructor(private options: StaticCmsClientOptions) {
        super();
    } 

    async initialize(): Promise<void> {
        return;
    }
    async getViewByName(name: string): Promise<HeadOnView> {
        return Promise.resolve(this.options.static[name]);
    }
    async getMultipleViews(names: string[]): Promise<{[name: string]: HeadOnView}> {
        const results:any = {};
        names.forEach(name => {
            if (this.options.static[name]) {
                results[name] = this.options.static[name];
            }
        }) 
        return results;
    }
}