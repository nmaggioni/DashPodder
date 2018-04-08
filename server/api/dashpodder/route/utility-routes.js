const UtilityController = require('../controller/utility-controller');

module.exports = class GpodderRoutes {
  static init(router) {
    router
      .route('/api/util/parsefeedinfo/:url')
      .get(UtilityController.parseFeedInfo);

    router
      .route('/api/util/toplistgpoddernet')
      .get(UtilityController.toplistGpodderNet);

    router
      .route('/api/util/toplistgpoddernet/:amount')
      .get(UtilityController.toplistGpodderNet);
  }
};
