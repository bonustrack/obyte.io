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
        :get-more="getMore"
        :feed="messages"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    messages() {
      return this.$store.state.messages[this.$route.params.address] || [];
    },
    attestations() {
      let attestations = this.$store.state.attestations[this.$route.params.address] || [];
      attestations = JSON.parse(JSON.stringify(attestations));
      if (attestations.messages) { attestations.messages.reverse(); }
      return attestations;
    },
  },
  methods: {
    getMore() {
      this.getMessages(this.$route.params.address);
    },
    ...mapActions([
      'getMessages',
      'getAttestations',
    ]),
  },
  created() {
    this.getMessages(this.$route.params.address);
    this.getAttestations(this.$route.params.address);
  },
};
</script>
