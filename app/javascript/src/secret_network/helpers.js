document.secretNetworkClient = function(environment) {
  const {
    CosmWasmClient,
  } = require('secretjs');
  return new CosmWasmClient(document.secretNetworkHttpUrl(environment))
}

document.secretNetworkSigningClient = function(environment, walletAddress, gasParams) {
  const {
    SigningCosmWasmClient,
  } = require('secretjs');
  let chainId = document.secretNetworkChainId(environment)
  let httpUrl = document.secretNetworkHttpUrl(document.secretNetworkHttpUrl(environment))
  let keplrOfflineSigner = window.getOfflineSigner(chainId);
  return new SigningCosmWasmClient(httpUrl, walletAddress, keplrOfflineSigner, window.getEnigmaUtils(chainId), gasParams)
}

document.secretNetworkChainId = function(environment) {
  let chainId = 'secret-4'
  if (environment == 'staging') {
    chainId = 'pulsar-1'
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
