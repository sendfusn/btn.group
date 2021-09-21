$(document).ready(function(){
  if($("#near-smart-contract-interface").length) {
    window.onload = async () => {
      let param_count = 0;
      $('#add-new-param').click(function(event){
        event.preventDefault();
        $('#params-container').append('<hr><div class="row"><div class="col-8 mb-3"><label class="form-label" for="param-' + param_count + '-key">Key</label><input autocomplete="off" class="form-control" id="param-' + param_count + '-key"></div><div class="col-8 mb-3"><label class="form-label" for="param-' + param_count + '-value">Value</label><input autocomplete="off" class="form-control" id="param-' + param_count + '-value"></div><div class="col-4 mb-3"><label class="form-label" for="param-' + param_count + '-type">Type</label><select class="form-control" id="param-' + param_count + '-type"><option value="raw">raw</option><option selected value="string">text / string</option></select></div></div>');
        param_count++;
      });

      document.nearSmartContractInterfaceForm.onsubmit = () => {
        // Disable form
        $("#search-button").prop("disabled", true);
        $("#result-container").addClass("d-none");
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        document.hideAllAlerts();
        (async () => {
          try {
            // Set environment
            let environment = document.featureEnvironment();
            let chainId = document.nearNetworkChainId(environment)
            let httpUrl = document.nearNetworkHttpUrl(environment)
            // Set params
            let contractAddress = document.nearSmartContractInterfaceForm.contractAddress.value;
            let functionName = document.nearSmartContractInterfaceForm.functionName.value;
            let params = {};
            let last_key;
            $('#params-container input, #params-container select').each(function(index){
              if (index % 3 == 0) {
                last_key = this.value;
              } else if (index % 3 == 1) {
                if (last_key.length) {
                  if (this.value.length) {
                    params[last_key] = this.value;
                  }
                }
              } else {
                if (this.value == 'raw') {
                  if (last_key.length) {
                    if (params[last_key].length) {
                      params[last_key] = JSON.parse(params[last_key])
                    }
                  }
                }
              }
            })

            // Interact with smart contract
            let result;
            if(document.nearSmartContractInterfaceForm.interactionType.value == 'query') {
              const {connect, keyStores} = require("near-api-js");
              // account ID associated with the transaction
              let config = {
                networkId: chainId,
                keyStore: new keyStores.BrowserLocalStorageKeyStore(),
                nodeUrl: httpUrl,
              };
              document.config = config;
              const near = await connect(config);
              const account = await near.account("stevenchang.near");
              result = await account.viewFunction(
                contractAddress,
                functionName,
                params,
              )
            } else {
              const {connect, keyStores, WalletConnection} = require("near-api-js");
              // account ID associated with the transaction
              let config = {
                networkId: chainId,
                keyStore: new keyStores.BrowserLocalStorageKeyStore(),
                nodeUrl: httpUrl,
                walletUrl: document.nearNetworkWebWalletUrl(environment),
              };
              const near = await connect(config);
              const wallet = new WalletConnection(near);
              if(!wallet.isSignedIn()) return wallet.requestSignIn({ contractId: contractAddress })
              const optionsCall = {
                  contractId: contractAddress,
                  methodName: functionName,
                  args: params
              }
              const account = await wallet.account()
              result = await account.functionCall(optionsCall);
            }

            // Display results
            $("#result-value").removeClass("d-none");
            $("#result-value").html(document.prettyPrintJSON(result));
            $("#result-container").removeClass("d-none");
          }
          catch(err) {
            console.error(err)
            let errorDisplayMessage = err.message;
            if (err.message.includes('[-32000] Server error: account')) {
              errorDisplayMessage = 'Smart contract address is invalid.'
            } else if (err.message.includes('MethodNotFound')) {
              errorDisplayMessage = 'Function not found.'
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
      };
    }
  };
});
