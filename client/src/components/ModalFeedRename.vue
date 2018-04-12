<template lang="pug">
  div(uk-modal='' :id='id')
    .uk-modal-dialog.uk-modal-body
      button.uk-modal-close-default(type='button' uk-close='')
      h2.uk-modal-title Rename this feed
      FeedRename(:feedUrl='feedUrl' :feedTitle='feedTitle' @renameDone='renameDone')
</template>

<script>
  import FeedRename from '@components/FeedRename';

  export default {
    name: 'ModalFeedRename',
    components: {
      FeedRename,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      feedUrl: {
        type: String,
        required: true,
      },
      feedTitle: {
        type: String,
        required: true,
      },
    },
    methods: {
      renameDone: function(arg) {
        this.$emit('renameDone', arg);
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
