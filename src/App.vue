<template>
  <div id="app">
    <div id="styled-text-area">
      <div id="title-str">Index Styled Text</div>
      <IndexStyler 
        :indexObjects="indexObjects"
        :rawText="TestText"
        :defaultStyle="defaultStyle"
        :defaultHtmlAttributes="defaultStyle"
        :isFirstChar0="isFirstChar0"
        :isSlicedInvolvingEndIndex="isSlicedInvolvingEndIndex"
        :isIndexObjectsWatched="isIndexObjectsWatched"
        :textContainerId="textContainerId" />
    </div>
    <div class="json-area">
      <div class="current-index-objects-area">
        <div id="title-str">indexObjects Prop Example</div>
        indexObjects: [<span v-for="(indexObject, i) in indexObjects" :key="i" >
            {
                startIndex: <input class="index-input" type="number" v-model.number="indexObject.startIndex">,
                endIndex: <input class="index-input" type="number" v-model.number="indexObject.endIndex">,
                style: {
                  <template v-if="indexObject.style">
                  <span v-for="(property, j) in Object.keys(indexObject.style)" :key="j" class="style-row">{{ property }}: <input class="style-input" v-model.lazy="indexObject.style[property]">, <button @click="deleteStyle(property, i)">Delete</button><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </template>
                  <input class="style-input" v-model="addedStyles[i].property">: <input class="style-input" v-model="addedStyles[i].value"><button @click="addStyle(i)" class="style-add-btn">Add</button>
                }
            }<span v-if="i !== indexObjects.length - 1">,</span><button @click="removeIndexObject(i)">Remove</button></span>
        ]
        <div class="added-index-object-area">
          <div id="title-str"> Added indexObject Prop </div>
          {
              startIndex: <input class="index-input" type="number" v-model.number="pushedIndexObject.startIndex">,
              endIndex: <input class="index-input" type="number" v-model.number="pushedIndexObject.endIndex">,
              style: {
                  <input class="style-input" v-model="pushedStyleProperty">: <input class="style-input" v-model="pushedStyleValue">
              }
          }
          <button @click="changeIndexObjects" :disabled="isPushDisabled">Push</button>
        </div>
      </div>
      <div class="other-props-area">
        <div id="title-str"> Other Props Example</div>
          <p>defaultStyle: {{ defaultStyle }},</p>
          <p>defaultHtmlAttributes: {{ defaultStyle }},</p>
          <p>isFirstChar0: {{ isFirstChar0 }},</p>
          <p>isSlicedInvolvingEndIndex: {{ isSlicedInvolvingEndIndex }},</p>
          <p>isIndexObjectsWatched: {{ isIndexObjectsWatched }},</p>
          <p>textContainerId: '{{ textContainerId }}'</p>
      </div>
    </div>
  </div>
</template>

<script>
import IndexStyler from './components/IndexStyler.vue'
import TestText from './TestText.js'
import TestIndexObjects from './TestIndexObjects.js'

export default {
  name: 'app',
  components: {
    IndexStyler
  },
  data() {
    return {
      indexObjects: [],
      pushedIndexObject: {
        startIndex: null,
        endIndex: null,
        style: null
      },
      pushedStyleProperty: null,
      pushedStyleValue: null,
      addedStyles: [],
      defaultStyle: { color: 'pink' },
      defaultHtmlAttributes: { class: 'index-styled-text' },
      isFirstChar0: true,
      isSlicedInvolvingEndIndex: true,
      isIndexObjectsWatched: true,
      textContainerId: "text-container-custom-id"
    }
  },
  created() {
    this.indexObjects = TestIndexObjects
    for (let i = 0; i < this.indexObjects.length; i++) {
      this.addedStyles.push({ property: null, value: null })
    }
  },
  computed: {
    TestText() {
      return TestText
    },
    isPushDisabled() {
      return this.pushedIndexObject.startIndex === null ||
             this.pushedIndexObject.endIndex === null
    }
  },
  methods: {
    createTestIndexObjects() {
      // return TestIndexObjects
      const sampleIndexObjects = []
      for (let i = 0; i < 2; i++) {
        let startIndex = Math.floor( Math.random() * TestText.length );
        let endIndex =  Math.floor( Math.random() * TestText.length );
        if (startIndex > endIndex ) {
          [startIndex, endIndex] = [endIndex, startIndex]
        }
        const color = ['red', 'yellow', 'brown', 'blue', 'skyblue', 'orange', 'purple', 'gold', 'silver', 'green'][Math.floor( Math.random() * 10 )]
        const backgroundColor = ['red', 'yellow', 'brown', 'blue', 'skyblue', 'orange', 'purple', 'gold', 'silver', 'green'][Math.floor( Math.random() * 10 )]
        const sampleIndexObject = {}
        sampleIndexObject.startIndex = startIndex
        sampleIndexObject.endIndex = endIndex
        sampleIndexObject.style = { color, backgroundColor, borderRadius: '5px' }
        sampleIndexObject.htmlAttributes = { id: i }
        sampleIndexObjects.push(sampleIndexObject)
      }
      return sampleIndexObjects
    },
    changeIndexObjects() {
      if (this.pushedStyleProperty && this.pushedStyleValue) {
        this.pushedIndexObject.style = { [this.pushedStyleProperty]: this.pushedStyleValue }
      } else {
        this.pushedIndexObject.style = null
      }
      this.indexObjects.push(this.pushedIndexObject)
      this.pushedIndexObject = { startIndex: null, endIndex: null, style: null }
      this.pushedStyleProperty = null
      this.pushedStyleValue = null
      this.addedStyles.push({ property: null, value: null })
    },
    addStyle(i) {
      // this.indexObjects[i].style[this.addedStyles[i].property] = this.addedStyles[i].value
      this.$set( this.indexObjects[i].style, this.addedStyles[i].property, this.addedStyles[i].value )
      this.addedStyles[i].property = null
      this.addedStyles[i].value = null
    },
    deleteStyle(property, i) {
      this.$delete(this.indexObjects[i].style, property)
    },
    removeIndexObject(i) {
      this.indexObjects.splice(i, 1)
    }
  }
}
</script>

<style>
  #app {
    font-size: 17px;
  }
  #styled-text-area {
    border: dashed 1px #708090;
    padding: 20px;
    width: 94%;
    margin: 30px auto 0;
    position: relative;
  }
  .style-input {
    width: 100px;
  }
  .index-input {
    width: 50px;
  }
  .json-area {
    white-space: pre-wrap;
    position: relative;
    width: 96%;
    margin: 20px auto 0;
  }
  .current-index-objects-area {
    width: 49%;
    border: dashed 1px #708090;
    position: absolute;
    left: 0;
    margin-bottom: 15px;
  }
  #title-str {
    position: absolute;
    top: -15px;
    left:10px;
    font-size: 20px;
    font-weight: bold;
    height: 30px;
    z-index: 2;
    background-color: white;
  }
  .added-index-object-area {
    width: 90%;
    border: dashed 1px #708090;
    margin: 0 auto;
    position: relative;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
  .other-props-area {
    width: 49%;
    border: dashed 1px #708090;
    position: relative;
    position: absolute;
    right: 0;
    padding: 15px 10px;
    white-space: initial;
  }
  .style-plus-btn {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: grey;
    color: white;
    display: inline-block;
    cursor: pointer;
    text-align: center;
  }
  .style-add-btn {
    margin-left: 10px;
  }
</style>
