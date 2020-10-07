<template>
  <div class="w-100">
    <p>
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
          <span>{{message.payload['asset']}}</span>
        </router-link>
      </span>
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
  props: ['message'],
  methods: mapActions([
    'getAssets',
  ]),
  computed: {
    assets() {
      return this.$store.state.app.assets || [];
    },
    assetMetaData() {
      return this.assets.reduce((accum, currentVal) => {
        const newArray = accum;
        let assetName = currentVal.payload.name;
        assetName += currentVal.payload.ticker ? ` ($${currentVal.payload.ticker})` : '';
        newArray[currentVal.payload.asset] = {
          assetName,
          decimals: currentVal.payload.decimals || 0,
        };
        return newArray;
      }, {});
    },
  },
  created() {
    if (!this.$store.state.app.assetsIsLoaded && !this.$store.state.app.assetsIsLoading) {
      this.getAssets();
    }
  },
};
</script>
