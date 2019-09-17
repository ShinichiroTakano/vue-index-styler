import { mount } from '@vue/test-utils';
import IndexStyler from '@/components/IndexStyler.vue';
import TestText from '@/TestText.js'

const loopCount = 1000

const createId = number => {
  return `id-${number}`
}

const createIndex = (textLength, isFirstChar0, isSlicedInvolvingEndIndex) => {
  let max, min
  if (isFirstChar0) {
    min = 0
    if (isSlicedInvolvingEndIndex) {
      max = textLength
    } else {
      max = textLength + 1
    }
  } else {
    min = 1
    if (isSlicedInvolvingEndIndex) {
      max = textLength
    } else {
      max = textLength + 1
    }
  }
  let index = Math.floor( Math.random() * max ) + min
  return index
}

function createSampleIndexObjects (isFirstChar0, isSlicedInvolvingEndIndex) {
  const sampleIndexObjects = []
  for (let i = 0; i < loopCount; i++) {
    let startIndex = createIndex(TestText.length, isFirstChar0, isSlicedInvolvingEndIndex)
    let endIndex =  createIndex(TestText.length, isFirstChar0, isSlicedInvolvingEndIndex)
    if (startIndex > endIndex ) {
      [startIndex, endIndex] = [endIndex, startIndex]
    }
    if (!isSlicedInvolvingEndIndex) {
      if (startIndex === endIndex ) {
        endIndex += 1
      }
    }
    const color = ['red', 'yellow', 'brown', 'blue', 'skyblue', 'orange', 'purple', 'gold', 'silver', 'green'][Math.floor( Math.random() * 10 )]
    const sampleIndexObject = {}
    sampleIndexObject.startIndex = startIndex
    sampleIndexObject.endIndex = endIndex
    sampleIndexObject.style = { color }
    sampleIndexObject.htmlAttributes = { id: createId(i) }
    sampleIndexObjects.push(sampleIndexObject)
  }
  return sampleIndexObjects
}

const indexObjectsList = {
  default: createSampleIndexObjects(true, true),
  isFirstChar0False: createSampleIndexObjects(false, true),
  isSlicedInvolvingEndIndexFalse: createSampleIndexObjects(true, false),
  isFirstChar1AndIsSlicedExcludingEndIndex: createSampleIndexObjects(false, false)
}

const checkRenderingRightText = (wrapper, testContainerId) => {
  const testContainer = wrapper.find(`#${testContainerId}`)
  expect(testContainer.text()).toBe(TestText)
}

const checkRenderingRightStyle = (wrapper, indexObjects) => {
  const results = []
  for (let i = 0; i < loopCount; i++) {
    const spanStyle = wrapper.find(`#${createId(i)}`).attributes().style
    const result = spanStyle === `color: ${indexObjects[i].style.color};`
    results.push(result)
  }
  expect(results.every(e => e)).toBe(true);
}

describe('IndexStyleComponent', () => {
  const indexObjects = indexObjectsList.default
  const textContainerId = 'test1'
  describe('of default index', () => {
    const wrapper = mount(IndexStyler, {
      propsData: {
        indexObjects: JSON.parse(JSON.stringify(indexObjects)),
        rawText: TestText,
        textContainerId
      },
      attachToDocument: true
    })
    it('renders the right text', () => {
      checkRenderingRightText(wrapper, textContainerId)
    })
    it('renders the right style', () => {
      checkRenderingRightStyle(wrapper, indexObjects)
    })
  })
  describe('not isFirstChar0', () => {
    const indexObjects = indexObjectsList.isFirstChar0False
    const textContainerId = 'test2'
    const wrapper = mount(IndexStyler, {
      propsData: {
        indexObjects: JSON.parse(JSON.stringify(indexObjects)),
        rawText: TestText,
        textContainerId,
        isFirstChar0: false
      },
      attachToDocument: true
    })
    it('renders the right text', () => {
      checkRenderingRightText(wrapper, textContainerId)
    })
    it('renders the right style', () => {
      checkRenderingRightStyle(wrapper, indexObjects)
    })
  })
  describe('not isSlicedInvolvingEndIndex', () => {
    const indexObjects = indexObjectsList.isSlicedInvolvingEndIndexFalse
    const textContainerId = 'test3'
    const wrapper = mount(IndexStyler, {
      propsData: {
        indexObjects: JSON.parse(JSON.stringify(indexObjects)),
        rawText: TestText,
        textContainerId,
        isSlicedInvolvingEndIndex: false
      },
      attachToDocument: true
    })
    it('renders the right text', () => {
      checkRenderingRightText(wrapper, textContainerId)
    })
    it('renders the right style', () => {
      checkRenderingRightStyle(wrapper, indexObjects)
    })
  })
  describe('not isSlicedInvolvingEndIndex', () => {
    const indexObjects = indexObjectsList.isFirstChar1AndIsSlicedExcludingEndIndex
    const textContainerId = 'test4'
    const wrapper = mount(IndexStyler, {
      propsData: {
        indexObjects: JSON.parse(JSON.stringify(indexObjects)),
        rawText: TestText,
        textContainerId,
        isFirstChar0: false,
        isSlicedInvolvingEndIndex: false
      },
      attachToDocument: true
    })
    it('renders the right text', () => {
      checkRenderingRightText(wrapper, textContainerId)
    })
    it('renders the right style', () => {
      checkRenderingRightStyle(wrapper, indexObjects)
    })
  })
})
