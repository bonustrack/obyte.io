<template>
  <p>
    Voted "{{message.payload.choice}}" on the poll
    <router-link :to="'/u/' + message.payload.unit">
      {{message.payload.unit}}
    </router-link>
  </p>
</template>

<script>
export default {
  props: ['message'],
}
</script>
