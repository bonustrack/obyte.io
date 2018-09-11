<template>
  <img
    class="avatar"
    style="vertical-align: middle;"
    :width="size || 64"
    :height="size || 64"
    :src="'data:image/svg+xml;base64,' + identicon"
  />
</template>

<script>
const crypto = require('crypto');
const Identicon = require('identicon.js');

export default {
  props: ['address', 'size'],
  computed: {
    identicon () {
      const hash = crypto.createHash('md5').update(this.address).digest('hex');
      return new Identicon(hash, { format: 'svg' }).toString();
    },
  },
}
</script>
