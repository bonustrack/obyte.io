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
      <span v-if="items.length === 0" class="octicon octicon-primitive-dot anim-pulse pr-0"></span>
      <div class="columns overflow-hidden mb-5">
        <div
          v-for="asset in filteredList"
          v-if=""
          class="column one-third clearfix p-0"
        >
          <div
            class="Box d-flex flex-column box-shadow m-2 p-4"
            style="height: 400px;"
          >
            <h3>
              <span class="h4 float-right">{{asset.payload.ticker}}</span>
              <span style="color: black;">{{asset.payload.shortName}}</span>
            </h3>
            <a
              target="_blank"
              class="mb-3"
               :href="'https://obyte.io/joint/' + asset.payload.asset">
              #{{asset.payload.asset | truncate(5)}}
            </a>
            <p v-if="asset.payload.description">{{asset.payload.description | truncate(150)}}</p>
            <h6>Issuer: {{asset.payload.issuer}}</h6>
          </div>
        </div>
        <div v-if="items.length != 0" class="column one-third clearfix p-0">
          <div
            class="Box d-flex flex-column box-shadow m-2 p-4"
            style="height: 400px;"
          >
            <h3 class="mb-2">
              <a
                href="https://obyte.app"
                target="_blank"
              >
                Create your own asset
              </a>
            </h3>
            <div class="mb-2">
              <a
                href="https://obyte.app"
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
