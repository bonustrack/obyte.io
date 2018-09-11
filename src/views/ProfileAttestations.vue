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
      return this.$store.state.attestations[this.$route.params.address] || [];
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