<template>
  <div class="w-100">
    <p>
      Defined
      <span v-if="assetMetaData[message.unit]">
        <span v-if="message.payload.cap">{{message.payload.cap | niceAsset(assetMetaData[message.unit].decimals)}}</span>
        <span v-else>unlimited</span>
        {{assetMetaData[message.unit].assetName}}
      </span>
      <span v-else>
        <span v-if="message.payload.cap">{{$n(message.payload.cap)}}</span>
        <span v-else>unlimited</span>
        {{message.unit}}
      </span>
    </p>
    <ul class="Box Box--condensed d-inline-block w-100">
      <li class="Box-row" v-for="(field, index) in filteredPayload" :key="index">
        <p class="m-0">
          <span class="text-bold">{{field}}: </span>
          <span class="pre">{{textOrJSON(message.payload[field])}}</span>
        </p>
      </li>
    </ul>
    <div class="mt-2" v-if="assetMetaData[message.unit]">
      <router-link :to="'/u/' + assetMetaData[message.unit].metaUnit">See Asset Registry unit</router-link>
    </div>
  </div>
</template>

<script>
import utils from '@/helpers/utils';
import { mapActions } from 'vuex';

export default {
  props: ['message'],
  methods: {
    textOrJSON: (json) => utils.textOrJSON(json),
    ...mapActions([
      'getAssets',
    ]),
  },
  computed: {
    filteredPayload: function () {
      return Object.keys(this.message.payload).filter(function (field, index) {
        return field!=='cap'; 
      })
    },
    assets () {
      return this.$store.state.app.assets || [];
    },
    assetMetaData() {
      return this.assets.reduce(function(accum, currentVal) {
        let assetName = currentVal.payload.name;
        assetName += currentVal.payload.ticker ? ' ($'+ currentVal.payload.ticker +')' : '';
        accum[currentVal.payload.asset] = {
          assetName,
          decimals: currentVal.payload.decimals || 0,
          metaUnit: currentVal.unit,
        };
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
