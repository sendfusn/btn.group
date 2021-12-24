import BigNumber from "bignumber.js";

$(document).ready(function(){
  if($("#secret-network-dex-aggregator").length) {

    window.onload = async () => {
      this.address;
      this.cryptocurrencies = {}
      this.dexAggregatorSmartContractAddress ='secret14qvf0dltj7ugdtcuvpd20323k5h4wpd905ssud';
      this.tradePairs = {}
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.gasDeposit = 40000;
      this.gasRedeem = 40000;
      this.gasSiennaPerSwap = 100000;
      this.gasSecretSwapPerSwap = 135000;
      this.queryCount = 0;

      // === LISTENERS ===
      $.each(['.from-balance-view-button', '.to-balance-view-button'], function(index, value) {
        let $balanceViewButton = $(value)
        document.querySelectorAll(value).forEach(item => {
          item.addEventListener('click', async(evt) => {
            $balanceViewButton.prop("disabled", true);
            $balanceViewButton.find('.loading').removeClass('d-none')
            $balanceViewButton.find('.ready').addClass('d-none')
            let cryptoId;
            let selectorPrefix;
            if (value == '.from-balance-view-button') {
              cryptoId = $('#from').val()
              selectorPrefix = '.from'
            } else {
              cryptoId = $('#to').val()
              selectorPrefix = '.to'
            }
            try {
              await window.keplr.suggestToken(this.chainId, this.cryptocurrencies[cryptoId]['smart_contract']['address']);
              this.updateWalletBalance(cryptoId, selectorPrefix);
              $balanceViewButton.addClass('d-none')
            } catch(err) {
              document.showAlertDanger(err)
            } finally {
              // Show ready ui
              $balanceViewButton.prop("disabled", false);
              $balanceViewButton.find('.loading').addClass('d-none')
              $balanceViewButton.find('.ready').removeClass('d-none')
            }
          })
        })
      }.bind(this))
      $(document).on('keplr_connected', async(evt) => {
        let accounts = await window.keplrOfflineSigner.getAccounts()
        this.address = accounts[0].address;
      })
      $('#flip-token').click(function(event){
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId =document.secretNetworkDexAggregatorForm.to.value
        document.secretNetworkDexAggregatorForm.from.value = toId
        document.secretNetworkDexAggregatorForm.fromAmount.value = ''
        document.secretNetworkDexAggregatorForm.to.value = fromId
        document.secretNetworkDexAggregatorForm.estimateAmount.value = ''
        document.secretNetworkDexAggregatorForm.minAmount.value = ''
      })
      $("#from-amount-input").on("input", function(){
        this.getEstimate()
      }.bind(this));
      $("#from").change(function(){
        this.updateWalletBalance($('#from').val(), '.from')
        this.getEstimate()
      }.bind(this));
      $("#slippage-tolerance").change(function(){
        let estimateAmount = document.secretNetworkDexAggregatorForm.estimateAmount.value
        if (Number(estimateAmount) > 0) {
          let toId = document.secretNetworkDexAggregatorForm.to.value
          let toCryptocurrencyDecimals = this.cryptocurrencies[toId]['decimals']
          let slippage = Number(document.secretNetworkDexAggregatorForm.slippageTolerance.value) * new BigNumber(estimateAmount) / 100
          let minAmount = new BigNumber(estimateAmount - slippage).toFormat(toCryptocurrencyDecimals)
          document.secretNetworkDexAggregatorForm.minAmount.value = minAmount
        }
      }.bind(this));
      $("#to").change(function(){
        this.updateWalletBalance($('#to').val(), '.to')
        this.getEstimate()
      }.bind(this));

      this.updateWalletBalance = async(cryptocurrencyId, selectorPrefix) => {
        let $walletBalance = $(selectorPrefix + '-balance')
        let $walletBalanceLink = $(selectorPrefix + '-balance-link')
        let $walletBalanceLoading = $(selectorPrefix + '-balance-loading')
        let $walletBalanceViewButton = $(selectorPrefix + '-balance-view-button')
        let balance
        let cryptoAddress;
        let cryptocurrency = this.cryptocurrencies[cryptocurrencyId];
        let updateWalletBalanceStillValid = true
        $walletBalance.addClass('d-none')
        $walletBalanceLoading.removeClass('d-none')
        $walletBalanceViewButton.addClass('d-none')
        try {
          if (cryptocurrency['smart_contract']) {
            cryptoAddress = cryptocurrency['smart_contract']['address']
            let key = await window.keplr.getSecret20ViewingKey(this.chainId, cryptoAddress)
            // If they have the key, replace the button with the balance
            let balanceResponse = await this.client.queryContractSmart(cryptoAddress, { balance: { address: this.address, key: key } })
            balance = balanceResponse['balance']['amount']
          } else {
            let accountDetails = await this.client.getAccount(this.address)
            accountDetails['balance'].forEach(function(balanceDetails) {
              if (cryptocurrency['denom'] == balanceDetails['denom']) {
                balance = balanceDetails['amount']
              }
            })
            if (balance == undefined) {
              balance = '0'
            }
          }
          if (selectorPrefix == '.from') {
            if (cryptocurrencyId != $('#from').val()) {
              updateWalletBalanceStillValid = false
            }
          } else {
            if (cryptocurrencyId != $('#to').val()) {
              updateWalletBalanceStillValid = false
            }
          }
          if (updateWalletBalanceStillValid) {
            let balanceFormatted = this.humanizeStringNumberFromSmartContract(balance, cryptocurrency['decimals'])
            $walletBalance.text(balanceFormatted)
            $walletBalance.removeClass('d-none')
            $walletBalanceViewButton.addClass('d-none')
          }
        } catch(err) {
          if (updateWalletBalanceStillValid) {
            console.log(err)
            // If they don't have a viewing key, show the view balance button and hide the balance
            $walletBalance.addClass('d-none')
            $walletBalanceViewButton.removeClass('d-none')
          }
        } finally {
          if (updateWalletBalanceStillValid) {
            $walletBalanceLoading.addClass('d-none')
            $walletBalanceViewButton.find('.loading').addClass('d-none')
            $walletBalanceLink.removeClass('d-none')
          }
        }
      }

      this.getEstimate = () => {
        this.queryCount += 1;
        this.reset()
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId = document.secretNetworkDexAggregatorForm.to.value
        $("#swap-paths").html('')
        if (Number(fromAmount) > 0) {
          if(this.wrapPaths[fromId] == toId) {
            $("#slippage-container").addClass('d-none')
            $("#min-acceptable-amount-container").addClass('d-none')
            document.secretNetworkDexAggregatorForm.estimateAmount.value = fromAmount
          } else {
            $("#slippage-container").removeClass('d-none')
            $("#min-acceptable-amount-container").removeClass('d-none')
            setTimeout(function(){
              if (fromAmount == document.secretNetworkDexAggregatorForm.fromAmount.value && fromId == document.secretNetworkDexAggregatorForm.from.value && toId == document.secretNetworkDexAggregatorForm.to.value) {
                this.getSwapPaths(fromId, toId, fromAmount)
              }
            }.bind(this), 1500);
          }
        }
      }

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
        this.wrapPaths = {}
        Object.keys(this.tradePairs).forEach((k) => {
          let tradePair = this.tradePairs[k]
          if (tradePair['protocol'] == undefined) {
            let nativeId;
            let tokenId;
            tradePair['cryptocurrency_pools'].forEach((cp) => {
              if (cp['cryptocurrency_role'] == 'deposit') {
                if (cp['cryptocurrency']['smart_contract'] == undefined) {
                  nativeId = cp['cryptocurrency_id']
                } else {
                  tokenId = cp['cryptocurrency_id']
                }
              }
            })
            this.wrapPaths[nativeId] = tokenId
            this.wrapPaths[tokenId] = nativeId
          }
        })
        window.tradePairs = this.tradePairs;
        window.cryptocurrencies = this.cryptocurrencies;
        window.wrapPaths = this.wrapPaths;
        this.updateWalletBalance($('#from').val(), '.from')
        this.updateWalletBalance($('#to').val(), '.to')
        this.loadingCryptocurrenciesAndTradePairs = false;
      }

      this.delay = async(ms) => {
        return new Promise(resolve => {
            setTimeout(() => { resolve('') }, ms);
        })
      }

      this.getSwapPaths = async(from_id, to_id, fromAmount) => {
        this.gettingSwapPaths = true
        let tokenFromId = from_id;
        let tokenToId = to_id;
        if(this.loadingCryptocurrenciesAndTradePairs) {
          await this.delay(3000)
        }
        if (this.wrapPaths[from_id] && this.cryptocurrencies[this.wrapPaths[from_id]]['smart_contract']) {
          tokenFromId = this.wrapPaths[from_id]
        }
        if (this.wrapPaths[to_id] && this.cryptocurrencies[this.wrapPaths[to_id]]['smart_contract']) {
          tokenToId = this.wrapPaths[to_id]
        }
        let currentQueryCount = this.queryCount;
        this.swapPaths[from_id] = {}
        let url = "/swap_paths?from_id=" + tokenFromId + "&to_id=" + tokenToId + "&from_amount=" + this.formatStringNumberForSmartContract(fromAmount, this.cryptocurrencies[from_id]['decimals']);
        this.swapPaths[from_id][to_id] = await $.ajax({
          url: url,
          type: 'GET'
        })
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
          let x = '<div class="card mt-2" id="' + swapPath['id'] + '">' + '<div>Swap path:</div>'
          let currentCryptoId = swapPath['from_id']
          let currentCryptoSymbol = swapPath['from']['symbol']
          if(this.cryptocurrencies[from_id]['smart_contract'] == undefined) {
            x = x + '<div>' + this.cryptocurrencies[from_id]['symbol'] + ' == wrap ==> ' + this.cryptocurrencies[this.wrapPaths[from_id]]['symbol'] + '</div>'
            currentCryptoId = this.wrapPaths[from_id]
            currentCryptoSymbol = this.cryptocurrencies[this.wrapPaths[from_id]]['symbol']
          }
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
          if (currentCryptoId != to_id) {
            x = x + '<div>' + this.cryptocurrencies[currentCryptoId]['symbol'] + ' == unwrap ==> ' + this.cryptocurrencies[this.wrapPaths[currentCryptoId]]['symbol'] + '</div>'
          }
          x = x + '<div class="result">Result: <b>Loading...</b></div>'
          $("#swap-paths").append(x)
          if (swapPath['resultOfSwaps'] != undefined) {
            if (swapPath['resultOfSwaps'] == '0') {
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
            let slippage = Math.round(new BigNumber(document.secretNetworkDexAggregatorForm.slippageTolerance.value) * new BigNumber(swapPath['resultOfSwaps']) / 100)
            let minAmount = new BigNumber(swapPath['resultOfSwaps']) - slippage
            document.secretNetworkDexAggregatorForm.minAmount.value = this.humanizeStringNumberFromSmartContract(minAmount, this.cryptocurrencies[to_id]['decimals'], fmt)
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
        this.swapPaths = {};
        document.secretNetworkDexAggregatorForm.estimateAmount.value = ''
        document.secretNetworkDexAggregatorForm.minAmount.value = ''
      }

      document.secretNetworkDexAggregatorForm.onsubmit = async (e) => {
        e.preventDefault()
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let estimateAmount = document.secretNetworkDexAggregatorForm.estimateAmount.value
        let toId = document.secretNetworkDexAggregatorForm.to.value
        fromAmount = this.formatStringNumberForSmartContract(fromAmount, this.cryptocurrencies[fromId]['decimals'])
        estimateAmount = this.formatStringNumberForSmartContract(estimateAmount, this.cryptocurrencies[toId]['decimals'])
        if (this.wrapPaths[fromId] == toId) {
          this.queryCount += 1
          let submitButtonSelector = '#submit-button'
          let $submitButton = $(submitButtonSelector)
          $submitButton.prop("disabled", true);
          $submitButton.find('.loading').removeClass('d-none')
          $submitButton.find('.ready').addClass('d-none')
          let contract;
          let handleMsg;
          let sentFunds = []
          let successMessage;
          if(this.cryptocurrencies[fromId]['smart_contract']) {
            contract = this.cryptocurrencies[fromId]['smart_contract']['address']
            handleMsg = { redeem: { amount: fromAmount } };
            successMessage = 'Unwrapped'
          } else {
            contract = this.cryptocurrencies[toId]['smart_contract']['address']
            handleMsg = { deposit: {} };
            sentFunds = [{ "denom": this.cryptocurrencies[fromId]['denom'], "amount": fromAmount }]
            successMessage = 'Wrapped'
          }
          try {
            this.setClient(String(this.gasRedeem));
            let response = await this.client.execute(contract, handleMsg, '', sentFunds)
            document.secretNetworkDexAggregatorForm.fromAmount.value = ''
            document.secretNetworkDexAggregatorForm.estimateAmount.value = ''
            document.showAlertSuccess(successMessage);
          } catch(error) {
            document.showAlertDanger(error)
          } finally {
            // Show ready ui
            $submitButton.prop("disabled", false);
            $submitButton.find('.loading').addClass('d-none')
            $submitButton.find('.ready').removeClass('d-none')
          }
        } else if (this.selectedSwapPath) {
          this.queryCount += 1
          let submitButtonSelector = '#submit-button'
          let $submitButton = $(submitButtonSelector)
          $submitButton.prop("disabled", true);
          $submitButton.find('.loading').removeClass('d-none')
          $submitButton.find('.ready').addClass('d-none')
          let currentFromId = fromId
          let minAmount = document.secretNetworkDexAggregatorForm.minAmount.value
          minAmount = this.formatStringNumberForSmartContract(minAmount, this.selectedSwapPath['to']['decimals'])
          let hops = []
          let gas = 0
          let initNativeFromToken;
          if(this.cryptocurrencies[fromId]['smart_contract'] == undefined) {
            let wrapToSmartContract = this.cryptocurrencies[this.wrapPaths[currentFromId]]['smart_contract']
            initNativeFromToken = {native: {address: wrapToSmartContract['address'], contract_hash: wrapToSmartContract['data_hash']}}
            gas += this.gasRedeem
          }
          this.selectedSwapPath['swap_path_as_array'].forEach((tradePairId) => {
            let tradePair = this.tradePairs[tradePairId]
            if (tradePair['protocol']['identifier'] == 'sienna') {
              gas += this.gasSiennaPerSwap
            } else if (tradePair['protocol']['identifier'] == 'secret_swap') {
              gas += this.gasSecretSwapPerSwap
            }
            let fromToken;
            if(initNativeFromToken && hops.length == 0) {
              fromToken = initNativeFromToken
              currentFromId = this.wrapPaths[currentFromId]
            } else {
              fromToken = {snip20: {address: this.cryptocurrencies[currentFromId]['smart_contract']['address'], contract_hash: this.cryptocurrencies[currentFromId]['smart_contract']['data_hash']}}
            }
            let hop = {smart_contract: {address: tradePair['smart_contract']['address'], contract_hash: tradePair['smart_contract']['data_hash']}, from_token: fromToken}
            hops.push(hop)
            let changed = false
            tradePair['cryptocurrency_pools'].forEach(function(cp) {
              if(cp['cryptocurrency_role'] == 'deposit' && cp['cryptocurrency_id'] != currentFromId && !changed) {
                currentFromId = cp['cryptocurrency_id']
                changed = true
              }
            })
          })
          let hop = {from_token: {snip20: {address: this.cryptocurrencies[currentFromId]['smart_contract']['address'], contract_hash: this.cryptocurrencies[currentFromId]['smart_contract']['data_hash']}}}
          if (currentFromId != toId) {
            let unwrapBySmartContract = this.cryptocurrencies[currentFromId]['smart_contract']
            hop['redeem_denom'] = this.cryptocurrencies[toId]['denom']
            hop['smart_contract'] = {address: unwrapBySmartContract['address'], contract_hash: unwrapBySmartContract['data_hash']}
            gas += this.gasRedeem
          }
          hops.push(hop)
          // when single hop
          // when from token is native
          // when to token is native
          // when multi hop and from and to tokens are smart contract tokens
          // build the message
          try {
            let contract;
            let recipient;
            let routeMessage;
            if (hops.length == 1) {
              recipient = this.tradePairs[hops[0]]['smart_contract']['address']
              routeMessage = { swap: { expected_return: minAmount } }
            } else {
              gas += 100000
              recipient = this.dexAggregatorSmartContractAddress
              routeMessage = { hops: hops, estimated_amount: estimateAmount, minimum_acceptable_amount: minAmount, to: this.address }
            }
            let routeMsgEncoded = Buffer.from(JSON.stringify(routeMessage)).toString('base64')
            let handleMsg;
            let sentFunds = []
            if (this.cryptocurrencies[fromId]['smart_contract']) {
              contract = this.cryptocurrencies[fromId]['smart_contract']['address']
              handleMsg = { send: { amount: fromAmount, recipient: recipient, msg: routeMsgEncoded } }
            } else {
              contract = this.dexAggregatorSmartContractAddress
              handleMsg = { receive: { amount: fromAmount, from: this.address, msg: routeMsgEncoded } }
              sentFunds = [{ "denom": this.cryptocurrencies[fromId]['denom'], "amount": fromAmount }]
            }
            this.setClient(String(gas));
            let response = await this.client.execute(contract, handleMsg, '', sentFunds)
            let returnAmount;
            response['logs'][0]['events'][response['logs'][0]['events'].length - 1]['attributes'].forEach(function(attribute){
              if(attribute['key'] == 'return_amount') {
                returnAmount = attribute['value']
              }
            })
            if(new BigNumber(estimateAmount) < new BigNumber(returnAmount)) {
              returnAmount = estimateAmount
            }
            returnAmount = this.humanizeStringNumberFromSmartContract(returnAmount, this.cryptocurrencies[toId]['decimals'])
            window.test = response
            document.showAlertSuccess("Amount received " + returnAmount);
            document.secretNetworkDexAggregatorForm.fromAmount.value = ''
            document.secretNetworkDexAggregatorForm.estimateAmount.value = ''
            document.secretNetworkDexAggregatorForm.minAmount.value = ''
            $("#swap-paths").html('')
          } catch(error) {
            document.showAlertDanger(error)
          } finally {
            // Show ready ui
            $submitButton.prop("disabled", false);
            $submitButton.find('.loading').addClass('d-none')
            $submitButton.find('.ready').removeClass('d-none')
          }
        }
      };

      this.setClient = (gas) => {
        let gasParams = {
            exec: {
              amount: [{ amount: gas, denom: 'uscrt' }],
              gas: gas,
            },
          }
        this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
      }

      this.getAndSetCryptocurrenciesAndTradePairs()
    }
  }
})
