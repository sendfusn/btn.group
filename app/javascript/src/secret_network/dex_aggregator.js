import BigNumber from "bignumber.js";

$(document).ready(function(){
  if($("#secret-network-dex-aggregator").length) {

    window.onload = async () => {
      this.cryptocurrencies = {}
      this.dexAggregatorSmartContractAddress ='secret14qvf0dltj7ugdtcuvpd20323k5h4wpd905ssud';
      this.tradePairs = {}
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.gasDeposit = '40000';
      this.gasRedeem = '40000';
      this.gasSiennaPerSwap = '100000';
      this.gasSecretSwapPerSwap = '135000';
      this.queryCount = 0;
      this.swapPaths = {};

      // === LISTENERS ===
      $('#flip-token').click(function(event){
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId =document.secretNetworkDexAggregatorForm.to.value
        document.secretNetworkDexAggregatorForm.from.value = toId
        document.secretNetworkDexAggregatorForm.fromAmount.value = ''
        document.secretNetworkDexAggregatorForm.to.value = fromId
        document.secretNetworkDexAggregatorForm.estimateAmount.value = ''
      })
      $("#from-amount-input").on("input", function(){
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId = document.secretNetworkDexAggregatorForm.to.value
        $("#swap-paths").html('')
        setTimeout(function(){
          if (fromAmount == document.secretNetworkDexAggregatorForm.fromAmount.value && fromId == document.secretNetworkDexAggregatorForm.from.value && toId == document.secretNetworkDexAggregatorForm.to.value) {
            this.getSwapPaths(fromId, toId, fromAmount)
          }
        }.bind(this), 1500);
      }.bind(this));
      $("#from").change(function(){
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId = document.secretNetworkDexAggregatorForm.to.value
        $("#swap-paths").html('')
        if (Number(fromAmount) > 0) {
          setTimeout(function(){
            if (fromAmount == document.secretNetworkDexAggregatorForm.fromAmount.value && fromId == document.secretNetworkDexAggregatorForm.from.value && toId == document.secretNetworkDexAggregatorForm.to.value) {
              this.getSwapPaths(fromId, toId, fromAmount)
            }
          }.bind(this), 1500);
        }
      }.bind(this));
      $("#to").change(function(){
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId = document.secretNetworkDexAggregatorForm.to.value
        $("#swap-paths").html('')
        if (Number(fromAmount) > 0) {
          setTimeout(function(){
            if (fromAmount == document.secretNetworkDexAggregatorForm.fromAmount.value && fromId == document.secretNetworkDexAggregatorForm.from.value && toId == document.secretNetworkDexAggregatorForm.to.value) {
              this.getSwapPaths(fromId, toId, fromAmount)
            }
          }.bind(this), 1500);
        }
      }.bind(this));

      this.getAndSetCryptocurrenciesAndTradePairs = async() => {
        this.loadingCryptocurrenciesAndTradePairs = true;
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
        this.loadingCryptocurrenciesAndTradePairs = false;
      }

      this.delay = async(ms) => {
        return new Promise(resolve => {
            setTimeout(() => { resolve('') }, ms);
        })
      }

      this.getSwapPaths = async(from_id, to_id, fromAmount) => {
        this.gettingSwapPaths = true
        if(this.loadingCryptocurrenciesAndTradePairs) {
          await this.delay(3000)
        }

        this.queryCount += 1;
        this.reset()
        let currentQueryCount = this.queryCount;
        if (this.swapPaths[from_id] == undefined) {
          this.swapPaths[from_id] = {}
        }
        if (this.swapPaths[from_id][to_id] == undefined) {
          let url = "/swap_paths?from_id=" + from_id + "&to_id=" + to_id + "&from_amount=" + this.formatStringNumberForSmartContract(fromAmount, this.cryptocurrencies[from_id]['decimals']);
          this.swapPaths[from_id][to_id] = await $.ajax({
            url: url,
            type: 'GET'
          })
        }
        this.renderResults(from_id, to_id)
        for (const swapPath of this.swapPaths[from_id][to_id]) {
          if(currentQueryCount == this.queryCount) {
            let resultOfSwaps = await this.getResultOfSwaps(swapPath, currentQueryCount)
            swapPath['resultOfSwaps'] = parseFloat(resultOfSwaps)
            this.renderResults(from_id, to_id)
          }
        }
        this.gettingSwapPaths = false
      }

      this.renderResults = (from_id, to_id) => {
        $("#swap-paths").html('')
        this.swapPaths[from_id][to_id].sort((a, b) => b.resultOfSwaps - a.resultOfSwaps).forEach((swapPath, index) => {
          let currentCryptoId = swapPath['from_id']
          let currentCryptoSymbol = swapPath['from']['symbol']
          let x = '<div class="card mt-2" id="' + swapPath['id'] + '">' + '<div>Swap path:</div>'
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
          x = x + '<div class="result">Result: <b>Loading...</b></div>'
          $("#swap-paths").append(x)
          if (swapPath['resultOfSwaps']) {
            if (swapPath['resultOfSwaps'] == 0) {
              $('#' + swapPath['id']).remove()
            } else {
              $('#' + swapPath['id']).find('.result b').text(this.humanizeStringNumberFromSmartContract(swapPath['resultOfSwaps'], this.cryptocurrencies[to_id]['decimals']))
            }
          }
          if(index == 0 && swapPath['resultOfSwaps']) {
            this.selectedSwapPath = swapPath
            $('#' + swapPath['id']).addClass('bg-success')
            let fmt = {
              decimalSeparator: '.',
              groupSeparator: '',
              secondaryGroupSize: this.cryptocurrencies[to_id]['decimals']
            }
            document.secretNetworkDexAggregatorForm.estimateAmount.value = this.humanizeStringNumberFromSmartContract(swapPath['resultOfSwaps'], this.cryptocurrencies[to_id]['decimals'], fmt)
            document.secretNetworkDexAggregatorForm.minAmount.value = this.humanizeStringNumberFromSmartContract(swapPath['resultOfSwaps'], this.cryptocurrencies[to_id]['decimals'], fmt)
          }
        })
      }

      this.formatStringNumberForSmartContract = (stringNumber, decimals) => {
        if (stringNumber == '') {
          stringNumber = '0'
        }

        return new BigNumber(stringNumber.replace(/,/g, '')).times(new BigNumber("10").pow(decimals)).toFixed();
      }

      this.humanizeStringNumberFromSmartContract = (stringNumber, decimals, toFormatDecimals = undefined) => {
        return new BigNumber(stringNumber).dividedBy(new BigNumber("10").pow(decimals)).toFormat(toFormatDecimals)
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

      this.getResultOfSwaps = async(swapPath, currentQueryCount) => {
        let fromId = swapPath['from_id']
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromCryptoDecimals = this.cryptocurrencies[fromId]['decimals']
        let fromAmountFormatted = new BigNumber(fromAmount.replace(/,/g, '')).times(new BigNumber("10").pow(fromCryptoDecimals)).toFixed()
        for (const poolId of swapPath['swap_path_as_array']) {
          if(currentQueryCount == this.queryCount) {
            fromAmountFormatted = await this.querySwapSimulation(fromAmountFormatted, fromId, poolId);
            fromId = this.extractSwapToId(fromId, poolId)
            if (this.simulationCryptoMaxReturns[swapPath['swap_count']][fromId] == undefined) {
              this.simulationCryptoMaxReturns[swapPath['swap_count']][fromId] = new BigNumber(fromAmountFormatted)
            } else if(this.simulationCryptoMaxReturns[swapPath['swap_count']][fromId] > new BigNumber(fromAmountFormatted)) {
              // For arbitrage just keep going because I want to see the results
              if(swapPath['from_id'] != swapPath['to_id']) {
                return '0'
              }
            } else {
              this.simulationCryptoMaxReturns[swapPath['swap_count']][fromId] = new BigNumber(fromAmountFormatted)
            }
          }
        }
        if(currentQueryCount == this.queryCount) {
          return fromAmountFormatted
        }
        return '0'
      }

      this.querySwapSimulation = async(fromAmountFormatted, fromId, poolId) => {
        if (this.simulationSwapResults[poolId] == undefined) {
          this.simulationSwapResults[poolId] = {}
        }
        if (this.simulationSwapResults[poolId][fromId] == undefined) {
          this.simulationSwapResults[poolId][fromId] = {}
        }
        // If this exact trade has been done before, return the result
        if (this.simulationSwapResults[poolId][fromId][fromAmountFormatted]) {
          return this.simulationSwapResults[poolId][fromId][fromAmountFormatted]
        }
        let fromCryptoAddress = this.cryptocurrencies[fromId]['smart_contract']['address']
        let fromCryptoCodeHash = this.cryptocurrencies[fromId]['smart_contract']['data_hash']
        let pool = this.tradePairs[poolId]
        let protocolIdentifier = pool['protocol']['identifier']
        let swapMsg;
        if (protocolIdentifier == 'secret_swap') {
          swapMsg = {simulation: {offer_asset: {info: {token: {contract_addr: fromCryptoAddress, token_code_hash: fromCryptoCodeHash, viewing_key: 'SecretSwap'}}, amount: fromAmountFormatted}}}
        } else if (protocolIdentifier == 'sienna') {
          swapMsg = {swap_simulation: {offer: {token: {custom_token: {contract_addr: fromCryptoAddress, token_code_hash: fromCryptoCodeHash, viewing_key: ''}}, amount: fromAmountFormatted}}}
        } else {
          return fromAmountFormatted
        }
        try {
          let result = await this.client.queryContractSmart(pool['smart_contract']['address'], swapMsg)
          this.simulationSwapResults[poolId][fromId][fromAmountFormatted] = result['return_amount']
          return result['return_amount']
        } catch(error) {
          swapMsg = {swap_simulation: {offer: {token: {custom_token: {contract_addr: fromCryptoAddress, token_code_hash: fromCryptoCodeHash.toLowerCase(), viewing_key: ''}}, amount: fromAmountFormatted}}}

          let result = await this.client.queryContractSmart(pool['smart_contract']['address'], swapMsg)
          this.simulationSwapResults[poolId][fromId][fromAmountFormatted] = result['return_amount']
          return result['return_amount']
        }
      }

      this.reset = () => {
        this.bestResultsPerSwapCount = {}
        this.selectedSwapPath = undefined;
        // This holds the results of swaps for a pool, for crypto id, for the amount offered
        this.simulationSwapResults = {}
        // This holds the best result of swap to per swap_count e.g. cryptoId => swapCount => 555_555
        // The concept is that if the new amount is lower than the stored amount, there would be a better path out there 
        this.simulationCryptoMaxReturns = {
          1: {},
          2: {},
          3: {},
          4: {},
          5: {},
          6: {},
          7: {},
          8: {},
          9: {},
          10: {},
        }
      }

      document.secretNetworkDexAggregatorForm.onsubmit = async (e) => {
        e.preventDefault()
        if (this.selectedSwapPath) {
          let fromId = document.secretNetworkDexAggregatorForm.from.value
          let currentFromId = fromId
          let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
          fromAamount = this.formatStringNumberForSmartContract(fromAamount, this.selectedSwapPath['from']['decimals'])
          let estimateAmount = document.secretNetworkDexAggregatorForm.estimateAmount.value
          estimateAmount = this.formatStringNumberForSmartContract(estimateAmount, this.selectedSwapPath['to']['decimals'])
          let minAmount = document.secretNetworkDexAggregatorForm.minAmount.value
          minAmount = this.formatStringNumberForSmartContract(minAmount, this.selectedSwapPath['to']['decimals'])
          let hops = []
          this.selectedSwapPath['swap_path_as_array'].forEach((tradePairId) => {
            let tradePair = this.tradePairs[tradePairId]
            let hop = {smart_contract: {address: tradePair['smart_contract']['address'], contract_hash: tradePair['smart_contract']['data_hash']}, from_token: {snip20: {address: this.cryptocurrencies[currentFromId]['smart_contract']['address'], contract_hash: this.cryptocurrencies[currentFromId]['smart_contract']['data_hash']}}}
            hops.push(hop)
            currentFromId = tradePair['to_id']
          })

          // when single hop
          // when from token is native
          // when to token is native
          // when multi hop and from and to tokens are smart contract tokens
          // build the message
          try {
            let routeMsg = Buffer.from(JSON.stringify({ hops: hops, estimated_amount: estimateAmount, minimum_acceptable_amount: minAmount }).toString('base64'))
            console.log(routeMsg)
            let handleMsg = { send: { amount: fromAmount, recipient: this.dexAggregatorSmartContractAddress, msg: routeMsg } }
            console.log(handleMsg)
            let response = await this.client.execute(this.cryptocurrencies[fromId]['smart_contract']['address'], handleMsg)
          } catch(error) {
            console.log(error)
          }
        }
      };

      this.getAndSetCryptocurrenciesAndTradePairs()
    }
  }
})
