<template>
  <div>
    <p v-if="!message.unit_authors.includes(output.address)" v-for="(output, index) in message.payload.outputs" :key="index">
      Sent {{output.amount}} {{message.asset ? message.asset : 'bytes'}} to
      <router-link :to="'/@' + output.address">
        {{output.address}}
      </router-link>
    </p>
  </div>
</template>

<script>
export default {
  props: ['message'],
}
</script>
