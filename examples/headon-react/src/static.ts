export const STATIC_CONTENT = {static: {
    '/home': {
      urlSlug: '/home',
      items: [
        {
          componentType: 'componentTitleParagraph',
          props: {
            title: 'Example title',
            paragraph: 'Lorem ipsum'
          }
        },
        {
          componentType: 'componentFlexBox',        
          props: {          
            direction: 'row',
            cssClass: 'home3col',
            items:[
              {
                componentType: 'componentTitleParagraph',
                props: {
                  title: 'Example title TWO',
                  paragraph: 'Lorem ipsum'
                }
              },
              {
                componentType: 'componentTitleParagraph',
                props: {
                  title: 'Example title THREE',
                  paragraph: 'Lorem ipsum'
                }
              },
            ]
          }
        }
      ]
    }
  }};