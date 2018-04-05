<template lang="pug">
  .feeds-list
    .uk-card.uk-card-default.uk-card-body
      h1.uk-text-center Your subscriptions
      table.uk-table.centered
        tr
          th #
          th Name
          th URL
        tr(v-for='(feedUrl, feedName, i) in feeds', :key='i')
          td(v-text='i+1')
          td
            router-link(:to="{ path: '/feed', query: { url: feedUrl }}", v-text='feedName')
          td(v-text='feedUrl')
    .feed-subscribe.uk-card.uk-card-default.uk-card-body
      h2.uk-text-center Add a new subscription
      FeedSubscribe.uk-align-center(@refresh='getAll')
</template>

<script>
  import FeedSubscribe from '@components/FeedSubscribe';

  export default {
    name: 'FeedsList',
    components: {
      FeedSubscribe,
    },
    data: function() {
      return {
        feeds: [],
      };
    },
    mounted: function() {
      this.getAll();
    },
    methods: {
      getAll() {
        this.$http.get('gpo/list')
          .then((feeds) => {
            return feeds.json();
          })
          .then((feeds) => {
            this.feeds = feeds;
          });
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
