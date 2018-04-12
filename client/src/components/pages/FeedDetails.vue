<template lang="pug">
  .main
    .uk-grid(data-uk-grid-margin='')
      .uk-width-medium-3-4.uk-row-first
        article.uk-article
          h1.uk-article-title
            a(v-text='title')
          p.uk-article-meta.feed-info-subtitle
            span by {{ publisher }}
            span &middot;&nbsp;
            a(:href='url' uk-icon='icon: rss; ratio: 0.75')
            span &middot;&nbsp;
            a(:href='mygpoUrl' uk-icon='icon: world; ratio: 0.75')
          p.uk-text-justify.uk-margin-medium-bottom(v-text='description')

          .uk-grid.uk-margin-medium-top
            .uk-width-1-2
              h2.uk-float-left Episodes
            .uk-width-1-2
              .uk-float-right.table-or-list-toggle
                span.uk-form-label.uk-text-muted Show as&nbsp;
                a.uk-form-label(@click='toggleLayout' v-text='tableOrList')


          EpisodesTable.uk-margin-small-top(v-if='tableOrList === "table"'
            :episodes='pagedEpisodes[currentPage]'
            :indexOffset='episodesPerPage * currentPage'
          )
          EpisodesList.uk-margin-medium-top(v-else
            :episodes='pagedEpisodes[currentPage]'
          )
          Pagination.uk-margin-large-top(
            :pages='pagedEpisodes.length - 1'
            :currentPage='currentPage + 1'
            @changePage='changePage'
          )
      .uk-width-medium-1-4
        .uk-panel.uk-panel-box.uk-text-center
          img.uk-border-circle(width='120' height='120' :src='logo' :alt='title + " logo"')
          h3(v-text='title')
          p.uk-text-center
            b Tags:&nbsp;
            span(v-for='(tag, i) in tags' :key='i')
              | {{ tag }}
              span.span-br(v-if='i !== tags.length - 1') ,&nbsp;
        .uk-panel
          h3.uk-panel-title Related Links
          ul.uk-list
            li
              a(:href='website') Website
            li
              a(:href='mygpoUrl') Gpodder.net
            li
              a(:href='url') RSS feed
</template>

<script>
  import EpisodesTable from '@components/EpisodesTable';
  import EpisodesList from '@components/EpisodesList';
  import FeedRename from '@components/FeedRename';
  import Pagination from '@components/Pagination';

  export default {
    name: 'FeedDetails',
    components: {
      EpisodesTable,
      EpisodesList,
      FeedRename, // TODO: implement feed renaming
      Pagination,
    },
    data: function() {
      return {
        url: '',
        title: 'Unknown',
        publisher: 'Unknown',
        description: 'Loading...',
        tags: [],
        logo: '',
        mygpoUrl: '',
        website: '',
        episodes: [],
        pagedEpisodes: [[]],
        currentPage: 0,
        tableOrList: 'table',
      };
    },
    created: function() {
      this.episodesPerPage = 10;
    },
    mounted: function() {
      this.url = this.$route.query.url;
      if (this.url.length > 0) {
        this.getFeedInfo();
        this.getFeedEpisodes();
      }
    },
    methods: {
      getFeedInfo: function() {
        this.$http.get(`util/feedinfo/${btoa(this.url)}`)
          .then((res) => {
            return res.json();
          })
          .then((jres) => {
            this.title = jres.title;
            this.description = jres.description;
            this.logo = jres.logo_url;
            this.mygpoUrl = jres.mygpo_link;
            this.website = jres.website;

            this.$http.get(`util/feedinfoscrape/${btoa(this.mygpoUrl)}`)
              .then((res) => {
                return res.json();
              })
              .then((jres) => {
                this.publisher = jres.publisher;
                this.tags = jres.tags;
              });
          });
      },
      getFeedEpisodes: function() {
        this.$http.get(`gpo/info/${btoa(this.url)}`)
          .then((res) => {
            return res.json();
          })
          .then((jres) => {
            this.episodes = jres.episodes;
            this.pageEpisodes();
          });
      },
      pageEpisodes: function() {
        this.pagedEpisodes = [];
        let episodesCount = this.episodes.length;
        if (episodesCount <= this.episodesPerPage) {
          this.pagedEpisodes.push(this.episodes);
          return;
        }
        let remainder = episodesCount % this.episodesPerPage;
        let latestIndex = 0;
        while (episodesCount > remainder) {
          this.pagedEpisodes.push(this.episodes.slice(latestIndex, latestIndex + this.episodesPerPage));
          episodesCount -= this.episodesPerPage;
          latestIndex += this.episodesPerPage;
        }
        this.pagedEpisodes.push(this.episodes.slice(latestIndex));
      },
      changePage: function(page) {
        this.currentPage = page - 1; // Pagination is 1-indexed
      },
      toggleLayout: function() {
        if (this.tableOrList === 'table') {
          this.tableOrList = 'list';
        } else {
          this.tableOrList = 'table';
        }
      },
    },
  };
</script>

<style scoped lang="stylus">
  .feed-info-subtitle
    .uk-icon, span
      margin-right 5px

  .span-br:after
    content '\200b'

  .table-or-list-toggle
    margin-top 5px
    a
      text-decoration underline
</style>
