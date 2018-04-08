const gpodder = require("../../../constants/gpodder");
const { decode } = require("../../../constants/base64");

module.exports = class GpodderController {
  static subscribe(req, res) {
    let url = decode(req.params.url),
      name = decode(req.params.name);

    gpodder.subscribe(url, name).then(() => {
      res.status(200).json({});
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static search(req, res) {
    let query = decode(req.params.query);

    gpodder.search(query).then(results => {
      res.status(results.length ? 200 : 204).json(results);
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static toplist(req, res) {
    gpodder.toplist().then(results => {
      res.status(200).json(results);
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static rename(req, res) {
    let url = decode(req.params.url),
      newname = decode(req.params.newname);

    gpodder.rename(url, newname).then(() => {
      res.status(200).json({});
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static unsubscribe(req, res) {
    let url = decode(req.params.url);

    gpodder.subscribe(url).then(() => {
      res.status(200).json({});
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static enable(req, res) {
    let url = decode(req.params.url);

    gpodder.enable(url).then(() => {
      res.status(200).json({});
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static disable(req, res) {
    let url = decode(req.params.url);

    gpodder.disable(url).then(() => {
      res.status(200).json({});
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static info(req, res) {
    let url = decode(req.params.url),
      limit = req.params.limit ? parseInt(req.params.limit) : null;

    gpodder.info(url, limit).then((info) => {
      res.status(200).json(info);
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static list(req, res) {
    gpodder.list().then((list) => {
      res.status(200).json(list);
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static update(req, res) {
    let url = req.params.url ? decode(req.params.url) : null;

    gpodder.update(url).then((numberOfNewEpisodes) => {
      res.status(200).json(numberOfNewEpisodes);
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static download(req, res) {
    let url = req.params.url ? decode(req.params.url) : null;

    gpodder.download(url).then((numberOfDownloadedEpisodes) => {
      res.status(200).json(numberOfDownloadedEpisodes);
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static pending(req, res) {
    let url = req.params.url ? decode(req.params.url) : null;

    gpodder.pending(url).then((result) => {
      res.status(200).json(result);
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static episodes(req, res) {
    let url = req.params.url ? decode(req.params.url) : null,
      limit = req.params.limit ? parseInt(req.params.limit) : null,
      offset = req.params.offset ? parseInt(req.params.offset) : null;

    gpodder.episodes(url, limit, offset).then((result) => {
      res.status(200).json(result);
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static set(req, res) {
    let key = req.params.key ? decode(req.params.key) : null,
      value = req.params.value ? decode(req.params.value) : null;

    gpodder.set(key, value).then((result) => {
      res.status(200).json(result);
    }).catch(err => {
      res.status(500).json(err);
    });
  }

  static rewrite(req, res) {
    let oldurl = decode(req.params.oldurl),
      newurl = decode(req.params.newurl);

    gpodder.rewrite(oldurl, newurl).then(() => {
      res.status(200).json({});
    }).catch(err => {
      res.status(500).json(err);
    });
  }
};
