<template>
  <Markdown v-if="$route.name === 'unit'" :text="message.payload"/>
  <Markdown v-else :text="message.payload | truncate(1000)"/>
</template>

<script>
export default {
  props: ['message'],
};
</script>
