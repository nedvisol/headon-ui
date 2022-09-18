import {StaticCmsClient} from '../../src/cms/static';
import { HeadOnView } from '../../src/model';

describe('class StaticCmsClient', ()=>{
    describe('#initialize', ()=>{
        it('should return void', async ()=>{
            const staticCmsClient = new StaticCmsClient({static:{}});
            const actual = await staticCmsClient.initialize();
            expect(actual).toBeUndefined();            
        });
    });
    describe('#getViewByName', ()=>{
        it('should return HeadOnView object matching the provided name', async ()=>{
            const expected:{[name: string]: HeadOnView} = {
                foo1: {
                    items:[
                        { componentType: 'bar1', props: {} }
                    ]
                },
                foo2: {
                    items:[
                        { componentType: 'bar2', props: {} }
                    ]
                }
            };
            const staticCmsClient = new StaticCmsClient({static: expected});
            const actual = await staticCmsClient.getViewByName('foo1');
            expect(actual).toEqual(expected['foo1']);        
        });
    });
    describe('#getMultipleViews', ()=>{
        it('should return HeadOnView object map belonging to the provided names', async ()=>{
            const staticCotent:{[name: string]: HeadOnView} = {
                foo1: {
                    items:[
                        { componentType: 'bar1', props: {} }
                    ]
                },
                foo2: {
                    items:[
                        { componentType: 'bar2', props: {} }
                    ]
                },
                foo3: {
                    items:[
                        { componentType: 'bar3', props: {} }
                    ]
                }
            };
            const staticCmsClient = new StaticCmsClient({static:staticCotent});
            const actual = await staticCmsClient.getMultipleViews(['foo1','foo3']);
            expect(actual).toEqual({
                foo1: {
                    items:[
                        { componentType: 'bar1', props: {} }
                    ]
                },
                foo3: {
                    items:[
                        { componentType: 'bar3', props: {} }
                    ]
                }
            });
        });
    });
});