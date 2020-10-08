<template>
  <div>
    <div class="mb-4">
      <div
        v-if="app.balancesIsLoaded"
        class="box-shadow bg-white"
        style="margin-right: 16px;"
      >
        <div class="columns p-3 border-bottom">
          <div class="column one-half v-align-middle"><strong>Currency</strong></div>
          <div class="column one-fourth text-right"><strong>Balance</strong></div>
          <div class="column one-fourth text-right"><strong>Exchange price</strong></div>
        </div>
        <div
          class="columns p-3 border-bottom"
          v-for="(balance, index) in balances" :key="index"
        >
          <div class="column one-half v-align-middle">
            <p><Avatar size="24" :address="index"/> {{index == 'bytes' ? 'Obyte Bytes' : (assetMetaData[index] ? assetMetaData[index].assetName : index)}}</p>
          </div>
          <div class="column one-fourth text-right">
            <h4 v-if="index === 'bytes'">{{balance === 0 ? '-' : balance | niceBytes}}</h4>
            <h4 v-else-if="assetMetaData[index]">{{balance | niceAsset(assetMetaData[index].decimals)}}</h4>
            <h4 v-else>{{balance === 0 ? '-' : balance}}</h4>
            <span v-if="index === 'bytes' && app.rate.USD">
              {{balance === 0 ? '-' : (calculateBytesPrice(balance, app.rate.USD.price) >= 0.01 ? $n(calculateBytesPrice(balance, app.rate.USD.price), 'currency') : '$'+ calculateBytesPrice(balance, app.rate.USD.price))}}
            </span>
            <span v-else>-</span>
          </div>
          <div v-if="app.rate.USD" class="column one-fourth text-right">
            <h4>{{index === 'bytes' ? $n(app.rate.USD.price, 'currency') : '-'}}</h4>
            <span v-if="index === 'bytes'">
              <span v-if="app.rate.USD.percent_change_24h > 0" class="text-green">
                +{{$n(app.rate.USD.percent_change_24h)}}%
              </span>
              <span v-if="app.rate.USD.percent_change_24h == 0">
                {{$n(app.rate.USD.percent_change_24h)}}%
              </span>
              <span v-if="app.rate.USD.percent_change_24h < 0" class="text-red">
                {{$n(app.rate.USD.percent_change_24h)}}%
              </span>
            </span>
          </div>
          <div v-else class="column one-fourth text-right">-</div>
        </div>
      </div>
      <span class="octicon octicon-primitive-dot anim-pulse pr-0" v-else>Balances not loaded yet</span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    app() {
      return this.$store.state.app;
    },
    assetMetaData() {
      return this.$store.state.app.assets.reduce((accum, currentVal) => {
        const newArray = accum;
        newArray[currentVal.assetId] = currentVal;
        return newArray;
      }, {});
    },
    balances() {
      return this.$store.state.app.balances && this.$store.state.app.balances.bytes
        ? this.$store.state.app.balances : { bytes: 0 };
    },
  },
  methods: {
    calculateBytesPrice: (balance, rate) => (balance / 1000000000) * rate,
    ...mapActions([
      'getBalances',
      'getAssets',
    ]),
  },
  created() {
    if (!this.$store.state.app.balancesIsLoaded && !this.$store.state.app.balancesIsLoading) {
      this.getBalances();
    }
    if (!this.$store.state.app.assetsIsLoaded && !this.$store.state.app.assetsIsLoading) {
      this.getAssets();
    }
  },
};
</script>
