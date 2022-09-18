import React from 'react';
import { HeadOnContext, HeadOnView, ReactComponent } from '@headon/core';
import { HeadOnContextObject } from './provider';

export async function getViewFromCmsName(ctx: HeadOnContext, name: string): Promise<HeadOnView | undefined> {
    //check cache
    if (ctx.cmsCache[name]) {
        return ctx.cmsCache[name]
    }
    if (!ctx.cmsClient) {
        throw new Error('CMS client has not been initialized or configured');
    }
    const data:HeadOnView | undefined = await ctx.cmsClient?.getViewByName(name);
    if (data) {
        ctx.cmsCache[name] = data;
    }
    return data;
}

export interface IRenderProps {
    name?: string,
    view?: HeadOnView
}


export function RenderView(props: IRenderProps) {        
    var {name, view} = props;
    if (!name && !view) {
        throw new Error('name or view must be provided');               
    }
    const ctx = React.useContext(HeadOnContextObject);
    const {componentRegistry, cmsCache} = ctx;    
    var defaultView:HeadOnView|undefined = undefined;
    if (view) {
        defaultView = view;
    } else if (name && cmsCache[name]) {
        defaultView = cmsCache[name];
    }

    const [renderView, setRenderView] = React.useState<HeadOnView | undefined>(defaultView);

    React.useEffect(()=>{
        if (name && !renderView) {
            getViewFromCmsName(ctx, name).then(v => setRenderView(v));
        }    
    });

    return (
        <>
        {
            componentRegistry && renderView && renderView.items 
                &&  renderView.items.map( (item, idx) => {                
                const component:ReactComponent = componentRegistry[item.componentType].componentType;
                const componentProps:any = item.props;
                return React.createElement(component, {...componentProps, key: idx});
            })
        }
        </>
    )
}