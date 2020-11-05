<template>
  <div class="w-100">
    <p v-if="message.payload.inputs && message.payload.inputs[0].type === 'issue'">
      Issued
      <span v-if="!message.payload['asset']" :title="message.payload['inputs'][0].amount">{{message.payload['inputs'][0].amount | niceBytes}}</span>
      <span v-else-if="assetMetaData[message.payload['asset']]">
        {{message.payload['inputs'][0].amount | niceAsset(assetMetaData[message.payload['asset']].decimals)}}
        <router-link :to="'/u/' + message.payload['asset']">
          <span>{{assetMetaData[message.payload['asset']].assetName}}</span>
        </router-link>
      </span>
      <span v-else>
        {{$n(message.payload['inputs'][0].amount)}}
        <router-link :to="'/u/' + message.payload['asset']">
          <span class="monospace">{{message.payload['asset']}}</span>
        </router-link>
      </span>
    </p>
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
          <span class="monospace">{{message.payload.asset}}</span>
        </router-link>
      </span>
      to
      <router-link :to="'/@' + output.address">
        <span class="monospace">{{output.address}}</span>
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
      return this.$store.state.app.assets.reduce((accum, currentVal) => {
        const newArray = accum;
        newArray[currentVal.assetId] = currentVal;
        return newArray;
      }, {});
    },
  },
  methods: mapActions([
    'getAssets',
  ]),
  created() {
    if (!this.$store.state.app.assetsIsLoaded && !this.$store.state.app.assetsIsLoading) {
      this.getAssets();
    }
  },
};
</script>
