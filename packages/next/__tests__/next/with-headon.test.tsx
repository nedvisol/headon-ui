import React from 'react';
import {HeadOnContextObject} from '@headon/react';
import { act } from "react-dom/test-utils";
import {createRoot, Root} from 'react-dom/client';

import { HeadOnAttributes, withHeadOn } from '../../src/next/with-headon';

describe('withHeadOn', ()=>{
    var container:HTMLDivElement|null;
    var root: Root;
    beforeEach(() => {
        // setup a DOM element as a render target
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container); // createRoot(container!) if you use TypeScript                
    });

    afterEach(() => {
        // cleanup on exiting
        if (container !== null) {            
            //unmountComponentAtNode(container);
            act(()=>{
                root.unmount();
            });            
            container.remove();
            container = null;    
        }
    });

    it('should create a HOC that injects preloaded content into context if provided', ()=>{
        const preloadedViewsMap = {
            '/test': {
                urlSlug: '/test/',
                items: []
            }
        }
        const TestComponent = (props: any)=>{
            const ctx = React.useContext(HeadOnContextObject)
            expect(ctx.cmsCache).toEqual(preloadedViewsMap);
            expect(props.preloadedViewsMap).toBeUndefined();
            return <></>;
        };

        const WrappedTestComponent = withHeadOn(TestComponent);

        const props:HeadOnAttributes = {
            preloadedViewsMap
        };

        act(()=>{
            root.render(
                <WrappedTestComponent {...props}/>
            );
        });
        
    });
});