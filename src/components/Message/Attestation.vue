<template>
  <div>
    <p>
      Attested
      <router-link :to="'/@' + message.payload.address">
        {{message.payload.address}}
      </router-link>
    </p>
    <ul class="Box Box--condensed d-inline-block">
      <li class="Box-row" v-for="field in Object.keys(message.payload.profile)">
        <p class="m-0">
          <span class="text-bold">{{field}}:</span>
          {{message.payload.profile[field]}}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['message'],
}
</script>
