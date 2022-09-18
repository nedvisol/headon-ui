import { HeadOnContext } from "@headon/core";
import { HeadOnProviderPropsOptions } from "@headon/react";
import {GetServerSideProps} from 'next';
import { HeadOnAttributes, PreloadedViewsMap } from "./with-headon";

var headOnServerSideContext:HeadOnContext;

export function initializeServerSideHeadOn(options: HeadOnProviderPropsOptions) {
    headOnServerSideContext = {
        cmsClient: options.cmsClient,
        cmsCache: {},
        initialized: true        
    };
}


export function HeadOnGetServerSideProps<T>(pageGetServerSideProps?:GetServerSideProps, preloadCmsPaths?: string[]) {
    const getServerSideProps: GetServerSideProps<HeadOnAttributes> = async (ctx) => {        
        const path = ctx.resolvedUrl;
        if (!headOnServerSideContext) {
            throw new Error('Server-side HeadOn has not been initialized');
        }     
        if (!headOnServerSideContext.cmsClient) {
            throw Error(`CMS client has not been configured or initialized`);
        }

        const cmsPaths = [...(preloadCmsPaths?preloadCmsPaths:[]), path];    
        const preloadedViewsMap = await headOnServerSideContext.cmsClient.getMultipleViews(cmsPaths);


        const view = preloadedViewsMap[path];
        if (!view) {
            // throw Error('no cms data from path');
            return {
                notFound: true
            }
        }        
        const pageProps = pageGetServerSideProps?await pageGetServerSideProps(ctx):{props: {}};
        return {
            props: {
                ...(pageProps as any).props,
                view,
                preloadedViewsMap,
            }
        };        
    }
    return getServerSideProps;
}