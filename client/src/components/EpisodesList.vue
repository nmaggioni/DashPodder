<template lang="pug">
  dl.uk-description-list.uk-description-list-divider
    template(v-for='(episode, i) in episodes')
      dt.uk-text-primary(:key='i')
        span(v-text='episode.title')
        span.uk-align-right.uk-text-capitalize.uk-text-muted(v-text='episode.status')
      dd Lorem ipsum dolor sit amet

</template>

<script>
  export default {
    name: 'EpisodesList',
    props: {
      episodes: {
        type: Array,
        required: true,
      },
    },
  };
</script>

<style scoped lang="stylus">
  dt
    font-size 1em
</style>
