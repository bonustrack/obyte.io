<template>
  <pre class="markdown-body" style="text-overflow: ellipsis; overflow: hidden;">{{JSON.stringify(message.payload, null, 4)}}</pre>
</template>

<script>
export default {
  props: ['message'],
}
</script>
