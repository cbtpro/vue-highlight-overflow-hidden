<template>
  <div class="highlight-container" v-html="highlightedText"></div>
</template>

<script>
export default {
  name: 'HighlightText',
  props: {
    matchValue: {
      type: String,
      required: true
    },
    highlights: {
      type: Array,
      required: true
    }
  },
  computed: {
    highlightedText() {
      let highlighted = this.matchValue;
      const highlightsRegex = this.highlights
        .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');
      const regex = new RegExp(`(${highlightsRegex})`, 'gi');
      highlighted = highlighted.replace(regex, '<span class="highlight">$1</span>');
      return this.wrapWithEllipsis(highlighted);
    }
  },
  methods: {
    wrapWithEllipsis(text) {
      const container = document.createElement('div');
      container.style.display = '-webkit-box';
      container.style.webkitBoxOrient = 'vertical';
      container.style.webkitLineClamp = '3';
      container.style.overflow = 'hidden';
      container.style.textOverflow = 'ellipsis';
      container.style.whiteSpace = 'pre-wrap';
      container.style.wordBreak = 'break-word';
      container.innerHTML = text;

      document.body.appendChild(container);
      const isOverflowing = container.scrollHeight > container.clientHeight;
      document.body.removeChild(container);

      if (isOverflowing) {
        const visibleText = container.innerHTML.split(' ').slice(0, 10).join(' ');
        return `...${visibleText}`;
      }

      return text;
    }
  }
};
</script>

<style scoped>
.highlight-container {
  width: 375px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  word-break: break-word;
}

.highlight {
  background-color: yellow;
}
</style>
