<template>
  <div class="w-100">
    <p>Issued {{$n(message.payload.cap)}} {{message.unit}}</p>
    <ul class="Box Box--condensed d-inline-block w-100">
      <li class="Box-row" v-if="field!=='cap'" v-for="field in Object.keys(message.payload)">
        <p class="m-0">
          <span class="text-bold">{{field}}:</span>
          {{message.payload[field]}}
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
