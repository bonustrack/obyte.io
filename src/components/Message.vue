<template>
  <li
    v-if="(message.app === 'payment' && filteredOutputs.length) || message.app !== 'payment'"
    class="d-block width-full py-4 clearfix border-bottom"
  >
    <div class="flex-content-start mb-1">
      <router-link :to="'/@' + message.unit_authors[0]">
        <span class="float-left mr-3">
          <Avatar size="44" :address="message.unit_authors[0]"/>
        </span>
      </router-link>
      <div>
        <router-link :to="'/@' + message.unit_authors[0]">
          <span class="monospace">{{message.unit_authors[0] | name('', message.unit_authors[0])}}</span>
        </router-link>
        <span v-if="getVerifiedStatus(message.unit_authors[0])" class="tooltipped tooltipped-n ml-1" aria-label="Verified">
          <span class="octicon octicon-verified mb-1"></span>
        </span>
        <span class="Label Label--outline ml-2">
          {{message.app}}
        </span>
        <router-link
          style="color: inherit !important;"
          class="ml-2"
          :to="'/u/' + message.unit"
          :title="message.unit_creation_date | date('YYYY-MM-DD HH:mm \U\T\C')"
        >
          <span>{{message.unit_creation_date | date}}</span>
        </router-link>
      </div>
    </div>
    <div class="d-flex">
      <MessagePayment v-if="message.app === 'payment'" :message="message" :filteredOutputs="filteredOutputs" />
      <MessageText v-else-if="message.app === 'text'" :message="message" />
      <MessageAttestation v-else-if="message.app === 'attestation'" :message="message" />
      <MessagePoll v-else-if="message.app === 'poll'" :message="message" />
      <MessageVote v-else-if="message.app === 'vote'" :message="message" />
      <MessageAsset v-else-if="message.app === 'asset'" :message="message" />
      <MessageDefinition v-else-if="message.app === 'definition'" :message="message" />
      <MessageData v-else :message="message" />
    </div>
  </li>
</template>

<script>
import utils from '@/helpers/utils';

export default {
  props: ['message'],
  methods: {
    getVerifiedStatus: address => utils.getVerifiedStatus(address),
  },
  computed: {
    filteredOutputs() {
      const unitAuthors = this.message.unit_authors;
      return this.message.payload.outputs.filter(output => !unitAuthors.includes(output.address));
    },
  },
};
</script>
