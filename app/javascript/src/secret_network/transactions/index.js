$(document).ready(function(){
  if($("#secret-network-transactions").length) {
    initListeners()
    getAndSetSmartContracts(1)

    document.secretNetworkTransactionsForm.onsubmit = () => {
      $transactionsTableBody = $('#transactions-table-body');
      let transactions = [];
      $transactionsTableBody.html('')
      $("#balance").text('')
      $($('th')[2]).text('Amount')
      $("#search-button").prop("disabled", true);
      $("#loading").removeClass("d-none")
      $("#ready").addClass("d-none")
      document.hideAllAlerts();
      (async () => {
        try {
          // Set environment
          let environment = document.featureEnvironment();
          let client =  document.secretNetworkClient(environment);
          let address = document.secretNetworkTransactionsForm.address.value;
          let contractAddress = secretNetworkTransactionsForm.contractAddress.value;
          let chainId = document.secretNetworkChainId(environment);
          let token_info_response = await client.queryContractSmart(contractAddress, { token_info: {} });
          let token_decimals = token_info_response["token_info"]["decimals"]
          let token_symbol = token_info_response["token_info"]["symbol"]
          let viewingKey = document.secretNetworkTransactionsForm.viewingKey.value;
          let pageSize = document.secretNetworkTransactionsForm.pageSize.value;
          let page = document.secretNetworkTransactionsForm.page.value;
          let params = {
            transfer_history: {
              address: address,
              key: viewingKey,
              page: parseFloat(page - 1),
              page_size: parseFloat(pageSize)
            }
          }
          let transactions_response = await client.queryContractSmart(contractAddress, params);
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
            transactionsTableBodyContent += '#' + value['id'] + '</td><td>'

            // Description & Amount
            let amount = value['coins']['amount']
            amount = applyDecimals(amount, token_decimals)
            let description
            if (address != value['receiver']) {
              amount *= -1
              description = value['receiver']
            } else {
              description = value['from']
            }
            if (document.smartContracts[description]) {
              description = document.smartContracts[description]['label']
            }
            transactionsTableBodyContent += description + '</td><td>'
            transactionsTableBodyContent += parseFloat(amount).toLocaleString('en', { minimumFractionDigits: token_decimals }) + '</td></tr>'
          })
          transactionsTableBodyContent += '</tr>'
          $transactionsTableBody.html(transactionsTableBodyContent)

          // Add token symbol next to amount header
          $($('th')[2]).text('Amount' + ' (' + token_symbol + ')')

          params = {
            balance: {
              address: address,
              key: viewingKey
            }
          }
          let balance_response = await client.queryContractSmart(contractAddress, params);
          // Display results
          $('#balance').text(applyDecimals(balance_response["balance"]["amount"], token_decimals).toLocaleString('en', { minimumFractionDigits: token_decimals }) + ' ' + token_symbol)
        }
        catch(err) {
          console.error(err)
          let errorDisplayMessage = err.message;
          if (err.message.includes('decoding bech32 failed')) {
            errorDisplayMessage = 'Smart contract or wallet address is invalid.'
          }
          document.showAlertDanger(errorDisplayMessage)
        }
        finally {
          // Enable form
          $("#search-button").prop("disabled", false);
          $("#loading").addClass("d-none")
          $("#ready").removeClass("d-none")
        }
      })();

      return false;
    }

    function applyDecimals(amount, decimals) {
      return amount / parseFloat("1" + '0'.repeat(decimals))
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

      // $('#contract-address').change(function(){
      //   $('#viewing-key-input').val('')
      //   let environment = document.featureEnvironment();
      //   let client =  document.secretNetworkClient(environment);
      //   let contractAddress = secretNetworkTransactionsForm.contractAddress.value;
      //   let chainId = document.secretNetworkChainId(environment);
      //   window.keplr.getSecret20ViewingKey(chainId, contractAddress).then(function(result){
      //     $('#viewing-key-input').val(result) 
      //   });
      // })

      document.querySelector('#load-address-from-keplr-wallet-button').addEventListener('click', (evt) => {
        let environment = document.featureEnvironment();
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

      document.querySelector('#load-viewing-key-from-keplr-button').addEventListener('click', (evt) => {
        let environment = document.featureEnvironment();
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
                let key = await window.keplr.getSecret20ViewingKey(this.chainId, document.secretNetworkTransactionsForm.contractAddress.value)
                document.secretNetworkTransactionsForm.viewingKey.value = key
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
    }
  };
});
