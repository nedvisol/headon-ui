export interface HeadOnView {
    urlSlug?: string,
    items: HeadOnElement[]
}

export interface HeadOnElement {
    componentType: string,
    props: any,    
}



export interface ComponentRegistry {
    [name: string]: ComponentRegistryEntry,   
}

export type ReactComponent = React.ComponentClass<any, any> | React.FC<any>;

export interface ComponentRegistryEntry {
    componentType: ReactComponent
}
interface HeadOnCache {
    [path:string]: HeadOnView
}
export interface HeadOnContext {
    initialized: boolean,
    cmsClient?: CmsClient,
    componentRegistry?: ComponentRegistry,
    cmsCache: HeadOnCache,       
}

export interface CmsClient {
    initialize(): Promise<void>;
    getViewByName(name: string): Promise<HeadOnView>;
    getMultipleViews(names: string[]): Promise<{[name: string]: HeadOnView}>;
}