$(document).ready(function(){
  if($("#secret-network-transactions").length) {
    this.datatable = window.$('#transactions-table').DataTable({
      columns: [
          { title: "ID" },
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
          _.each(transactions_response["transfer_history"]["txs"], function(value){
            let row = [];
            // data
            let id = value['id']
            row.push(id);
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
          $($('th')[2]).text('Amount' + '(' + token_symbol + ')')

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
          document.showAlertDanger(err)
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

      $('#contract-address').change(function(){
        $('#viewing-key-input').val('')
        let environment = document.featureEnvironment();
        let client =  document.secretNetworkClient(environment);
        let contractAddress = secretNetworkTransactionsForm.contractAddress.value;
        let chainId = document.secretNetworkChainId(environment);
        window.keplr.getSecret20ViewingKey(chainId, contractAddress).then(function(result){
          $('#viewing-key-input').val(result) 
        });
      })
    }
  };
});
