<template>
  <div>
    <p v-for="(output, index) in filteredOutputs" :key="index">
      Sent
      <span v-if="message.payload.asset">
        {{$n(output.amount)}}
        <router-link :to="'/u/' + message.payload.asset">
          <span>{{assetMeta[message.payload.asset] || message.payload.asset}}</span>
        </router-link>
      </span>
      <span v-else :title="output.amount">{{output.amount | nice}}</span>
      to
      <router-link :to="'/@' + output.address">
        <span>{{output.address}}</span>
      </router-link>
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['message', 'filteredOutputs'],
  computed: {
    assetMeta() {
      return this.$store.state.app.assets.reduce(function(accum, currentVal) {
        accum[currentVal.payload.asset] = currentVal.payload.shortName +' ($'+ currentVal.payload.ticker +')';
        return accum;
      }, {});
    }
  },
  methods: mapActions([
    'getAssets',
  ]),
  created() {
    if (this.$store.state.app.assets.length === 0) {
      this.getAssets();
    }
  },
}
</script>
