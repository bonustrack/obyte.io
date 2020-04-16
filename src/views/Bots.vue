<template>
  <div>
    <div class="container-md py-8 p-responsive text-center">
      <h1>Chatbots</h1>
      <p v-if="items.length != 0">
        {{items.length}} chatbots available
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
          v-for="(bot, index) in filteredList" :key="index"
          class="column one-third clearfix p-0"
        >
          <div
            class="Box d-flex flex-column box-shadow m-2 p-4"
            style="height: 400px;"
          >
            <h3 class="mb-2">
              <a :href="'obyte:' + bot.pairing_code">
                {{bot.name}}
              </a>
            </h3>
            <p class="mb-3">{{bot.description | truncate(200)}}</p>
            <div class="mb-2">
              <a :href="'obyte:' + bot.pairing_code" class="btn">
                Add chatbot
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
                href="https://developer.obyte.org/"
                target="_blank"
              >
                Writing chatbots for Obyte
              </a>
            </h3>
            <div class="mb-2">
              <a
                href="https://developer.obyte.org/"
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
