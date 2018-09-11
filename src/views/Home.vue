<template>
  <div>
    <div class="hero pt-9 pb-8 text-center border-bottom mb-4">
      <h1 class="text-white">Unstoppable data</h1>
      <p class="text-white">{{ $t("message.hello") }}</p>
    </div>
    <div class="container-md p-responsive">
      <Feed
        :get-more="getCreated"
        :feed="created"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    created () {
      return this.$store.state.messages.created;
    },
  },
  methods: mapActions([
    'getCreated',
  ]),
  created() {
    this.getCreated();
  }
}
</script>

<style lang="less" scoped>
@import '../vars';

.hero {
  margin-top: -@topnav-height;
  background-image: url("../assets/img/top-left.svg"),url("../assets/img/top-right.svg");
  background-repeat: no-repeat, no-repeat;
  background-attachment: fixed;
  background-blend-mode: color-dodge;
  background-position: calc(50% - 60px) 0,calc(50% + 60px) 0;
  background-color: #151c23;
}

@media screen and (max-width: 1200px) {
  .hero {
    background-image: url("../assets/img/top-left.svg");
    background-position: calc(50% - 100px) 0;
  }
}

</style>