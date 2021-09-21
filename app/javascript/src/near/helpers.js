document.nearNetworkChainId = function(environment) {
  let chainId = 'mainnet'
  if (environment == 'staging') {
    chainId = 'testnet'
  };
  return chainId
}

document.nearNetworkHttpUrl = function(environment) {
  let http_url = 'datahub';
  if (environment == 'staging') {
    http_url = http_url + '_staging'
  };
  return http_url
}

document.nearNetworkWebWalletUrl = function(environment) {
  let http_url = 'https://wallet.near.org/';
  if (environment == 'staging') {
    http_url = 'https://wallet.testnet.near.org/'
  };
  return http_url
}
