<template>
  <div>
    <h2 class="mb-2">
      <router-link :to="'/u/' + message.unit">
        {{message.payload.question}}
      </router-link>
    </h2>
    <ul class="Box Box--condensed d-inline-block">
      <li class="Box-row" v-for="choice in message.payload.choices">
        <p class="m-0">
          <label class="text-normal">
            <!--<input class="mr-2" type="radio" name="hireme" value="on">-->
            {{choice}}
          </label>
        </p>
      </li>
    </ul>
    <div class="mt-2">
      <a :href="'byteball:AhMVGrYMCoeOHUaR9v/CZzTC34kScUeA4OBkRCxnWQM+@byteball.org/bb#poll-' + message.unit">Vote on this poll</a> or
      <a :href="'byteball:AhMVGrYMCoeOHUaR9v/CZzTC34kScUeA4OBkRCxnWQM+@byteball.org/bb#stats-' + message.unit">see stats</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message'],
}
</script>
