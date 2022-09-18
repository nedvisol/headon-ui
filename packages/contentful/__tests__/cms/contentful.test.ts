jest.mock('contentful');

import {ContentfulCmsClient, ContentfulCmsClientOptions} from '../../src/cms/contentful';
import * as Contentful from 'contentful';
const ActualContentful = jest.requireActual('contentful');

describe('class ContentfulCmsClient', ()=>{
    const options:ContentfulCmsClientOptions = {
        contenful: {
            space: 'foo-space',
            accessToken: 'foo-accessToken'
        }
    };

    describe('#constructor', ()=>{
        it('should create contentful client', ()=>{
            
            const contentfulCmsClient = new ContentfulCmsClient(options);

            expect(Contentful.createClient).toBeCalledWith({
                space: 'foo-space',
                accessToken: 'foo-accessToken'
            });

        });
        it('should throw an exception if either space or accessToken or both are not provided', ()=>{
            expect(()=>{
                const contentfulCmsClient = new ContentfulCmsClient({} as any);
            }).toThrowError('missing space ID or access token');
            expect(()=>{
                const contentfulCmsClient = new ContentfulCmsClient({contentful: {}} as any);
            }).toThrowError('missing space ID or access token');
            expect(()=>{
                const contentfulCmsClient = new ContentfulCmsClient({contentful: { space: 'foo-space'}} as any);
            }).toThrowError('missing space ID or access token');
            expect(()=>{
                const contentfulCmsClient = new ContentfulCmsClient({contentful: { accessToken: 'foo-accessToken'}} as any);
            }).toThrowError('missing space ID or access token');
        });
    });

    describe('#initialize', ()=>{
        it('should return onthing', async () => {
            const contentfulCmsClient = new ContentfulCmsClient(options);
            const actual = await contentfulCmsClient.initialize();
            expect(actual).toBeUndefined();
        });
    });

    describe('#parseForElement', ()=>{
        it('should convert Contentful Entry items array into an array of HeadOnElement', ()=>{
            const contentfulCmsClient = new ContentfulCmsClient(options);
            const cfEntryItems = [
                {
                    sys: {
                        contentType: {
                            sys: {
                                id: 'contenttypeid1'
                            }
                        }
                    },
                    fields: {
                        field1: 'value1',
                        items: [
                            {
                                sys: {
                                    contentType: {
                                        sys: {
                                            id: 'contenttypeid2'
                                        }
                                    }
                                },
                                fields: {
                                    field2: 'value2'                                      
                                }
                            }
                        ]    
                    }
                },
                {
                    sys: {
                        contentType: {
                            sys: {
                                id: 'contenttypeid3'
                            }
                        }
                    },
                    fields: {
                        field3: 'value3' 
                    }
                }
            ];
            const expected = [
                {
                    componentType: 'contenttypeid1',
                    props: {
                        field1: 'value1',
                        items: [
                            {
                                componentType: 'contenttypeid2',
                                props: {
                                    field2: 'value2',
                                    items: null
                                }
                            }
                        ]
                    }
                },
                {
                    componentType: 'contenttypeid3',
                    props: {
                        field3: 'value3',
                        items: null
                    }
                }
            ];
            
            const actual = (contentfulCmsClient as any).parseForElement(cfEntryItems);
            expect(actual).toEqual(expected);
        });
    });

    describe('#parseForView', ()=> {
        it('should parse Contentful Entry and create a HeadOnView', ()=>{
            const cfEntry = {
                fields: {
                    urlSlug: 'urlslug1',
                    items: [
                        {
                            sys: {
                                contentType: {
                                    sys: {
                                        id: 'contenttypeid1'
                                    }
                                }
                            },
                            fields: {
                                field1: 'value1' 
                            }
                        }
                    ]
                }
            };
            const expected = {
                urlSlug: 'urlslug1',
                items: [
                    {
                        componentType: 'contenttypeid1',
                        props: {
                            field1: 'value1',
                            items: null
                        }
                    }
                ]
            }
            const contentfulCmsClient = new ContentfulCmsClient(options);
            const actual = (contentfulCmsClient as any).parseForView(cfEntry);
            expect(actual).toEqual(expected);            
        });
    });

    describe('#getViewByName', ()=> {
        const mockGetEntries = jest.fn(async ()=>(Promise.resolve({
            items: [
                {
                    fields: {
                        urlSlug: '/urlslug1',
                        items: [
                            {
                                sys: {
                                    contentType: {
                                        sys: {
                                            id: 'contenttypeid1'
                                        }
                                    }
                                },
                                fields: {
                                    field1: 'value1' 
                                }
                            }
                        ]
                    }
                }
            ]
        })));

        beforeEach(()=>{
            (Contentful.createClient as jest.Mock<any, any>).mockImplementation(()=>{
                return {
                    getEntries: mockGetEntries
                }
            });
            mockGetEntries.mockClear();
        });

        it('should return HeadOnView based on Contentful contentobject matching "name" parameter', async ()=>{
            const contentfulCmsClient = new ContentfulCmsClient(options);
            const actual = await contentfulCmsClient.getViewByName('/urlslug1');
            const expected = {
                urlSlug: '/urlslug1',
                items: [
                    {
                        componentType: 'contenttypeid1',
                        props: {
                            field1: 'value1',
                            items: null
                        }
                    }
                ]
            };
            expect(actual).toEqual(expected);        
            
            expect(mockGetEntries).toBeCalledWith({
                content_type: 'view',
                'fields.urlSlug[in]': '/urlslug1',
                include: 10
            });
        });

        it('should return undefined if no content object matching provided "name" parameter', async ()=> {
            const contentfulCmsClient = new ContentfulCmsClient(options);
            const actual = await contentfulCmsClient.getViewByName('/notexisting');    
            expect(actual).toBeUndefined();
            
        });
    });

    describe('#getMultipleViews', ()=> {
        const mockGetEntries = jest.fn(async ()=>(Promise.resolve({
            items: [
                {
                    fields: {
                        urlSlug: '/urlslug1',
                        items: [
                            {
                                sys: {
                                    contentType: {
                                        sys: {
                                            id: 'contenttypeid1'
                                        }
                                    }
                                },
                                fields: {
                                    field1: 'value1' 
                                }
                            }
                        ]
                    }
                },
                {
                    fields: {
                        urlSlug: '/urlslug2',
                        items: [
                            {
                                sys: {
                                    contentType: {
                                        sys: {
                                            id: 'contenttypeid2'
                                        }
                                    }
                                },
                                fields: {
                                    field2: 'value2' 
                                }
                            }
                        ]
                    }
                }                
            ]
        })));
        beforeEach(()=>{
            (Contentful.createClient as jest.Mock<any, any>).mockImplementation(()=>{
                return {
                    getEntries: mockGetEntries
                }
            });
        });
        it('should return a map of name-to-HeadOnView based on content objects in Contentful, non-existing paths will be ignored', async ()=> {
            const contentfulCmsClient = new ContentfulCmsClient(options);
            const actual = await contentfulCmsClient.getMultipleViews(['/urlslug1','/urlslug2','/urlslug3'])

            const expected = {
                '/urlslug1': {
                    urlSlug: '/urlslug1',
                    items: [
                        {
                            componentType: 'contenttypeid1',
                            props: {
                                field1: 'value1',
                                items: null
                            }
                        }
                    ]
                },
                '/urlslug2': {
                    urlSlug: '/urlslug2',
                    items: [
                        {
                            componentType: 'contenttypeid2',
                            props: {
                                field2: 'value2',
                                items: null
                            }
                        }
                    ]
                },                
            };
            
            
            ;
            expect(actual).toEqual(expected);            
            
            expect(mockGetEntries).toBeCalledWith({
                content_type: 'view',
                'fields.urlSlug[in]': '/urlslug1,/urlslug2,/urlslug3',
                include: 10
            });
        });
    });
});