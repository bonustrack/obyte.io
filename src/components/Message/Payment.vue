<template>
  <div>
    <p v-for="(output, index) in filteredOutputs" :key="index">
      Sent {{output.amount}} {{message.asset ? message.asset : 'bytes'}} to
      <router-link :to="'/@' + output.address">
        <span>{{output.address}}</span>
      </router-link>
    </p>
  </div>
</template>

<script>
export default {
  props: ['message', 'filteredOutputs'],
}
</script>
