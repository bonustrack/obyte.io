<template>
  <div class="tabnav ml-3" style="margin-top: -61px; padding-left: 100px;">
    <nav class="tabnav-tabs">
      <router-link :to="'/@' + address" active-class="selected" exact class="tabnav-tab">
        Messages
      </router-link>
      <router-link :to="'/@' + address + '/attestations'" active-class="selected" exact class="tabnav-tab">
        Attestations
        <span v-if="attestations.messages && attestations.messages.length" class="Counter">
          {{attestations.messages.length}}
        </span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  props: ['address', 'attestations'],
};
</script>
