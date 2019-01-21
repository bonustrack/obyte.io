<template>
  <div>
    <div class="container-md p-responsive">
      <h1 class="py-8 text-center">Oracles</h1>
    </div>
    <ul class="container-md p-responsive">
      <MessageLoading v-if="oracles.length === 0"/>
      <li v-for="oracle in oracles" class="d-block width-full py-4 clearfix border-bottom">
        <div class="flex-content-start mb-1">
          <router-link :to="'/@' + oracle.unit_authors[0]">
            <span class="float-left mr-3">
              <Avatar size="44" :address="oracle.unit_authors[0]"/>
            </span>
          </router-link>
          <div>
            <router-link :to="'/@' + oracle.unit_authors[0]" class="mr-1">
              {{oracle.unit_authors[0]}}
            </router-link>
          </div>
        </div>
        <div class="d-flex">
          <div>
            <h2>{{oracle.unit_authors[0] | name('oracle_name')}}</h2>
            <p>{{$n(oracle.count)}} data feed</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    oracles () {
      return this.$store.state.app.oracles || [];
    },
  },
  methods: mapActions([
   'getOracles',
  ]),
  created() {
    if (this.$store.state.app.oracles.length === 0) {
      this.getOracles();
    }
  }
}
</script>
