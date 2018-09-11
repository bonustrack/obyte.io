<template>
  <p>Issue {{$n(message.payload.cap)}} {{message.unit}}</p>
</template>

<script>
export default {
  props: ['message'],
}
</script>
