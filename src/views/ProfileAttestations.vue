<template>
  <div>
    <ProfileHero
      :address="$route.params.address"
      :attestations="attestations"
    />
    <div class="container-md p-responsive py-4">
      <ProfileNav
        :address="$route.params.address"
        :attestations="attestations"
      />
      <Feed
        :feed="attestations"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    attestations () {
      const attestations = this.$store.state.attestations[this.$route.params.address] || [];
      if (attestations.messages)
        attestations.messages = JSON.parse(JSON.stringify(attestations.messages)).reverse();
      return attestations;
    },
  },
  methods: mapActions([
    'getAttestations',
  ]),
  created() {
    this.getAttestations(this.$route.params.address);
  }
}
</script>