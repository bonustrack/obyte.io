<template>
  <div class="w-100">
    <p>
      Defined
      {{message.payload.cap ? $n(message.payload.cap) : 'unlimited'}}
      <span>{{assetMeta[message.unit] || message.unit}}</span>
    </p>
    <ul class="Box Box--condensed d-inline-block w-100">
      <li class="Box-row" v-for="(field, index) in filteredPayload" :key="index">
        <p class="m-0">
          <span class="text-bold">{{field}}: </span>
          <span class="pre">{{textOrJSON(message.payload[field])}}</span>
        </p>
      </li>
    </ul>
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
    assetMeta() {
      return this.$store.state.app.assets.reduce(function(accum, currentVal) {
        accum[currentVal.payload.asset] = currentVal.payload.shortName +' ($'+ currentVal.payload.ticker +')';
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
