<template>
  <div class="container-md p-responsive">
    <div class="py-8 text-center">
      <h1>Settings</h1>
    </div>
    <div class="mb-4 columns">
      <div>
        <h2 class="mb-4">
          <router-link to="/edit-profile">
            Edit my profile
          </router-link>
        </h2>
        <h2 class="mb-4">
          <router-link to="/editor">
            Write a post
          </router-link>
        </h2>
        <h2 class="mb-4">
          <router-link to="/poll/create">
            Create a poll
          </router-link>
        </h2>
        <h2 class="mb-4">Security</h2>
        <h4>Backup phrase</h4>
        <div class="bg-blue-light border border-blue-light rounded-1 p-3 my-3">
          <button class="btn" v-if="!seedIsVisible" @click="seedIsVisible = true">Show</button>
          <span v-if="seedIsVisible">{{app.seed}}</span>
          <button class="btn" v-if="seedIsVisible" @click="seedIsVisible = false">Hide</button>
        </div>
        <h4>Public key</h4>
        <div class="bg-blue-light border border-blue-light rounded-1 p-3 my-3">
          {{app.pubkey}}
        </div>
        <h4>Definition</h4>
        <div class="bg-blue-light border border-blue-light rounded-1 p-3 my-3">
          {{JSON.stringify(app.definition)}}
        </div>
        <h4>Path</h4>
        <div class="bg-blue-light border border-blue-light rounded-1 p-3 my-3">
          {{app.path}}
        </div>
        <h4>Address</h4>
        <div class="bg-blue-light border border-blue-light rounded-1 p-3 my-3">
          {{app.address}}
        </div>
        <!--
        <p>Node address</p>
        <p>wss://obyte.org/ws</p>
        <p>Version</p>
        <p>0.0.1</p>
        -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Avatar from '@/components/Avatar';

export default {
  data() {
    return {
      seedIsVisible: false,
    };
  },
  computed: {
    app() {
      return this.$store.state.app || {};
    },
  },
};
</script>
