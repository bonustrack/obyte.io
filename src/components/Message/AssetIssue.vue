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
          <span class="monospace">{{message.payload['asset']}}</span>
        </router-link>
      </span>
      <span v-if="message.payload['inputs'][0].address">
        to
        <router-link :to="'/@' + message.payload['inputs'][0].address">
          <span class="monospace">{{message.payload['inputs'][0].address}}</span>
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
    assetMetaData() {
      return this.$store.state.app.assets.reduce((accum, currentVal) => {
        const newArray = accum;
        newArray[currentVal.assetId] = currentVal;
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
