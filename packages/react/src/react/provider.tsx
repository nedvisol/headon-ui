import React from 'react';
import { CmsClient, ComponentRegistry, HeadOnContext } from '@headon/core';

export const HeadOnContextObject = React.createContext<HeadOnContext>({initialized: false, cmsCache: {}});



export interface HeadOnProviderPropsOptions {
    cmsClient?: CmsClient,    
    ssr?: boolean,
}

export interface HeadOnProviderProps {
    options: HeadOnProviderPropsOptions,
    componentRegistry: ComponentRegistry,
    children: React.ReactElement | React.ReactElement[]
}

export function HeadOnProvider(props: HeadOnProviderProps) {    
    const {children, componentRegistry, options} = props;
    const ctx = React.useContext(HeadOnContextObject);
    ctx.cmsClient = options.ssr?undefined:options.cmsClient; // only initialize client instance if NOT SSR
    ctx.componentRegistry = componentRegistry;
    
    return (
        <>
         { children }
        </>
    )
}