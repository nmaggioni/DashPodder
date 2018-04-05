<template lang="pug">
  mixin navbar_items
    router-link(to="/" tag="li" exact)
      a Subscriptions
    router-link(to="/top" tag="li")
      a Top feeds
    router-link(to="/search" tag="li")
      a Search
  #app
    .uk-container.uk-container-center.uk-margin-top.uk-margin-large-bottom
      nav.uk-navbar.uk-margin-large-bottom
        a.uk-navbar-brand.uk-hidden-small(href="/") DashPodder
        ul.uk-navbar-nav.uk-hidden-small
          +navbar_items
        a.uk-navbar-toggle.uk-visible-small(href="#offcanvas" data-uk-offcanvas="")
        .uk-navbar-brand.uk-navbar-center.uk-visible-small DashPodder

      router-view

    #offcanvas.uk-offcanvas
    .uk-offcanvas-bar
      ul.uk-nav.uk-nav-offcanvas
        +navbar_items
</template>

<script>
  export default {
    name: 'App',
  };
</script>

<style lang="stylus">
  @import "uikit/dist/css/uikit.min.css"
  @import "assets/uikit.docs.css"
  @import "assets/app.styl"
</style>
