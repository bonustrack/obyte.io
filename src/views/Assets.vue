<template>
  <div>
    <div class="container-md py-8 p-responsive text-center">
      <h1>Assets</h1>
      <p v-if="items.length != 0">
        {{items.length}} assets available
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
          v-for="(asset, index) in filteredList" :key="index"
          class="column one-third clearfix p-0"
        >
          <div
            class="Box d-flex flex-column box-shadow m-2 p-4"
            style="height: 400px;"
          >
            <h3>
              <span v-if="asset.payload.ticker && asset.payload.shortName" class="h4 float-right">{{asset.payload.ticker}}</span>
              <span v-if="asset.payload.shortName" style="color: black;">{{asset.payload.shortName}}</span>
              <span v-else-if="asset.payload.name" style="color: black;">{{asset.payload.name}}</span>
            </h3>
            <router-link class="mb-3" :to="'/u/' + asset.payload.asset">
              <span>#{{asset.payload.asset | truncate(10)}}</span>
            </router-link>
            <p v-if="asset.payload.description">{{asset.payload.description | truncate(150)}}</p>
            <h6 v-if="asset.payload.issuer">Issuer: {{asset.payload.issuer}}</h6>
          </div>
        </div>
        <div v-if="items.length != 0" class="column one-third clearfix p-0">
          <div
            class="Box d-flex flex-column box-shadow m-2 p-4"
            style="height: 400px;"
          >
            <h3 class="mb-2">
              <a
                href="https://asset.obyte.app/"
                target="_blank"
              >
                Create your own asset
              </a>
            </h3>
            <div class="mb-2">
              <a
                href="hhttps://asset.obyte.app/"
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
import { mapActions } from 'vuex';

export default {
  data () {
    return {
      query: this.$route.query.q,
    }
  },
  computed: {
    items () {
      return this.$store.state.app.assets || [];
    },
    filteredList() {
      return this.$store.state.app.assets.filter(asset => {
        const query = this.query ? this.query.toLowerCase() : '';
        return JSON.stringify(asset).toLowerCase().includes(query);
      })
    }
  },
  methods: mapActions([
    'getAssets',
  ]),
  created() {
    if (this.$store.state.app.assets.length === 0) {
      this.getAssets();
    }
  }
}
</script>
