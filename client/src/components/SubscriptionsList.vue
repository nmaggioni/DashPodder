<template lang="pug">
  div
    .uk-card.uk-card-default.uk-card-body
      .heading-with-spinner
        h1.uk-text-center Your subscriptions
        div(uk-spinner="ratio: 1" v-if="loading")
      .uk-overflow-auto
        table.uk-table.uk-table-hover.centered
          tr
            th #
            th Name
            th URL
          tr(v-for='(feedUrl, feedName, i) in feeds', :key='i')
            td(v-text='i+1')
            td
              router-link(:to="{ path: '/feed', query: { url: feedUrl }}", v-text='feedName')
            td(v-text='feedUrl')
        p(v-if="noFeeds") You have no subscriptions.
    .uk-card.uk-card-default.uk-card-body
      SubscriptionNew.uk-align-center(@refresh='getAll')
</template>

<script>
  import SubscriptionNew from '@components/SubscriptionNew';

  export default {
    name: 'SubscriptionsList',
    components: {
      SubscriptionNew,
    },
    data: function() {
      return {
        loading: true,
        feeds: {},
      };
    },
    computed: {
      noFeeds: function() {
        return !Object.keys(this.feeds).length && !this.loading;
      },
    },
    mounted: function() {
      this.getAll();
    },
    methods: {
      getAll() {
        this.loading = true;
        this.$http.get('gpo/list')
          .then((feeds) => {
            return feeds.json();
          })
          .then((feeds) => {
            this.feeds = feeds;
            this.loading = false;
          });
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
