<template>
  <div>
    <p v-for="(output, index) in filteredOutputs" :key="index">
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
  computed: {
    filteredOutputs: function () {
      return this.message.payload.outputs.filter(function (output, index) {
        return !this.message.unit_authors.includes(output.address); 
      })
    }
  },
}
</script>
