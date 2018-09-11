<template>
  <div
    v-html="compiledMarkdown"
    :class="className"
  />
</template>

<script>
import marked from 'marked';

export default {
  props: ['text', 'className'],
  computed: {
    compiledMarkdown: function () {
      return marked(this.text, { sanitize: true })
    }
  },
}
</script>
