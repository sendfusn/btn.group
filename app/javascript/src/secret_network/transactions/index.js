$(document).ready(function(){
  if($("#secret-network-transactions").length) {
    initListeners()
    getAndSetSmartContracts(1)
    getAndSetCryptocurrencies(1)

    document.secretNetworkTransactionsForm.onsubmit = async (e) => {
      e.preventDefault()
      this.buttcoinContractAddress = "secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt";
      this.environment = 'production';
      this.chainId = 'secret-3';
      this.client =  document.secretNetworkClient(this.environment);
      let address = document.secretNetworkTransactionsForm.address.value;
      let contractAddress = secretNetworkTransactionsForm.contractAddress.value;
      let premiumAccess = false;
      let transactions = [];
      let viewingKey = document.secretNetworkTransactionsForm.viewingKey.value;

      // Reset transactions table and balance
      $transactionsTableBody = $('#transactions-table-body');
      $transactionsTableBody.html('')
      $("#balance").text('')
      $('#pay-wall').addClass('d-none')
      $($('th')[2]).text('Amount')

      // Button to loading
      $("#search-button").prop("disabled", true);
      $("#loading").removeClass("d-none")
      $("#ready").addClass("d-none")

      // Hide alerts
      document.hideAllAlerts();

      // First we need to find out if the user has premium access
      try {
        let params = {
          balance: {
            address: address,
            key: await window.keplr.getSecret20ViewingKey(this.chainId, this.buttcoinContractAddress)
          }
        }
        let balance_response = await this.client.queryContractSmart(this.buttcoinContractAddress, params);
        premiumAccess = balance_response["balance"]["amount"] >= 555_000_000
        if (!premiumAccess) {
          $('#pay-wall').removeClass('d-none')
        }
      } catch(err) {
        console.error(err)
      }

      try {
        if (!premiumAccess) {
          document.secretNetworkTransactionsForm.page.value = 1
          document.secretNetworkTransactionsForm.pageSize.value = '10'
        }

        // Get the token info
        let token_info_response = await this.client.queryContractSmart(contractAddress, { token_info: {} });
        let token_decimals = token_info_response["token_info"]["decimals"]
        let token_symbol = token_info_response["token_info"]["symbol"]
        let params = {
          transfer_history: {
            address: address,
            key: viewingKey,
            page: parseFloat(document.secretNetworkTransactionsForm.page.value - 1),
            page_size: parseFloat(document.secretNetworkTransactionsForm.pageSize.value)
          }
        }

        // Get the transactions for that token
        let transactions_response = await this.client.queryContractSmart(contractAddress, params);
        if (transactions_response['viewing_key_error']) {
          throw(transactions_response['viewing_key_error']['msg'])
        }
        let transactionsTableBodyContent = '';
        _.each(transactions_response["transfer_history"]["txs"], function(value){
          // ID & Date
          transactionsTableBodyContent += '<tr><td>'
          if (value['block_time']) {
            let options = { year: 'numeric', month: 'short', day: 'numeric' };
            let dateAsString = new Date(Number(value['block_time']) * 1000).toLocaleDateString(undefined, options);
            transactionsTableBodyContent += dateAsString + '<hr>'
          }
          transactionsTableBodyContent += 'id: #' + value['id'] + '</td><td>'

          // Description & Amount
          let amount = value['coins']['amount']
          amount = applyDecimals(amount, token_decimals)
          let description = '<a href="'
          let descriptionAddress;
          if (address != value['receiver']) {
            amount *= -1
            descriptionAddress = value['receiver']
          } else {
            descriptionAddress = value['from']
          }
          if (document.smartContracts[descriptionAddress]) {
            description += 'https://secretnodes.com/secret/chains/secret-3/contracts/' + descriptionAddress + ' target="_blank">' + descriptionAddress + '</a>'
            description += '<hr>Contract label: ' + document.smartContracts[descriptionAddress]['label']
          } else {
            description += 'https://secretnodes.com/secret/chains/secret-3/accounts/' + descriptionAddress + ' target="_blank">' + descriptionAddress + '</a>'
          }
          transactionsTableBodyContent += description + '</td><td>'
          transactionsTableBodyContent += parseFloat(amount).toLocaleString('en', { minimumFractionDigits: token_decimals }) + '</td></tr>'
        })
        transactionsTableBodyContent += '</tr>'
        $transactionsTableBody.html(transactionsTableBodyContent)
        // Add token symbol next to amount header
        $($('th')[2]).text('Amount' + ' (' + token_symbol + ')')

        // Get the balance for the token
        params = {
          balance: {
            address: address,
            key: viewingKey
          }
        }
        let balance_response = await this.client.queryContractSmart(contractAddress, params);
        // Display results
        $('#balance').text(applyDecimals(balance_response["balance"]["amount"], token_decimals).toLocaleString('en', { minimumFractionDigits: token_decimals }) + ' ' + token_symbol)
      }
      catch(err) {
        console.error(err)
        let errorDisplayMessage = err
        if (err.message) {
          errorDisplayMessage = err.message;
        }
        if (errorDisplayMessage.includes('decoding bech32 failed')) {
          errorDisplayMessage = 'Token contract address is invalid.'
        }
        if (errorDisplayMessage.includes('{"generic_err":{"msg":"canonicalize_address errored: invalid checksum"}')) {
          errorDisplayMessage = 'Wallet address is invalid.'
        }
        document.showAlertDanger(errorDisplayMessage)
      }
      finally {
        // Enable form
        $("#search-button").prop("disabled", false);
        $("#loading").addClass("d-none")
        $("#ready").removeClass("d-none")
      }
    }

    function applyDecimals(amount, decimals) {
      return amount / parseFloat("1" + '0'.repeat(decimals))
    }

    function getAndSetCryptocurrencies(blockchainId) {
      document.cryptocurrencies = {}
      var request = new XMLHttpRequest()
      // Open a new connection, using the GET request on the URL endpoint
      request.open('GET', '/cryptocurrencies?blockchain_id=' + blockchainId, true)
      request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response)
        data.forEach((cryptocurrency) => {
          document.cryptocurrencies[cryptocurrency["symbol"]] = cryptocurrency;
        })
      }
      // Send request
      request.send()
    }

    function getAndSetSmartContracts(blockchainId) {
      document.smartContracts = {}
      var request = new XMLHttpRequest()
      // Open a new connection, using the GET request on the URL endpoint
      request.open('GET', '/smart_contracts?blockchain_id=' + blockchainId, true)
      request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response)
        data.forEach((smartContract) => {
          document.smartContracts[smartContract["address"]] = smartContract;
        })
      }
      // Send request
      request.send()
    }

    function initListeners() {
      $('#viewing-key-container .fa-eye').click(function(){
        if($('#viewing-key-input').attr('type') == 'text') {
          $('#viewing-key-input').attr('type', 'password')
        } else {
          $('#viewing-key-input').attr('type', 'text')
        }
      })

      $('#address').change(function(){
        $('#viewing-key-input').val('')
        // let environment = document.featureEnvironment();
        // let client =  document.secretNetworkClient(environment);
        // let contractAddress = secretNetworkTransactionsForm.contractAddress.value;
        // let chainId = document.secretNetworkChainId(environment);
        // window.keplr.getSecret20ViewingKey(chainId, contractAddress).then(function(result){
        //   $('#viewing-key-input').val(result)
        // });
      })

      $('#contract-address').change(function(){
        $('#viewing-key-input').val('')
        // let environment = document.featureEnvironment();
        // let client =  document.secretNetworkClient(environment);
        // let contractAddress = secretNetworkTransactionsForm.contractAddress.value;
        // let chainId = document.secretNetworkChainId(environment);
        // window.keplr.getSecret20ViewingKey(chainId, contractAddress).then(function(result){
        //   $('#viewing-key-input').val(result)
        // });
      })

      document.querySelector('#load-viewing-key-from-keplr-button').addEventListener('click', (evt) => {
        this.chainId = document.secretNetworkChainId(this.environment);
        (async () => {
          let $target = $('#load-viewing-key-from-keplr-button')
          $target.prop("disabled", true);
          $target.find('.loading').removeClass('d-none')
          $target.find('.ready').addClass('d-none')
          try {
            const {
              SigningCosmWasmClient,
            } = require('secretjs');
            if (!window.getOfflineSigner || !window.keplr) {
              throw("Please install keplr extension")
            } else {
              if (window.keplr.experimentalSuggestChain) {
                // This method will ask the user whether or not to allow access if they haven't visited this website.
                // Also, it will request user to unlock the wallet if the wallet is locked.
                // If you don't request enabling before usage, there is no guarantee that other methods will work.
                await window.keplr.enable(this.chainId);
                this.keplrOfflineSigner = window.getOfflineSigner(this.chainId);
                let accounts = await this.keplrOfflineSigner.getAccounts();
                this.address = accounts[0].address;
                document.secretNetworkTransactionsForm.address.value = this.address
                await window.keplr.suggestToken(this.chainId, document.secretNetworkTransactionsForm.contractAddress.value);
                let key = await window.keplr.getSecret20ViewingKey(this.chainId, document.secretNetworkTransactionsForm.contractAddress.value)
                document.secretNetworkTransactionsForm.viewingKey.value = key
                $(".load-viewing-key-link").addClass('d-none')
              } else {
                throw("Please use the recent version of keplr extension")
              }
            }
          } catch(err) {
            let errorDisplayMessage = err;
            document.showAlertDanger(errorDisplayMessage)
          } finally {
            // Show ready ui
            $target.prop("disabled", false);
            $target.find('.loading').addClass('d-none')
            $target.find('.ready').removeClass('d-none')
          }
        })();
      })

      document.querySelector('#load-address-from-keplr-wallet-button').addEventListener('click', (evt) => {
        this.chainId = document.secretNetworkChainId(this.environment);
        (async () => {
          let $target = $('#load-address-from-keplr-wallet-button')
          $target.prop("disabled", true);
          $target.find('.loading').removeClass('d-none')
          $target.find('.ready').addClass('d-none')
          try {
            const {
              SigningCosmWasmClient,
            } = require('secretjs');
            if (!window.getOfflineSigner || !window.keplr) {
              throw("Please install keplr extension")
            } else {
              if (window.keplr.experimentalSuggestChain) {
                // This method will ask the user whether or not to allow access if they haven't visited this website.
                // Also, it will request user to unlock the wallet if the wallet is locked.
                // If you don't request enabling before usage, there is no guarantee that other methods will work.
                await window.keplr.enable(this.chainId);
                this.keplrOfflineSigner = window.getOfflineSigner(this.chainId);
                let accounts = await this.keplrOfflineSigner.getAccounts();
                this.address = accounts[0].address;
                document.secretNetworkTransactionsForm.address.value = this.address
                let key = await window.keplr.getSecret20ViewingKey(this.chainId, document.secretNetworkTransactionsForm.contractAddress.value)
                document.secretNetworkTransactionsForm.viewingKey.value = key
                $(".load-viewing-key-link").addClass('d-none')
              } else {
                throw("Please use the recent version of keplr extension")
              }
            }
          } catch(err) {
            let errorDisplayMessage = err;
            if (err['message'].includes('There is no matched secret20')) {
              $(".load-viewing-key-link").removeClass('d-none')
            } else {
              document.showAlertDanger(errorDisplayMessage)
            }
          } finally {
            // Show ready ui
            $target.prop("disabled", false);
            $target.find('.loading').addClass('d-none')
            $target.find('.ready').removeClass('d-none')
          }
        })();
      })
    }
  };
});
