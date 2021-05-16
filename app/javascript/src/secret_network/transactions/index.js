$(document).ready(function(){
  if($("#secret-network-transactions").length) {
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
            let params = {
              transfer_history: {
                address: address,
                key: viewingKey,
                page_size: 50
              }
            }
            let transactions_response = await client.queryContractSmart(contractAddress, params);
            _.each(transactions_response["transfer_history"]["txs"], function(value){
              $('tbody').append('<tr><td>' + value['id'] + '</td>' + '<td>' + value['sender'] + '</td>' + '<td>' + value['from'] + '</td>' + '<td>' + value['receiver'] + '</td>' + '<td>' + value['coins']['amount'] + '</td>' + '</tr>')
              $('#denomination').text(value['coins']['denom'])
            })
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
