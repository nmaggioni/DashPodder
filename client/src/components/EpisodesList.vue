<template lang="pug">
  dl.uk-description-list.uk-description-list-divider
    template(v-for='(episode, i) in episodes')
      dt.uk-text-primary(:key='i')
        span {{ episode.title }}
        a.uk-align-right(
          v-if='episode.status !== "downloaded"'
          uk-icon='icon: cloud-download'
          @click='$emit("downloadEpisode", episode.guid)'
        )
        span.uk-align-right.uk-text-uppercase.uk-label(
          :class='episodeLabelClassFn(episode.status)'
        )
          | {{ episode.status }}
      dd(v-if='episode.extras') {{ episode.extras.summary }}

</template>

<script>
  export default {
    name: 'EpisodesList',
    props: {
      episodes: {
        type: Array,
        required: true,
      },
      episodeLabelClassFn: {
        type: Function,
        required: true,
      },
    },
  };
</script>

<style scoped lang="stylus">
  dt
    font-size 1em
</style>
