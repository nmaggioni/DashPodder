<template lang="pug">
  .feeds-list
    .uk-card.uk-card-default.uk-card-body
      .heading-with-spinner
        h1.uk-text-center Top feeds
        div(uk-spinner="ratio: 1" v-if="loadingOrParsing")
      table.uk-table.centered
        tr
          th #
          th Name
          th URL
        tr(v-for='(feed, i) in feeds', :key='i')
          td(v-text='i+1')
          td(:class="[{ italic: feed.title === 'N/A' }, { bold: feed.title === 'N/A' }]", v-text='feed.title')
          td
            a(:href='feed.url', v-text='feed.url')
</template>

<script>
  export default {
    name: 'FeedsTop',
    data: function() {
      return {
        loading: true,
        feeds: [],
        feedsLeftToParse: 0,
      };
    },
    computed: {
      loadingOrParsing: function() {
        return this.loading || this.feedsLeftToParse > 0;
      },
    },
    mounted: function() {
      this.getAll();
    },
    methods: {
      getAll() {
        this.loading = true;
        this.$http.get('gpo/toplist')
          .then((feeds) => {
            return feeds.json();
          })
          .then((feeds) => {
            this.feeds = [];
            this.loading = false;
            this.feedsLeftToParse = feeds.length;
            feeds.forEach((feedUrl) => {/* eslint-disable padded-blocks */

              this.$http.get(`util/parsefeedinfo/${btoa(feedUrl)}`, { timeout: 15000 })
                .then((res) => {
                  return res.json();
                })
                .then((jres) => {
                  this.feeds.push({
                    title: jres.title.length > 40 ? jres.title.substr(0, 37) + '...' : jres.title,
                    url: feedUrl,
                  });
                  this.feedsLeftToParse--;
                })
                .catch(() => {
                  this.feeds.push({
                    title: 'N/A',
                    url: feedUrl,
                  });
                  this.feedsLeftToParse--;
                });

            });
          });
      },
    },
  };
</script>

<style scoped lang="stylus">
  .italic
    font-style italic

  .bold
    font-weight bold
</style>
