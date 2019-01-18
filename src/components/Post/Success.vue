<template>
  <div class="container-md p-responsive text-center my-5">
    <h1 class="mb-4">Success!</h1>
    <p>
      The unit
      <a
        :href="'https://explorer.obyte.org/#' + unit"
        target="_blank"
      >
        {{unit}}
      </a>
      has been successfully broadcasted
    </p>
  </div>
</template>

<script>
export default {
  props: ['unit'],
}
</script>
