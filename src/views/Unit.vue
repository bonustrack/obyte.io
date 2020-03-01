<template>
  <div class="container-md p-responsive">
    <Feed :feed="{ isLoading, messages }" class="mb-4"/>
    <p class="mb-4">
      <a :href="'https://explorer.obyte.org/#' + unit" target="_blank">
        <span>See unit on Explorer</span>
      </a>
      <span class="octicon octicon-link-external f3 ml-2"/>
      |
      <a :href="'https://obyte.io/joint/' + unit" target="_blank">
        <span>See unit as JSON</span>
      </a>
      <span class="octicon octicon-link-external f3 ml-2"/>
    </p>
    <div v-if="isPoll && votes.length" class="mb-4">
      <h3>Last 10 votes:</h3>
      <p v-for="(vote, index) in votes" :key="index">
        <router-link :to="'/@' + vote.unit_authors[0]" class="mr-1">
          <span>{{vote.unit_authors[0] | name('', vote.unit_authors[0])}}</span>
        </router-link> voted
        <b>{{ vote.payload.choice }}</b>
      </p>
    </div>
  </div>
</template>

<script>
import client from '@/helpers/client';
import api from '@/helpers/api';

export default {
  data () {
    return {
      isLoading: false,
      unit: this.$route.params[0] || this.$route.params.pathMatch,
      joint: null,
      messages: null,
      votes: [],
      isPoll: false,
    }
  },
  created() {
    this.isLoading = true;

    client.api.getJoint(this.unit).then(joint => {
      this.joint = joint;
      this.messages = joint.joint.unit.messages.map((message, i) => {
        if (message.app === 'poll') this.isPoll = true;
        return {
          ...message,
          unit: joint.joint.unit.unit,
          message_index: i,
          unit_authors: joint.joint.unit.authors.map(author => author.address),
          unit_creation_date: new Date(joint.joint.unit.timestamp * 1000),
          unit_is_stable: joint.joint.ball ? 1 : 0,
          unit_main_chain_index: joint.joint.unit.main_chain_index,
        };
      });

      if (this.isPoll) {
        api.requestAsync('get_votes', this.unit).then(votes => {
          this.votes = votes;
          this.isLoading = false;
        }).catch((error) => {
          console.log('Get votes failed', error);
        });
      } else {
        this.isLoading = false;
      }
    }).catch((error) => {
      console.log('Get joint failed', error);
    });
  }
}
</script>
