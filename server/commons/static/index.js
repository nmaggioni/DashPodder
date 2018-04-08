"use strict";

const fs = require("fs");
const path = require("path");

module.exports = class StaticDispatcher {
  static sendIndex(req, res) {
    const _root = process.cwd();

    res.type(".html");

    fs.createReadStream(path.join(`${_root}/../client/dist/index.html`)).pipe(res);
  }
};
