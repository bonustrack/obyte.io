<template>
  <div class="w-100">
    <p v-for="(output, index) in filteredOutputs" :key="index">
      Sent
      <span v-if="!message.payload.asset" :title="output.amount">{{output.amount | niceBytes}}</span>
      <span v-else-if="assetMetaData[message.payload.asset]">
        {{output.amount | niceAsset(assetMetaData[message.payload.asset].decimals)}}
        <router-link :to="'/u/' + message.payload.asset">
          <span>{{assetMetaData[message.payload.asset].assetName}}</span>
        </router-link>
      </span>
      <span v-else>
        {{$n(output.amount)}}
        <router-link :to="'/u/' + message.payload.asset">
          <span>{{message.payload.asset}}</span>
        </router-link>
      </span>
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
    assetMetaData() {
      return this.$store.state.app.assets.reduce(function(accum, currentVal) {
        let assetName = currentVal.payload.name;
        assetName += currentVal.payload.ticker ? ' ($'+ currentVal.payload.ticker +')' : '';
        accum[currentVal.payload.asset] = {
          assetName: assetName,
          decimals: currentVal.payload.decimals || 0,
          metaUnit: currentVal.unit,
        };
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
