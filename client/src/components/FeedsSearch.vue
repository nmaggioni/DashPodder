<template lang="pug">
  .search-feeds
    input(v-model='query', placeholder='Query', type='text')
    button(@click='search') Search
    p(v-if='error', v-text='error')
    table.feeds-table(v-if='searchResults.length')
      tr
        th #
        th URL
      tr(v-for='(feedUrl, i) in searchResults', :key='i')
        td(v-text='i')
        td
          a(:href='feedUrl', v-text='feedUrl')
    p(v-else-if="!error.length" v-text="waitingMsg")
</template>

<script>
  export default {
    name: 'FeedsSearch',
    data: function() {
      return {
        query: '',
        searchResults: [],
        error: '',
        waitingMsg: 'Please search something.',
      };
    },
    methods: {
      search() {
        this.searchResults = [];
        this.error = '';
        this.waitingMsg = 'Searching...';
        this.$http.get(`gpo/search/${btoa(this.query)}`)
          .then((feeds) => {
            return feeds.json();
          })
          .then((feeds) => {
            this.error = '';
            this.searchResults = feeds;
          })
          .catch(() => {
            this.searchResults = [];
            this.error = 'No feeds found.';
          });
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
