<template>
  <div class="w-100">
    <p>Issued {{$n(message.payload['inputs'][0].amount)}}
      <router-link v-if="message.payload['asset']" :to="'/u/' + message.payload['asset']">
        <span>{{assetMeta[message.payload['asset']] || message.payload['asset']}}</span>
      </router-link>
      <span v-else>bytes</span>
      <span v-if="message.payload['inputs'][0].address">
        to
        <router-link :to="'/@' + message.payload['inputs'][0].address">
          <span>{{message.payload['inputs'][0].address}}</span>
        </router-link>
      </span>
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['message', 'filteredOutputs'],
  methods: mapActions([
    'getAssets',
  ]),
  computed: {
    assetMeta() {
      return this.$store.state.app.assets.reduce(function(accum, currentVal) {
        accum[currentVal.payload.asset] = currentVal.payload.name +' ($'+ currentVal.payload.ticker +')';
        return accum;
      }, {});
    }
  },
  created() {
    if (this.$store.state.app.assets.length === 0) {
      this.getAssets();
    }
  },
}
</script>