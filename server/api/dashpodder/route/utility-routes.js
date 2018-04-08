const UtilityController = require('../controller/utility-controller');

module.exports = class GpodderRoutes {
  static init(router) {
    router
      .route('/api/util/parsefeedinfo/:url')
      .get(UtilityController.parseFeedInfo);

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
      .route('/api/util/episodeinfo/:podcasturl/:episodeurl')
      .get(UtilityController.episodeinfo);
  }
};
