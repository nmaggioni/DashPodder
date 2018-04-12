const followRedirects = require('follow-redirects');
const https = followRedirects.https;
const http = followRedirects.http;
const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
const { decode } = require('../../../constants/base64');

/*
function chooseProtocol(url) {

  return url.startsWith('https') ? https : http;
}
*/

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

  static feedinfo(req, res) {
    let url = decode(req.params.url);

    https.get(`https://gpodder.net/api/2/data/podcast.json?url=${url}`, (gpodderRes) => {
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

  static feedinfoscrape(req, res) {
    let mygpourl = decode(req.params.mygpourl);

    https.get(mygpourl.replace(/^http:/, 'https:'), (gpodderRes) => {
      let body = '';

      gpodderRes
        .setEncoding('utf8')
        .on('data', (data) => {
          body += data;
        })
        .on('end', () => {
          const dom = new JSDOM(body);
          let publisher = dom.window.document.querySelector('small.description').childNodes[0].nodeValue
            .replace('·', '').replace(/\n/g, ' ').replace(/^\s*by/, '').replace(/\s\s+/g, '');
          let tags = [];
          dom.window.document.querySelectorAll('span.other').forEach((el) => {
            tags.push(el.innerHTML);
          });
          res.status(200).json({
            publisher: publisher || 'Unknown',
            tags: tags,
          });
        })
        .on('error', (err) => {
          // console.error(err);
          res.status(500).end();
        });
    });
  }

  static episodeinfo(req, res) {
    let podcastUrl = decode(req.params.podcasturl);
    let episodeUrl = decode(req.params.episodeurl);

    https.get(`https://gpodder.net/api/2/data/episode.json?podcast=${podcastUrl}&url=${episodeUrl}`, (gpodderRes) => {
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
