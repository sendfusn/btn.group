$(document).ready(function(){
  if($("#secret-network-transactions").length) {
    document.smartContracts = {}
    var request = new XMLHttpRequest()
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', '/smart_contracts?blockchain_id=1', true)
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response)
      data.forEach((smartContract) => {
        document.smartContracts[smartContract["address"]] = smartContract;
      })
    }
    // Send request
    request.send()

    this.datatable = window.$('#transactions-table').DataTable({
      columns: [
          { title: "ID" },
          { title: "Date" },
          { title: "Description" },
          { title: "Amount" },
      ],
      dom: '<"top">frtp',
      ordering: false,
      paging: false
    });
    initListeners()
    document.secretNetworkTransactionsForm.onsubmit = () => {
      let transactions = [];
      this.datatable.clear().draw();
      // Disable form
      $("#balance").text('')
      $($('th')[3]).text('Amount')
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
          _.each(transactions_response["transfer_history"]["txs"], function(value){
            let row = [];
            // data
            let id = value['id']
            row.push(id);
            if (value['block_time']) {
              let options = { year: 'numeric', month: 'long', day: 'numeric' };
              row.push(new Date(Number(value['block_time']) * 1000).toLocaleDateString(undefined, options))
            } else {
              row.push('n/a')
            }
            let amount = value['coins']['amount']
            amount = applyDecimals(amount, token_decimals)
            let description
            if (address != value['receiver']) {
              amount *= -1
              description = value['receiver']
            } else {
              description = value['from']
            }
            row.push(description)
            row.push(parseFloat(amount).toLocaleString('en', { minimumFractionDigits: token_decimals }))
            transactions.push(row)
          })
          this.datatable.rows.add(transactions);
          this.datatable.draw();
          // Add token symbol next to amount header
          $($('th')[3]).text('Amount' + '(' + token_symbol + ')')

          params = {
            balance: {
              address: address,
              key: viewingKey
            }
          }
          let balance_response = await client.queryContractSmart(contractAddress, params);
          // Display results
          $('#balance').text(applyDecimals(balance_response["balance"]["amount"], token_decimals) + ' ' + token_symbol)
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
    }
  };
});
