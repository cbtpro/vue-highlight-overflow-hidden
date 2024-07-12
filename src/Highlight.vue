<template>
  <span v-html="output" class="highlight single-line-ellipsis"></span>
</template>

<script>
  import { computed, toRefs } from 'vue'
  import { highlightFun, highlightByMatchList  } from './utils.js'

  export default {
    name: 'Highlight',
    props: {
      text: {
        type: String,
        required: true
      },
      keyword: {
        type: String,
        default: ''
      },
      highLights: {
        type: Array,
        default: () => []
      },
      color: {
        type: String,
        default: '#3981f4'
      }
    },
    setup(props) {
      const { text, keyword, highLights, color } = toRefs(props)
      const output = computed(() => {
        if (keyword.value) {
          return highlightFun(text.value, keyword.value, color.value, true)
        }
        return highlightByMatchList(text.value, highLights.value, color.value)
      })
      return {
        output
      }
    }
  }
</script>

<style scoped>
  .highlight {
    &.single-line-ellipsis {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
</style>
