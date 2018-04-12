<template lang="pug">
  .uk-overflow-auto.nofloat
    table.uk-table.uk-table-striped.uk-table-hover.centered
      thead
        th.uk-table-shrink #
        th.uk-table-expand Name
        th.uk-table-shrink Status
      tbody
        tr(v-for='(episode, i) in episodes' :key='i')
          td.uk-text-muted(v-text='i+1')
          td.uk-text-bold.uk-text-truncate(v-text='episode.title')
          td.uk-text-capitalize(v-text='episode.status')
</template>

<script>
  export default {
    name: 'EpisodesTable',
    props: {
      episodes: {
        type: Array,
        required: true,
      },
    },
  };
</script>

<style scoped lang="stylus">
  .index
    width 30px

  //.trimmed-title
  //  white-space nowrap
  //  overflow hidden
  //  text-overflow ellipsis
  //  width 250px

</style>
