document.secretNetwork = {
  addressAliasContract: {
    address: 'secret19993tt7657ljrzt27dh8wm7kxfedgezyuva96w',
    dataHash: 'D3194D7CEBE185E50C4D3CD3CF40827F58DFC48971EE330087CEFA8395FA0B6E'
  },
  butt: {
    address: 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt',
    dataHash: 'F8B27343FF08290827560A1BA358EECE600C9EA7F403B02684AD87AE7AF0F288'
  },
  environment: 'production',
  smartContracts: {},
  userVipLevel: 0,
  walletAddress: undefined,
  transactions: {
    extractDescriptionAddressFromTx: function(ownerAddress, tx) {
      let descriptionAddress;
      if (ownerAddress != tx['receiver']) {
        descriptionAddress = tx['receiver']
      } else {
        descriptionAddress = tx['from']
      }
      return descriptionAddress
    },
    getSmartContractsInTxs: async(ownerAddress, txs) => {
      let addressesString = ''
      let addressesInString = {}
      txs.forEach((tx) => {
        let address = document.secretNetwork.transactions.extractDescriptionAddressFromTx(ownerAddress, tx)
        if (!document.secretNetwork.smartContracts[address] || !addressesInString[address]) {
          addressesString = addressesString + address + ','
          addressesInString[address] = true
        }
      })

      try {
        let contracts = await $.ajax({
          url: '/smart_contracts?addresses=' + addressesString,
          type: 'GET'
        })
        contracts.forEach((smartContract) => {
          document.secretNetwork.smartContracts[smartContract["address"]] = smartContract;
        })
      } catch(err) {
        console.log(err)
      }
    }
  },
  chainId: function(environment) {
    let chainId = 'secret-4'
    if (environment == 'staging') {
      chainId = 'pulsar-2'
    };
    return chainId
  },
  client: function() {
    const {
      CosmWasmClient,
    } = require('secretjs');

    if (document.secretNetwork.environment == 'staging') {
      if (!document.secretNetworkClientStaging) {
        document.secretNetworkClientStaging = new CosmWasmClient(document.secretNetworkHttpUrl(document.secretNetwork.environment))
      }
      return document.secretNetworkClientStaging
    } else {
      if (!document.secretNetworkClientProduction) {
        document.secretNetworkClientProduction = new CosmWasmClient(document.secretNetworkHttpUrl(document.secretNetwork.environment))
      }
      return document.secretNetworkClientProduction
    }
  },
  getAndSetUserVipLevel: async(address, client) => {
    let chainId = document.secretNetwork.chainId('production')
    document.secretNetwork.userVipLevel = 0
    // Set users vip level
    try {
      let params = {
        balance: {
          address: address,
          key: await window.keplr.getSecret20ViewingKey(chainId, document.secretNetwork.butt.address)
        }
      }
      let balance_response = await client.queryContractSmart(document.secretNetwork.butt.address, params, undefined, document.secretNetwork.butt.dataHash);
      let balance = balance_response["balance"]["amount"]
      balance = Number(balance)
      if (balance >= 100_000_000_000) {
        document.secretNetwork.userVipLevel = 5
      } else if(balance >= 50_000_000_000) {
        document.secretNetwork.userVipLevel = 4
      } else if(balance >= 25_000_000_000) {
        document.secretNetwork.userVipLevel = 3
      } else if(balance >= 12_500_000_000) {
        document.secretNetwork.userVipLevel = 2
      } else if(balance >= 6_250_000_000) {
        document.secretNetwork.userVipLevel = 1
      }
    } catch(err) {
      console.error(err)
    } finally {
      $("#vip-level").text(document.secretNetwork.userVipLevel)
      return document.secretNetwork.userVipLevel
    }
  },
  signingClient: function(walletAddress, gasParams) {
    const {
      SigningCosmWasmClient,
    } = require('secretjs');

    let chainId = document.secretNetwork.chainId(document.secretNetwork.environment)
    let httpUrl = document.secretNetworkHttpUrl(document.secretNetworkHttpUrl(document.secretNetwork.environment))
    let keplrOfflineSigner = window.getOfflineSigner(chainId);
    if (document.secretNetwork.environment == 'staging') {
      if (!document.secretNetworkSigningClientStaging) {
        document.secretNetworkSigningClientStaging = new SigningCosmWasmClient(httpUrl, walletAddress, keplrOfflineSigner, window.getEnigmaUtils(chainId), gasParams)
      }
      return document.secretNetworkSigningClientStaging
    } else {
      if (!document.secretNetworkSigningClientProduction) {
        document.secretNetworkSigningClientProduction = new SigningCosmWasmClient(httpUrl, walletAddress, keplrOfflineSigner, window.getEnigmaUtils(chainId), gasParams)
      }
      return document.secretNetworkSigningClientProduction
    }
  }
}

document.secretNetworkHttpUrl = function(environment) {
  let http_url = '/datahub';
  if (environment == 'staging') {
    http_url = http_url + '_staging'
  };
  return http_url
}
