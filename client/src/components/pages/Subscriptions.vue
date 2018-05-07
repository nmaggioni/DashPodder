<template lang="pug">
  .main
    SubscriptionsList.uk-margin-large-bottom(ref='subscriptionList')
    SubscriptionNew.uk-align-center(@refresh='newSubscribe')
</template>

<script>
  import SubscriptionsList from '@components/SubscriptionsList';
  import SubscriptionNew from '@components/SubscriptionNew';

  export default {
    name: 'Subscriptions',
    components: {
      SubscriptionsList,
      SubscriptionNew,
    },
    data: function() {
      return {
      };
    },
    methods: {
      newSubscribe: function() {
        this.$refs.subscriptionList.getAll();
      },
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
