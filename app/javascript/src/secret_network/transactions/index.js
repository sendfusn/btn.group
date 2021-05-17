$(document).ready(function(){
  if($("#secret-network-transactions").length) {
    this.datatable = window.$('#transactions-table').DataTable({
      columns: [
          { title: "Data" },
          { title: "Description" },
          { title: "Amount" },
      ],
      dom: '<"top"i>frtp',
      paging: false
    });
    window.onload = async () => {
      this.chainId = 'secret-2';

      // Keplr extension injects the offline signer that is compatible with cosmJS.
      // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
      // And it also injects the helper function to `window.keplr`.
      // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
      if (!window.getOfflineSigner || !window.keplr) {
        alert("Please install keplr extension");
      } else {
        if (window.keplr.experimentalSuggestChain) {
          try {
            // This method will ask the user whether or not to allow access if they haven't visited this website.
            // Also, it will request user to unlock the wallet if the wallet is locked.
            // If you don't request enabling before usage, there is no guarantee that other methods will work.
            await window.keplr.enable(this.chainId);

            // @ts-ignore
            const keplrOfflineSigner = window.getOfflineSigner(this.chainId);
            const accounts = await keplrOfflineSigner.getAccounts();
            this.address = accounts[0].address;
            $('#address').val(this.address);
          } catch (error) {
            console.error(error)
          }
        } else {
          alert("Please use the recent version of keplr extension");
        }
      }

      document.secretNetworkTransactionsForm.onsubmit = () => {
        let transactions = [];
        this.datatable.clear().draw();

        // Disable form
        $("#search-button").prop("disabled", true);
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        document.hideAllAlerts();
        (async () => {
          try {
            // Set environment
            let environment;
            if ('on' == document.secretNetworkTransactionsForm.production.value) {
              environment = 'production'
            } else {
              environment = 'staging'
            }
            let client =  document.secretNetworkClient(environment);
            let address = document.secretNetworkTransactionsForm.address.value;
            let contractAddress = secretNetworkTransactionsForm.contractAddress.value;
            let viewingKey = await window.keplr.getSecret20ViewingKey("secret-2", contractAddress);
            let pageSize = document.secretNetworkTransactionsForm.pageSize.value;
            let page = document.secretNetworkTransactionsForm.page.value;
            console.log(page)
            console.log(pageSize)
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
              row.push('');
              description & amount
              let amount = value['coins']['amount']
              let description
              if (address != value['receiver']) {
                amount *= -1
                description = value['receiver']
              } else {
                description = value['from']
              }
              row.push(description)
              row.push(parseFloat(amount).toLocaleString('en'))
              transactions.push(row)
            })
            this.datatable.rows.add(transactions);
            this.datatable.draw();

            // _.each(transactions_response["transfer_history"]["txs"], function(value){
            //   // Format amount & description
            //   let amount = value['coins']['amount']
            //   let description
            //   if (address != value['receiver']) {
            //     amount *= -1
            //     description = value['receiver']
            //   } else {
            //     description = value['from']
            //   }
            //   amount = parseFloat(amount).toLocaleString('en')

            //   // Figure out description (the opposite party

            //   $('tbody').append('<tr><td>' + '' + '</td>' + '<td>' + description + '</td>' + '<td>' + amount + '</td>' + '</tr><tr><td colspan="3"><p>id: ' + value['id'] + '<br>sender/spender: ' + value['sender'] + '<br>from/owner: ' + value['from'] + '<br>receiver: ' + value['receiver'] + '</p></td></tr>')
            //   // Put denom next to amount header
            //   $('#denomination').text('(' + value['coins']['denom'] + ')')
            // })
            params = {
              balance: {
                address: address,
                key: viewingKey
              }
            }
            let balance_response = await client.queryContractSmart(contractAddress, params);
            // Display results
            $('#balance').text(balance_response["balance"]["amount"])
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
      };
    }
  };
});
