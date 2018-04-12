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

  static feedinfoparse(req, res) {
    let url = decode(req.params.url);

    let parser = new Parser({
      headers: { 'Accept': 'application/rss+xml,application/rss,application/xml' },
    });
    parser.parseURL(url)
      .then((feed) => {
        res.status(200).json({
          title: feed.title,
          description: feed.description,
          image: feed['itunes']['image'],
        });
      })
      .catch((err) => {
        // console.error(err);
        res.status(204).end();
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
          let publisher = dom.window.document.querySelector('small.description');
          if (publisher) {
            publisher = publisher.childNodes[0].nodeValue
              .replace('·', '').replace(/\n/g, ' ').replace(/^\s*by/, '').replace(/\s\s+/g, '');
          }
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

  static episodeinfoscrape(req, res) {
    let podcastUrl = decode(req.params.podcasturl);
    let episodeTitle = decode(req.params.episodetitle);

    let parser = new Parser({
      headers: { 'Accept': 'application/rss+xml,application/rss,application/xml' },
    });
    parser.parseURL(podcastUrl)
      .then((feed) => {
        let episodeInfo = {};
        let found = feed.items.some((episode) => {
          if (episode.title.toLowerCase() === episodeTitle.toLowerCase()) {
            episodeInfo = {
              title: episode.title,
              subtitle: episode.itunes.subtitle,
              creator: episode.creator,
              date: episode.isoDate,
              link: episode.link,
              media: episode.enclosure.url,
              content: episode.contentSnippet,
              summary: episode.itunes.summary,
              duration: episode.itunes.duration,
              explicit: episode.itunes.explicit,
              image: episode.itunes.image,
            };
            return true;
          }
        });
        res.status(found ? 200 : 204).json(episodeInfo);
      })
      .catch((err) => {
        // console.error(err);
        res.status(204).end();
      });
  }

  static episodesinfoscrape(req, res) {
    let podcastUrl = decode(req.params.podcasturl);
    let limit = Math.abs(parseInt(req.params.limit || 0));
    let offset = Math.abs(parseInt(req.params.offset || 0));

    let parser = new Parser({
      headers: { 'Accept': 'application/rss+xml,application/rss,application/xml' },
    });
    parser.parseURL(podcastUrl)
      .then((feed) => {
        let episodeInfos = [];
        if (limit > 0) {
          if (offset > 0) {
            feed.items = feed.items.slice(offset);
          }
          feed.items = feed.items.slice(0, limit);
        }
        feed.items.forEach((episode) => {
          episodeInfos.push({
            title: episode.title,
            subtitle: episode.itunes.subtitle,
            creator: episode.creator,
            date: episode.isoDate,
            link: episode.link,
            media: episode.enclosure.url,
            content: episode.contentSnippet,
            summary: episode.itunes.summary,
            duration: episode.itunes.duration,
            explicit: episode.itunes.explicit,
            image: episode.itunes.image,
          });
        });
        res.status(episodeInfos.length ? 200 : 204).json(episodeInfos);
      })
      .catch((err) => {
        // console.error(err);
        res.status(204).end();
      });
  }
};
