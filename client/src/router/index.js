import Vue from 'vue';
import Router from 'vue-router';
import PageSubscriptions from '@pages/Subscriptions';
import PageTopFeeds from '@pages/TopFeeds';
import PageSearch from '@pages/Search';
import PageFeed from '@pages/Feed';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'uk-active',
  routes: [
    {
      path: '/',
      name: 'Subscriptions',
      component: PageSubscriptions,
    },
    {
      path: '/top',
      name: 'Top feeds',
      component: PageTopFeeds,
    },
    {
      path: '/search',
      name: 'Search',
      component: PageSearch,
    },
    {
      path: '/feed',
      name: 'Feed',
      component: PageFeed,
    },
  ],
});
