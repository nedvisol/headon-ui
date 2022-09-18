import { CmsClient, HeadOnView } from "../model";

export abstract class BaseCmsClient implements CmsClient {        
    abstract initialize(): Promise<void>;
    abstract getViewByName(name: string): Promise<HeadOnView>;
    abstract getMultipleViews(names: string[]): Promise<{[name: string]: HeadOnView}>;
}