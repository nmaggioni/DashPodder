<template lang="pug">
  .episodes-list
    table.episodes-table
      tr
        th #
        th Name
        th Status
      tr(v-for='(episode, i) in episodes', :key='i')
        td(v-text='i+1')
        td(v-text='episode.title')
        td(v-text='episode.status')
</template>

<script>
  export default {
    name: 'FeedsList',
    props: {
      episodes: {
        type: Array,
        required: true,
      },
    },
    data: function() {
      return {};
    },
  };
</script>

<style scoped lang="stylus">
</style>
