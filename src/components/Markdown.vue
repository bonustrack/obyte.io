<template>
  <div
    v-html="compiledMarkdown"
    :class="className"
  />
</template>

<script>
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

export default {
  props: ['text', 'className'],
  computed: {
    compiledMarkdown() {
      return marked(sanitizeHtml(this.text));
    },
  },
};
</script>
