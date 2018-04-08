<template lang="pug">
  .feed-subscribe
    h2.uk-text-center Add a new subscription
    div(v-if='shouldShowBanner' :class="bannerClass" uk-alert="duration: 200")
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
            input.uk-button.uk-button-primary(type='submit' value='Subscribe' :disabled='loading')
            div(uk-spinner="ratio: 0.75" v-if="loading")

</template>

<script>
  export default {
    name: 'FeedSubscribe',
    data: function() {
      return {
        newFeedName: '',
        newFeedURL: '',
        errors: [],
        loading: false,
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
        this.loading = true;
        this.errors = [];
        if (!this.newFeedName) {
          this.errors.push('Feed name required.');
        }
        if (!this.newFeedURL) {
          this.errors.push('Feed URL required.');
        }
        if (this.newFeedURL && !/^http(?:s)?:\/\//.test(this.newFeedURL)) {
          this.errors.push('Feed URL does not look like an HTTP(S) URL.');
        }
        if (this.errors.length) {
          this.loading = false;
          return false;
        }

        this.$http.get(`gpo/subscribe/${btoa(this.newFeedURL)}/${btoa(this.newFeedName)}`)
          .then(() => {
            this.loading = false;
            this.success = true;
            setTimeout(() => {
              this.success = false;
            }, 3000);
            this.$emit('refresh');
          })
          .catch(() => {
            this.loading = false;
            this.errors.push('Something went wrong.');
          });
        return true;
      },
    },
  };
</script>

<style scoped lang="stylus">
  h2
    margin-bottom 30px
  .uk-form-label
    font-size 1em
    margin-top 10px
    width 100px
  .uk-form-controls
    margin-left 100px
  .uk-alert
    width 300px
    margin auto
    margin-bottom 30px
    p
      margin-bottom 0
      margin-right 30px
  .uk-alert-close
    top 10px
    &:after
      display none
  .uk-spinner
    margin-left 15px
</style>
