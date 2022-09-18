import React from 'react';
import { ComponentRegistry, HeadOnView, StaticCmsClient } from "@headon/core";
import {createRoot, Root} from 'react-dom/client';
import { act } from "react-dom/test-utils";
import { screen } from '@testing-library/react'; 
import {getViewFromCmsName, RenderView} from '../../src/react/render';
import { HeadOnContextObject, HeadOnProvider } from '../../src/react/provider';
import { ErrorBoundary } from './error-boundary';
import { isPropertyAccessExpression } from 'typescript';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;


describe('RenderView', ()=>{
    const componentRegistry:ComponentRegistry = {
        component1: {
            componentType: (props:any)=>(<div className="component-1">{props.text?props.text:'component-1'}</div>)                
        }
    }

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
            act(()=>{
                root.unmount();
            });            
            container.remove();
            container = null;    
        }
    });

    it('should render nothing and outputs console.error if both name and view props are not provided',()=>{            
        act(()=>{
            root.render(<ErrorBoundary><RenderView /></ErrorBoundary>);             
        });                    
        expect(screen.getByTestId('errorboundary').innerHTML).toBe('name or view must be provided');
    });


    it('should render a view if HeadOnView object is provided as a prop', ()=>{
        const view:HeadOnView = {
            items: [
                { 
                    componentType: 'component1',
                    props: {}
                }
            ]
        }
        act(()=>{
            root.render(
                <HeadOnProvider options={{ssr: true}} componentRegistry={componentRegistry}>
                    <RenderView view={view} />
                </HeadOnProvider>            
            );
        });
        expect(container?.querySelector('div[class=component-1]')?.innerHTML).toBe('component-1');
    });

    it('should render a view based on name, using views retrived from cms', async ()=>{
        const cmsClient = new StaticCmsClient({static: {
            '/test': {
                urlSlug: '/test',
                items: [
                    { 
                        componentType: 'component1',
                        props: {}
                    }    
                ]
            }
        }})
        await act(async()=>{
            root.render(
                <HeadOnProvider options={{cmsClient}} componentRegistry={componentRegistry}>
                    <RenderView name={'/test'} />
                </HeadOnProvider>            
            );
        });
        expect(container?.querySelector('div[class=component-1]')?.innerHTML).toBe('component-1');
    });

    it('should render a view based on a name and use content from cmsCache if exists', async ()=>{
        const TestContext = (props: any)=>{
            const ctx = React.useContext(HeadOnContextObject);
            ctx.cmsCache = {
                '/test-cached': {
                    urlSlug: '/test-cached',
                    items: [
                        { 
                            componentType: 'component1',
                            props: {
                                text: 'cached'
                            }
                        }    
                    ]
                }
            }
            return (
                <>
                    {props.children}
                </>
            )
        }
        await act(async()=>{
            root.render(
                <HeadOnProvider options={{ssr: true}} componentRegistry={componentRegistry}>
                    <TestContext>
                        <RenderView name={'/test-cached'} />
                    </TestContext>                    
                </HeadOnProvider>            
            );
        });
        expect(container?.querySelector('div[class=component-1]')?.innerHTML).toBe('cached');
    });

});

describe('getViewFromCmsName', ()=>{
    it('should return HeadOnView from cache if exists', async()=>{
        const actual = await getViewFromCmsName({
            cmsCache: {
                '/test-cached': {
                    urlSlug: '/test-cached',
                    items: [
                        { 
                            componentType: 'component1',
                            props: {
                                text: 'cached'
                            }
                        }    
                    ]
                }
            },
            initialized:true            
        }, '/test-cached');
        expect(actual).toEqual(
            {
                urlSlug: '/test-cached',
                items: [
                    { 
                        componentType: 'component1',
                        props: {
                            text: 'cached'
                        }
                    }    
                ]
            }
        );
    });

    it('should throw an error if CMS client is included in the context', async ()=>{
        expect(async ()=>{
            await getViewFromCmsName({cmsCache:{}, initialized: true},'/test');
        }).rejects.toThrowError('CMS client has not been initialized or configured');
    });
});