$(document).ready(function(){
  if($("#secret-network-transactions").length) {
    window.onload = async () => {
      this.chainId = document.secretNetwork.chainId(document.secretNetwork.environment);
      this.client = document.secretNetwork.client(document.secretNetwork.environment);
      document.activateKeplr()

      // === LISTENERS ===
      $('#viewing-key-container .fa-eye').click(function(){
        if($('#viewing-key-input').attr('type') == 'text') {
          $('#viewing-key-input').attr('type', 'password')
        } else {
          $('#viewing-key-input').attr('type', 'text')
        }
      })
      $('#address').change(function(){
        $('#viewing-key-input').val('')
      })
      $('#contract-address').change(function(){
        $('#viewing-key-input').val('')
      })
      $(document).on('keplr_connected', async(evt) => {
        $('.load-wallet-link').removeClass('d-none')
        if (document.secretNetwork.userVipLevel == 0) {
          $('#pay-wall').removeClass('d-none')
        } else {
          $('#pay-wall').addClass('d-none')
        }
      })

      document.querySelector('#load-from-keplr-button').addEventListener('click', async(evt) => {
        let $target = $('#load-from-keplr-button')
        $target.prop("disabled", true);
        $target.find('.loading').removeClass('d-none')
        $target.find('.ready').addClass('d-none')
        try {
          let key = await window.keplr.getSecret20ViewingKey(this.chainId, document.secretNetworkTransactionsForm.contractAddress.value)
          document.secretNetworkTransactionsForm.viewingKey.value = key
          document.secretNetworkTransactionsForm.address.value = document.secretNetwork.walletAddress
        } catch(err) {
          if (!err['message'].includes('There is no matched secret20')) {
            document.showAlertDanger(err)
          }
        } finally {
          // Show ready ui
          $target.prop("disabled", false);
          $target.find('.loading').addClass('d-none')
          $target.find('.ready').removeClass('d-none')
        }
      })

      document.secretNetworkTransactionsForm.onsubmit = async (e) => {
        e.preventDefault()
        let address = document.secretNetworkTransactionsForm.address.value;
        let contractAddress = secretNetworkTransactionsForm.contractAddress.value;
        let transactions = [];
        let viewingKey = document.secretNetworkTransactionsForm.viewingKey.value;
        // Reset transactions table and balance
        $transactionsTableBody = $('#transactions-table-body');
        $transactionsTableBody.html('')
        $("#balance").text('')
        $($('th')[2]).text('Amount')

        // Button to loading
        $("#search-button").prop("disabled", true);
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")

        // Hide alerts
        document.hideAllAlerts();

        try {
          // First we need to find out if the user has premium access
          await document.secretNetwork.getAndSetUserVipLevel(document.secretNetwork.walletAddress, this.client)
          if (document.secretNetwork.userVipLevel == 0) {
            $('#pay-wall').removeClass('d-none')
            document.secretNetworkTransactionsForm.page.value = 1
            document.secretNetworkTransactionsForm.pageSize.value = '10'
          } else {
            $('#pay-wall').addClass('d-none')
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
          let txs = transactions_response["transfer_history"]["txs"]
          await document.secretNetwork.transactions.getSmartContractsInTxs(address, txs)
          txs.forEach((value) => {
            // ID & Date
            transactionsTableBodyContent += '<tr><td>'
            if (value['block_time']) {
              let dateAsString = new Date(Number(value['block_time']) * 1000).toLocaleString(undefined, {dateStyle: 'short', timeStyle: 'short'});
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
            let smartContract = document.secretNetwork.smartContracts[descriptionAddress]
            if (smartContract) {
              description += 'https://secretnodes.com/secret/chains/secret-4/contracts/' + descriptionAddress + '" target="_blank">' + descriptionAddress + '</a>'
              description += '<hr>Contract label: ' + smartContract['label']
            } else {
              description += 'https://secretnodes.com/secret/chains/secret-4/accounts/' + descriptionAddress + '" target="_blank">' + descriptionAddress + '</a>'
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
    };
  }
});
