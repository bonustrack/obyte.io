<template>
  <div class="w-100">
    <p>
      Attested
      <router-link :to="'/@' + message.payload.address">
        {{message.payload.address}}
      </router-link>
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
export default {
  props: ['message'],
}
</script>
