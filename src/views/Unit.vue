<template>
  <div class="container-md p-responsive">
    <p class="mt-3 float-right">
      <a :href="'https://obyte.io/joint/' + unit" target="_blank">
        See unit detail <span class="octicon octicon-link-external f3 ml-2"/>
      </a>
    </p>
    <ul>
      <Message v-for="message in feed" :message="message"/>
    </ul>
    <Feed :feed="{ isLoaded: true, messages }"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import client from '@/helpers/client';
import api from '@/helpers/api';

export default {
  data () {
    return {
      unit: this.$route.params.pathMatch,
      joint: null,
      feed: null,
      messages: null,
      is_poll: false,
    }
  },
  created() {
    client.api.getJoint(this.$route.params.pathMatch).then(joint => {
      this.joint = joint;
      this.feed = joint.joint.unit.messages.map((message, i) => {
        this.is_poll = message.app === 'poll' ? true : this.is_poll;
        return {
          ...message,
          unit: joint.joint.unit.unit,
          message_index: i,
          unit_authors: joint.joint.unit.authors.map(author => author.address),
          unit_creation_date: new Date(joint.joint.unit.timestamp * 1000),
          unit_is_stable: joint.joint.ball ? 1 : 0,
          unit_main_chain_index: joint.joint.unit.main_chain_index,
        }
      });
      if (this.is_poll) {
        let params = { poll_unit: joint.joint.unit.unit };
        if (this.messages && this.messages.length > 0) {
          let lastMessage = this.messages.slice().reverse()[0];
          params.unit = lastMessage.unit;
          params.message_index = lastMessage.message_index;
        }
        api.requestAsync('get_votes', params).then(votes => {
          this.messages = votes.map((message, i) => {
            return {
              ...message,
              unit: message.unit,
              message_index: i,
              unit_authors: message.unit_authors.map(author => author),
              unit_creation_date: new Date(message.unit_creation_date),
              unit_is_stable: message.ball ? 1 : 0,
              unit_main_chain_index: message.main_chain_index,
            }
          });
          console.log(this.messages);
        });
      }
      console.log(this.feed);
    }).catch((error) => {
      console.log('Get joint failed', error);
    });
  }
}
</script>