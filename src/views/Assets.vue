<template>
  <div>
    <div class="container-md py-8 p-responsive text-center">
      <h1>Assets</h1>
      <p v-if="items.length != 0">
        {{filteredList.length}} assets available
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
              <span v-if="asset.ticker && asset.shortName" class="h4 float-right">{{asset.ticker}}</span>
              <span v-if="asset.shortName" style="color: black;">{{asset.shortName}}</span>
              <span v-else-if="asset.name" style="color: black;">{{asset.name}}</span>
            </h3>
            <router-link class="mb-3" :to="'/u/' + asset.assetId">
              <span class="monospace">#{{asset.assetId | truncate(22)}}</span>
            </router-link>
            <p v-if="asset.description">{{asset.description | truncate(200)}}</p>
            <h6 v-if="asset.issuer">Issuer: {{asset.issuer}}</h6>
          </div>
        </div>
        <div v-if="items.length != 0" class="column one-third clearfix p-0">
          <div
            class="Box d-flex flex-column box-shadow m-2 p-4"
            style="height: 400px;"
          >
            <h3 class="mb-2">Create your own asset</h3>
            <div class="mb-2">
              <a
                href="https://asset.obyte.app/"
                target="_blank"
                class="btn btn-blue"
              >
                obyte.app
              </a>
            </div>
            <div class="mb-2">
              <a
                href="https://tokens.ooo/"
                target="_blank"
                class="btn btn-blue"
              >
                tokens.ooo
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
  data() {
    return {
      query: this.$route.query.q,
    };
  },
  computed: {
    items() {
      return this.$store.state.app.assets || [];
    },
    filteredList() {
      return this.items.filter((asset) => {
        const query = this.query ? this.query.toLowerCase() : '';
        return JSON.stringify(asset).toLowerCase().includes(query);
      });
    },
  },
  methods: mapActions([
    'getAssets',
  ]),
  created() {
    if (!this.$store.state.app.assetsIsLoaded && !this.$store.state.app.assetsIsLoading) {
      this.getAssets();
    }
  },
};
</script>
