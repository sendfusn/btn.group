import BigNumber from "bignumber.js";

$(document).ready(function(){
  if($("#secret-network-dex-aggregator").length) {
    window.onload = async () => {
      this.address;
      this.cryptocurrencies = {}
      this.buttcoinContractAddress = "secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt";
      this.dexAggregatorSmartContractAddress ='secret14qvf0dltj7ugdtcuvpd20323k5h4wpd905ssud';
      this.tradePairs = {}
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.gasWrap = 40000;
      this.queryCount = 0;
      this.userVipLevel = 0;
      this.vipLevels = {
        0: {
          commission: 5,
          tradingFee: 0.1
        },
        1: {
          commission: 4,
          tradingFee: 0.08
        },
        2: {
          commission: 3,
          tradingFee: 0.06
        },
        3: {
          commission: 2,
          tradingFee: 0.04
        },
        4: {
          commission: 1,
          tradingFee: 0.2
        },
        5: {
          commission: 0,
          tradingFee: 0
        }
      }

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
        this.setUserVipLevel()
      })
      $('#flip-token').click(function(event){
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId =document.secretNetworkDexAggregatorForm.to.value
        document.secretNetworkDexAggregatorForm.from.value = toId
        document.secretNetworkDexAggregatorForm.fromAmount.value = ''
        document.secretNetworkDexAggregatorForm.to.value = fromId
        document.secretNetworkDexAggregatorForm.estimateAmount.value = ''
        document.secretNetworkDexAggregatorForm.minAmount.value = ''
        this.updateWalletBalance($('#from').val(), '.from')
        this.updateWalletBalance($('#to').val(), '.to')
        $('#from-usd-price').text('')
        $('#min-acceptable-amount-usd-price').text('')
        $('#to-usd-price').text('')
      }.bind(this))
      $("#from-amount-input").on("input", async(evt) => {
        await this.getEstimate()
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        $('#from-usd-price').text('~ $' + (this.cryptocurrencies[fromId]['price'] * fromAmount).toLocaleString(undefined, { maximumFractionDigits: 2 }))
      });
      $("#from").change(function(){
        this.toggleConfig()
        this.updateWalletBalance($('#from').val(), '.from')
        this.getEstimate()
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        $('#from-usd-price').text('~ $' + (this.cryptocurrencies[fromId]['price'] * fromAmount).toLocaleString(undefined, { maximumFractionDigits: 2 }))
      }.bind(this));
      $("#slippage-tolerance").change(function(){
        let estimateAmount = document.secretNetworkDexAggregatorForm.estimateAmount.value
        if (Number(estimateAmount) > 0) {
          let toId = document.secretNetworkDexAggregatorForm.to.value
          let toCryptocurrencyDecimals = this.cryptocurrencies[toId]['decimals']
          let slippage = Number(document.secretNetworkDexAggregatorForm.slippageTolerance.value) * new BigNumber(estimateAmount) / 100
          let minAmount = new BigNumber(estimateAmount - slippage).toFormat(toCryptocurrencyDecimals)
          document.secretNetworkDexAggregatorForm.minAmount.value = parseFloat(minAmount.replace(/,/g, ''))
          $('#min-acceptable-amount-usd-price').text('~ $' + (this.cryptocurrencies[toId]['price'] * document.secretNetworkDexAggregatorForm.minAmount.value).toLocaleString(undefined, { maximumFractionDigits: 2 }))
        }
      }.bind(this));
      $("#to").change(function(){
        this.toggleConfig()
        this.updateWalletBalance($('#to').val(), '.to')
        this.getEstimate()
      }.bind(this));

      // === Functions ===
      this.applyFee = () => {
        // If selectedSwapPath and there's no protocolId
        if (this.selectedSwapPath && !this.selectedSwapPath['protocol_id']) {
          this.setUserVipLevel()
          let fee;
          let otherProtocolsBestResultAmount;
          if(this.bestResultsPerProtocol[2]) {
            otherProtocolsBestResultAmount = this.bestResultsPerProtocol[2]['resultOfSwaps']
          }
          if(this.bestResultsPerProtocol[4]) {
            if(this.bestResultsPerProtocol[4]['resultOfSwaps'] > otherProtocolsBestResultAmount) {
              otherProtocolsBestResultAmount = this.bestResultsPerProtocol[4]['resultOfSwaps']
            }
          }
          if(otherProtocolsBestResultAmount) {
            fee = this.vipLevels[this.userVipLevel]['commission'] * (this.selectedSwapPath['resultOfSwaps'] - otherProtocolsBestResultAmount) / 100
          } else {
            fee = this.selectedSwapPath['resultOfSwaps'] * this.vipLevels[this.userVipLevel]['tradingFee'] / 100
          }
          this.selectedSwapPath['resultOfSwaps'] -= fee
          this.selectedSwapPath['netUsdResultOfSwaps'] = new BigNumber(this.selectedSwapPath['resultOfSwaps']).times(new BigNumber(this.cryptocurrencies[this.selectedSwapPath['to_id']]['price'])).dividedBy(new BigNumber("10").pow(this.cryptocurrencies[this.selectedSwapPath['to_id']]['decimals'])).minus(this.selectedSwapPath['gas_in_usd'])
        }
      }

      this.delay = async(ms) => {
        return new Promise(resolve => {
            setTimeout(() => { resolve('') }, ms);
        })
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

      this.fillForm = () => {
        let toId = this.selectedSwapPath['to_id']
        let toCryptocurrency = this.cryptocurrencies[toId]
        let fmt = {
          decimalSeparator: '.',
          groupSeparator: '',
          secondaryGroupSize: toCryptocurrency['decimals']
        }
        document.secretNetworkDexAggregatorForm.estimateAmount.value = document.humanizeStringNumberFromSmartContract(this.selectedSwapPath['resultOfSwaps'], toCryptocurrency['decimals'], fmt)
        $('#to-usd-price').text('~ $' + (toCryptocurrency['price'] * document.secretNetworkDexAggregatorForm.estimateAmount.value).toLocaleString(undefined, { maximumFractionDigits: 2 }))
        let slippage = Math.round(new BigNumber(document.secretNetworkDexAggregatorForm.slippageTolerance.value) * new BigNumber(this.selectedSwapPath['resultOfSwaps']) / 100)
        let minAmount = new BigNumber(this.selectedSwapPath['resultOfSwaps']) - slippage
        document.secretNetworkDexAggregatorForm.minAmount.value = document.humanizeStringNumberFromSmartContract(minAmount, toCryptocurrency['decimals'], fmt)
        $('#min-acceptable-amount-usd-price').text('~ $' + (toCryptocurrency['price'] * document.secretNetworkDexAggregatorForm.minAmount.value).toLocaleString(undefined, { maximumFractionDigits: 2 }))
      }

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
        this.updateWalletBalance($('#from').val(), '.from')
        this.updateWalletBalance($('#to').val(), '.to')
      }

      this.getEstimate = async() => {
        this.queryCount += 1;
        this.resetBeforeEstimate()
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId = document.secretNetworkDexAggregatorForm.to.value
        $("#swap-paths").html('')
        while (!this.wrapPaths) {
          await this.delay(500)
        }
        if (Number(fromAmount) > 0) {
          if(this.wrapPaths[fromId] == toId) {
            document.secretNetworkDexAggregatorForm.estimateAmount.value = fromAmount
          } else {
            setTimeout(function(){
              if (fromAmount == document.secretNetworkDexAggregatorForm.fromAmount.value && fromId == document.secretNetworkDexAggregatorForm.from.value && toId == document.secretNetworkDexAggregatorForm.to.value) {
                this.getSwapPaths(fromId, toId, fromAmount)
              }
            }.bind(this), 1500);
          }
        }
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

      this.getSwapPaths = async(from_id, to_id, fromAmount) => {
        let submitButtonSelector = '#submit-button'
        let $submitButton = $(submitButtonSelector)
        let currentQueryCount = this.queryCount;
        try {
          $submitButton.prop("disabled", true);
          $submitButton.find('.loading').removeClass('d-none')
          $submitButton.find('.ready').addClass('d-none')
          $submitButton.find('.loading #status').text('Getting swap paths')
          let tokenFromId = from_id;
          let tokenToId = to_id;
          if (this.wrapPaths[from_id] && this.cryptocurrencies[this.wrapPaths[from_id]]['smart_contract']) {
            tokenFromId = this.wrapPaths[from_id]
          }
          if (this.wrapPaths[to_id] && this.cryptocurrencies[this.wrapPaths[to_id]]['smart_contract']) {
            tokenToId = this.wrapPaths[to_id]
          }
          this.swapPaths[from_id] = {}
          let url = "/swap_paths?from_id=" + tokenFromId + "&to_id=" + tokenToId + "&from_amount=" + document.formatHumanizedNumberForSmartContract(fromAmount, this.cryptocurrencies[from_id]['decimals']);
          this.swapPaths[from_id][to_id] = await $.ajax({
            url: url,
            type: 'GET'
          })
          this.renderResults(from_id, to_id)
          for (const [index, swapPath] of this.swapPaths[from_id][to_id].entries()) {
            if(currentQueryCount == this.queryCount) {
              $submitButton.find('.loading #status').text('Checking swap path ' + (index + 1) + ' of ' + this.swapPaths[from_id][to_id].length)
              let resultOfSwaps = await this.getResultOfSwaps(swapPath, currentQueryCount)
              swapPath['resultOfSwaps'] = parseFloat(resultOfSwaps)
              swapPath['netUsdResultOfSwaps'] = new BigNumber(swapPath['resultOfSwaps']).times(new BigNumber(this.cryptocurrencies[swapPath['to_id']]['price'])).dividedBy(new BigNumber("10").pow(this.cryptocurrencies[swapPath['to_id']]['decimals'])).minus(swapPath['gas_in_usd'])
              if (swapPath['protocol_id'] == 2) {
                if (this.bestResultsPerProtocol[2]) {
                  if(swapPath['netUsdResultOfSwaps'] > this.bestResultsPerProtocol[2]['netUsdResultOfSwaps']) {
                    this.bestResultsPerProtocol[2] = swapPath
                  }
                } else {
                  this.bestResultsPerProtocol[2] = swapPath
                }
              } else if (swapPath['protocol_id'] == 4) {
                if (this.bestResultsPerProtocol[4]) {
                  if(swapPath['netUsdResultOfSwaps'] > this.bestResultsPerProtocol[4]['netUsdResultOfSwaps']) {
                    this.bestResultsPerProtocol[4] = swapPath
                  }
                } else {
                  this.bestResultsPerProtocol[4] = swapPath
                }
              } else {
                if (this.bestResultsPerProtocol[0]) {
                  if(swapPath['netUsdResultOfSwaps'] > this.bestResultsPerProtocol[0]['netUsdResultOfSwaps']) {
                    this.bestResultsPerProtocol[0] = swapPath
                  }
                } else {
                  this.bestResultsPerProtocol[0] = swapPath
                }
              }
              this.renderResults(from_id, to_id)
            }
          }
          if(currentQueryCount == this.queryCount) {
            this.applyFee()
            this.renderTable()
            this.fillForm()
            $('#results').removeClass('d-none')
          }
        } catch(error) {
          if(currentQueryCount == this.queryCount) {
            document.showAlertDanger(error)
          }
        } finally {
          if(currentQueryCount == this.queryCount) {
            $submitButton.prop("disabled", false);
            $submitButton.find('.loading').addClass('d-none')
            $submitButton.find('.ready').removeClass('d-none')
          }
        }
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

      this.renderResults = (from_id, to_id) => {
        $("#swap-paths").html('')
        this.swapPaths[from_id][to_id].sort((a, b) => b.netUsdResultOfSwaps - a.netUsdResultOfSwaps).forEach((swapPath, index) => {
          if (this.userVipLevel == 5) {
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
                $('#' + swapPath['id']).find('.result b').text(document.humanizeStringNumberFromSmartContract(swapPath['resultOfSwaps'], this.cryptocurrencies[to_id]['decimals']))
              }
            }
          }
          if(index == 0 && swapPath['resultOfSwaps']) {
            this.selectedSwapPath = swapPath
            $('#' + this.selectedSwapPath['id']).addClass('bg-success')
          }
        })
      }

      this.renderTable = () => {
        this.resetTable()
        if(this.bestResultsPerProtocol[0]) {
          let formattedAmount = document.humanizeStringNumberFromSmartContract(this.bestResultsPerProtocol[0]['resultOfSwaps'], this.cryptocurrencies[this.bestResultsPerProtocol[0]['to_id']]['decimals'])
          let gasInUsd = parseFloat(this.bestResultsPerProtocol[0]['gas_in_usd']).toFixed(2)
          let netUsdResult = parseFloat(this.bestResultsPerProtocol[0]['netUsdResultOfSwaps']).toFixed(2)
          $('#btn-best-result td:nth-child(2)').text(formattedAmount)
          $('#btn-best-result td:nth-child(3)').text(gasInUsd)
          $('#btn-best-result td:nth-child(4)').text(netUsdResult)
        }
        if(this.bestResultsPerProtocol[2]) {
          let formattedAmount = document.humanizeStringNumberFromSmartContract(this.bestResultsPerProtocol[2]['resultOfSwaps'], this.cryptocurrencies[this.bestResultsPerProtocol[2]['to_id']]['decimals'])
          let gasInUsd = parseFloat(this.bestResultsPerProtocol[2]['gas_in_usd']).toFixed(2)
          let netUsdResult = parseFloat(this.bestResultsPerProtocol[2]['netUsdResultOfSwaps']).toFixed(2)
          $('#secret-swap-best-result td:nth-child(2)').text(formattedAmount)
          $('#secret-swap-best-result td:nth-child(3)').text(gasInUsd)
          $('#secret-swap-best-result td:nth-child(4)').text(netUsdResult)
        }
        if(this.bestResultsPerProtocol[4]) {
          let formattedAmount = document.humanizeStringNumberFromSmartContract(this.bestResultsPerProtocol[4]['resultOfSwaps'], this.cryptocurrencies[this.bestResultsPerProtocol[4]['to_id']]['decimals'])
          let gasInUsd = parseFloat(this.bestResultsPerProtocol[4]['gas_in_usd']).toFixed(2)
          let netUsdResult = parseFloat(this.bestResultsPerProtocol[4]['netUsdResultOfSwaps']).toFixed(2)
          $('#sienna-best-result td:nth-child(2)').text(formattedAmount)
          $('#sienna-best-result td:nth-child(3)').text(gasInUsd)
          $('#sienna-best-result td:nth-child(4)').text(netUsdResult)
        }
      }

      this.resetAfterSwap = () => {
        document.secretNetworkDexAggregatorForm.fromAmount.value = ''
        document.secretNetworkDexAggregatorForm.estimateAmount.value = ''
        document.secretNetworkDexAggregatorForm.minAmount.value = ''
        $("#swap-paths").html('')
        $('#results').addClass('d-none')
        $('#results').find('.loading').removeClass('d-none')
        $('#from-usd-price').text('')
        $('#min-acceptable-amount-usd-price').text('')
        $('#to-usd-price').text('')
        this.updateWalletBalance($('#from').val(), '.from')
        this.updateWalletBalance($('#to').val(), '.to')
        this.setUserVipLevel()
      }

      this.resetBeforeEstimate = () => {
        $('#results').addClass('d-none')
        $('#results').find('.loading').removeClass('d-none')
        $('#min-acceptable-amount-usd-price').text('')
        $('#to-usd-price').text('')
        this.resetTable()
        this.bestResultsPerProtocol = {}
        this.selectedSwapPath = undefined;
        // This holds the results of swaps for a pool, for crypto id, for the amount offered
        this.simulationSwapResults = {}
        this.swapPaths = {};
        document.secretNetworkDexAggregatorForm.estimateAmount.value = ''
        document.secretNetworkDexAggregatorForm.minAmount.value = ''
      }

      this.resetTable = () => {
        $('#results tbody td:nth-child(2)').text('-')
        $('#results tbody td:nth-child(3)').text('-')
        $('#results tbody td:nth-child(4)').text('-')
      }

      this.setClient = (gas) => {
        let gasParams = {
            exec: {
              amount: [{ amount: gas, denom: 'uscrt' }],
              gas: gas,
            },
          }
        this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
      }

      this.setUserVipLevel = async() => {
        // Set users vip level
        try {
          let params = {
            balance: {
              address: this.address,
              key: await window.keplr.getSecret20ViewingKey(this.chainId, this.buttcoinContractAddress)
            }
          }
          let balance_response = await this.client.queryContractSmart(this.buttcoinContractAddress, params);
          let balance = balance_response["balance"]["amount"]
          balance = Number(balance)
          if (balance >= 100_000_000_000) {
            this.userVipLevel = 5
          } else if(balance >= 50_000_000_000) {
            this.userVipLevel = 4
          } else if(balance >= 25_000_000_000) {
            this.userVipLevel = 3
          } else if(balance >= 12_500_000_000) {
            this.userVipLevel = 2
          } else if(balance >= 6_250_000_000) {
            this.userVipLevel = 1
          } else {
            this.userVipLevel = 0
          }
        } catch(err) {
          this.userVipLevel = 0
          console.error(err)
        } finally {
          console.log(this.userVipLevel)
        }
      }

      this.toggleConfig = async() => {
        while (!this.wrapPaths) {
          await this.delay(500)
        }
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId = document.secretNetworkDexAggregatorForm.to.value
        if(this.wrapPaths[fromId] == toId) {
          $("#cog-container").addClass('d-none')
          $("#slippage-container").addClass('d-none')
        } else {
          $("#cog-container").removeClass('d-none')
          $("#slippage-container").removeClass('d-none')
        }
      }

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
            let balanceFormatted = document.humanizeStringNumberFromSmartContract(balance, cryptocurrency['decimals'])
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

      document.secretNetworkDexAggregatorForm.onsubmit = async (e) => {
        e.preventDefault()
        if (this.wrapPaths[fromId] != toId && !this.selectedSwapPath) {
          return
        }

        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let estimateAmount = document.secretNetworkDexAggregatorForm.estimateAmount.value
        let toId = document.secretNetworkDexAggregatorForm.to.value
        fromAmount = document.formatHumanizedNumberForSmartContract(fromAmount, this.cryptocurrencies[fromId]['decimals'])
        estimateAmount = document.formatHumanizedNumberForSmartContract(estimateAmount, this.cryptocurrencies[toId]['decimals'])
        let submitButtonSelector = '#submit-button'
        let $submitButton = $(submitButtonSelector)
        $submitButton.prop("disabled", true);
        $submitButton.find('.loading').removeClass('d-none')
        $submitButton.find('.ready').addClass('d-none')
        $submitButton.find('.loading #status').text('Loading...')
        let contract;
        let handleMsg;
        let sentFunds = []
        let successMessage;
        try {
          if (this.wrapPaths[fromId] == toId) {
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
            this.setClient(String(this.gasWrap));
            let response = await this.client.execute(contract, handleMsg, '', sentFunds)
          } else {
            let currentFromId = fromId
            let minAmount = document.secretNetworkDexAggregatorForm.minAmount.value
            minAmount = document.formatHumanizedNumberForSmartContract(minAmount, this.selectedSwapPath['to']['decimals'])
            let hops = []
            let gas = 0
            let initNativeFromToken;
            // when from token is native
            if(this.cryptocurrencies[fromId]['smart_contract'] == undefined) {
              let wrapToSmartContract = this.cryptocurrencies[this.wrapPaths[currentFromId]]['smart_contract']
              initNativeFromToken = {native: {address: wrapToSmartContract['address'], contract_hash: wrapToSmartContract['data_hash']}}
              gas += this.gasWrap
            }
            gas += this.selectedSwapPath['gas']
            this.selectedSwapPath['swap_path_as_array'].forEach((tradePairId) => {
              let tradePair = this.tradePairs[tradePairId]
              let fromToken;
              if(initNativeFromToken && hops.length == 0) {
                fromToken = initNativeFromToken
                currentFromId = this.wrapPaths[currentFromId]
              } else {
                fromToken = {snip20: {address: this.cryptocurrencies[currentFromId]['smart_contract']['address'], contract_hash: this.cryptocurrencies[currentFromId]['smart_contract']['data_hash']}}
              }
              let hop = {smart_contract: {address: tradePair['smart_contract']['address'], contract_hash: tradePair['smart_contract']['data_hash']}, from_token: fromToken}
              hops.push(hop)
              currentFromId = this.extractSwapToId(currentFromId, tradePairId)
            })
            let hop = {from_token: {snip20: {address: this.cryptocurrencies[currentFromId]['smart_contract']['address'], contract_hash: this.cryptocurrencies[currentFromId]['smart_contract']['data_hash']}}}
            // when to token is native
            if (this.wrapPaths[currentFromId] == toId) {
              let unwrapBySmartContract = this.cryptocurrencies[currentFromId]['smart_contract']
              hop['redeem_denom'] = this.cryptocurrencies[toId]['denom']
              hop['smart_contract'] = {address: unwrapBySmartContract['address'], contract_hash: unwrapBySmartContract['data_hash']}
              gas += this.gasWrap
            }
            hops.push(hop)
            let recipient;
            let routeMessage;
            if (hops.length == 1) {
              recipient = this.tradePairs[hops[0]]['smart_contract']['address']
              routeMessage = { swap: { expected_return: minAmount } }
            } else {
              recipient = this.dexAggregatorSmartContractAddress
              routeMessage = { hops: hops, estimated_amount: estimateAmount, minimum_acceptable_amount: minAmount, to: this.address }
            }
            let routeMsgEncoded = Buffer.from(JSON.stringify(routeMessage)).toString('base64')
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
            successMessage = "Amount received " + document.humanizeStringNumberFromSmartContract(returnAmount, this.cryptocurrencies[toId]['decimals'])
          }
          document.showAlertSuccess(successMessage);
          this.resetAfterSwap()
        } catch(error) {
          document.showAlertDanger(error)
        } finally {
          $submitButton.prop("disabled", false);
          $submitButton.find('.loading').addClass('d-none')
          $submitButton.find('.ready').removeClass('d-none')
        }
      };

      this.getAndSetCryptocurrenciesAndTradePairs()
    }
  }
})
