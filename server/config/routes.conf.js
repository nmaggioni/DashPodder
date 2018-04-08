"use strict";

const morgan = require("morgan");
const bodyParser = require("body-parser");
const contentLength = require("express-content-length-validator");
const helmet = require("helmet");
const express = require("express");
const compression = require("compression");
const zlib = require("zlib");
const cors = require('cors');

module.exports = class RouteConfig {
  static init(application) {
    let _root = process.cwd();
    let _nodeModules = "/node_modules/";
    let _jspmPackages = "/jspm_packages/";
    let _clientFiles = "/../client/dist/";

    application.use(compression({
      level: zlib.Z_BEST_COMPRESSION,
      threshold: "1kb"
    }));

    application.use(express.static(_root + _nodeModules));
    application.use(express.static(_root + _jspmPackages));
    application.use(express.static(_root + _clientFiles));
    application.use(cors());
    application.use(bodyParser.json());
    application.use(morgan("dev"));
    application.use(contentLength.validateMax({ max: 999 }));
    application.use(helmet());
  }
}
