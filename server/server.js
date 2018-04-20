const PORT = process.env.PORT || 3333;

const fs = require("fs");
const os = require("os");
const http = require("http");
const express = require("express");
const RoutesConfig = require("./config/routes.conf");
const Routes = require("./routes/index");

const { useSystemScript } = require('./config/gpo');
if (!useSystemScript && !fs.existsSync('./constants/bin/gpo')) {
  console.log('Custom gpo script not detected, downloading...');
  const getGpoScript = require(`${__dirname}/constants/get_gpo_script`);
  getGpoScript.download();
}

const app = express();

RoutesConfig.init(app);
Routes.init(app, express.Router());

http.createServer(app)
  .listen(PORT, () => {
    console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
    console.log(`enviroment: ${process.env.NODE_ENV}`);
  });
