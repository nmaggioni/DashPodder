<template lang="pug">
  form.uk-form(@submit.prevent='renameFeed')
    div(v-if='errors.length')
      p
        b Please correct the following error(s):
      ul
        li(v-for='error in errors', :key='error') {{ error }}
    input.uk-width-1-2#newFeedName(type='text' :placeholder='newFeedName' v-model='newFeedName')
    input.uk-button.uk-margin-left(type='submit' value='Rename')
</template>

<script>
  export default {
    name: 'FeedRename',
    props: {
      feedUrl: {
        type: String,
        required: true,
      },
      feedTitle: {
        type: String,
        required: true,
      },
    },
    data: function() {
      return {
        newFeedName: this.feedTitle,
        errors: [],
      };
    },
    methods: {
      renameFeed() {
        this.errors = [];
        if (!this.newFeedName.length) {
          this.errors.push('New feed name required.');
          return false;
        }

        this.$http.get(`gpo/rename/${btoa(this.feedUrl)}/${btoa(this.newFeedName)}`)
          .then(() => {
            this.$emit('renameDone');
          })
          .catch((err) => {
            this.$emit('renameDone', err);
          });
        return true;
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
