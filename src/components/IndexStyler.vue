<template>
  <div :id="textContainerId"></div>
</template>
<script>
export default {
  name: 'index-style-text',
  props: {
    indexObjects: {
      type: Array,
      required: true
    },
    rawText: {
      type: String,
      required: true
    },
    textContainerId: {
      type: String,
      default: 'styled-text-container'
    },
    defaultStyle: {
      type: Object
    },
    defaultHtmlAttributes: {
      type: Object
    },
    isFirstChar0: {
      type: Boolean,
      default: true
    },
    isSlicedInvolvingEndIndex: {
      type: Boolean,
      default: true
    },
    isIndexObjectsWatched: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.checkIsIndexObjectsWatched()
  },
  mounted() {
    this.styleText()
  },
  methods: {
    checkIsIndexObjectsWatched() {
      if (this.isIndexObjectsWatched) {
        this.$watch('indexObjects', this.styleText, { deep: true })
      }
    },
    styleText() {
      if (this.indexObjects.length === 0) {
        this.displayRawText()
        return
      }
      this.checkIndexes()
      let indexObjects;
      if (this.isIndexObjectsWatched) {
        indexObjects = JSON.parse(JSON.stringify(this.indexObjects))
      } else {
        indexObjects = this.indexObjects
      }
      this.convertIndexToDefault(indexObjects)
      const indexObjectsTree = this.createIndexObjectsTree(indexObjects)
      this.sortIntoChildren(indexObjectsTree)
      const styledFragments = this.createStyledFragments(indexObjectsTree)
      const styledTextContainer = document.getElementById(this.textContainerId)
      while (styledTextContainer.firstChild) styledTextContainer.removeChild(styledTextContainer.firstChild)
      styledTextContainer.appendChild(styledFragments)
    },
    displayRawText() {
      const styledTextContainer = document.getElementById(this.textContainerId)
      while (styledTextContainer.firstChild) styledTextContainer.removeChild(styledTextContainer.firstChild)
      styledTextContainer.appendChild(document.createTextNode(this.rawText))
    },
    isNumber(value) {
      return ((typeof value === 'number') && (isFinite(value)));
    },
    checkIndexes() {
      const textLength = this.rawText.length
      for (const indexObject of this.indexObjects) {
        const { startIndex, endIndex } = indexObject
        if (!this.isNumber(startIndex)) {
          throw new Error('"startIndex must be number.');
        }
        if (!this.isNumber(endIndex)) {
          throw new Error('"endIndex must be number.');
        }
        if (this.isSlicedInvolvingEndIndex) {
          if (startIndex > endIndex) {
            throw new Error('"startIndex <= endIndex" must be required.');
          }
        } else {
          if (startIndex >= endIndex) {
            throw new Error('"startIndex < endIndex" must be required.');
          }
        }
        if (this.isFirstChar0) {
          if (startIndex < 0 || endIndex < 0) {
            throw new Error('"0 <= startIndex && 0 <= endIndex" must be required.');
          }
          if (this.isSlicedInvolvingEndIndex) {
            if (startIndex >= textLength || endIndex >= textLength ) {
              throw new Error('"startIndex < text.length && endIndex < text.length" must be required.');
            }
          } else {
            if (startIndex >= textLength + 1 || endIndex >= textLength + 1 ) {
              throw new Error('"startIndex < text.length + 1 && endIndex < text.length + 1" must be required.');
            }
          }
        } else {
          if (startIndex < 1 || endIndex < 1) {
            throw new Error('"1 <= startIndex && 1 <= endIndex" must be required.');
          }
          if (this.isSlicedInvolvingEndIndex) {
            if (startIndex > textLength || endIndex > textLength ) {
              throw new Error('"startIndex =< text.length && endIndex =< text.length" must be required.');
            }
          } else {
            if (startIndex > textLength + 1 || endIndex > textLength + 1 ) {
              throw new Error('"startIndex =< text.length +1 &&  endIndex =< text.length + 1" must be required.');
            }
          }
        }
      }
    },
    convertIndexToDefault(indexObjects) {
      if (this.isFirstChar0 && this.isSlicedInvolvingEndIndex) {
        return
      }
      if (!this.isFirstChar0) {
        for (const indexObject of indexObjects) {
          const { startIndex, endIndex } = indexObject
          indexObject.startIndex = startIndex - 1
          indexObject.endIndex = endIndex - 1
        }
      }
      if (!this.isSlicedInvolvingEndIndex) {
        for (const indexObject of indexObjects) {
          const { endIndex } = indexObject
          indexObject.endIndex = endIndex - 1
        }
      }
    },
    sortByStartIndex(indexObjects) {
      indexObjects.sort((a, b) => {
        if (a.startIndex > b.startIndex) {
          return 1
        } else if (a.startIndex < b.startIndex) {
          return -1
        } else {
          return 0
        }
      })
    },
    sortIntoChildren(indexObjectsTree) {
      this.sortByStartIndex(indexObjectsTree)
      for (const indexObject of indexObjectsTree) {
        if (indexObject.children) {
          this.sortIntoChildren(indexObject.children)
        }
      }
    },
    sortByIndexDiff(indexObjects) {
      indexObjects.sort((a, b) => {
        const aDiff = a.endIndex - a.startIndex
        const bDiff = b.endIndex - b.startIndex
        if (aDiff < bDiff) {
          return 1
        } else if (aDiff > bDiff) {
          return -1
        } else {
          return 0
        }
      })
    },
    createIndexObjectsTree(indexObjects) {
      this.sortByIndexDiff(indexObjects)
      const indexObjectsCount = indexObjects.length
      for (let i = indexObjectsCount - 1; i >= 0; i--) {
        const { startIndex, endIndex, style, children, htmlAttributes } = indexObjects[i]
        for (let j = i - 1; j >= 0; j--) {
          const nextIndexObject = indexObjects[j]
          const nextStartIndex = nextIndexObject.startIndex
          const nextEndIndex = nextIndexObject.endIndex
          const nextStyle = nextIndexObject.style
          const nextHtmlAttributes = nextIndexObject.htmlAttributes
          const nextChildren = nextIndexObject.children
          let newChild
          if (endIndex < nextStartIndex || nextEndIndex < startIndex) {
            continue
          } else if (startIndex < nextStartIndex && nextStartIndex <= endIndex) {
            nextIndexObject.startIndex = startIndex
            nextIndexObject.style = style
            nextIndexObject.htmlAttributes = htmlAttributes
            newChild = {
              startIndex: nextStartIndex,
              endIndex,
              style: nextStyle,
              htmlAttributes: nextHtmlAttributes
            }
          } else if (nextStartIndex <= startIndex && endIndex <= nextEndIndex) {
            newChild = { startIndex, endIndex, style, htmlAttributes }
          } else if (startIndex <= nextEndIndex && nextEndIndex < endIndex) {
            nextIndexObject.endIndex = endIndex
            newChild = {
              startIndex,
              endIndex: nextEndIndex,
              style,
              htmlAttributes
            }
          }
          indexObjects.splice(i, 1)
          this.sortByIndexDiff(indexObjects)
          let newChildren
          if (children && nextChildren) {
            newChildren = children.concat(nextChildren)
          } else if (children || nextChildren) {
            newChildren = children || nextChildren
          } else {
            newChildren = []
          }
          newChildren.push(newChild)
          nextIndexObject.children = this.createIndexObjectsTree(newChildren)
          break
        }
      }
      return indexObjects
    },
    makeTextNode(sliceStart, sliceEnd) {
      const slicedText = this.rawText.slice(sliceStart, sliceEnd)
      const slicedTextNode = document.createTextNode(slicedText)
      return slicedTextNode
    },
    getBeforeEndIndex(i, indexObject, parentStartIndex) {
      if (i === 0) {
        return parentStartIndex
      } else {
        return indexObject[i - 1].endIndex + 1
      }
    },
    getNextStartIndex(i, indexObject, parentEndIndex) {
      if (indexObject[i + 1]) {
        return indexObject[i + 1].startIndex
      } else {
        return parentEndIndex
      }
    },
    getNeighborIndexes(i, indexObject, parentStartIndex, parentEndIndex) {
      return [this.getBeforeEndIndex(i, indexObject, parentStartIndex), this.getNextStartIndex(i, indexObject, parentEndIndex)]
    },
    createStyledFragment(indexObject, beforeEndIndex, nextStartIndex, isAllLast) {
      const { startIndex, endIndex, style, htmlAttributes } = indexObject
      const leftTextNodeOfSpan = this.makeTextNode(beforeEndIndex, startIndex)
      const styledSpan = document.createElement('span')
      if (indexObject.children) {
        const indexObjectCount = indexObject.children.length
        const styledFragments = document.createDocumentFragment()
        for (let i = 0; i < indexObjectCount; i++) {
          const childIndexObject = indexObject.children[i]
          const [beforeEndIndex, nextStartIndex] = this.getNeighborIndexes(i, indexObject.children, indexObject.startIndex, indexObject.endIndex)
          const isLastChild = i === indexObjectCount - 1
          const styledFragment = this.createStyledFragment(childIndexObject, beforeEndIndex, nextStartIndex, isLastChild)
          styledFragments.appendChild(styledFragment)
        }
        styledSpan.appendChild(styledFragments)
      } else {
        const textNodeBetweenSpan = this.makeTextNode(startIndex, endIndex + 1)
        styledSpan.appendChild(textNodeBetweenSpan)
      }
      const isStyleObject = style instanceof Object && !(style instanceof Array)
      const isDefaultStyleObject = this.defaultStyle instanceof Object && !(this.defaultStyle instanceof Array)
      let appliedStyle
      if (isStyleObject && isDefaultStyleObject) {
        appliedStyle = { ...this.defaultStyle, ...style }
      } else if (isStyleObject || isDefaultStyleObject) {
        appliedStyle = style || this.defaultStyle
      }
      if (appliedStyle) {
        for (const [property, value] of Object.entries(appliedStyle)) {
          styledSpan.style[property] = value
        }
      }
      const isHtmlAttributesObject = htmlAttributes instanceof Object && !( htmlAttributes instanceof Array)
      const isDefaultHtmlAttributesObject = this.defaultHtmlAttributes instanceof Object && !(this.defaultHtmlAttributes instanceof Array)
      let appliedHtmlAttributes
      if (isHtmlAttributesObject && isDefaultHtmlAttributesObject) {
        appliedHtmlAttributes = { ...this.defaultHtmlAttributes, ...htmlAttributes }
      } else if (isHtmlAttributesObject || isDefaultHtmlAttributesObject) {
        appliedHtmlAttributes = htmlAttributes || this.defaultHtmlAttributes
      }
      if (appliedHtmlAttributes) {
        for (const [htmlAttributeName, value] of Object.entries(appliedHtmlAttributes)) {
          styledSpan.setAttribute(htmlAttributeName, value)
        }
      }
      const styledFragment = document.createDocumentFragment();
      styledFragment.appendChild(leftTextNodeOfSpan)
      styledFragment.appendChild(styledSpan)
      if (isAllLast) {
        const rightTextNodeOfSpan = this.makeTextNode(endIndex + 1, nextStartIndex + 1)
        styledFragment.appendChild(rightTextNodeOfSpan)
      }
      return styledFragment
    },
    createStyledFragments(indexObjectsTree) {
      const indexObjectCount = indexObjectsTree.length
      const styledFragments = document.createDocumentFragment()
      for (let i = 0; i < indexObjectCount; i++) {
        const indexObject = indexObjectsTree[i]
        const [beforeEndIndex, nextStartIndex] = this.getNeighborIndexes(i, indexObjectsTree, 0, this.rawText.length - 1)
        const isAllLast = i === indexObjectCount - 1
        const styledFragment = this.createStyledFragment(indexObject, beforeEndIndex, nextStartIndex, isAllLast)
        styledFragments.appendChild(styledFragment)
      }
      return styledFragments
    }
  }
}
</script>
