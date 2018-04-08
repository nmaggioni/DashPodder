<template lang="pug">
  .feeds-list
    .uk-card.uk-card-default.uk-card-body
      .heading-with-spinner
        h1.uk-text-center Top feeds
        div(uk-spinner="ratio: 1" v-if="loadingOrParsing")
      form.uk-form-horizontal.amount-form(@submit.prevent='')
        fieldset.uk-fieldset
          label.uk-form-label.uk-text-meta(for='topAmount') No. of entries to show:
          .uk-form-controls
            input.uk-form-input(id='topAmount' type='number' v-model.number='numberOfEntries')
      table.uk-table.centered
        tr
          th #
          th Name
          th Description
          th Website
        tr(v-for='(feed, i) in feeds', :key='i')
          td.uk-text-muted(v-text='i+1')
          td.uk-text-bold.trimmed-title(v-text='feed.title')
          td.uk-text-truncate(v-text='feed.description')
          td.uk-text-truncate
            a(:href='feed.website', v-text='feed.website')
</template>

<script>
  export default {
    name: 'FeedsTop',
    data: function() {
      return {
        loading: true,
        numberOfEntries: 10,
        feeds: [],
        feedsLeftToParse: 0,
      };
    },
    computed: {
      loadingOrParsing: function() {
        return this.loading || this.feedsLeftToParse > 0;
      },
    },
    watch: {
      numberOfEntries: function(newVal, oldVal) {
        if (newVal === oldVal || !newVal) return;
        newVal = newVal > 999 ? 999 : newVal;

        if (newVal < oldVal) {
          while (newVal < oldVal) {
            this.feeds.pop();
            oldVal--;
          }
        } else {
          this.getAll();
        }
      },
    },
    mounted: function() {
      this.getAll();
    },
    methods: {
      getAll() {
        this.loading = true;
        this.$http.get(`util/toplistgpoddernet/${this.numberOfEntries}`)
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
  .trimmed-title
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    max-width 50px

  .amount-form
    float right
    margin-bottom 15px
    .uk-form-label
      width 125px
      margin-top 3px
    .uk-form-controls
      margin-left 135px
      input
        width 40px
</style>
