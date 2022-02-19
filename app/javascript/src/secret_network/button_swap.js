import BigNumber from "bignumber.js";

$(document).ready(function(){
  if($("#secret-network-button-swap").length) {
    $('header').addClass('h-100')

    window.onload = async () => {
      this.cryptocurrencies = {}
      this.dexAggregatorSmartContractAddress ='secret14qvf0dltj7ugdtcuvpd20323k5h4wpd905ssud';
      this.dexAggregatorDataHash = '4B2AE0ECBEF722BCC85AAEBB501F2814BF4FC4C94A8E62574BFAB009CEBF719C'
      this.fromAmountInputSelector = '#from-amount-input'
      this.fromId = 515;
      this.toId = 351;
      this.tradePairs = {}
      this.client = document.secretNetwork.client();
      this.gasWrap = 60_000;
      this.queryCount = 0;
      this.tokenModalFor;
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

      // === LIST ===
      var options = {
        valueNames: [ 'address', 'symbol' ]
      };
      this.tokenList = new List('hacker-list', options);

      // === LISTENERS ===
      if ($('#arbitrage-container').length) {
        $('#arbitrage-enabled').change(function() {
          if($('#arbitrage-enabled').is(":checked")) {
            let arbitrageSeconds = $("#arbitrage-seconds").val()
            this.arbitrageInterval = setInterval(function() { $('#from-amount-input').trigger("input") }, arbitrageSeconds * 1_000);
          } else {
            clearInterval(this.arbitrageInterval);
          }
        }.bind(this));
      }

      $.each(['.from-balance-view-button', '.to-balance-view-button'], function(index, value) {
        let $balanceViewButton = $(value)
        document.querySelectorAll(value).forEach(item => {
          item.addEventListener('click', async(evt) => {
            $balanceViewButton.prop("disabled", true);
            $balanceViewButton.find('.loading').removeClass('d-none')
            $balanceViewButton.find('.ready').addClass('d-none')
            let cryptoId;
            let inputToClickFillTo;
            let selectorPrefix;
            if (value == '.from-balance-view-button') {
              cryptoId = this.fromId
              selectorPrefix = '.from'
              inputToClickFillTo = this.fromAmountInputSelector
            } else {
              cryptoId = this.toId
              selectorPrefix = '.to'
            }
            try {
              await document.connectKeplrWallet(false)
              if (document.secretNetwork.walletAddress) {
                if (this.cryptocurrencies[cryptoId]['smart_contract']) {
                  await window.keplr.suggestToken(document.secretNetwork.chainId(), this.cryptocurrencies[cryptoId]['smart_contract']['address']);
                }
                this.updateWalletBalance(cryptoId, selectorPrefix, inputToClickFillTo);
                $balanceViewButton.addClass('d-none')
              }
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
        $('.balance-container').removeClass('d-none')
        this.updateWalletBalance(this.fromId, '.from', this.fromAmountInputSelector)
        this.updateWalletBalance(this.toId, '.to')
      })
      $('#flip-token').click(function(event){
        event.preventDefault()
        let fromId = this.fromId
        let toId = this.toId
        this.fromId = toId
        document.secretNetworkDexAggregatorForm.fromAmount.value = ''
        this.toId = fromId
        document.secretNetworkDexAggregatorForm.estimateAmount.value = ''
        document.secretNetworkDexAggregatorForm.minAmount.value = ''
        this.updateWalletBalance(this.fromId, '.from', this.fromAmountInputSelector)
        this.updateWalletBalance(this.toId, '.to')
        $('#from-usd-price').text('')
        $('#min-acceptable-amount-usd-price').text('')
        $('#to-usd-price').text('')
        $('#from-token-button .symbol').text(this.cryptocurrencies[this.fromId]['symbol'])
        $('#from-token-button .logo-avatar').attr('src', 'https://res.cloudinary.com/hv5cxagki/image/upload/v1/' + this.cryptocurrencies[this.fromId]['attachments'][0]['cloudinary_public_id'])
        $('#to-token-button .symbol').text(this.cryptocurrencies[this.toId]['symbol'])
        $('#to-token-button .logo-avatar').attr('src', 'https://res.cloudinary.com/hv5cxagki/image/upload/v1/' + this.cryptocurrencies[this.toId]['attachments'][0]['cloudinary_public_id'])
      }.bind(this))
      $(this.fromAmountInputSelector).on("input", async(evt) => {
        await this.getEstimate()
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromId = this.fromId
        $('#from-usd-price').text('$' + (this.cryptocurrencies[fromId]['price'] * fromAmount).toLocaleString(undefined, { maximumFractionDigits: 2 }))
      });
      $("#from-token-button").click(function(){
        this.tokenModalFor = 'from';
      }.bind(this));
      $("#to-token-button").click(function(){
        this.tokenModalFor = 'to';
      }.bind(this));
      $("#slippage-tolerance").change(function(){
        let estimateAmount = document.secretNetworkDexAggregatorForm.estimateAmount.value
        if (Number(estimateAmount) > 0) {
          let toId = this.toId
          let toCryptocurrencyDecimals = this.cryptocurrencies[toId]['decimals']
          let slippage = Number(document.secretNetworkDexAggregatorForm.slippageTolerance.value) * new BigNumber(estimateAmount) / 100
          let minAmount = new BigNumber(estimateAmount - slippage).toFormat(toCryptocurrencyDecimals)
          document.secretNetworkDexAggregatorForm.minAmount.value = parseFloat(minAmount.replace(/,/g, ''))
          $('#min-acceptable-amount-usd-price').text('$' + (this.cryptocurrencies[toId]['price'] * document.secretNetworkDexAggregatorForm.minAmount.value).toLocaleString(undefined, { maximumFractionDigits: 2 }))
        }
      }.bind(this));
      $('li.bg-white').click(function(e){
        e.preventDefault()
        this.updateAfterTokenSelect(e)
      }.bind(this))

      // === Functions ===
      this.updateAfterTokenSelect = async(event) => {
        $('.modal').modal('hide');
        $('#input-text-2').val('');
        this.tokenList.search()
        if(this.tokenModalFor == 'from') {
          this.fromId = event['currentTarget']['dataset']['cryptocurrencyId']
          this.updateWalletBalance(this.fromId, '.from', this.fromAmountInputSelector)
          document.secretNetworkDexAggregatorForm.fromAmount.value = ''
          let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
          $('#from-usd-price').text('')
          $('#from-token-button .symbol').text(this.cryptocurrencies[this.fromId]['symbol'])
          $('#from-token-button .logo-avatar').attr('src', 'https://res.cloudinary.com/hv5cxagki/image/upload/v1/' + this.cryptocurrencies[this.fromId]['attachments'][0]['cloudinary_public_id'])
        } else {
          this.toId = event['currentTarget']['dataset']['cryptocurrencyId']
          this.updateWalletBalance(this.toId, '.to')
          $('#to-token-button .symbol').text(this.cryptocurrencies[this.toId]['symbol'])
          $('#to-token-button .logo-avatar').attr('src', 'https://res.cloudinary.com/hv5cxagki/image/upload/v1/' + this.cryptocurrencies[this.toId]['attachments'][0]['cloudinary_public_id'])
        }
        this.toggleConfig()
        this.getEstimate()
      }

      this.applyFee = () => {
        // If selectedSwapPath and there's no protocolId
        if (this.selectedSwapPath && !this.selectedSwapPath['protocol_id']) {
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
            fee = this.vipLevels[document.secretNetwork.userVipLevel]['commission'] * (this.selectedSwapPath['resultOfSwaps'] - otherProtocolsBestResultAmount) / 100
          } else {
            fee = this.selectedSwapPath['resultOfSwaps'] * this.vipLevels[document.secretNetwork.userVipLevel]['tradingFee'] / 100
          }
          this.selectedSwapPath['resultOfSwaps'] = Math.round(this.selectedSwapPath['resultOfSwaps'] - fee)
          this.setNetUsdResultOfSwaps(this.selectedSwapPath)
        }
      }

      this.setNetUsdResultOfSwaps = (swapPath) => {
        let toCryptocurrency = this.cryptocurrencies[swapPath['to_id']]
        swapPath['netUsdResultOfSwaps'] = new BigNumber(swapPath['resultOfSwaps']).times(new BigNumber(toCryptocurrency['price'])).dividedBy(new BigNumber("10").pow(toCryptocurrency['decimals'])).minus(swapPath['gas_in_usd'])
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
        $('#to-usd-price').text('$' + (toCryptocurrency['price'] * document.secretNetworkDexAggregatorForm.estimateAmount.value).toLocaleString(undefined, { maximumFractionDigits: 2 }))
        let slippage = Math.round(new BigNumber(document.secretNetworkDexAggregatorForm.slippageTolerance.value) * new BigNumber(this.selectedSwapPath['resultOfSwaps']) / 100)
        let minAmount = new BigNumber(this.selectedSwapPath['resultOfSwaps']) - slippage
        document.secretNetworkDexAggregatorForm.minAmount.value = document.humanizeStringNumberFromSmartContract(minAmount, toCryptocurrency['decimals'], fmt)
        $('#min-acceptable-amount-usd-price').text('$' + (toCryptocurrency['price'] * document.secretNetworkDexAggregatorForm.minAmount.value).toLocaleString(undefined, { maximumFractionDigits: 2 }))
      }

      this.getAndSetCryptocurrenciesAndTradePairs = async() => {
        let result = await $.ajax({
          url: '/pools?enabled=true&categories=trade_pair',
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
        $('#loading-container').addClass('d-none')
        $('form[name=secretNetworkDexAggregatorForm]').removeClass('d-none')
        this.updateWalletBalance(this.fromId, '.from', this.fromAmountInputSelector)
        this.updateWalletBalance(this.toId, '.to')
      }

      this.getEstimate = async() => {
        this.queryCount += 1;
        this.resetBeforeEstimate()
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromId = this.fromId
        let toId = this.toId
        $("#swap-paths").html('')
        if(this.wrapPaths[fromId] == toId) {
          document.secretNetworkDexAggregatorForm.estimateAmount.value = fromAmount
        } else {
          setTimeout(function(){
            if (fromAmount == document.secretNetworkDexAggregatorForm.fromAmount.value && fromId == this.fromId && toId == this.toId) {
              this.getSwapPaths(fromId, toId, fromAmount)
            }
          }.bind(this), 1500);
        }
      }

      this.getResultOfSwaps = async(swapPath, currentQueryCount) => {
        let fromId = swapPath['from_id']
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let fromCryptoDecimals = this.cryptocurrencies[fromId]['decimals']
        let fromAmountFormatted = document.formatHumanizedNumberForSmartContract(fromAmount, fromCryptoDecimals)
        swapPath['simulationResults'] = []
        for (const poolId of swapPath['swap_path_as_array']) {
          if(currentQueryCount == this.queryCount) {
            fromAmountFormatted = await this.querySwapSimulation(fromAmountFormatted, fromId, poolId);
            swapPath['simulationResults'].push(fromAmountFormatted)
            fromId = this.extractSwapToId(fromId, poolId)
          }
        }
        if(currentQueryCount == this.queryCount) {
          return fromAmountFormatted
        }
        return '0'
      }

      this.getSwapPaths = async(from_id, to_id, fromAmount) => {
        let currentQueryCount = this.queryCount;
        let $submitButton = $('#submit-button')
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
          if (Number(fromAmount) > 0) {
            let url = "/swap_paths?from_id=" + tokenFromId + "&to_id=" + tokenToId + "&from_amount=" + document.formatHumanizedNumberForSmartContract(fromAmount, this.cryptocurrencies[from_id]['decimals']);
            this.swapPaths[from_id][to_id] = await $.ajax({
              url: url,
              type: 'GET'
            })
            if(this.swapPaths[from_id][to_id].length) {
              this.renderResults(from_id, to_id)
              for (const [index, swapPath] of this.swapPaths[from_id][to_id].entries()) {
                if(currentQueryCount == this.queryCount) {
                  $submitButton.find('.loading #status').text('Checking swap path ' + (index + 1) + ' of ' + this.swapPaths[from_id][to_id].length)
                  let resultOfSwaps = await this.getResultOfSwaps(swapPath, currentQueryCount)
                  swapPath['resultOfSwaps'] = parseFloat(resultOfSwaps)
                  this.setNetUsdResultOfSwaps(swapPath)
                  this.setBestResultForProtocol(swapPath)
                  this.renderResults(from_id, to_id)
                }
              }
              if(currentQueryCount == this.queryCount) {
                this.applyFee()
                this.renderTable()
                this.fillForm()
                $('#results').removeClass('d-none')
                if ($('#arbitrage-enabled').length && $('#arbitrage-enabled').is(":checked") && Number($("#to-amount-input").val()) - Number($("#arbitrage-profit").val()) > Number($("#from-amount-input").val())) {
                  $('#bird-audio')[0].play()
                }
              }
            } else {
              document.showAlertInfo('No swap paths available. Please try different tokens or different amounts.')
            }
          }
        } catch(error) {
          if(currentQueryCount == this.queryCount && error.status != 401) {
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
        let cryptocurrencyPool;
        pool.cryptocurrency_pools.forEach(function(cp){
          if(cp.cryptocurrency_id == fromId) {
            cryptocurrencyPool = cp
          }
        })
        if (cryptocurrencyPool['downcase_data_hash_for_swap_simulation']) {
          fromCryptoCodeHash = fromCryptoCodeHash.toLowerCase()
        }
        if (protocolIdentifier == 'secret_swap') {
          swapMsg = {simulation: {offer_asset: {info: {token: {contract_addr: fromCryptoAddress, token_code_hash: fromCryptoCodeHash, viewing_key: 'SecretSwap'}}, amount: fromAmountFormatted}}}
        } else if (protocolIdentifier == 'sienna') {
          swapMsg = {swap_simulation: {offer: {token: {custom_token: {contract_addr: fromCryptoAddress, token_code_hash: fromCryptoCodeHash, viewing_key: ''}}, amount: fromAmountFormatted}}}
        } else {
          return fromAmountFormatted
        }
        try {
          let result = await this.client.queryContractSmart(pool['smart_contract']['address'], swapMsg, undefined, pool['smart_contract']['data_hash'])
          this.simulationSwapResults[poolId][fromId][fromAmountFormatted] = result['return_amount']
          return result['return_amount']
        } catch(error) {
          console.log(error)
          if (error.message && error.message.includes('not managed by this') && !cryptocurrencyPool['downcase_data_hash_for_swap_simulation']) {
            cryptocurrencyPool['downcase_data_hash_for_swap_simulation'] = true
            $.ajax({
              url: '/cryptocurrency_pools/' + cryptocurrencyPool['id'],
              type: 'put',
              data: { cryptocurrency_pool: { downcase_data_hash_for_swap_simulation: true } },
              dataType: 'json'
            })
            swapMsg = {swap_simulation: {offer: {token: {custom_token: {contract_addr: fromCryptoAddress, token_code_hash: fromCryptoCodeHash.toLowerCase(), viewing_key: ''}}, amount: fromAmountFormatted}}}
            let result = await this.client.queryContractSmart(pool['smart_contract']['address'], swapMsg, undefined, pool['smart_contract']['data_hash'])
            this.simulationSwapResults[poolId][fromId][fromAmountFormatted] = result['return_amount']
            return result['return_amount']
          } else {
            document.showAlertDanger(error)
          }
        }
      }

      this.renderResults = (from_id, to_id) => {
        $("#swap-paths").html('')
        this.swapPaths[from_id][to_id].sort((a, b) => b.netUsdResultOfSwaps - a.netUsdResultOfSwaps).forEach((swapPath, index) => {
          if (document.secretNetwork.userVipLevel == 5) {
            let swapPathId = swapPath['id']
            let x = '<div class="card mt-2" id="' + swapPathId + '">' + '<b>Swap path: #' + swapPathId + '</b>'
            let currentCryptoId = swapPath['from_id']
            let currentCryptoSymbol = swapPath['from']['symbol']
            x = x + '<table class="table"><tbody>'
            // Wrapping
            if(this.cryptocurrencies[from_id]['smart_contract'] == undefined) {
              currentCryptoId = this.wrapPaths[from_id]
              currentCryptoSymbol = this.cryptocurrencies[this.wrapPaths[from_id]]['symbol']
              x = x + this.generateSwapPathRowAsString(this.cryptocurrencies[from_id]['symbol'], 'wrap', currentCryptoSymbol)

            }
            // Swapping
            swapPath['swap_path_as_array'].forEach((tradePairId, index) => {
              let protocolName = this.tradePairs[tradePairId]['protocol']['name']
              let xId = currentCryptoId
              this.tradePairs[tradePairId]['cryptocurrency_pools'].forEach((cryptoPool) => {
                if (cryptoPool['cryptocurrency_id'] != Number(xId) && cryptoPool['cryptocurrency_role'] == 'deposit') {
                  let fromCurrentSymbol = currentCryptoSymbol
                  currentCryptoSymbol = cryptoPool['cryptocurrency']['symbol']
                  currentCryptoId = cryptoPool['cryptocurrency_id']
                  let resultString = ''
                  if (swapPath['simulationResults']) {
                    let usdPrice;
                    let simulationResult = swapPath['simulationResults'][index]
                    resultString = document.humanizeStringNumberFromSmartContract(simulationResult, this.cryptocurrencies[currentCryptoId]['decimals'])
                    usdPrice = document.humanizeStringNumberFromSmartContract(simulationResult * cryptoPool['cryptocurrency']['price'], this.cryptocurrencies[currentCryptoId]['decimals'], 2)
                    if (usdPrice) {
                      resultString = resultString + ' / $' + usdPrice
                    }
                  }
                  x = x + this.generateSwapPathRowAsString(fromCurrentSymbol, protocolName, currentCryptoSymbol, resultString)
                }
              })
            })
            // Unwrapping
            if (this.wrapPaths[currentCryptoId] == to_id) {
              x = x + this.generateSwapPathRowAsString(this.cryptocurrencies[currentCryptoId]['symbol'], 'unwrap', this.cryptocurrencies[to_id]['symbol'])
            }
            x = x + '</tbody></table></div>'
            $("#swap-paths").append(x)
          }
          if(index == 0 && swapPath['resultOfSwaps']) {
            this.selectedSwapPath = swapPath
            $('#' + this.selectedSwapPath['id']).addClass('bg-theme-accent-alt')
          }
        })
      }

      this.generateSwapPathRowAsString = function(fromSymbol, via, toSymbol, result = '') {
        return '<tr><td class="table-des">' + fromSymbol + '</td><td class="table-des">' + via + '</td><td class="table-des">' + toSymbol + '</td><td class="table-des">' + result + '</td></tr>'
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
        if(this.selectedSwapPath) {
          if(this.selectedSwapPath['protocol_id'] == 2) {
            $('#secret-swap-best-result').addClass('text-success')
          } else if (this.selectedSwapPath['protocol_id'] == 4) {
            $('#sienna-best-result').addClass('text-success')
          } else {
            $('#btn-best-result').addClass('text-success')
          }
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
        this.updateWalletBalance(this.fromId, '.from', this.fromAmountInputSelector)
        this.updateWalletBalance(this.toId, '.to')
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
        $('#btn-best-result').removeClass('text-success')
        $('#secret-swap-best-result').removeClass('text-success')
        $('#sienna-best-result').removeClass('text-success')
      }

      this.setBestResultForProtocol = (swapPath) => {
        let protocolId = 0;
        if (swapPath['protocol_id']) {
          protocolId = swapPath['protocol_id']
        }
        if (this.bestResultsPerProtocol[protocolId]) {
          if(swapPath['netUsdResultOfSwaps'].isGreaterThan(this.bestResultsPerProtocol[protocolId]['netUsdResultOfSwaps'])) {
            this.bestResultsPerProtocol[protocolId] = swapPath
          }
        } else {
          this.bestResultsPerProtocol[protocolId] = swapPath
        }
      }

      this.toggleConfig = async() => {
        if(this.wrapPaths[this.fromId] == this.toId) {
          $("#cog-container").addClass('d-none')
          $("#slippage-container").addClass('d-none')
        } else {
          $("#cog-container").removeClass('d-none')
          $("#slippage-container").removeClass('d-none')
        }
      }

      this.updateWalletBalance = async(cryptocurrencyId, selectorPrefix, inputToClickFillTo = undefined) => {
        let cryptocurrency = this.cryptocurrencies[cryptocurrencyId];
        if (cryptocurrency ==  undefined || document.secretNetwork.walletAddress == undefined) {
          return
        }
        let $walletBalance = $(selectorPrefix + '-balance')
        let $walletBalanceLink = $(selectorPrefix + '-balance-link')
        let $walletBalanceLoading = $(selectorPrefix + '-balance-loading')
        let $walletBalanceViewButton = $(selectorPrefix + '-balance-view-button')
        let balance
        let cryptoAddress;
        let updateWalletBalanceStillValid = true
        $walletBalance.addClass('d-none')
        $walletBalanceLoading.removeClass('d-none')
        $walletBalanceViewButton.addClass('d-none')
        try {
          await document.connectKeplrWallet(false)
          if (document.secretNetwork.walletAddress) {
            if (cryptocurrency['smart_contract']) {
              cryptoAddress = cryptocurrency['smart_contract']['address']
              let key = await window.keplr.getSecret20ViewingKey(document.secretNetwork.chainId(), cryptoAddress)
              // If they have the key, replace the button with the balance
              let balanceResponse = await this.client.queryContractSmart(cryptoAddress, { balance: { address: document.secretNetwork.walletAddress, key: key } }, undefined, cryptocurrency['smart_contract']['data_hash'])
              balance = balanceResponse['balance']['amount']
            } else {
              let accountDetails = await this.client.getAccount(document.secretNetwork.walletAddress)
              accountDetails['balance'].forEach(function(balanceDetails) {
                if (cryptocurrency['denom'] == balanceDetails['denom']) {
                  balance = balanceDetails['amount']
                }
              })
              if (balance == undefined) {
                balance = '0'
              }
            }
            cryptocurrency['balance'] = balance
            if (selectorPrefix == '.from') {
              if (cryptocurrencyId != this.fromId) {
                updateWalletBalanceStillValid = false
              }
            } else {
              if (cryptocurrencyId != this.toId) {
                updateWalletBalanceStillValid = false
              }
            }
            if (updateWalletBalanceStillValid) {
              let balanceFormatted = document.humanizeStringNumberFromSmartContract(balance, cryptocurrency['decimals'])
              if (inputToClickFillTo) {
                $walletBalance.off("click");
                $walletBalance.attr('href', '#');
                $walletBalance.click(function(e) {
                  e.preventDefault()
                  $(inputToClickFillTo).val(balanceFormatted.replace(/,/g, '')).trigger('input')
                })
              }
              $walletBalance.text(balanceFormatted)
              $walletBalance.removeClass('d-none')
              $walletBalanceViewButton.addClass('d-none')
            }
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
        let fromId = this.fromId
        let toId = this.toId
        if (this.wrapPaths[fromId] != toId && !this.selectedSwapPath) {
          return
        }

        let fromCryptocurrency = this.cryptocurrencies[fromId]
        let fromBalance = fromCryptocurrency['balance']
        let fromAmount = document.secretNetworkDexAggregatorForm.fromAmount.value
        let estimateAmount = document.secretNetworkDexAggregatorForm.estimateAmount.value
        let toCryptocurrency = this.cryptocurrencies[toId]
        let toBalance = toCryptocurrency['balance']
        fromAmount = document.formatHumanizedNumberForSmartContract(fromAmount, fromCryptocurrency['decimals'])
        estimateAmount = document.formatHumanizedNumberForSmartContract(estimateAmount, toCryptocurrency['decimals'])
        let submitButtonSelector = '#submit-button'
        let $submitButton = $(submitButtonSelector)
        $submitButton.prop("disabled", true);
        $submitButton.find('.loading').removeClass('d-none')
        $submitButton.find('.ready').addClass('d-none')
        $submitButton.find('.loading #status').text('Loading...')
        let contract;
        let contractDataHash;
        let handleMsg;
        let sentFunds = []
        let successMessage;
        try {
          await document.connectKeplrWallet()
          if (document.secretNetwork.walletAddress) {
            if (this.wrapPaths[fromId] == toId) {
              if(fromCryptocurrency['smart_contract']) {
                contract = fromCryptocurrency['smart_contract']['address']
                contractDataHash = fromCryptocurrency['smart_contract']['data_hash']
                handleMsg = { redeem: { amount: fromAmount } };
                successMessage = 'Unwrapped'
              } else {
                contract = toCryptocurrency['smart_contract']['address']
                contractDataHash = toCryptocurrency['smart_contract']['data_hash']
                handleMsg = { deposit: {} };
                sentFunds = [{ "denom": fromCryptocurrency['denom'], "amount": fromAmount }]
                successMessage = 'Wrapped'
              }
              let gasParams = {
                exec: {
                  amount: [{ amount: String(this.gasWrap), denom: 'uscrt' }],
                  gas: String(this.gasWrap),
                },
              }
              this.client = document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams)
              let response = await this.client.execute(contract, handleMsg, '', sentFunds, gasParams.exec, contractDataHash)
            } else {
              let currentFromId = fromId
              let minAmount = document.secretNetworkDexAggregatorForm.minAmount.value
              minAmount = document.formatHumanizedNumberForSmartContract(minAmount, this.selectedSwapPath['to']['decimals'])
              let hops = []
              let gas = 0
              let initNativeFromToken;
              // when from token is native
              if(fromCryptocurrency['smart_contract'] == undefined) {
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
                hop['redeem_denom'] = toCryptocurrency['denom']
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
                routeMessage = { hops: hops, estimated_amount: estimateAmount, minimum_acceptable_amount: minAmount, to: document.secretNetwork.walletAddress }
              }
              let routeMsgEncoded = Buffer.from(JSON.stringify(routeMessage)).toString('base64')
              if (fromCryptocurrency['smart_contract']) {
                contract = fromCryptocurrency['smart_contract']['address']
                contractDataHash = fromCryptocurrency['smart_contract']['data_hash']
                handleMsg = { send: { amount: fromAmount, recipient: recipient, msg: routeMsgEncoded } }
              } else {
                contract = this.dexAggregatorSmartContractAddress
                contractDataHash = this.dexAggregatorDataHash
                handleMsg = { receive: { amount: fromAmount, from: document.secretNetwork.walletAddress, msg: routeMsgEncoded } }
                sentFunds = [{ "denom": fromCryptocurrency['denom'], "amount": fromAmount }]
              }
              let gasParams = {
                exec: {
                  amount: [{ amount: String(gas), denom: 'uscrt' }],
                  gas: String(gas),
                },
              }
              this.client = document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams)
              let response = await this.client.execute(contract, handleMsg, '', sentFunds, gasParams.exec, contractDataHash)
              let returnAmount;
              response['logs'][0]['events'][response['logs'][0]['events'].length - 1]['attributes'].forEach(function(attribute){
                if(attribute['key'] == 'return_amount') {
                  returnAmount = attribute['value']
                }
              })
              if(new BigNumber(estimateAmount) < new BigNumber(returnAmount)) {
                returnAmount = estimateAmount
              }
              successMessage = "Amount received " + document.humanizeStringNumberFromSmartContract(returnAmount, toCryptocurrency['decimals'])
            }
            await document.delay(6_500)
            this.resetAfterSwap()
            // Update vip levels if swap involves BUTT
            if (fromCryptocurrency['symbol'] == 'BUTT' || toCryptocurrency['symbol'] == 'BUTT') {
              await document.secretNetwork.getAndSetUserVipLevel(document.secretNetwork.walletAddress, this.client)
            }
            document.showAlertSuccess(successMessage);
          }
        } catch(error) {
          // When this error happens, it may or may not have have gone through. Not sure why Datahub is sending this error.
          // Doesn't matter how much gas I put up for some of these contracts. It either works or it doesn't
          if (error.message.includes('timed out waiting for tx to be included in a block')) {
            // Wait 6.5 seconds and if balance of the to and from token has changed... Success
            await document.delay(6_500)
            await this.updateWalletBalance(fromId, '.from', this.fromAmountInputSelector)
            await this.updateWalletBalance(toId, '.to')
            if (this.cryptocurrencies[fromId]['balance'] != fromBalance && this.cryptocurrencies[toId]['balance'] != toBalance) {
              document.showAlertSuccess("Swap successful");
              this.resetAfterSwap()
            } else {
              document.showAlertDanger("Timeout error. Please check your wallet to see if transaction went through. Otherwise try with more gas.")
            }
          } else {
            document.showAlertDanger(error)
          }
        } finally {
          $submitButton.prop("disabled", false);
          $submitButton.find('.loading').addClass('d-none')
          $submitButton.find('.ready').removeClass('d-none')
        }
      };

      this.getAndSetCryptocurrenciesAndTradePairs()
      document.activateKeplr()
    }
  }
})
