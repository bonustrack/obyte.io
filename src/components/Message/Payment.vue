<template>
  <div>
    <p v-for="(output, index) in filteredOutputs" :key="index">
      Sent <span :title="output.amount">{{message.asset ? output.amount +' '+ message.asset : output.amount | nice}}</span> to
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
