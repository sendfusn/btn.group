$(document).ready(function(){
  if($("#near-smart-contract-interface").length) {
    let paramCount = 0;
    $('#add-new-param').click(function(event){
      event.preventDefault();
      $('#params-container').append('<div class="param-container"><hr><div class="row"><div class="col-8"><div class="field-item"><label class="field-label" for="param-' + paramCount + '-key">Key</label><input autocomplete="off" class="input-bordered" id="param-' + paramCount + '-key"></div></div><div class="col-4 text-right"><a href="#" class="fa fa-times"></a></div><div class="col-8"><div class="field-item"><label class="field-label" for="param-' + paramCount + '-value">Value</label><input autocomplete="off" class="input-bordered" id="param-' + paramCount + '-value"></div></div><div class="col-4"><div class="field-item"><label class="field-label" for="param-' + paramCount + '-type">Type</label><select class="input-bordered" id="param-' + paramCount + '-type"><option value="raw">raw</option><option selected value="string">text / string</option></select></div></div></div></div>');
      $(".param-container .fa-times").click(function(){
        this.closest('.param-container').remove();
      })
      paramCount++;
    });

    // This is for when a transaction goes through the web wallet authorize page
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    if (vars['transactionHashes'] && vars['account_id']) {
      document.showAlertSuccess('Transaction with transaction hash ' + vars['transactionHashes'] + ' for ' + vars['account_id'] + ' successful.')
    }

    document.nearSmartContractInterfaceForm.onsubmit = () => {
      // Disable form
      $("#search-button").prop("disabled", true);
      $("#result-container").addClass("d-none");
      $("#loading").removeClass("d-none")
      $("#ready").addClass("d-none")
      document.hideAllAlerts();
      let environment = document.featureEnvironment();
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

      this.submitToDatahub = async (environment, contractAddress, functionName, params) => {
        try {
          // Set environment
          let chainId = document.nearNetworkChainId(environment)
          let httpUrl = document.nearNetworkHttpUrl(environment)

          // Interact with smart contract
          let result;
          if(document.nearSmartContractInterfaceForm.interactionType.value == 'query') {
            // account ID associated with the transaction
            let config = {
              networkId: chainId,
              keyStore: new keyStores.BrowserLocalStorageKeyStore(),
              nodeUrl: httpUrl,
            };
            const near = await connect(config);
            const account = await near.account();
            result = await account.viewFunction(
              contractAddress,
              functionName,
              params,
            )
          } else {
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
              args: params,
            }
            const account = await wallet.account()
            result = await account.functionCall(optionsCall);
          }

          // Display results
          $("#result-value").removeClass("d-none");
          $("#result-value").html(document.prettyPrintJSON(result));
          $("#result-container").removeClass("d-none");
          $('html, body').animate({
              scrollTop: $("#result-container").offset().top
          }, 2000);
        }
        catch(err) {
          console.error(err)
          let errorDisplayMessage = err.message;
          if (err.message.includes('[-32000] Server error: account')) {
            errorDisplayMessage = 'Smart contract address is invalid.'
          } else if (err.message.includes('MethodNotFound')) {
            errorDisplayMessage = 'Function not found.'
          } else if (err.message.includes('[-32000] Server error: The node does not track the shard ID 0')) {
            errorDisplayMessage = undefined
            this.submitToDatahub(environment, contractAddress, functionName, params)
          }
          if (errorDisplayMessage) {
            document.showAlertDanger(errorDisplayMessage)
          }
        }
        finally {
          // Enable form
          $("#search-button").prop("disabled", false);
          $("#loading").addClass("d-none")
          $("#ready").removeClass("d-none")
        }
      }
      this.submitToDatahub(environment, contractAddress, functionName, params)

      return false;
    };
  }
});
