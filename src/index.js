import IndexStyler from '@/components/IndexStyler.vue'
const defaultComponentName = 'IndexStyler'

export default {
  install(Vue, options = {}) {
    const componentName = options.componentName || defaultComponentName
    Vue.component(componentName, IndexStyler)
  }
}
