import {NextPage} from 'next';
import React from 'react';
import { HeadOnView } from '@headon/core'
import { HeadOnContextObject } from '@headon/react';

export type PreloadedViewsMap = {
    [path: string]: HeadOnView | undefined
}

export type HeadOnAttributes = {
    view?: HeadOnView,
    preloadedViewsMap?: PreloadedViewsMap,
    globalContent?: { [key: string]: any }
}

export function withHeadOn<T>(WrappedComponent: NextPage<T>) {    
    return (props: T & HeadOnAttributes) => {
        const ctx = React.useContext(HeadOnContextObject);

        if (props.preloadedViewsMap) {
            ctx.cmsCache = Object.assign(ctx.cmsCache, props.preloadedViewsMap);
        }

        // console.log('new cmscache', ctx.cmsCache);

        const childProps = Object.assign({}, props);
        delete childProps.preloadedViewsMap;
        delete childProps.globalContent;

        return (<WrappedComponent {...childProps} />);
    }
}