const { run } = require('./child_process');
const gpoPath = require('../config/gpo').useSystemScript ? 'gpo' : `${__dirname}/bin/gpo`;

function splitAndClean(rawOutputString) {
  let lines = rawOutputString.split('\n');
  let linesCleaned = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] !== '') {
      linesCleaned.push(lines[i]);
    }
  }
  return linesCleaned;
}

function parseEpisodeStatus(statusChar) {
  switch (statusChar) {
    case '*':
      return 'new';
    case '▉':
      return 'downloaded';
    case '░':
      return 'deleted';
    default:
      return 'unknown';
  }
}

async function subscribe(url, name) {
  let gpo = await run(gpoPath, ['subscribe', url, name]);
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length || !lines[0].startsWith('Successfully added')) {
    throw new Error(`gpo did not output a successful message: ${lines.length ? lines[0].replace('\n', '') : 'N/A'}`);
  }
}

async function search(query) {
  let gpo = await run(gpoPath, ['search', '"' + query + '"']);
  let lines = splitAndClean(gpo.stdout);
  if (!lines.length) {
    return [];
  } else if (!lines[0].startsWith('http')) {
    throw new Error(
      `gpo did not output a successful message: ${lines[0].replace('\n', '')}`
    );
  }
  return lines;
}

async function toplist() {
  let gpo = await run(gpoPath, ['toplist']);
  let lines = splitAndClean(gpo.stdout);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  } else if (!lines[0].startsWith('http')) {
    throw new Error(
      `gpo did not output a successful message: ${lines[0].replace('\n', '')}`
    );
  }
  return lines;
}

async function rename(url, newName) {
  let gpo = await run(gpoPath, ['rename', url, newName]);
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
}

async function unsubscribe(url) {
  let gpo = await run(gpoPath, ['unsubscribe', url]);
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
}

async function enable(url) {
  let gpo = await run(gpoPath, ['enable', url]);
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
}

async function disable(url) {
  let gpo = await run(gpoPath, ['disable', url]);
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
}

async function info(url, episodesLimit) {
  let gpo = await run(gpoPath, ['info', url], true);
  let rawLines = gpo.stdall;
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
  let feedInfo = {
    title: rawLines.match(/Title:\s(.+)$/m)[1],
    url: rawLines.match(/URL:\s(.+)$/m)[1],
    episodes: [],
  };
  if (!feedInfo.title) {
    throw new Error('gpo did not output a successful message');
  }
  let episodesMatches = rawLines.match(/\d+.\s+.\s+.+$/gm);
  for (let i = 0; (i < episodesMatches.length) && (episodesLimit ? i < episodesLimit : true); i++) {
    feedInfo.episodes.push({
      title: episodesMatches[i].match(/\d+.\s+.\s+(.+)$/)[1],
      status: parseEpisodeStatus(episodesMatches[i].match(/\d+.\s+(.)\s+/)[1]),
    });
  }
  return feedInfo;
}

async function list() {
  let gpo = await run(gpoPath, ['list']);
  let lines = splitAndClean(gpo.stdout);
  let linesNumber = lines.length;
  if (!linesNumber) {
    throw new Error('gpo did not output anything');
  } else if (linesNumber % 2 !== 0) {
    throw new Error('gpo did not output an even number of lines');
  }
  let feeds = {};
  let feedName;
  for (let i = 0; i < lines.length; i++) {
    if (i % 2 === 0) {
      feedName = lines[i].replace(/^# /, '');
    } else if (feedName) {
      feeds[feedName] = lines[i];
    }
  }
  return feeds;
}

async function update(url) {
  let gpo = await run(gpoPath, ['update'].concat(url || []));
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
  return parseInt(lines[lines.length - 1].match(/^\d+/));
}

async function download(url, guid) {
  let gpo = await run(gpoPath, ['download'].concat(url || []).concat(guid || []));
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
  return parseInt(lines[lines.length - 1].match(/^\d+/));
}

async function _delete(url, guid) {
  let gpo = await run(gpoPath, ['delete'].concat([url, guid]));
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
}

async function pending(url) {
  let gpo = await run(gpoPath, ['pending'].concat(url || []));
  let lines = splitAndClean(gpo.stdout);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
  let pendingNumber = parseInt(lines[lines.length - 1].match(/^\d+/));
  lines.splice(lines.length - 1, 1);
  let feeds = {};
  let feedName;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('# ')) {
      feedName = lines[i].replace(/^# /, '');
    } else if (feedName) {
      let episode = lines[i].replace(/^\s+/, '');
      feeds[feedName] = feeds[feedName] ? feeds[feedName].concat(episode) : [episode];
    }
  }
  return [pendingNumber, feeds];
}

async function episodes(url, limit, offset) {
  if (limit && offset) limit += offset;
  let gpo = await run(gpoPath, ['episodes', '--guid'].concat(url || []));
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
  let feeds = {};
  let feedUrl;
  let episodesCount = 0;
  for (let i = 0; i < lines.length; i++) {
    let matchesUrl = lines[i].match(/\s+\w+\s\w+\s(http.+):$/);
    if (matchesUrl) {
      feedUrl = matchesUrl[1];
      episodesCount = 0;
    } else if (feedUrl) {
      let matches = lines[i].match(/\d+\.\s+(\S+)\s+(.)\s+(.+)$/);
      if (matches) {
        if ((offset ? episodesCount >= offset : true) && (limit ? episodesCount < limit : true)) {
          let episode = {
            title: matches[3],
            guid: matches[1],
            status: parseEpisodeStatus(matches[2]),
          };
          feeds[feedUrl] = feeds[feedUrl] ? feeds[feedUrl].concat(episode) : [episode];
        }
        episodesCount++;
      }
    }
  }
  return feeds;
}

async function set(key, value) {
  let optArray = [];
  if (key) {
    optArray.push(key);
    if (value) {
      optArray.push(value);
    }
  }
  let gpo = await run(gpoPath, ['set'].concat(optArray));
  let lines = splitAndClean(gpo.stdout);
  if (!lines.length || !lines[0].match(/.* = .*/)) {
    throw new Error(
      `gpo did not output a successful message: ${lines.length ? lines[0].replace('\n', '') : 'N/A'}`
    );
  }
  let settings = {};
  for (let i = 0; i < lines.length; i++) {
    let splitted = lines[i].split(' = ');
    settings[splitted[0]] = splitted[1];
  }
  return settings;
}

async function rewrite(oldUrl, newUrl) {
  let gpo = await run(gpoPath, ['rewrite', oldUrl, newUrl]);
  let lines = splitAndClean(gpo.stdall);
  if (!lines.length) {
    throw new Error('gpo did not output anything');
  }
}

module.exports = {
  subscribe: subscribe,
  search: search,
  toplist: toplist,
  rename: rename,
  unsubscribe: unsubscribe,
  enable: enable,
  disable: disable,
  info: info,
  list: list,
  update: update,
  download: download,
  _delete: _delete,
  pending: pending,
  episodes: episodes,
  set: set,
  rewrite: rewrite,
};
