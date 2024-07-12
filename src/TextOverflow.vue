<template>
  <div ref="textOverflowRef" class="text-overflow-v1" :style="boxStyle">
    <span ref="overEllipsisRef" :style="realTextStyle">
      <slot name="prefix"></slot>
      {{ realText }}
    </span>
    <span class="slot-box" ref="slotRef" v-if="showSlotNode">
      <slot :click-toggle="toggle" :expanded="expanded">
        <div @click="toggle" class="more-btn">
          {{ expanded ? '收起' : '查看全部' }}
        </div>
      </slot>
    </span>
  </div>
</template>

<script>
  import { computed, nextTick, onMounted, ref, toRefs } from 'vue'

  export default {
    name: 'TextOverflowV1',
    props: {
      /** 显示文本 */
      text: {
        type: String,
        default: ''
      },
      /**
       * 最多显示行数，如果使用了插槽prefix，会自动增加一行
       * */
      maxLines: {
        type: Number,
        default: 3
      },
      /** 文字宽度宽度 */
      width: {
        type: Number,
        default: 0
      },
      /**
       * 展开按钮的开始的位置
       */
      expandOffset: {
        type: Number,
        default: 145
      },
      viewType: {
        type: String,
        default: 'expand',
        validator(value) {
          return ['expand', 'popup'].indexOf(value) !== -1
        }
      },
      wordBreak: {
        type: String,
        default: 'break-all'
      }
    },
    emits: ['change', 'done'],
    setup(props, { emit }) {
      const { text, width, maxLines, expandOffset, viewType, wordBreak } = toRefs(props)
      const realTextStyle = computed(() => {
        return {
          wordBreak: wordBreak.value
        }
      })
      const offset = ref(text.value.length)
      const expanded = ref(false)
      const slotBoxWidth = ref(0)
      const textBoxWidth = ref(width.value)
      const showSlotNode = ref(false)
      const boxStyle = computed(() => {
        if (width.value) {
          return {
            width: width.value + 'px'
          }
        }
        return {}
      })
      const isPopup = computed(() => {
        return viewType.value === 'popup'
      })
      const realText = computed(() => {
        // 是否被截取
        const isCutOut = offset.value !== text.value.length
        let realText = text.value
        if ((isCutOut && !expanded.value) || (isCutOut && isPopup.value)) {
          realText = text.value.slice(0, offset.value) + '...'
        }
        return realText
      })

      const calculateOffset = (from, to) => {
        nextTick(() => {
          if (Math.abs(from - to) <= 1) {
            emit('done')
            return
          }
          if (isOverflow()) {
            to = offset.value
          } else {
            from = offset.value
          }
          offset.value = Math.floor((from + to) / 2)
          calculateOffset(from, to)
        })
      }
      const isOverflow = () => {
        const { len, lastWidth } = getLines()

        if (len < maxLines.value) {
          return false
        }
        if (maxLines.value) {
          // 超出部分 行数 > 最大行数 或则  已经是最大行数但最后一行宽度 + 后面内容超出正常宽度
          const lastLineOver = !!(len === maxLines.value && lastWidth + slotBoxWidth.value > textBoxWidth.value)
          if (len > maxLines.value || lastLineOver) {
            return true
          }
        }
        return false
      }
      const overEllipsisRef = ref(null)
      const getLines = () => {
        const clientRects = overEllipsisRef.value.getClientRects()
        return {
          len: clientRects.length,
          lastWidth: clientRects[clientRects.length - 1].width
        }
      }
      const toggle = () => {
        expanded.value = !expanded.value
        emit('change', expanded.value)
      }
      const textOverflowRef = ref(null)
      const slotRef = ref(null)

      onMounted(() => {
        const { len } = getLines()
        if (len > maxLines.value) {
          showSlotNode.value = true
          nextTick(() => {
            slotBoxWidth.value = expandOffset.value
            textBoxWidth.value = textOverflowRef.value.clientWidth
            calculateOffset(0, text.value.length)
          })
        } else {
          emit('done')
        }
      })
      return {
        realTextStyle,
        offset,
        expanded,
        slotBoxWidth,
        textBoxWidth,
        showSlotNode,
        boxStyle,
        realText,
        calculateOffset,
        textOverflowRef,
        overEllipsisRef,
        slotRef,
        toggle
      }
    }
  }
</script>

<style scoped>
  .slot-box {
    display: inline-block;
    .more-btn {
      font-family: PingFangSC-Regular;
      font-size: 26px;
      color: #3981f4;
      letter-spacing: 0;
      font-weight: 400;
    }
  }
</style>
