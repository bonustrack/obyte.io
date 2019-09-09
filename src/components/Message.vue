<template>
  <li
    v-if="message.app !== 'payment'"
    class="d-block width-full py-4 clearfix border-bottom"
  >
    <div class="flex-content-start mb-1">
      <router-link :to="'/@' + message.unit_authors[0]">
        <span class="float-left mr-3">
          <Avatar size="44" :address="message.unit_authors[0]"/>
        </span>
      </router-link>
      <div>
        <router-link :to="'/@' + message.unit_authors[0]" class="mr-1">
          {{message.unit_authors[0] | name('', message.unit_authors[0])}}
        </router-link>
        <span class="Label Label--outline mr-1">
          {{message.app}}
        </span>
        <router-link
          style="color: inherit !important;"
          :to="'/u/' + message.unit"
        >
          {{message.unit_creation_date | date}}
        </router-link>
      </div>
    </div>
    <div class="d-flex">
      <MessagePayment v-if="message.app === 'payment'" :message="message" />
      <MessageText v-if="message.app === 'text'" :message="message" />
      <MessageAttestation v-if="message.app === 'attestation'" :message="message" />
      <MessagePoll v-if="message.app === 'poll'" :message="message" />
      <MessageVote v-if="message.app === 'vote'" :message="message" />
      <MessageData v-if="['data', 'data_feed', 'profile', 'address_definition_change'].includes(message.app)" :message="message" />
      <MessageAsset v-if="message.app === 'asset'" :message="message" />
    </div>
  </li>
  <li
    v-else-if="message.payload.inputs[0].type === 'issue'"
    class="d-block width-full py-4 clearfix border-bottom"
  >
    <MessageAssetIssue :message="message" />
  </li>
</template>

<script>
import utils from '@/helpers/utils';

export default {
  props: ['message'],
  methods: {
    textOrJSON: (json) => utils.textOrJSON(json),
  },
}
</script>
