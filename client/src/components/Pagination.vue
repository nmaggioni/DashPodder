<template lang="pug">
  ul.uk-pagination.uk-flex-center.uk-margin
    li(:class='{ "uk-disabled": currentPage <= 1 }')
      a(@click="previous")
        span(uk-pagination-previous='')

    template(v-if='splittedPages.split > 0')
      li(v-for='p in range(splittedPages.start, currentPage - 1)' :class='p === currentPage ? "uk-active" : ""')
        a(@click="$emit('changePage', p)") {{ p }}
      li(v-for='p in range(currentPage, splittedPages.split)' :class='p === currentPage ? "uk-active" : ""')
        a(@click="$emit('changePage', p)") {{ p }}
      template(v-if='splittedPages.split < splittedPages.end')
        li.uk-disabled
          a ...
        li(:class='splittedPages.end === currentPage ? "uk-active" : ""')
          a(@click="$emit('changePage', splittedPages.end)" v-text='splittedPages.end')

    template(v-else)
      li(v-for='p in pages' :class='p === currentPage ? "uk-active" : ""')
        a(@click="$emit('changePage', p)") {{ p }}

    li(:class='{ "uk-disabled": currentPage === pages }')
      a(@click="next")
        span(uk-pagination-next='')

</template>

<script>
  export default {
    name: 'Pagination',
    props: {
      pages: {
        type: Number,
        required: true,
      },
      currentPage: {
        type: Number,
        required: true,
      },
    },
    computed: {
      splittedPages: function() {
        let res = {
          start: this.currentPage > 2 ? this.currentPage - 2 : 1,
          split: 0,
          end: this.pages,
        };
        if (this.pages > 10) {
          let split = this.currentPage + 2;
          while (split > this.pages) {
            split--;
          }
          res.split = split;
        }
        return res;
      },
    },
    methods: {
      range: function(start, end) {
        return Array(end - start + 1).fill('').map((_, idx) => start + idx);
      },
      changePage: function(page) {
        this.$emit('changePage', page);
      },
      previous: function() {
        if (this.currentPage > 1) {
          this.changePage(this.currentPage - 1);
        }
      },
      next: function() {
        if (this.currentPage < this.pages) {
          this.changePage(this.currentPage + 1);
        }
      },
    },
  };
</script>

<style scoped lang="stylus">
  .uk-pagination
    li
      a
        padding-top 0
        padding-bottom 0
        &:hover
          color #555
    .uk-active
      color #333
</style>
