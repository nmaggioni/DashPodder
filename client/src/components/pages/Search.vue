<template lang="pug">
  SearchFeeds
</template>

<script>
  import SearchFeeds from '@components/SearchFeeds';

  export default {
    name: 'Search',
    components: {
      SearchFeeds,
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
