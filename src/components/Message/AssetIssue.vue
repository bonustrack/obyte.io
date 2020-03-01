<template>
  <div class="w-100">
    <p>Issued {{$n(message.payload['inputs'][0].amount)}}
      <router-link v-if="message.payload['asset']" :to="'/u/' + message.payload['asset']">
        <span>{{message.payload['asset']}}</span>
      </router-link>
      <span v-else>bytes</span>
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
import utils from '@/helpers/utils';

export default {
  props: ['message'],
  methods: {
    textOrJSON: (json) => utils.textOrJSON(json),
  },
}
</script>
