<template>
  <div class="container-md p-responsive">
    <Feed :feed="{ isLoaded: true, messages }"/>
    <p class="mt-3">
      <a :href="'https://obyte.io/joint/' + unit" target="_blank">
        See unit detail <span class="octicon octicon-link-external f3 ml-2"/>
      </a>
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import client from '@/helpers/client';

export default {
  data () {
    return {
      unit: this.$route.params[0],
      joint: null,
      messages: null,
    }
  },
  created() {
    client.api.getJoint(this.$route.params[0]).then(joint => {
      this.joint = joint;
      this.messages = joint.joint.unit.messages.map((message, i) => {
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
      console.log(this.messages);
    }).catch((error) => {
      console.log('Get joint failed', error);
    });
  }
}
</script>