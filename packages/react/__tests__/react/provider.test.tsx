import React from 'react';
import { ComponentRegistry, StaticCmsClient } from "@headon/core";
import {createRoot, Root} from 'react-dom/client';
import { act } from "react-dom/test-utils";
import { HeadOnContextObject, HeadOnProvider, HeadOnProviderPropsOptions } from '../../src/react/provider';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('HeadOnProvider', ()=>{
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

    it('should establish a context for HeadOn with client and registry - non SSR, and render children', ()=>{
        const cmsClient = new StaticCmsClient({static: {}})
        const options:HeadOnProviderPropsOptions = {
            cmsClient        
        };
        const componentRegistry:ComponentRegistry = {
            component1: {
                componentType: ()=>(<div></div>)                
            }
        }
        const TestComponent = ()=>{
            const ctx = React.useContext(HeadOnContextObject);            
            expect(ctx.cmsClient).toBe(cmsClient); // check that it is the same object
            expect(componentRegistry).toBe(componentRegistry); // check that it is the same object

            return (<div>test-component</div>);
        }
        act(()=>{
            root.render(<HeadOnProvider options={options} componentRegistry={componentRegistry}>
                <TestComponent />
            </HeadOnProvider>);
        });
        expect(container?.querySelector('div')?.innerHTML).toBe('test-component');
    });

    it('should establish a context for HeadOn with client and registry - SSR', ()=>{        
        const options:HeadOnProviderPropsOptions = {
            ssr: true        
        };
        const componentRegistry:ComponentRegistry = {
            component1: {
                componentType: ()=>(<div></div>)                
            }
        }
        const TestComponent = ()=>{
            const ctx = React.useContext(HeadOnContextObject);            
            expect(ctx.cmsClient).toBeUndefined; // check that it is the same object
            expect(componentRegistry).toBe(componentRegistry); // check that it is the same object

            return (<div>test-component</div>);
        }
        act(()=>{
            root.render(<HeadOnProvider options={options} componentRegistry={componentRegistry}>
                <TestComponent />
            </HeadOnProvider>);
        });
        expect(container?.querySelector('div')?.innerHTML).toBe('test-component');

    });

});