<template>
  <div>
    <div class="container-md p-responsive">
      <h1 class="py-8 text-center">Attestors</h1>
    </div>
    <ul class="container-md p-responsive">
      <MessageLoading v-if="attestors.length === 0"/>
      <li v-for="(attestor, index) in attestors" :key="index" class="d-block width-full py-4 clearfix border-bottom">
        <div class="flex-content-start mb-1">
          <router-link :to="'/@' + attestor.unit_authors[0]">
            <span class="float-left mr-3">
              <Avatar size="44" :address="attestor.unit_authors[0]"/>
            </span>
          </router-link>
          <div>
            <router-link :to="'/@' + attestor.unit_authors[0]" class="mr-1">
              <span>{{attestor.unit_authors[0]}}</span>
            </router-link>
          </div>
        </div>
        <div class="d-flex">
          <div>
            <h2>{{attestor.unit_authors[0] | name('attestor_name')}}</h2>
            <p>{{$n(attestor.count)}} attestation(s)</p>
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
    attestors () {
      return this.$store.state.app.attestors || [];
    },
  },
  methods: mapActions([
   'getAttestors',
  ]),
  created() {
    if (this.$store.state.app.attestors.length === 0) {
      this.getAttestors();
    }
  }
}
</script>
