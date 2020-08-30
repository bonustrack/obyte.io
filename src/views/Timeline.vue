<template>
  <div class="container-md p-responsive">
    <div class="py-8 text-center">
      <h1>Timeline</h1>
    </div>
    <Feed
      :get-more="getTimeline"
      :feed="timeline"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    timeline() {
      return this.$store.state.timeline.created;
    },
  },
  methods: mapActions([
    'getTimeline',
  ]),
  created() {
    this.getTimeline();
  },
};
</script>
