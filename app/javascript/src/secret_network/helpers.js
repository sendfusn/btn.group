// SECRETJS
document.secretNetwork = {
  butt: {
    address: 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt',
    dataHash: 'F8B27343FF08290827560A1BA358EECE600C9EA7F403B02684AD87AE7AF0F288'
  },
  environment: 'production',
  gasAndDelayFactor: 1,
  gettingBlockHeight: false,
  height: 0,
  keplrConnectedTriggered: false,
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
  allBalances: async(environment = 'production', attempt = 1) => {
    let response;
    try {
      let client = await document.secretNetwork.signingClient(environment)
      response = await client.query.bank.allBalances({ address: document.secretNetwork.walletAddress})
    } catch(err) {
      if (err.message.includes('Bad status on response: 502') && attempt < 5) {
        return await document.secretNetwork.allBalances(environment, attempt + 1)
      } else {
        throw err
      }
    } finally {
      if (response) {
        if (response['code'] > 0) {
          if (response['jsonLog']['generic_err']) {
            throw response['jsonLog']['generic_err']
          } else if(response['jsonLog']['not_found']) {
            throw response['jsonLog']['not_found']['kind'] + ' ' + 'not found'
          } else {
            throw response['jsonLog']['rawLog']
          }
        } else {
          return response
        }
      }
    }
  },
  chainId: function(environment = 'production') {
    let chainId = 'secret-4'
    if (environment == 'staging') {
      chainId = 'pulsar-2'
    };
    return chainId
  },
  client: async(environment) => {
    const {
      SecretNetworkClient,
    } = require('secretjs');

    if (environment == 'staging') {
      if (!document.secretNetworkClientStaging) {
        document.secretNetworkClientStaging = await SecretNetworkClient.create({ rpcUrl: document.secretNetwork.httpUrl(environment) })
      }
      return document.secretNetworkClientStaging
    } else {
      if (!document.secretNetworkClientProduction) {
        document.secretNetworkClientProduction = await SecretNetworkClient.create({ rpcUrl: document.secretNetwork.httpUrl(environment) })
      }
      return document.secretNetworkClientProduction
    }
  },
  executeContract: async(params, gasLimit, environment = 'production', attempt = 1) => {
    let response;
    try {
      let client = await document.secretNetwork.signingClient(environment)
      response = await client.tx.compute.executeContract(params, { gasLimit })
    } catch(err) {
      if (err.message.includes('Bad status on response: 502') && attempt < 5) {
        return await document.secretNetwork.executeContract(params, gasLimit, environment, attempt + 1)
      } else {
        throw err
      }
    } finally {
      if (response) {
        if (response['code'] > 0) {
          if (response['jsonLog']['generic_err']) {
            throw response['jsonLog']['generic_err']
          } else if(response['jsonLog']['not_found']) {
            throw response['jsonLog']['not_found']['kind'] + ' ' + 'not found'
          } else {
            throw response['jsonLog']['rawLog']
          }
        } else {
          return response
        }
      }
    }
  },
  getAndSetUserVipLevel: async(address) => {
    let chainId = document.secretNetwork.chainId()
    document.secretNetwork.userVipLevel = 0
    // Set users vip level
    try {
      let query = {
        balance: {
          address: address,
          key: await window.keplr.getSecret20ViewingKey(chainId, document.secretNetwork.butt.address)
        }
      }
      let params = {
        address: document.secretNetwork.butt.address,
        codeHash: document.secretNetwork.butt.dataHash,
        query: query
      }
      let balance_response = await document.secretNetwork.queryContractSmart(params)
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
      $(document).trigger('vip_level_updated', {});
      return document.secretNetwork.userVipLevel
    }
  },
  getBlockHeight: async() => {
    if (document.secretNetwork.gettingBlockHeight) {
      while(document.secretNetwork.gettingBlockHeight) {
        await document.delay(1_000)
      }
      return document.secretNetwork.height
    }

    try {
      document.secretNetwork.gettingBlockHeight = true
      let client = await document.secretNetwork.client()
      let response = await client.query.tendermint.getLatestBlock()
      document.secretNetwork.height = Number(response['block']['header']['height'])
      return document.secretNetwork.height
    } catch (err) {
      document.showAlertDanger(err)
    } finally {
      document.secretNetwork.gettingBlockHeight = false
    }
  },
  httpUrl: function (environment) {
    let http_url = '/datahub_rpc';
    if (environment == 'staging') {
      http_url = http_url + '_staging'
    };
    return window.location.origin + http_url
  },
  queryContractSmart: async(params, environment = 'production', attempt = 1) => {
    try {
      let client = await document.secretNetwork.client(environment)
      return await client.query.compute.queryContract(params);
    } catch(err) {
      window.test = err
      console.log(err)
      if ((err.message.includes('Bad status on response: 502') || err.message.includes('Bad status on response: 520')) && attempt < 5) {
        return await document.secretNetwork.queryContractSmart(params, environment, attempt + 1)
      } else {
        throw err
      }
    }
  },
  signingClient: async(environment = 'production') => {
    const {
      SecretNetworkClient,
    } = require('secretjs');

    let chainId = document.secretNetwork.chainId(environment)
    let httpUrl = document.secretNetwork.httpUrl(environment)
    let keplrOfflineSigner = window.getOfflineSignerOnlyAmino(chainId);
    let [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();
    if (environment == 'staging') {
      if (!document.secretNetworkSigningClientStaging) {
        document.secretNetworkSigningClientStaging = await SecretNetworkClient.create(
          {
            rpcUrl: httpUrl,
            chainId: chainId,
            wallet: keplrOfflineSigner,
            walletAddress: myAddress,
            encryptionUtils: window.getEnigmaUtils(chainId),
          }
        );
      }
      return document.secretNetworkSigningClientStaging
    } else {
      if (!document.secretNetworkSigningClientProduction) {
        document.secretNetworkSigningClientProduction = await SecretNetworkClient.create(
          {
            rpcUrl: httpUrl,
            chainId: chainId,
            wallet: keplrOfflineSigner,
            walletAddress: myAddress,
            encryptionUtils: window.getEnigmaUtils(chainId),
          }
        );
      }
      return document.secretNetworkSigningClientProduction
    }
  }
}
