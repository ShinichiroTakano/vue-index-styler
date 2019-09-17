import IndexStyler from '@/components/IndexStyler.vue'
const defaultComponentName = 'IndexStyler'

const VueIndexStyler = {
  install(Vue, options = {}) {
    const componentName = options.componentName || defaultComponentName
    Vue.component(componentName, IndexStyler)
  }
}

export default VueIndexStyler
