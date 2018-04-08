<template lang="pug">
  .uk-overflow-auto.nofloat
    table.uk-table.uk-table-striped.uk-table-hover.centered
      thead
        th.uk-table-shrink #
        th.uk-table-expand Name
        th.uk-table-expand Description
      tbody
        router-link(
        v-for='(feed, i) in feeds' :key='i' :title='feed.url' tag='tr'
        :to="{ path: '/feed', query: { url: feed.url } }"
        )
          td.uk-text-muted(v-text='i+1')
          td.uk-text-bold.uk-text-truncate.trimmed-title(v-text='feed.title')
          td(v-text='trimDescription(feed.description)')
</template>

<script>
  export default {
    name: 'FeedsTable',
    props: {
      feeds: {
        type: Array,
        required: true,
      },
    },
    methods: {
      trimDescription: function(description) {
        if (description.length > 200) {
          let trimmed = description.substring(0, 197);
          while (trimmed.charAt(trimmed.length - 1) !== ' ') {
            trimmed = trimmed.substr(0, trimmed.length - 1);
          }
          while (!trimmed.charAt(trimmed.length - 1).match(/[A-Za-z]/)) {
            trimmed = trimmed.substr(0, trimmed.length - 1);
          }
          return trimmed + '...';
        }
        return description;
      },
    },
  };
</script>

<style scoped lang="stylus">
  .index
    width 30px

  .trimmed-title
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    width 250px

  tr
    cursor pointer

</style>
