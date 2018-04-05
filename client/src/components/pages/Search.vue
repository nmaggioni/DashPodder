<template lang="pug">
  .main
    FeedsSearch
</template>

<script>
  import FeedsSearch from '@components/FeedsSearch';

  export default {
    name: 'Home',
    components: {
      FeedsSearch,
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
