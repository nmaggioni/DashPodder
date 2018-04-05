<template lang="pug">
  div
    .uk-text-center.uk-text-error(v-if='errors.length')
        p
          b Please correct the following error(s):
        ul
          li(v-for='error in errors' :key='error') {{ error }}
    div
      form.uk-form-horizontal.uk-grid-small.uk-text-center(uk-grid action='#' @submit='subscribeToFeed')
        fieldset.uk-fieldset.uk-width-1-3.uk-container-center
          label.uk-form-label(for='newFeedName') Name
          .uk-form-controls
            input.uk-input#newFeedName(v-model='newFeedName' type='text')
          .uk-margin
            label.uk-form-label(for='newFeedURL') URL
            .uk-form-controls
              input.uk-input#newFeedURL(v-model='newFeedURL' type='text')
          .uk-margin
            input.uk-button.uk-button-primary(type='submit' value='Subscribe')

</template>

<script>
  export default {
    name: 'FeedSubscribe',
    data: function() {
      return {
        newFeedName: '',
        newFeedURL: '',
        errors: [],
      };
    },
    methods: {
      subscribeToFeed(e) {
        e.preventDefault();
        this.errors = [];
        if (!this.newFeedName) {
          this.errors.push('Feed name required.');
          return false;
        }
        if (!this.newFeedURL) {
          this.errors.push('Feed URL required.');
          return false;
        }
        if (!/^http(?:s)?:\/\//.test(this.newFeedURL)) {
          this.errors.push('Feed URL does not look like an HTTP(S) URL.');
          return false;
        }

        this.$http.get(`gpo/subscribe/${btoa(this.newFeedURL)}/${btoa(this.newFeedName)}`)
          .then(() => {
            window.alert('Subscribed successfully');
            this.$emit('refresh');
          })
          .catch(() => {
            window.alert('Subscribed UNsuccessfully');
          });
        return true;
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
