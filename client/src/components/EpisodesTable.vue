<template lang="pug">
  .uk-overflow-auto.nofloat
    table.uk-table.uk-table-striped.uk-table-hover.centered
      thead
        th.uk-table-shrink #
        th.uk-table-expand Name
        th.uk-table-shrink Status
      tbody
        tr(v-for='(episode, i) in episodes' :key='i')
          td.uk-text-muted(v-text='i + 1 + indexOffset')
          td.uk-text-bold.uk-text-truncate(v-text='episode.title')
          td.uk-text-uppercase
            .uk-flex.uk-preserve-width
              div
                span.uk-text-uppercase.uk-label(
                  :class='episodeLabelClassFn(episode.status)'
                ) {{ episode.status }}
              div.download-icon
                a(
                  v-if='episode.status !== "downloaded"'
                  uk-icon='icon: cloud-download'
                  @click='$emit("downloadEpisode", episode.guid)'
                )
</template>

<script>
  export default {
    name: 'EpisodesTable',
    props: {
      episodes: {
        type: Array,
        required: true,
      },
      indexOffset: {
        type: Number,
        required: false,
        default: 0,
      },
      episodeLabelClassFn: {
        type: Function,
        required: true,
      },
    },
  };
</script>

<style scoped lang="stylus">
  .index
    width 30px

  .download-icon
    margin-left 10px
</style>
