const UtilityController = require('../controller/utility-controller');

module.exports = class GpodderRoutes {
  static init(router) {
    router
      .route('/api/util/toplist')
      .get(UtilityController.toplist);

    router
      .route('/api/util/toplist/:amount')
      .get(UtilityController.toplist);

    router
      .route('/api/util/search/:query')
      .get(UtilityController.search);

    router
      .route('/api/util/feedinfo/:url')
      .get(UtilityController.feedinfo);

    router
      .route('/api/util/feedinfoparse/:url')
      .get(UtilityController.feedinfoparse);

    router
      .route('/api/util/feedinfoscrape/:mygpourl')
      .get(UtilityController.feedinfoscrape);

    router
      .route('/api/util/episodeinfo/:podcasturl/:episodeurl')
      .get(UtilityController.episodeinfo);

    router
      .route('/api/util/episodeinfoscrape/:podcasturl/:episodetitle')
      .get(UtilityController.episodeinfoscrape);

    router
      .route('/api/util/episodesinfoscrape/:podcasturl/:limit?/:offset?')
      .get(UtilityController.episodesinfoscrape);
  }
};
