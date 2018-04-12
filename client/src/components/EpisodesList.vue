<template lang="pug">
  dl.uk-description-list.uk-description-list-divider
    template(v-for='(episode, i) in episodes')
      dt.uk-text-primary(:key='i')
        span {{ episode.title }}
        span.uk-align-right.uk-text-uppercase.uk-label(
          :class='episodeLabelClass(episode.status)'
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
    },
    methods: {
      episodeLabelClass: function(status) {
        let type = '';
        switch (status) {
          case 'new':
            break;
          case 'downloaded':
            type = 'success';
            break;
          case 'deleted':
            type = 'danger';
            break;
          case 'unknown':
            type = 'warning';
            break;
        }
        return type ? `uk-label-${type}` : '';
      },
    },
  };
</script>

<style scoped lang="stylus">
  dt
    font-size 1em
</style>
