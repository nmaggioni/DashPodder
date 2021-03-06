<template lang="pug">
  div
    ModalSpinner(id='loadingModal' title='Getting feed details...')
    .uk-grid(data-uk-grid-margin='')
      .uk-width-medium-3-4.uk-row-first
        article.uk-article
          .uk-flex.uk-flex-left.uk-flex-middle
            h1.uk-article-title(v-text='title')
            span(uk-icon='pencil' @click='renameFeedStart' v-if='title && subscribed').uk-margin-left
            template(v-if='subscribed')
              span(uk-icon='trash' @click='unsubscribe').uk-margin-left
              ModalSpinner(id='unsubscribeModal' title='Unsubscribing from feed...')
          ModalFeedRename(id='renameModal' v-if='localTitle && subscribed'
            :feedUrl='url'
            :feedTitle='localTitle'
            @renameDone='renameFeedDone'
          )
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
            :episodeLabelClassFn='episodeLabelClass'
            :subscribed='subscribed'
            @downloadEpisode='downloadEpisodes'
            @deleteEpisode='deleteEpisodes'
          )
          EpisodesList.uk-margin-medium-top(v-else
            :episodes='pagedEpisodes[currentPage]'
            :episodeLabelClassFn='episodeLabelClass'
            :subscribed='subscribed'
            @downloadEpisode='downloadEpisodes'
            @deleteEpisode='deleteEpisodes'
          )
          Pagination.uk-margin-large-top(
            :pages='pagedEpisodes.length - 1'
            :currentPage='currentPage + 1'
            @changePage='changePage'
          )

      .uk-width-medium-1-4
        .uk-panel.uk-panel-box.uk-text-center
          img.uk-border-circle(width='120' height='120' :src='logo' :alt='title + " logo"')
          h3(v-text='localTitle')
          p.uk-text-center
            b Tags:&nbsp;
            span(v-if='!tags.length') N/A
            span(v-else v-for='(tag, i) in tags' :key='i')
              | {{ tag }}
              span.span-br(v-if='i !== tags.length - 1') ,&nbsp;
        .uk-flex.uk-flex-around.uk-margin-top.uk-margin-medium-bottom
          template(v-if='subscribed')
            button.uk-button.uk-button-large.uk-button-primary(@click='updateEpisodes') Update
            ModalSpinner(id='updateModal' title='Updating episodes list...')
            button.uk-button.uk-button-large.uk-button-secondary(@click='downloadEpisodes()') Download All
            ModalSpinner(id='downloadAllModal' title='Downloading missing episodes...')
            ModalSpinner(id='downloadSingleModal' title='Downloading single episode...')
            ModalSpinner(id='deleteModal' title='Deleting episode...')
          template(v-else)
            button.uk-button.uk-button-large.uk-button-success(@click='subscribe') Subscribe
            ModalSpinner(id='subscribeModal' title='Subscribing to feed...')
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
  import ModalFeedRename from '@components/ModalFeedRename';
  import Pagination from '@components/Pagination';
  import ModalSpinner from '@components/ModalSpinner';

  export default {
    name: 'FeedDetails',
    components: {
      EpisodesTable,
      EpisodesList,
      ModalFeedRename,
      Pagination,
      ModalSpinner,
    },
    data: function() {
      return {
        url: '',
        localTitle: '',
        subscribed: false,
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
    computed: {
      episodesPerPage: function() {
        return this.tableOrList === 'table' ? 10 : 5;
      },
    },
    mounted: function() {
      let modal = this.$UIkit.modal(document.getElementById('loadingModal'));
      modal.show();
      let tableOrList = localStorage.getItem('episodesViewType');
      if (tableOrList) this.tableOrList = tableOrList;

      this.url = this.$route.query.url;
      this.localTitle = this.$route.query.title;
      if (this.url.length > 0) {
        this.isSubscribed(this.url, () => {
          this.getFeedInfo(function() {
            modal.hide();
          });
          this.getFeedEpisodes();
        });
      }
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
      isSubscribed: function(url, callback) {
        this.$http.get('gpo/list')
          .then((feeds) => {
            return feeds.json();
          })
          .then((feeds) => {
            for (let feed in feeds) {
              if (feeds.hasOwnProperty(feed)) {
                if (feeds[feed] === url) {
                  this.subscribed = true;
                  break;
                }
              }
            }
            if (callback) callback();
          });
      },
      getFeedInfo: function(callback) {
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

            if (!this.title || !this.description || !this.logo) {
              this.$http.get(`util/feedinfoparse/${btoa(this.url)}`)
                .then((res) => {
                  return res.json();
                })
                .then((jres) => {
                  this.title = this.title ? this.title : jres.title;
                  this.description = this.description ? this.description : jres.description;
                  this.logo = this.logo ? this.logo : jres.image;

                  if (callback) callback();
                });
            } else {
              if (callback) callback();
            }

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
      updateLocalTitle: function() {
        this.$http.get(`gpo/info/${btoa(this.url)}`)
          .then((res) => {
            return res.json();
          })
          .then((jres) => {
            this.localTitle = jres.title;
          });
      },
      getFeedEpisodes: function() {
        if (this.subscribed) {
          this.$http.get(`gpo/episodes/${btoa(this.url)}`)
            .then((res) => {
              return res.json();
            })
            .then((jres) => {
              this.enrichFeedEpisodes(jres[this.url], () => {
                this.splitEpisodesInPages();
              });
            });
        } else {
          this.enrichFeedEpisodes(null, () => {
            this.splitEpisodesInPages();
          });
        }
      },
      enrichFeedEpisodes: function(episodes, callback) {
        this.$http.get(`util/episodesinfoscrape/${btoa(this.url)}` + (episodes ? `/${episodes.length}` : ''))
          .then((res) => {
            return res.json();
          })
          .then((jres) => {
            if (episodes) {
              jres.forEach((episodeInfo) => {
                episodes.some((episode) => {
                  if (!episode.extras) {
                    if (episode.title.toLowerCase() === episodeInfo.title.toLowerCase()) {
                      episode.extras = episodeInfo;
                    }
                  }
                });
              });
              } else {
                episodes = [];
                jres.forEach((episodeInfo) => {
                  episodes.push({
                    guid: '',
                    status: 'new',
                    title: episodeInfo.title,
                    extras: episodeInfo,
                  });
                });
              }
            this.episodes = episodes;
            callback();
          });
      },
      renameFeedStart: function() {
        let modal = this.$UIkit.modal(document.getElementById('renameModal'));
        modal.show();
      },
      renameFeedDone: function(err) {
        let modal = this.$UIkit.modal(document.getElementById('renameModal'));
        modal.hide();
        if (err) {
          this.$UIkit.notification({
            message: 'Error during feed rename.',
            status: 'danger',
            pos: 'top-center',
            timeout: 3000,
          });
        } else {
          this.$UIkit.notification({
            message: 'Feed renamed successfully',
            status: 'success',
            pos: 'top-center',
            timeout: 3000,
          });
        }
        this.updateLocalTitle();
      },
      updateEpisodes: function() {
        let modal = this.$UIkit.modal(document.getElementById('updateModal'));
        modal.show();

        this.$http.get(`gpo/update/${btoa(this.url)}`)
          .then((res) => {
            return res.json();
          })
          .then((jres) => {
            modal.hide();
            this.$UIkit.notification({
              message: `${jres} new episodes found.`,
              status: jres > 0 ? 'success' : 'primary',
              pos: 'top-center',
              timeout: 5000,
            });
            this.getFeedEpisodes();
          })
          .catch((err) => {
            modal.hide();
            this.$UIkit.notification({
              message: `Error during episodes update!`,
              status: 'danger',
              pos: 'top-center',
              timeout: 5000,
            });
            this.getFeedEpisodes();
          });
      },
      downloadEpisodes: function(guid) {
        let modal = this.$UIkit.modal(document.getElementById(`download${guid ? 'Single' : 'All'}Modal`));
        modal.show();

        this.$http.get(`gpo/download/${btoa(this.url)}${guid ? '/' + btoa(guid) : ''}`)
          .then((res) => {
            return res.json();
          })
          .then((jres) => {
            modal.hide();
            this.$UIkit.notification({
              message: `${jres} episode${jres !== 0 && jres > 1 ? '' : 's'} downloaded.`,
              status: jres > 0 ? 'success' : 'primary',
              pos: 'top-center',
              timeout: 5000,
            });
            this.getFeedEpisodes();
          })
          .catch((err) => {
            modal.hide();
            this.$UIkit.notification({
              message: `Error during episode${guid ? '' : 's'} download!`,
              status: 'danger',
              pos: 'top-center',
              timeout: 5000,
            });
            this.getFeedEpisodes();
          });
      },
      deleteEpisodes: function(guid) {
        let modal = this.$UIkit.modal(document.getElementById('deleteModal'));
        modal.show();

        this.$http.get(`gpo/delete/${btoa(this.url)}/${btoa(guid)}`)
          .then(() => {
            modal.hide();
            this.$UIkit.notification({
              message: `Episode deleted.`,
              status: 'success',
              pos: 'top-center',
              timeout: 5000,
            });
            this.getFeedEpisodes();
          })
          .catch((err) => {
            modal.hide();
            this.$UIkit.notification({
              message: `Error during episode deletion!`,
              status: 'danger',
              pos: 'top-center',
              timeout: 5000,
            });
            this.getFeedEpisodes();
          });
      },
      subscribe: function() {
        let modal = this.$UIkit.modal(document.getElementById(`subscribeModal`));
        modal.show();

        this.$http.get(`gpo/subscribe/${btoa(this.url)}/${btoa(this.title)}`)
          .then((res) => {
            return res.json();
          })
          .then((jres) => {
            modal.hide();
            this.$UIkit.notification({
              message: `Successfully subscribed.`,
              status: 'success',
              pos: 'top-center',
              timeout: 5000,
            });
            this.isSubscribed(this.url, () => {
              this.getFeedEpisodes();
            });
          })
          .catch((err) => {
            modal.hide();
            this.$UIkit.notification({
              message: `Could not subscribe.`,
              status: 'danger',
              pos: 'top-center',
              timeout: 5000,
            });
          });
      },
      unsubscribe: function() {
        this.$UIkit.modal.confirm('Do you really want to unsubscribe from this feed?').then(() => {
          let modal = this.$UIkit.modal(document.getElementById(`unsubscribeModal`));
          modal.show();

          this.$http.get(`gpo/unsubscribe/${btoa(this.url)}`)
            .then(() => {
              modal.hide();
              this.$UIkit.notification({
                message: `Successfully unsubscribed.`,
                status: 'success',
                pos: 'top-center',
                timeout: 5000,
              });
              this.subscribed = false;
              this.getFeedEpisodes();
            })
            .catch((err) => {
              modal.hide();
              this.$UIkit.notification({
                message: `Could not unsubscribe.`,
                status: 'danger',
                pos: 'top-center',
                timeout: 5000,
              });
            });
        }, () => {
            this.$UIkit.notification({
              message: `Did not do anything.`,
              status: 'warning',
              pos: 'top-center',
              timeout: 5000,
            });
        });
      },
      splitEpisodesInPages: function() {
        let episodesPerPage = Math.floor(this.episodesPerPage);
        this.pagedEpisodes = [];
        let episodesCount = this.episodes.length;
        if (episodesCount <= episodesPerPage) {
          this.pagedEpisodes.push(this.episodes);
          return;
        }
        let remainder = episodesCount % episodesPerPage;
        let latestIndex = 0;
        while (episodesCount > remainder) {
          this.pagedEpisodes.push(this.episodes.slice(latestIndex, latestIndex + episodesPerPage));
          episodesCount -= episodesPerPage;
          latestIndex += episodesPerPage;
        }
        this.pagedEpisodes.push(this.episodes.slice(latestIndex));
      },
      changePage: function(page) {
        this.currentPage = page - 1; // Pagination is 1-indexed
      },
      toggleLayout: function() {
        let oldPageNumber = this.currentPage;
        if (this.tableOrList === 'table') {
          this.tableOrList = 'list';
        } else {
          this.tableOrList = 'table';
        }
        this.splitEpisodesInPages();
        if (oldPageNumber > 0 && oldPageNumber > this.pagedEpisodes.length - 2) {
          this.currentPage = this.pagedEpisodes.length - 2;
        }
        localStorage.setItem('episodesViewType', this.tableOrList);
      },
    },
  };
</script>

<style scoped lang="stylus">
  .feed-info-subtitle
    margin-top 5px
    .uk-icon, span
      margin-right 5px

  .span-br:after
    content '\200b'

  .table-or-list-toggle
    margin-top 5px
    a
      text-decoration underline

  .uk-article
    span[uk-icon]
      cursor pointer
    h1.uk-article-title
      margin-bottom 0
</style>
