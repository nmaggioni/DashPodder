<template lang="pug">
  .main
    FeedsTop
</template>

<script>
  import FeedsTop from '@components/FeedsTop';

  export default {
    name: 'Home',
    components: {
      FeedsTop,
    },
    data: function() {
      return {
      };
    },
  };
</script>

<style scoped lang="stylus">
  h1, h2
    font-weight normal

  ul
    list-style-type none
    padding 0

  li
    display inline-block
    margin 0 10px

  a
    color #42b983
</style>
