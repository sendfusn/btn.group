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
