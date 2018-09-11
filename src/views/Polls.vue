<template>
  <div class="container-md p-responsive">
    <div class="py-8 text-center">
      <h1>Polls</h1>
    </div>
    <Feed
      :get-more="getPolls"
      :feed="polls"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    polls () {
      return this.$store.state.polls.created;
    },
  },
  methods: mapActions([
    'getPolls',
  ]),
  created() {
    this.getPolls();
  }
}
</script>
