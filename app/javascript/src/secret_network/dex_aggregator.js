import BigNumber from "bignumber.js";

$(document).ready(function(){
  if($("#secret-network-dex-aggregator").length) {

    window.onload = async () => {
      this.cryptocurrencies = {}
      this.tradePairs = {}
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.height = undefined;
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.gasDeposit = '40000';
      this.gasRedeem = '40000';
      this.gasSiennaPerSwap = '100000';
      this.gasSecretSwapPerSwap = '135000';
      this.gasBase;
      this.simulateTrades;
      this.simulationCryptoMaxReturns = {};
      this.simulationSwapResults = {}
      this.swapPaths = {};
      this.swapPathsAsArray = [];

      // === LISTENERS ===
      $('#flip-token').click(function(event){
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId =document.secretNetworkDexAggregatorForm.to.value

        document.secretNetworkDexAggregatorForm.from.value = toId
        document.secretNetworkDexAggregatorForm.fromAmount.value = ''
        document.secretNetworkDexAggregatorForm.to.value = fromId
        document.secretNetworkDexAggregatorForm.toAmount.value = ''
      })
      $("#from-amount-input").on("input", function(){
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        // this.simulateTrades = false
        setTimeout(function(){
          // this.simulateTrades = true
          if (fromAmount == document.secretNetworkDexAggregatorForm.fromAmount.value) {
            this.getSwapPaths(document.secretNetworkDexAggregatorForm.from.value, document.secretNetworkDexAggregatorForm.to.value)
          }
        }.bind(this), 1500);
      }.bind(this));

      this.getAndSetCryptocurrenciesAndTradePairs = async() => {
        let result = await $.ajax({
          url: '/pools?enabled=true',
          type: 'GET'
        })
        result.forEach((tradePair) => {
          this.tradePairs[tradePair['id']] = tradePair
          tradePair['cryptocurrency_pools'].forEach((cryptocurrencyPool) => {
            if (cryptocurrencyPool['cryptocurrency_role'] == 'deposit') {
              let cryptocurrency = cryptocurrencyPool['cryptocurrency']
              this.cryptocurrencies[cryptocurrency['id']] = cryptocurrency
            }
          })
        })
        window.tradePairs = this.tradePairs;
        window.cryptocurrencies = this.cryptocurrencies;
      }

      this.getSwapPaths = async(from_id, to_id) => {
        if (this.swapPaths[from_id] == undefined) {
          this.swapPaths[from_id] = {}
          if (this.swapPaths[from_id][to_id] == undefined) {
            let url = "/swap_paths?from_id=" + from_id + "&to_id=" + to_id;
            this.swapPathsAsArray = await $.ajax({
              url: url,
              type: 'GET'
            })
            window.swapPathsAsArray = this.swapPathsAsArray
            this.swapPathsAsArray.forEach((swapPath) => {
              let currentCryptoId = swapPath['from_id']
              let currentCryptoSymbol = swapPath['from']['symbol']
              let x = '<div class="card mt-2" id="' + swapPath['id'] + '">' + '<div>id: ' + swapPath['id'] + '</div>' + '<div>Swap path pool ids: ' + swapPath['swap_path_as_string'] + '</div><div>Swap path:</div>'
              swapPath['swap_path_as_array'].forEach((tradePairId) => {
                let protocolName = this.tradePairs[tradePairId]['protocol']['name']
                let xId = currentCryptoId
                this.tradePairs[tradePairId]['cryptocurrency_pools'].forEach((cryptoPool) => {
                  if (cryptoPool['cryptocurrency_id'] != Number(xId) && cryptoPool['cryptocurrency_role'] == 'deposit') {
                    x = x + '<div>' + currentCryptoSymbol
                    currentCryptoSymbol = cryptoPool['cryptocurrency']['symbol']
                    currentCryptoId = cryptoPool['cryptocurrency_id']
                    x = x + ' == ' + protocolName + ' ==> ' + currentCryptoSymbol + '</div>'
                  }
                })
              })
              x = x
              $("#swap-paths").append(x)
              this.swapPaths[from_id][swapPath['id']] = swapPath
            })
          }
        }
        window.swapPaths = this.swapPaths
        this.simulationCryptoMaxReturns = {}
        for (const swapPath of this.swapPathsAsArray) {
          let resultOfSwaps = await this.getResultOfSwaps(swapPath)
        }
      }

      this.extractSwapToId = function(fromId, tradePairId) {
        let x;
        this.tradePairs[tradePairId]['cryptocurrency_pools'].forEach((cryptoPool) => {
          if (cryptoPool['cryptocurrency_id'] != Number(fromId) && cryptoPool['cryptocurrency_role'] == 'deposit') {
            x = cryptoPool['cryptocurrency_id']
          }
        })
        return x
      }

      this.getResultOfSwaps = async(swapPath) => {
        let fromId = swapPath['from_id']
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromCryptoDecimals = this.cryptocurrencies[fromId]['decimals']
        let fromAmountFormatted = new BigNumber(fromAmount.replace(/,/g, '')).times(new BigNumber("10").pow(fromCryptoDecimals)).toFixed()
        for (const poolId of swapPath['swap_path_as_array']) {
          fromAmountFormatted = await this.querySwapSimulation(fromAmountFormatted, fromId, poolId);
          fromId = this.extractSwapToId(fromId, poolId)
          if (this.simulationCryptoMaxReturns[fromId] == undefined) {
            this.simulationCryptoMaxReturns[fromId] = new BigNumber(fromAmountFormatted)
          } else if(this.simulationCryptoMaxReturns[fromId] > new BigNumber(fromAmountFormatted)) {
            console.log(swapPath)
            console.log(fromId)
            console.log(new BigNumber(fromAmountFormatted).toFixed())
            console.log(this.simulationCryptoMaxReturns[fromId].toFixed())
            return
          } else {
            this.simulationCryptoMaxReturns[fromId] = new BigNumber(fromAmountFormatted)
          }
        }
        if(swapPath['to_id'] == swapPath['from_id']) {
          if(Number(fromAmountFormatted) > new BigNumber(fromAmount.replace(/,/g, '')).times(new BigNumber("10").pow(fromCryptoDecimals)).toFixed()) {
            alert(swapPath['id'])
            alert(fromAmountFormatted)
          }
        }
        console.log(swapPath)
        console.log(fromAmountFormatted)
      }

      this.querySwapSimulation = async(fromAmountFormatted, fromId, poolId) => {
        this.simulationSwapResults = {}
        this.simulationSwapResults[poolId] = {}
        this.simulationSwapResults[poolId][fromId] = {}
        this.simulationSwapResults[poolId][fromId][fromAmountFormatted];
        if (this.simulationSwapResults[poolId][fromId][fromAmountFormatted]) {
          return this.simulationSwapResults[poolId][fromId][fromAmountFormatted]
        }
        let fromCryptoAddress = this.cryptocurrencies[fromId]['smart_contract']['address']
        let fromCryptoCodeHash = this.cryptocurrencies[fromId]['smart_contract']['data_hash']
        let pool = this.tradePairs[poolId]
        let protocolIdentifier = pool['protocol']['identifier']
        let swapMsg;
        console.log(pool)
        if (protocolIdentifier == 'secret_swap') {
          swapMsg = {simulation: {offer_asset: {info: {token: {contract_addr: fromCryptoAddress, token_code_hash: fromCryptoCodeHash, viewing_key: 'SecretSwap'}}, amount: fromAmountFormatted}}}
        } else {
          swapMsg = {swap_simulation: {offer: {token: {custom_token: {contract_addr: fromCryptoAddress, token_code_hash: fromCryptoCodeHash, viewing_key: ''}}, amount: fromAmountFormatted}}}
        }
        try {
          let result = await this.client.queryContractSmart(pool['smart_contract']['address'], swapMsg)
          this.simulationSwapResults[poolId][fromId][fromAmountFormatted] = result['return_amount']
          console.log(result)
          return result['return_amount']
        } catch(error) {
          swapMsg = {swap_simulation: {offer: {token: {custom_token: {contract_addr: fromCryptoAddress, token_code_hash: fromCryptoCodeHash.toLowerCase(), viewing_key: ''}}, amount: fromAmountFormatted}}}

          let result = await this.client.queryContractSmart(pool['smart_contract']['address'], swapMsg)
          console.log(result)
          this.simulationSwapResults[poolId][fromId][fromAmountFormatted] = result['return_amount']
          return result['return_amount']
        }
      }

      document.secretNetworkDexAggregatorForm.onsubmit = async (e) => {
        e.preventDefault()
        console.log(document.secretNetworkDexAggregatorForm.fromAmount.value)
        console.log(document.secretNetworkDexAggregatorForm.toAmount.value)
        console.log(this.cryptocurrencies)
        console.log(this.tradePairs)
      };

      this.getAndSetCryptocurrenciesAndTradePairs()
    }
  }
})
