<template>
  <span>
    {{attestorsHelper[address] ? attestorsHelper[address].name : address}}
  </span>
</template>

<script>
import attestorsHelper from '@/helpers/attestors.json';

export default {
  props: ['address'],
  data () {
    return {
      attestorsHelper,
    };
  },
}
</script>
