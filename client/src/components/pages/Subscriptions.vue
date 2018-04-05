<template lang="pug">
  .main
    FeedsList
</template>

<script>
  import FeedsList from '@components/FeedsList';

  export default {
    name: 'Home',
    components: {
      FeedsList,
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
