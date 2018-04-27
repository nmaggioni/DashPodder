const GpodderController = require('../controller/gpodder-controller');

module.exports = class GpodderRoutes {
  static init(router) {
    router
      .route('/api/gpo/subscribe/:url/:name')
      .get(GpodderController.subscribe);

    router
      .route('/api/gpo/search/:query')
      .get(GpodderController.search);

    router
      .route('/api/gpo/toplist')
      .get(GpodderController.toplist);

    router
      .route('/api/gpo/rename/:url/:newname')
      .get(GpodderController.rename);

    router
      .route('/api/gpo/unsubscribe/:url')
      .get(GpodderController.unsubscribe);

    router
      .route('/api/gpo/enable/:url')
      .get(GpodderController.enable);

    router
      .route('/api/gpo/disable/:url')
      .get(GpodderController.disable);

    router
      .route('/api/gpo/info/:url/:limit?')
      .get(GpodderController.info);

    router
      .route('/api/gpo/list')
      .get(GpodderController.list);

    router
      .route('/api/gpo/update/:url?')
      .get(GpodderController.update);

    router
      .route('/api/gpo/download/:url?/:guid?')
      .get(GpodderController.download);

    router
      .route('/api/gpo/pending/:url?')
      .get(GpodderController.pending);

    router
      .route('/api/gpo/episodes/:url?/:limit?/:offset?')
      .get(GpodderController.episodes);

    router
      .route('/api/gpo/set/:key?/:value?')
      .get(GpodderController.set);

    router
      .route('/api/gpo/rewrite/:oldurl/:newurl')
      .get(GpodderController.rewrite);
  }
};
