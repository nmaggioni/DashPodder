<template lang="pug">
  .feeds-list
    table.feeds-table
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
        feeds: [],
      };
    },
    mounted: function() {
      this.getAll();
    },
    methods: {
      getAll() {
        this.$http.get('gpo/toplist')
          .then((feeds) => {
            return feeds.json();
          })
          .then((feeds) => {
            this.feeds = [];
            feeds.forEach((feedUrl) => {/* eslint-disable padded-blocks */

              this.$http.get(`util/parsefeedinfo/${btoa(feedUrl)}`)
                .then((res) => {
                  return res.json();
                })
                .then((jres) => {
                  this.feeds.push({
                    title: jres.title.length > 40 ? jres.title.substr(0, 37) + '...' : jres.title,
                    url: feedUrl,
                  });
                })
                .catch(() => {
                  this.feeds.push({
                    title: 'N/A',
                    url: feedUrl,
                  });
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
