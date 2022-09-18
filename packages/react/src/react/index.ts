export * from './render';
export * from './provider';

export interface ComponentRegistry {
    [name: string]: ComponentRegistryEntry,   
}

export type ReactComponent = React.ComponentClass<any, any> | React.FC<any>;

export interface ComponentRegistryEntry {
    componentType: ReactComponent
}
