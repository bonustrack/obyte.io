<template>
  <div>
    <div class="mb-4">
      <div
        v-if="app.balancesIsLoaded && app.rate.price_usd"
        class="box-shadow bg-white"
      >
        <div class="columns p-3 border-bottom">
          <div class="column one-half v-align-middle">Coin</div>
          <div class="column one-fourth text-right">Holding</div>
          <div class="column one-fourth text-right">Price</div>
        </div>
        <div
          class="columns p-3 border-bottom"
          v-for="(balance, index) in balances" :key="index"
        >
          <div class="column one-half v-align-middle">
            <p><Avatar size="24" :address="index"/> {{index}}</p>
          </div>
          <div class="column one-fourth text-right">
            <h4>{{balance === 0 ? '-' : $n(balance)}}</h4>
            <span v-if="index === 'bytes'">
              {{balance === 0 ? '-' : $n((balance / 1000000000 * app.rate.price_usd), 'currency')}}
            </span>
            <span v-else>-</span>
          </div>
          <div class="column one-fourth text-right">
            <h4>{{index === 'bytes' ? $n(app.rate.price_usd, 'currency') : '-'}}</h4>
            <span v-if="index === 'bytes'">
              <span v-if="app.rate.percent_change_24h > 0" class="text-green">
                +{{$n(app.rate.percent_change_24h)}}%
              </span>
              <span v-if="app.rate.percent_change_24h == 0">
                {{$n(app.rate.percent_change_24h)}}%
              </span>
              <span v-if="app.rate.percent_change_24h < 0" class="text-red">
                {{$n(app.rate.percent_change_24h)}}%
              </span>
            </span>
          </div>
        </div>
      </div>
      <span class="octicon octicon-primitive-dot anim-pulse pr-0" v-else></span>
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
    balances() {
      return this.$store.state.app.balances && this.$store.state.app.balances.bytes
        ? this.$store.state.app.balances : { bytes: 0 };
    },
  },
  methods: mapActions([
    'getBalances',
  ]),
  created() {
    if (!this.$store.state.app.balancesIsLoaded && !this.$store.state.app.isLoading) {
      this.getBalances();
    }
  },
};
</script>
