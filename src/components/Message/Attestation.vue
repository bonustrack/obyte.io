<template>
  <div class="w-100">
    <p>
      Attested
      <router-link :to="'/@' + message.payload.address">
        <span>{{message.payload.address}}</span>
      </router-link>
      <span v-if="getVerifiedStatus(message.payload.address)" class="tooltipped tooltipped-n ml-1" aria-label="Verified">
        <span class="octicon octicon-verified mb-1"></span>
      </span>
    </p>
    <ul class="Box Box--condensed d-inline-block w-100">
      <li class="Box-row" v-for="(field, index) in Object.keys(message.payload.profile)" :key="index">
        <p class="m-0">
          <span class="text-bold">{{field}}:</span>
          {{message.payload.profile[field]}}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import utils from '@/helpers/utils';

export default {
  props: ['message'],
  methods: {
    getVerifiedStatus: address => utils.getVerifiedStatus(address),
  },
};
</script>
