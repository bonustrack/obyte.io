<template>
  <ul v-if="errors.length" class="flash flash-error text-left pl-5 mb-4">
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</template>

<script>
export default {
  props: ['errors'],
}
</script>
