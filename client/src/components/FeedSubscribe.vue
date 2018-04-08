<template lang="pug">
  div
    div(v-if='shouldShowBanner' :class="bannerClass" uk-alert="duration: 200")
      button.uk-alert-close(type="button" uk-close)
      div(v-if="errors.length")
        p
          b Please correct the following error(s):
        ul
          li(v-for='error in errors' :key='error') {{ error }}
      div(v-else)
        p Subscribed successfully!
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
        success: false,
      };
    },
    computed: {
      shouldShowBanner: function() {
        return this.errors.length || this.success;
      },
      bannerClass: function() {
        if (this.errors.length) {
          return 'uk-alert-danger';
        } else if (this.success) {
          return 'uk-alert-success';
        }
        return 'uk-alert-primary';
      },
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
            this.success = true;
            setTimeout(() => {
              this.success = false;
            }, 1500);
            this.$emit('refresh');
          })
          .catch(() => {
            this.errors.push('Something went wrong.');
          });
        return true;
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
