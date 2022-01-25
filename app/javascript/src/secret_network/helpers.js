document.buttonAddress = function() {
  return 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt'
}

document.getAndSetUserVipLevel = async(address, client) => {
  let chainId = document.secretNetworkChainId('production')
  let userVipLevel = 0
  // Set users vip level
  try {
    let params = {
      balance: {
        address: address,
        key: await window.keplr.getSecret20ViewingKey(chainId, document.buttonAddress())
      }
    }
    let balance_response = await client.queryContractSmart(document.buttonAddress(), params);
    let balance = balance_response["balance"]["amount"]
    balance = Number(balance)
    if (balance >= 100_000_000_000) {
      userVipLevel = 5
    } else if(balance >= 50_000_000_000) {
      userVipLevel = 4
    } else if(balance >= 25_000_000_000) {
      userVipLevel = 3
    } else if(balance >= 12_500_000_000) {
      userVipLevel = 2
    } else if(balance >= 6_250_000_000) {
      userVipLevel = 1
    }
  } catch(err) {
    console.error(err)
  } finally {
    $("#vip-level").text(userVipLevel)
    return userVipLevel
  }
}

document.secretNetworkChainId = function(environment) {
  let chainId = 'secret-4'
  if (environment == 'staging') {
    chainId = 'pulsar-2'
  };
  return chainId
}

document.secretNetworkClient = function(environment) {
  const {
    CosmWasmClient,
  } = require('secretjs');
  return new CosmWasmClient(document.secretNetworkHttpUrl(environment))
}

document.secretNetworkHttpUrl = function(environment) {
  let http_url = '/datahub';
  if (environment == 'staging') {
    http_url = http_url + '_staging'
  };
  return http_url
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
