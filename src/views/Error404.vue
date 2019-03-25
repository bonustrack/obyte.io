<template>
  <div class="container-md p-responsive py-8 text-center">
    <h1 v-if="!error">Are you lost?</h1>
    <template v-else>
      <template v-if="error === 'STEEM_ATTESTATION_NOT_FOUND'">
        <h3>
          Unable to find a Steem account attested on Obyte with the requested username.
          The Steem account has not been attested yet or might have been attested privately.
        </h3>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      error: this.$route.query.error,
    }
  },
}
</script>
