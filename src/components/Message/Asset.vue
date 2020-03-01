<template>
  <div class="w-100">
    <p>Defined {{message.payload.cap ? $n(message.payload.cap) : 'unlimited'}} {{message.unit}}</p>
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

export default {
  props: ['message'],
  methods: {
    textOrJSON: (json) => utils.textOrJSON(json),
  },
  computed: {
    filteredPayload: function () {
      return Object.keys(this.message.payload).filter(function (field, index) {
        return field!=='cap'; 
      })
    }
  },
}
</script>
