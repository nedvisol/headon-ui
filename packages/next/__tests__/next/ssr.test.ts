import { StaticCmsClient } from '@headon/core';
import {HeadOnGetServerSideProps, initializeServerSideHeadOn} from '../../src/next/ssr';

describe('HeadOnGetServerSideProps', ()=>{
    it('should return a getServerSideProps that throws an error if context is not intialized', async()=>{
        const getServerSideProps = HeadOnGetServerSideProps();
        const ctx = {
            resolvedUrl: ''
        }
        await expect(async()=>{
            await getServerSideProps(ctx as any);
        }).rejects.toThrowError('Server-side HeadOn has not been initialized');
    });

    it('should return a getServerSideProps that throws an error if CMS client has not been configured', async()=>{
        initializeServerSideHeadOn({ });
        const getServerSideProps = HeadOnGetServerSideProps();
        const ctx = {
            resolvedUrl: ''
        }
        await expect(async()=>{
            await getServerSideProps(ctx as any);
        }).rejects.toThrowError('CMS client has not been configured or initialized');
    });

    it('should return a getServerSideProps that retrieve CMS content and returns HeadOnView', async()=>{
        const cmsClient = new StaticCmsClient({static:{}});
        jest.spyOn(cmsClient, 'getMultipleViews').mockImplementation(async ()=>({
            '/test': {
                urlSlug: '/test',
                items: []
            }
        }));
            
        initializeServerSideHeadOn({ 
            cmsClient
        });
        const getServerSideProps = HeadOnGetServerSideProps();
        const ctx = {
            resolvedUrl: '/test'
        }
        const actual = await getServerSideProps(ctx as any);
        expect(actual).toEqual({
            props: {
                view: {
                    urlSlug: '/test',
                    items: []
                },
                preloadedViewsMap: {
                    '/test': {
                        urlSlug: '/test',
                        items: []
                    }
                }
            }
        });
        expect(cmsClient.getMultipleViews).toBeCalledWith(['/test']);
    });

    it('should return notFound if the requested view is not returned by the CMS', async ()=>{
        const cmsClient = new StaticCmsClient({static:{}});
        jest.spyOn(cmsClient, 'getMultipleViews').mockImplementation(async ()=>({
            '/test': {
                urlSlug: '/test',
                items: []
            }
        }));
            
        initializeServerSideHeadOn({ 
            cmsClient
        });
        const getServerSideProps = HeadOnGetServerSideProps();
        const ctx = {
            resolvedUrl: '/notfound'
        }
        const actual = await getServerSideProps(ctx as any);
        expect(actual).toEqual({
            notFound: true
        });
        expect(cmsClient.getMultipleViews).toBeCalledWith(['/notfound']);
    });

    it('should load additional CMS paths if specified', async ()=> {
        const cmsClient = new StaticCmsClient({static:{}});
        jest.spyOn(cmsClient, 'getMultipleViews').mockImplementation(async ()=>({
            '/test': {
                urlSlug: '/test',
                items: []
            }
        }));
            
        initializeServerSideHeadOn({ 
            cmsClient
        });
        const getServerSideProps = HeadOnGetServerSideProps(undefined, ['/additional']);
        const ctx = {
            resolvedUrl: '/test'
        }
        const actual = await getServerSideProps(ctx as any);
        expect(actual).toEqual({
            props: {
                view: {
                    urlSlug: '/test',
                    items: []
                },
                preloadedViewsMap: {
                    '/test': {
                        urlSlug: '/test',
                        items: []
                    }
                }
            }
        });
        expect(cmsClient.getMultipleViews).toBeCalledWith([ '/additional','/test']);
    });

    it('should get additional props if provided a function and include in the result', async ()=>{
        const cmsClient = new StaticCmsClient({static:{}});
        jest.spyOn(cmsClient, 'getMultipleViews').mockImplementation(async ()=>({
            '/test': {
                urlSlug: '/test',
                items: []
            }
        }));

        const customGetServerSideProps = async (ctx: any)=> {
            return {
                props: {
                    additional: 'value'
                }
            }
        };
            
        initializeServerSideHeadOn({ 
            cmsClient
        });
        const getServerSideProps = HeadOnGetServerSideProps(customGetServerSideProps);
        const ctx = {
            resolvedUrl: '/test'
        }
        const actual = await getServerSideProps(ctx as any);
        expect(actual).toEqual({
            props: {
                additional: 'value',
                view: {
                    urlSlug: '/test',
                    items: []
                },
                preloadedViewsMap: {
                    '/test': {
                        urlSlug: '/test',
                        items: []
                    }
                }
            }
        });
        expect(cmsClient.getMultipleViews).toBeCalledWith(['/test']);
    });

});