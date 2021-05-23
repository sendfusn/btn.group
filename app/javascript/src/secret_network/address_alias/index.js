$(document).ready(function(){
  if($("#secret-network-address-alias-index").length) {
    const {
      SigningCosmWasmClient,
    } = require('secretjs');

    window.onload = async () => {
      document.aliasSearchForm.onsubmit = () => {
        $("#search-button").prop("disabled", true);
        $("#result-container").addClass("d-none");
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        document.hideAllAlerts();
        (async () => {
          try {
            // Set environment
            let environment = document.featureEnvironment();
            let chainId = document.secretNetworkChainId(environment)
            let client =  document.secretNetworkClient(environment);
            let contractAddress = document.featureContractAddress(environment);
            let search_type = document.aliasSearchForm.searchType.value;
            let search_value = document.aliasSearchForm.searchValue.value;
            let search_params = { search_type: search_type, search_value: search_value };
            let result = await client.queryContractSmart(contractAddress, { search: search_params })
            $("#result-value-container").removeClass("d-none");
            // $("#result-value").html(document.prettyPrintJSON(result));
            let url = 'https://secretnodes.com/secret/chains/' + chainId + '/accounts/' + result['attributes']['address']
            let resultValueHtml = '<h3 class="mb-0">' + result['attributes']['alias'] + '</h3><a class="mb-3 d-block" target="_blank" rel="noopener" href="' + url + '">' + result['attributes']['address'] + '</a><img class="w-100" src="' + result['attributes']['avatar_url'] + '">'
            $("#result-value").html(resultValueHtml)
            // Set data on delete button
            $("#delete-button").data('environment', environment)
            $("#delete-button").data('alias', result['attributes']['alias'])
          }
          catch(err) {
            let errorDisplayMessage = err;
            if (err.message.includes('not_found')) {
              errorDisplayMessage = 'Alias not found'
            }
            document.showAlertDanger(errorDisplayMessage)
          }
          finally {
            $("#result-container").removeClass("d-none");
            // Enable form
            $("#search-button").prop("disabled", false);
            $("#loading").addClass("d-none")
            $("#ready").removeClass("d-none")
          }
        })();

        return false;
      };
    }

    $("#delete-button").click(function(){
      (async () => {
        $("#delete-button").prop("disabled", true);
        $("#delete-loading").removeClass("d-none")
        $("#delete-ready").addClass("d-none")
        try {
          // Set environment
          let environment = $("#delete-button").data('environment');
          let contractAddress = document.featureContractAddress(environment);
          let chainId = document.secretNetworkChainId(environment)
          let httpUrl = document.secretNetworkHttpUrl(environment)

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
                await window.keplr.enable(chainId);

                // @ts-ignore
                const keplrOfflineSigner = window.getOfflineSigner(chainId);
                const accounts = await keplrOfflineSigner.getAccounts();
                this.address = accounts[0].address;
                this.client = new SigningCosmWasmClient(
                  httpUrl,
                  this.address,
                  keplrOfflineSigner,
                  window.getEnigmaUtils(chainId),
                  {
                    init: {
                      amount: [{ amount: '300000', denom: 'uscrt' }],
                      gas: '300000',
                    },
                    exec: {
                      amount: [{ amount: '300000', denom: 'uscrt' }],
                      gas: '300000',
                    },
                  },
                );
                this.account = await this.client.getAccount(this.address);
              } catch (error) {
                console.error(error)
              }
            } else {
              alert("Please use the recent version of keplr extension");
            }
          }

          let alias = $("#delete-button").data('alias');
          let handleMsg = { destroy: { alias: alias } }
          let response = await this.client.execute(contractAddress, handleMsg)
          $("#result-value").html('')
          $("#result-value-container").addClass("d-none");
          document.showAlertSuccess('Alias destroyed.')
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          $("#result-container").removeClass("d-none");
          $("#delete-button").prop("disabled", false);
          $("#delete-loading").addClass("d-none")
          $("#delete-ready").removeClass("d-none")
        }
      })();
    })
  };
});
