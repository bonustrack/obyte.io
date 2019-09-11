<template>
  <ul
    v-infinite-scroll="getMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
  >
    <MessageBlank v-if="feed.isLoaded && feed.messages && feed.messages.length === 0"/>
    <Message v-for="(message, index) in feed.messages" :message="message" :key="index"/>
    <MessageLoading v-if="feed.isLoading"/>
  </ul>
</template>

<script>
export default {
  props: ['feed', 'getMore'],
}
</script>
