<template lang="pug">
  mixin navbar_items_left
    router-link(to="/" tag="li" exact)
      a Subscriptions
    router-link(to="/top" tag="li")
      a Top feeds
    router-link(to="/search" tag="li")
      a Search

  mixin navbar_items_right
    router-link(to="/settings" tag="li" exact)
      a Settings

  #app
    .uk-container.uk-container-center.uk-margin-top.uk-margin-large-bottom
      nav.uk-navbar.uk-margin-large-bottom
        a.uk-navbar-brand.uk-hidden-small(href="/") DashPodder
        .uk-navbar-left
          ul.uk-navbar-nav.uk-hidden-small
            +navbar_items_left
        .uk-navbar-right
          ul.uk-navbar-nav.uk-hidden-small
            +navbar_items_right
        a.uk-navbar-toggle.uk-visible-small(uk-toggle="target: #offcanvas-nav")
        .uk-navbar-brand.uk-navbar-center.uk-visible-small DashPodder

      router-view

    #offcanvas-nav(uk-offcanvas='overlay: true')
      .uk-offcanvas-bar
        ul.uk-nav.uk-nav-default
          +navbar_items_left
          li.uk-nav-divider
          +navbar_items_right
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
