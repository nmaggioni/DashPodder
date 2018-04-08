const https = require('https');
const Parser = require('rss-parser');
const { decode } = require('../../../constants/base64');

module.exports = class UtilityController {
  static parseFeedInfo(req, res) {
    let url = decode(req.params.url);

    let parser = new Parser({
      headers: { 'Accept': 'application/rss+xml,application/rss,application/xml' },
    });
    parser.parseURL(url)
      .then((feed) => {
        res.status(200).json({ title: feed.title, image: feed['itunes']['image'] });
      })
      .catch((err) => {
        // console.error(err);
        res.status(204).end();
      });
  }

  static toplist(req, res) {
    let amount = String(Math.abs(parseInt(req.params.amount)) || 50);

    https.get(`https://gpodder.net/toplist/${amount}.json`, (gpodderRes) => {
      let body = '';

      gpodderRes
        .setEncoding('utf8')
        .on('data', (data) => {
          body += data;
        })
        .on('end', () => {
          res.status(200).json(JSON.parse(body));
        })
        .on('error', (err) => {
          // console.error(err);
          res.status(500).end();
        });
    });
  }

  static search(req, res) {
    let query = decode(req.params.query);

    https.get(`https://gpodder.net/search.json?q=${query}`, (gpodderRes) => {
      let body = '';

      gpodderRes
        .setEncoding('utf8')
        .on('data', (data) => {
          body += data;
        })
        .on('end', () => {
          res.status(200).json(JSON.parse(body));
        })
        .on('error', (err) => {
          // console.error(err);
          res.status(500).end();
        });
    });
  }
};
