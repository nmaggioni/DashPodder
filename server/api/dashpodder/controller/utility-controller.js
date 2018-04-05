const { decode } = require('../../../constants/base64');
const Parser = require('rss-parser');

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
};
