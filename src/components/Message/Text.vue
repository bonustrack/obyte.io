<template>
  <Markdown v-if="$route.name === 'unit'" :text="message.payload"/>
  <Markdown :text="message.payload | truncate(1000)" v-else/>
</template>

<script>
export default {
  props: ['message'],
}
</script>
