<template lang="pug">
  .main
    h1.inline(v-text="title")
    img.logo(:src="image" width="150px" alt="Feed logo")
    FeedRename(:feedUrl="url" :feedTitle="title" @refresh="getFeedInfo")
    FeedEpisodes(:episodes="episodes")
</template>

<script>
  import FeedEpisodes from '@components/FeedEpisodes';
  import FeedRename from '@components/FeedRename';

  export default {
    name: 'Feed',
    components: {
      FeedEpisodes,
      FeedRename,
    },
    data: function() {
      return {
        title: '',
        url: '',
        image: '',
        episodes: [],
      };
    },
    mounted: function() {
      this.getFeedInfo();
    },
    methods: {
      getFeedInfo: function() {
        this.url = this.$route.query.url;
        if (this.url.length > 0) {
          this.$http.get(`gpo/info/${btoa(this.url)}`)
            .then((res) => {
              return res.json();
            })
            .then((jres) => {
              this.title = jres.title;
              this.episodes = jres.episodes;
            });
          this.$http.get(`util/parsefeedinfo/${btoa(this.url)}`)
                .then((res) => {
                  return res.json();
                })
                .then((jres) => {
                  this.image = jres.image;
                });
        }
      },
    },
  };
</script>

<style scoped lang="stylus">
  .inline
    display inline

  .logo
    border-radius 50%
</style>
