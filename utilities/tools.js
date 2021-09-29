function getAPIUrl(network) {
  if (network=='mainnet'){
    return 'https://api.etherscan.io/api'
  } else {
    return 'https://api-' + network + '.etherscan.io/api'
  }
}

function delay(t, val) {
  return new Promise(function(resolve) {
      setTimeout(function() {
          resolve(val);
      }, t);
  });
}

module.exports = {
  getAPIUrl,
  delay
};