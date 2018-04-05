function encode(data) {
  return Buffer.from(data).toString('base64');
}

function decode(data) {
  return Buffer.from(data, 'base64').toString('ascii');
}

module.exports = {
  encode: encode,
  decode: decode
};
