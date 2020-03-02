<template>
  <div class="w-100">
    <h2 class="mb-2">
      <router-link :to="'/u/' + message.unit">
        <span>{{message.payload.question}}</span>
      </router-link>
    </h2>
    <ul class="Box Box--condensed d-inline-block w-100">
      <li class="Box-row" v-for="(choice, index) in message.payload.choices" :key="index">
        <p class="m-0">
          <label class="text-normal">
            <!--<input class="mr-2" type="radio" name="hireme" value="on">-->
            {{choice}}
          </label>
        </p>
      </li>
    </ul>
    <div class="mt-2">
      <span><a :href="'obyte:AhMVGrYMCoeOHUaR9v/CZzTC34kScUeA4OBkRCxnWQM+@obyte.org/bb#poll-' + message.unit">Vote on this poll</a></span>
      <span> | <a :href="'obyte:AhMVGrYMCoeOHUaR9v/CZzTC34kScUeA4OBkRCxnWQM+@obyte.org/bb#attested-' + message.unit">See results by attested users</a></span>
      <span> | <a :href="'obyte:AhMVGrYMCoeOHUaR9v/CZzTC34kScUeA4OBkRCxnWQM+@obyte.org/bb#stats-' + message.unit">See results by balances</a></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message'],
}
</script>
