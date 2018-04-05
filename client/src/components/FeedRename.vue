<template lang="pug">
  form(action='#', @submit='renameFeed')
    div(v-if='errors.length')
      p
        b Please correct the following error(s):
      ul
        li(v-for='error in errors', :key='error') {{ error }}
    span Rename this feed:
    input#newFeedName(v-model='newFeedName', :placeholder='feedTitle', type='text')
    input(type='submit', value='Rename')
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
        newFeedName: '',
        errors: [],
      };
    },
    methods: {
      renameFeed(e) {
        e.preventDefault();
        this.errors = [];
        if (!this.newFeedName.length) {
          this.errors.push('New feed name required.');
          return false;
        }

        this.$http.get(`gpo/rename/${btoa(this.feedUrl)}/${btoa(this.newFeedName)}`)
          .then(() => {
            window.alert('Renamed successfully');
            this.newFeedName = '';
            this.$emit('refresh');
          })
          .catch(() => {
            window.alert('Renamed UNsuccessfully');
          });
        return true;
      },
    },
  };
</script>

<style scoped lang="stylus">
</style>
