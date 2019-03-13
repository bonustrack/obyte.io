<template>
  <div id="nav" :class="['/', '/ico'].includes($route.path) ? 'topnav-light' : 'border-bottom'">
    <div class="p-responsive">
      <div id="menu-home">
        <router-link to="/" class="px-0">
          <svg height="24" width="24" class="v-align-middle logo">
            <circle cx="12" cy="12" r="9" stroke-width="3" fill="transparent"></circle>
          </svg>
        </router-link>
        <router-link to="/" style="font-size: 20px; color: black;">obyte</router-link>
      </div>
      <div id="menu-items">
        <router-link to="/assets">Assets</router-link>
        <router-link to="/attestors">Attestors</router-link>
        <router-link to="/oracles">Oracles</router-link>
        <router-link to="/bots">Bots</router-link>
        <router-link to="/witnesses">Witnesses</router-link>
        <router-link to="/polls">Polls</router-link>
        <router-link to="/timeline">Timeline</router-link>
      </div>
      <div id="menu-profile">
        <!--
        <div v-if="!app.address">
          <span v-if="!app.rate.price_usd" class="octicon octicon-primitive-dot anim-pulse pr-0"></span>
          <a
            v-if="app.rate.price_usd"
            class="pr-0"
            href="https://bittrex.com/Market/Index?MarketName=BTC-GBYTE"
            target="_blank"
            rel="noopener"
          >
            <span class="octicon octicon-graph"></span>
            1 GB =
            <span>
              ${{ parseFloat(app.rate.price_usd).toFixed(0) }}
              ({{ parseFloat(app.rate.price_btc).toFixed(3) }} BTC)
            </span>
          </a>
        </div>
        -->
        <div v-if="!app.address">
          <router-link to="/about">About</router-link>
          <router-link to="/create">Get started</router-link>
          <router-link v-if="app.hasUserList" to="/login">Log in</router-link>
        </div>
        <div v-else>
          <router-link :to="'/@' + app.address">
            <span v-if="app.name" class="mr-2">{{app.name}}</span>
            <Avatar :address="app.address" size="26"/>
          </router-link>
          <router-link to="/editor">
            <span class="octicon octicon-pencil f3"></span>
          </router-link>
          <router-link to="/wallet">
            <span class="octicon octicon-briefcase f3"></span>
          </router-link>
          <router-link to="/settings" class="pr-0">
            <span class="octicon octicon-gear f3"></span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    app () {
      return this.$store.state.app;
    },
  },
  methods: {
    ...mapActions([
      'getRate',
    ]),
  },
  created() {
    /*
    setInterval(() => {
      this.getRate();
    }, 5000);
    */
    this.getRate();
  }
}
</script>

<style lang="less">
@import '../vars';

#nav {
  width: auto;
  white-space: nowrap;
  //height: @topnav-height;
  line-height: calc(@topnav-height - 4px);
  background-color: @background-color;
  position: fixed;
  overflow: hidden;
  top:0;
  left: 0;
  right: 0;
  z-index: 9;

  &.topnav-light {
    background-color: rgba(0,0,0,0.75) !important;
    color: white !important;
    position: absolute;

    a {
      color: white !important;
    }
    @media screen and (min-width: 768px) {
      background-color: transparent !important;
    }
  }

  a {
    height: @topnav-height;
    display: inline-block;
    color: @text-color;
    text-decoration: none;
    padding: 0 5px;
    font-size: 16px;
    &.router-link-exact-active {
      color: @primary-color;
    }
  }
}

.logo circle {
  stroke: @primary-color;
}
#menu-home, #menu-items {
  float: left;
}
#menu-items {
  a {
    float: left;
  }
}
#menu-profile {
  top: 0;
  right: 0;
  text-align: right;
}
</style>
