const https = require('https');
const fs = require('fs');
const { repoCommitHash } = require('../config/gpo');

function download() {
  https.get(`https://raw.githubusercontent.com/gpodder/gpodder/${repoCommitHash}/bin/gpo`, (res) => {
    let rawData = '';

    res.on('data', (chunk) => {
      rawData += chunk;
    });

    res.on('end', () => {
      fs.writeFileSync(`${__dirname}/bin/gpo`, rawData, {
        mode: 0o744,
      });
    });
  }).on('error', (e) => {
    throw e;
  });
}

module.exports = {
  download: download,
};
