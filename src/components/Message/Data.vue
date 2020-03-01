<template>
  <!--
  <pre class="markdown-body" style="text-overflow: ellipsis; overflow: hidden;">{{JSON.stringify(message.payload, null, 4)}}</pre>
  -->
  <div v-if="message.unit_authors[0]==='AM6GTUKENBYA54FYDAKX2VLENFZIMXWG'" class="w-100">
    <p>
      Registered
      <router-link :to="'/u/' + message.payload.asset">
        {{message.payload.asset}}
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

export default {
  props: ['message'],
  methods: {
    textOrJSON: (json) => utils.textOrJSON(json),
  },
  computed: {
    filteredPayload: function () {
      return Object.keys(this.message.payload).filter(function (field, index) {
        return field!=='asset'; 
      })
    }
  },
}
</script>
