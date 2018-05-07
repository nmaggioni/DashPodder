<template lang="pug">
  div
    h1.uk-text-center Search for a feed
    form.uk-form-horizontal.uk-grid-small.uk-text-center(uk-grid @submit.prevent='search')
      .uk-width-1-2.uk-container-center
        input.uk-input.uk-width-2-3#query(v-model='query' type='text')
        input.uk-button.uk-button-primary.uk-width-1-5(type='submit' value='Search' :disabled='loadingOrParsing')
        div(uk-spinner="ratio: 0.75" v-if="loadingOrParsing")
    p.uk-text-center.uk-text-danger(v-if='noResults') No feeds found.
    .spacing(v-if='!hasDoneSearch')
    FeedsTable.feeds-table(v-if='searchResults.length' :feeds='searchResults')
</template>

<script>
  import FeedsTable from '@components/FeedsTable';

  export default {
    name: 'SearchFeeds',
    components: {
      FeedsTable,
    },
    data: function() {
      return {
        query: '',
        searchResults: [],
        loading: false,
        hasDoneSearch: false,
      };
    },
    computed: {
      noResults: function() {
        return this.hasDoneSearch && !this.loading && !this.searchResults.length;
      },
      loadingOrParsing: function() {
        return this.loading;
      },
    },
    methods: {
      search() {
        this.loading = true;
        this.searchResults = [];
        this.$http.get(`util/search/${btoa(this.query)}`)
          .then((feeds) => {
            this.hasDoneSearch = true;
            return feeds.json();
          })
          .then((feeds) => {
            this.searchResults = feeds;
            this.loading = false;
          })
          .catch(() => {
            this.searchResults = [];
            this.loading = false;
            this.statusMsg = 'No feeds found.';
          });
      },
    },
  };
</script>

<style scoped lang="stylus">
  h1
    margin-bottom 30px

  form
    margin-bottom 30px

  input[type='submit']
    margin-left 15px

  .uk-spinner
    margin-left 15px

  .spacing
    height 15px
</style>
