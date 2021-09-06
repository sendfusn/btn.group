// This is only for queries. See the SigningCosmWasmClient for handle actions.
document.secretNetworkClient = function(environment) {
  const {
    CosmWasmClient,
  } = require('secretjs');

  return new CosmWasmClient(document.secretNetworkHttpUrl(environment))
}

document.secretNetworkChainId = function(environment) {
  let chainId = 'secret-2'
  if (environment == 'staging') {
    chainId = 'holodeck-2'
  };
  return chainId
}

document.secretNetworkHttpUrl = function(environment) {
  let http_url = '/datahub';
  if (environment == 'staging') {
    http_url = http_url + '_staging'
  };
  return http_url
}
