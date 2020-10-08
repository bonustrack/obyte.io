<template>
  <div class="w-100">
    <p v-if="message.payload.address">
      Deployed
      <router-link :to="'/@' + message.payload.address">
        <span class="monospace">{{message.payload.address}}</span>
      </router-link>
      <span v-if="getVerifiedStatus(message.payload.address)" class="tooltipped tooltipped-n ml-1" aria-label="Verified">
        <span class="octicon octicon-verified mb-1"></span>
      </span>
    </p>
    <ul class="Box Box--condensed d-inline-block w-100">
      <li class="Box-row" v-for="(field, index) in dappMetaData[message.payload.address]" :key="index">
        <p class="m-0">
          <span class="text-bold">{{index}}: </span>
          <span class="pre">{{textOrJSON(dappMetaData[message.payload.address][index])}}</span>
        </p>
      </li>
      <li class="Box-row" v-if="message.payload.definition">
        <p class="m-0">
          <span v-if="$route.name === 'unit'" class="pre">{{filteredDefinition}}</span>
          <span v-else class="pre">{{filteredDefinition | truncate(1000)}}</span>
        </p>
      </li>
      <li class="Box-row" v-for="(field, index) in filteredPayload" :key="index">
        <p class="m-0">
          <span class="text-bold">{{field}}: </span>
          <span class="pre">{{textOrJSON(message.payload[field])}}</span>
        </p>
      </li>
    </ul>
    <div class="mt-2" v-if="message.payload.address && message.payload.definition">
      <span v-if="message.payload.definition[0] === 'autonomous agent'"><a :href="'obyte:' + message.payload.address">Interact with Autonomous Agent</a></span>
      <span v-if="message.payload.definition[1]['base_aa']"> | <router-link :to="'/@' + message.payload.definition[1]['base_aa']">Based on AA</router-link></span>
    </div>
  </div>
</template>

<script>
import utils from '@/helpers/utils';
import { mapActions } from 'vuex';

export default {
  props: ['message'],
  methods: {
    textOrJSON: json => utils.textOrJSON(json),
    getVerifiedStatus: address => utils.getVerifiedStatus(address),
    ...mapActions([
      'getDapps',
    ]),
  },
  computed: {
    dappMetaData() {
      return this.$store.state.app.dapps.reduce((accum, currentVal) => {
        const newArray = accum;
        newArray[currentVal.payload.address] = currentVal.source;
        return newArray;
      }, {});
    },
    filteredDefinition() {
      return utils.textOrJSON(this.message.payload.definition).replace(/\\n/g, '\n').replace(/\\t/g, '   ');
    },
    filteredPayload() {
      return Object.keys(this.message.payload).filter(field => field !== 'address' && field !== 'definition');
    },
  },
  created() {
    if (this.$store.state.app.dapps.length === 0) {
      this.getDapps();
    }
  },
};
</script>
