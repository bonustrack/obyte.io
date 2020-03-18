<template>
  <div>
    <div class="container-md py-8 p-responsive text-center">
      <h1>dApps (Autonomous Agents)</h1>
      <p v-if="items.length != 0">
        {{items.length}} dApps available
      </p>
    </div>
    <div class="container p-responsive">
      <div class="text-center mb-4">
        <input
          v-if="items.length != 0"
          v-model="query"
          type="text"
          placeholder="Search"
          class="form-control input-lg mb-2"
        />
      </div>
      <MessageBlank v-if="items.length === 0"/>
      <div class="columns overflow-hidden mb-5">
        <div
          v-for="(dapp, index) in filteredList" :key="index"
          class="column one-half clearfix p-0"
        >
          <div
            class="Box d-flex flex-column box-shadow m-2 p-4"
            style="height: 400px;"
          >
            <h4 class="mb-2">
              <router-link class="mb-3" :to="'/@' + dapp.payload.address">
                <span>{{dapp.payload.address}}</span>
              </router-link>
              <span v-if="getVerifiedStatus(dapp.payload.address)" class="tooltipped tooltipped-n float-right" aria-label="Verified">
                <span class="octicon octicon-verified mb-1"></span>
              </span>
            </h4>
            <router-link class="mb-3" :to="'/u/' + dapp.unit">
              <span>#{{dapp.unit | truncate(10)}}</span>
              <span v-if="dapp.source.version" class="float-right">v{{dapp.source.version | truncate(10)}}</span>
            </router-link>
            <p v-if="dapp.source.description">{{dapp.source.description | truncate(1000)}}</p>
            <div v-if="dapp.payload.definition[0] === 'autonomous agent'" class="mb-2">
              <a :href="'obyte:' + dapp.payload.address" class="btn">
                Interact with Autonomous Agent
              </a>
            </div>
            <div v-if="dapp.source.homepage_url || dapp.source.source_url" class="mb-2">
              <a v-if="dapp.source.homepage_url" :href="dapp.source.homepage_url | truncate(1000)" target="_blank" class="btn btn-blue mr-2">
                Home page
              </a>
              <a v-if="dapp.source.source_url" :href="dapp.source.source_url | truncate(1000)" target="_blank" class="btn btn-blue">
                Source code
              </a>
            </div>
            <!--
            <h6>Issuer: {{dapp.payload.issuer}}</h6>
            -->
          </div>
        </div>
        <div v-if="items.length != 0" class="column one-half clearfix p-0">
          <div
            class="Box d-flex flex-column box-shadow m-2 p-4"
            style="height: 400px;"
          >
            <h3 class="mb-2">
              <a
                href="https://developer.obyte.org/autonomous-agents"
                target="_blank"
              >
                Writing dApps on Obyte
              </a>
            </h3>
            <div class="mb-2">
              <a
                href="https://developer.obyte.org/autonomous-agents"
                target="_blank"
                class="btn btn-blue"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/helpers/utils';
import { mapActions } from 'vuex';

export default {
  data () {
    return {
      query: this.$route.query.q,
    }
  },
  computed: {
    items () {
      return this.$store.state.app.dapps || [];
    },
    filteredList() {
      return this.$store.state.app.dapps.filter(dapp => {
        const query = this.query ? this.query.toLowerCase() : '';
        return JSON.stringify(dapp).toLowerCase().includes(query);
      })
    }
  },
  methods: {
    getVerifiedStatus: (address) => utils.getVerifiedStatus(address),
    ...mapActions([
      'getDapps',
    ]),
  },
  created() {
    if (this.$store.state.app.dapps.length === 0) {
      this.getDapps();
    }
  }
}
</script>
