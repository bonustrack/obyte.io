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
      <li class="Box-row" v-if="field!=='asset'" v-for="field in Object.keys(message.payload)">
        <p class="m-0">
          <span class="text-bold">{{field}}:</span>
          {{message.payload[field]}}
        </p>
      </li>
    </ul>
  </div>
  <ul v-else class="Box Box--condensed d-inline-block w-100">
    <li class="Box-row" v-for="field in Object.keys(message.payload)">
      <p class="m-0">
        <span class="text-bold">{{field}}:</span>
        {{message.payload[field]}}
      </p>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['message'],
}
</script>
