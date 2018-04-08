<template lang="pug">
  .main
    SubscriptionsList
</template>

<script>
  import SubscriptionsList from '@components/SubscriptionsList';

  export default {
    name: 'Subscriptions',
    components: {
      SubscriptionsList,
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
