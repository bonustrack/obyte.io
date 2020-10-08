<template>
  <!--
  <pre class="markdown-body" style="text-overflow: ellipsis; overflow: hidden;">{{JSON.stringify(message.payload, null, 4)}}</pre>
  -->
  <div v-if="['AM6GTUKENBYA54FYDAKX2VLENFZIMXWG', 'O6H6ZIFI57X3PLTYHOCVYPP5A553CYFQ'].includes(message.unit_authors[0])" class="w-100">
    <p>
      Registered
      <router-link :to="'/u/' + message.payload.asset">
        <span class="monospace">{{message.payload.asset}}</span>
      </router-link>
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
  <div v-else-if="odexMatch(message)" class="w-100">
    <p>
      Matched orders on
      <router-link :to="'/@' + message.payload.order1.signed_message.aa">
        <span class="monospace">{{message.payload.order1.signed_message.aa}}</span>
      </router-link>
      <span v-if="getVerifiedStatus(message.payload.order1.signed_message.aa)" class="tooltipped tooltipped-n ml-1" aria-label="Verified">
        <span class="octicon octicon-verified mb-1"></span>
      </span>
    </p>
    <ul class="Box Box--condensed d-inline-block w-100">
      <li v-if="message.payload.order1.authors[0].address != message.payload.order1.signed_message.address" class="Box-row">
        <p class="m-0">
          <span class="text-bold">Maker signed by: </span>
          <router-link :to="'/@' + message.payload.order1.authors[0].address">
            <span class="monospace">{{message.payload.order1.authors[0].address}}</span>
          </router-link>
        </p>
      </li>
      <li class="Box-row">
        <p class="m-0">
          <span class="text-bold">Maker address: </span>
          <router-link :to="'/@' + message.payload.order1.signed_message.address">
            <span class="monospace">{{message.payload.order1.signed_message.address}}</span>
          </router-link>
        </p>
      </li>
      <li class="Box-row">
        <p class="m-0">
          <span class="text-bold">Maker sells: </span>
          <span v-if="message.payload.order1.signed_message.sell_asset === 'base'" class="pre">{{message.payload.order1.signed_message.sell_amount | niceBytes}}</span>
          <span v-else-if="message.payload.order1.signed_message.sell_asset !== 'base' && assetMetaData[message.payload.order1.signed_message.sell_asset]" class="pre">{{message.payload.order1.signed_message.sell_amount | niceAsset(assetMetaData[message.payload.order1.signed_message.sell_asset].decimals)}} {{assetMetaData[message.payload.order1.signed_message.sell_asset].assetName}}</span>
          <span v-else>Calculating ...</span>
        </p>
      </li>
      <li class="Box-row">
        <p class="m-0">
          <span class="text-bold">Maker price: </span>
          <span v-if="message.payload.order1.signed_message.buy_asset === 'base' && assetMetaData[message.payload.order1.signed_message.sell_asset]" class="pre">{{message.payload.order1.signed_message.price * (10 ** assetMetaData[message.payload.order1.signed_message.sell_asset].decimals) | niceBytes}}</span>
          <span v-else-if="message.payload.order1.signed_message.buy_asset !== 'base' && assetMetaData[message.payload.order1.signed_message.sell_asset] && assetMetaData[message.payload.order1.signed_message.buy_asset]" class="pre">{{message.payload.order1.signed_message.price * (10 ** assetMetaData[message.payload.order1.signed_message.sell_asset].decimals) | niceAsset(assetMetaData[message.payload.order1.signed_message.buy_asset].decimals)}} {{assetMetaData[message.payload.order1.signed_message.buy_asset].assetName}}</span>
          <span v-else>Calculating ...</span>
        </p>
      </li>
      <li class="Box-row">
        <p class="m-0">
          <span class="text-bold">Maker fee: </span>
          <span v-if="message.payload.order1.signed_message.matcher_fee_asset === 'base'" class="pre">{{message.payload.order1.signed_message.matcher_fee | niceBytes}}</span>
          <span v-else-if="message.payload.order1.signed_message.matcher_fee_asset !== 'base' && assetMetaData[message.payload.order1.signed_message.matcher_fee_asset]" class="pre">{{message.payload.order1.signed_message.matcher_fee | niceAsset(assetMetaData[message.payload.order1.signed_message.matcher_fee_asset].decimals)}} {{assetMetaData[message.payload.order1.signed_message.matcher_fee_asset].assetName}}</span>
          <span v-else>Calculating ...</span>
        </p>
      </li>
      <li v-if="message.payload.order2.authors[0].address != message.payload.order2.signed_message.address" class="Box-row">
        <p class="m-0">
          <span class="text-bold">Taker signed by: </span>
          <router-link :to="'/@' + message.payload.order2.authors[0].address">
            <span class="monospace">{{message.payload.order2.authors[0].address}}</span>
          </router-link>
        </p>
      </li>
      <li class="Box-row">
        <p class="m-0">
          <span class="text-bold">Taker address: </span>
          <router-link :to="'/@' + message.payload.order2.signed_message.address">
            <span class="monospace">{{message.payload.order2.signed_message.address}}</span>
          </router-link>
        </p>
      </li>
      <li class="Box-row">
        <p class="m-0">
          <span class="text-bold">Taker sells: </span>
          <span v-if="message.payload.order2.signed_message.sell_asset === 'base'" class="pre">{{message.payload.order2.signed_message.sell_amount | niceBytes}}</span>
          <span v-else-if="message.payload.order2.signed_message.sell_asset !== 'base' && assetMetaData[message.payload.order2.signed_message.sell_asset]" class="pre">{{message.payload.order2.signed_message.sell_amount | niceAsset(assetMetaData[message.payload.order2.signed_message.sell_asset].decimals)}} {{assetMetaData[message.payload.order2.signed_message.sell_asset].assetName}}</span>
          <span v-else>Calculating ...</span>
        </p>
      </li>
      <li class="Box-row">
        <p class="m-0">
          <span class="text-bold">Taker price: </span>
          <span v-if="message.payload.order2.signed_message.buy_asset === 'base' && assetMetaData[message.payload.order2.signed_message.sell_asset]" class="pre">{{message.payload.order2.signed_message.price * (10 ** assetMetaData[message.payload.order2.signed_message.sell_asset].decimals) | niceBytes}}</span>
          <span v-else-if="message.payload.order2.signed_message.buy_asset !== 'base' && assetMetaData[message.payload.order2.signed_message.sell_asset] && assetMetaData[message.payload.order2.signed_message.buy_asset]" class="pre">{{message.payload.order2.signed_message.price * (10 ** assetMetaData[message.payload.order2.signed_message.sell_asset].decimals) | niceAsset(assetMetaData[message.payload.order2.signed_message.buy_asset].decimals)}} {{assetMetaData[message.payload.order2.signed_message.buy_asset].assetName}}</span>
          <span v-else>Calculating ...</span>
        </p>
      </li>
      <li class="Box-row">
        <p class="m-0">
          <span class="text-bold">Taker fee: </span>
          <span v-if="message.payload.order2.signed_message.matcher_fee_asset === 'base'" class="pre">{{message.payload.order2.signed_message.matcher_fee | niceBytes}}</span>
          <span v-else-if="message.payload.order2.signed_message.matcher_fee_asset !== 'base' && assetMetaData[message.payload.order2.signed_message.matcher_fee_asset]" class="pre">{{message.payload.order2.signed_message.matcher_fee | niceAsset(assetMetaData[message.payload.order2.signed_message.matcher_fee_asset].decimals)}} {{assetMetaData[message.payload.order2.signed_message.matcher_fee_asset].assetName}}</span>
          <span v-else>Calculating ...</span>
        </p>
      </li>
    </ul>
  </div>
  <ul v-else class="Box Box--condensed d-inline-block w-100">
    <li class="Box-row" v-for="(field, index) in Object.keys(message.payload)" :key="index">
      <p class="m-0">
        <span class="text-bold">{{field}}: </span>
        <span class="pre">{{textOrJSON(message.payload[field])}}</span>
      </p>
    </li>
  </ul>
</template>

<script>
import utils from '@/helpers/utils';
import { mapActions } from 'vuex';

export default {
  props: ['message'],
  methods: {
    odexMatch(message) {
      if (!message.payload.order1 || !message.payload.order2) return false;
      if (!message.payload.order1.authors[0] || !message.payload.order1.authors[0].address) return false;
      if (!message.payload.order2.authors[0] || !message.payload.order2.authors[0].address) return false;
      const order1Message = message.payload.order1.signed_message || null;
      const order2Message = message.payload.order2.signed_message || null;
      if (!order1Message || !order2Message) return false;
      if (!order1Message.address || !order2Message.address) return false;
      if (!order1Message.matcher || !order2Message.matcher) return false;
      if (order1Message.matcher !== order2Message.matcher) return false;
      if (!order1Message.aa || !order2Message.aa) return false;
      if (order1Message.aa !== order2Message.aa) return false;
      if (!message.unit_authors.includes(order1Message.matcher)) return false;
      return true;
    },
    textOrJSON: json => utils.textOrJSON(json),
    getVerifiedStatus: address => utils.getVerifiedStatus(address),
    ...mapActions([
      'getAssets',
    ]),
  },
  computed: {
    assetMetaData() {
      const assets = this.$store.state.app.assets.reduce((accum, currentVal) => {
        const newArray = accum;
        newArray[currentVal.assetId] = currentVal;
        return newArray;
      }, {});
      assets.base = { assetName: 'Gigabytes ($GBYTE)', decimals: 9 };
      return assets;
    },
    filteredPayload() {
      return Object.keys(this.message.payload).filter(field => field !== 'asset');
    },
  },
  created() {
    if (!this.$store.state.app.assetsIsLoaded && !this.$store.state.app.assetsIsLoading) {
      this.getAssets();
    }
  },
};
</script>
