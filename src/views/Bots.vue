<template>
  <div>
    <div class="container-md py-8 p-responsive text-center">
      <h1>Bots</h1>
      <p v-if="items.length != 0">
        {{items.length}} bots available
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
          v-for="bot in filteredList"
          class="column one-third clearfix p-0"
        >
          <div
            class="Box d-flex flex-column box-shadow m-2 p-4"
            style="height: 400px;"
          >
            <h3 class="mb-2">
              <a :href="'byteball:' + bot.pairing_code">
                {{bot.name}}
              </a>
            </h3>
            <p class="mb-3">{{bot.description | truncate(100)}}</p>
            <div class="mb-2">
              <a :href="'byteball:' + bot.pairing_code" class="btn">
                Add bot
              </a>
            </div>
          </div>
        </div>
        <div v-if="items.length != 0" class="column one-third clearfix p-0">
          <div
            class="Box d-flex flex-column box-shadow m-2 p-4"
            style="height: 400px;"
          >
            <h3 class="mb-2">
              <a
                href="https://github.com/byteball/byteballcore/wiki/Writing-chatbots-for-Byteball"
                target="_blank"
              >
                Writing chatbots for Byteball
              </a>
            </h3>
            <div class="mb-2">
              <a
                href="https://github.com/byteball/byteballcore/wiki/Writing-chatbots-for-Byteball"
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
      return this.$store.state.app.bots || [];
    },
    filteredList() {
      return this.$store.state.app.bots.filter(bot => {
        const query = this.query ? this.query.toLowerCase() : '';
        return JSON.stringify(bot).toLowerCase().includes(query);
      })
    }
  },
  methods: mapActions([
    'getBots',
  ]),
  created() {
    if (this.$store.state.app.bots.length === 0) {
      this.getBots();
    }
  }
}
</script>
