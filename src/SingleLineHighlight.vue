<script name="hightlight" setup>
import {
  computed,
  defineOptions,
  nextTick,
  onMounted,
  ref,
  toRefs,
  watch,
} from "vue";
defineOptions({
  name: "hightlight",
});
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  highlights: {
    type: Array,
    default: () => [],
  },
});

const { text, highlights } = toRefs(props);
// 开始的单词索引
const startWordIndex = ref(0);
const words = computed(() => {
  // return text.value.split(/(?=\p{Script=Han}|\p{Script=Thai}|\p{Script=Cyrillic})|(?<=\p{Script=Han}|\p{Script=Thai}|\p{Script=Cyrillic})|\s+/u)
  return text.value.split(
    /(?=\p{Script=Han}|\p{Script=Thai}|\p{Script=Cyrillic}|\s|[\u0028\u0029\uFF08\uFF09])|(?<=\p{Script=Han}|\p{Script=Thai}|\p{Script=Cyrillic}|\s|[\u0028\u0029\uFF08\uFF09])/u
  );
});
// 结束的单词索引
const endWordIndex = ref(words.value.length);
const renderText = computed(() => {
  const result = [
    startWordIndex.value > 0 ? "…" : undefined,
    words.value.slice(startWordIndex.value, endWordIndex.value).join("").trim(),
    endWordIndex.value < words.value.length ? "…" : undefined,
  ].filter((item) => item !== undefined);
  return result.join("");
});
watch(renderText, (value, oldValue) => {
  if (value !== oldValue) {
    console.log(value);
  }
});
const hasHighlightText = () => {
  // 构建正则表达式，使用|分隔
  const regexPattern = highlights.value
    .map((text) => text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(regexPattern, "ig"); // 'i'表示不区分大小写
  // 检查realText是否匹配任意highlights中的字符串
  return regex.test(renderText.value);
};
const hasHighlightTextIndex = () => {
  // 构建正则表达式，使用|分隔
  const regexPattern = highlights.value.map((text) =>
    text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
  );
  const matchTextIndexs = regexPattern
    .map((regexStr) => {
      // 'i'表示不区分大小写
      const regex = new RegExp(regexStr, "i");
      if (regex.test(text.value)) {
        const { index } = regex.exec(text.value);
        // 检查realText是否匹配任意highlights中的字符串
        return { index, isMatch: regex.test(text.value) };
      }
      return undefined;
    })
    .filter((item) => {
      if (item === undefined) {
        return false;
      }
      const { index, isMatch } = item;
      return isMatch;
    })
    .map(({ index }) => index);
  // 去重
  return Array.from(new Set(matchTextIndexs));
};
const isOverflowing = (element) => {
  return (
    element.scrollWidth > element.clientWidth ||
    element.scrollHeight > element.clientHeight
  );
};
const matchIndex = ref(hasHighlightTextIndex());
const innerRef = ref(null);
const initRenderText = () => {
  return new Promise((resolve) => {
    nextTick(async () => {
      if (isOverflowing(innerRef.value)) {
        endWordIndex.value -= 1;
        const promise = await initRenderText();
        resolve(promise);
      } else {
        resolve();
      }
    });
  });
};

const execWindowFunction = async () => {
  while (startWordIndex.value < words.value.length) {
    startWordIndex.value += 1;
    if (endWordIndex.value < words.value.length) {
      if (endWordIndex.value < words.value.length - 5) {
        endWordIndex.value += 5;
      } else if (endWordIndex.value < words.value.length - 4) {
        endWordIndex.value += 4;
      } else if (endWordIndex.value < words.value.length - 3) {
        endWordIndex.value += 3;
      } else if (endWordIndex.value < words.value.length - 2) {
        endWordIndex.value += 2;
      } else if (endWordIndex.value < words.value.length - 1) {
        endWordIndex.value += 1;
      }
    }
    await initRenderText();
    execWindowFunction();
    if (hasHighlightText()) {
      break
    }
  }
};
onMounted(async () => {
  try {
    await initRenderText();
    execWindowFunction();
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div ref="" class="single-line-highlight">
    <div class="mock">
      <div ref="innerRef" class="inner single-line-ellipsis">
        {{ renderText }}
      </div>
    </div>
    <slot name="default" :renderText="renderText" />
  </div>
</template>

<style scoped>
.single-line-highlight {
  /* width: 375px; */
  width: 100%;
  position: relative;
  .mock {
    width: 100%;
    position: absolute;
    pointer-events: none;
    .inner {
      opacity: 0;
    }
  }
  .single-line-ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
