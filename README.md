# vue-index-styler

#### Vue.js 2.X component styling text by index.

Demo: https://shinichirotakano.github.io/vue-index-styler/

### Install

```bash
npm install vue-js-modal --save
```
or
```bash
yarn add vue-js-modal --save
```

### How to use

```javascript
import IndexStyler from 'vue-index-styler'

Vue.use(IndexStyler)
```

### Example use
```vue
<IndexStyler
  rawText="abcdefghijklmnopqrstuvwxyz"
  :indexObjects="[
    {
      startIndex: 1,
      endIndex: 3,
      style: {
        color: 'white',
        backgroundColor: 'red',
        padding: '3px 5px',
        borderRadius: '4px'
      }
    },
    {
      startIndex: 7,
      endIndex: 14,
      style: {
        backgroundColor: 'pink',
        fontSize: '15px'
      }
    }
  ]"
/>
```

#### Props

| Name      | Required | Type          | Default     | Description   |
| ---       | ---      | ---           | ---         | ---           |
| rawText | true | String | | styled text |
| indexObjects | true | Array | | [indexObject, indexObject, ・・・・]　* IndexObject detail is below. |
| textContainerId | false | String | 'styled-text-container' | id of div involving styled text. |
| defaultStyle | false | Object | | All indexeObjects are applied. Format is same as indexObject.style. |
| defaultHtmlAttributes | false | Object | | All indexeObjects are applied. Format is same as indexObject.htmlAttributes. |
| isFirstChar0 | false | Boolean | true | which to count rawText from 0 or 1. |
| isSlicedInvolvingEndIndex | false | Boolean | true | which to involve indexObject.endIndex or not. |
| isIndexObjectsWatched | false | Boolean | false | which to watch indexObjects change or not. |

#### IndexObject
| Property      | Required | Type          | Default     | Example Value   |
| ---       | ---      | ---           | ---         | ---           |
| startIndex | true | Number | | 1 |
| endIndex | true | Number | | 3 |
| style | false | Object | | { color: 'red', backgroundColor: 'yellow', fontSize: '12px' } |
| htmlAttributes | false | Object | | { id: '~~~', class: '~~~~' } |
