<template>
  <div class="w-100">
    <p v-if="message.payload.address">
      Deployed
      <router-link :to="'/@' + message.payload.address">
        <span>{{message.payload.address}}</span>
      </router-link>
    </p>
    <ul class="Box Box--condensed d-inline-block w-100">
      <li class="Box-row" v-if="message.payload.definition">
        <p class="m-0">
          <span class="pre">{{textOrJSON(message.payload.definition)}}</span>
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
      <span v-if="message.payload.definition[1]['doc_url']"> | <a :href="message.payload.definition[1]['doc_url']" target="_blank">Documentation</a></span>
      <span v-if="message.payload.definition[1]['base_aa']"> | <router-link :to="'/@' + message.payload.definition[1]['base_aa']">Based on AA</router-link></span>
    </div>
  </div>
</template>

<script>
import utils from '@/helpers/utils';

export default {
  props: ['message'],
  methods: {
    textOrJSON: (json) => utils.textOrJSON(json),
  },
  computed: {
    filteredPayload: function () {
      return Object.keys(this.message.payload).filter(function (field, index) {
        return field!=='address' && field!=='definition'; 
      })
    }
  },
}
</script>
