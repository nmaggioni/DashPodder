"use strict";

const GpodderRoutes = require("../api/dashpodder/route/gpodder-routes");
const UtilityRoutes = require("../api/dashpodder/route/utility-routes");

const StaticDispatcher = require("../commons/static/index");


module.exports = class Routes {
  static init(app, router) {
    GpodderRoutes.init(router);
    UtilityRoutes.init(router);

    router
      .route("*")
      .get(StaticDispatcher.sendIndex);


    app.use("/", router);
  }
};
