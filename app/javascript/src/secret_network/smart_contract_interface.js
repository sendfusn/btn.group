$(document).ready(function(){
  if($("#secret-network-smart-contract-interface").length) {
    window.onload = async () => {
      document.activateKeplr()
      let paramCount = 0;
      $('#add-new-param').click(function(event){
        event.preventDefault();
        $('#params-container').append('<div class="param-container"><hr><div class="row"><div class="col-8"><div class="field-item"><label class="field-label" for="param-' + paramCount + '-key">Key</label><input autocomplete="off" class="input-bordered" id="param-' + paramCount + '-key"></div></div><div class="col-4 text-right"><a href="#" class="fa fa-times"></a></div><div class="col-8"><div class="field-item"><label class="field-label" for="param-' + paramCount + '-value">Value</label><input autocomplete="off" class="input-bordered" id="param-' + paramCount + '-value"></div></div><div class="col-4"><div class="field-item"><label class="field-label" for="param-' + paramCount + '-type">Type</label><select class="input-bordered" id="param-' + paramCount + '-type"><option value="raw">raw</option><option selected value="string">text / string</option></select></div></div></div></div>');
        $(".param-container .fa-times").click(function(){
          this.closest('.param-container').remove();
        })
        paramCount++;
      });

      document.secretNetworkSmartContractInterfaceForm.onsubmit = () => {
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
            let chainId = document.secretNetworkChainId(environment)
            let httpUrl = document.secretNetworkHttpUrl(environment)
            // Set params
            let contractAddress = document.secretNetworkSmartContractInterfaceForm.contractAddress.value;
            let functionName = document.secretNetworkSmartContractInterfaceForm.functionName.value;
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
            let msg = { [functionName]: params }

            // Interact with smart contract
            let result;
            if(document.secretNetworkSmartContractInterfaceForm.interactionType.value == 'query') {
              this.client =  document.secretNetworkClient(environment);
              result = await this.client.queryContractSmart(contractAddress, msg);
            } else {
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
                    let gasParams = {
                        exec: {
                          amount: [{ amount: '75000', denom: 'uscrt' }],
                          gas: '75000',
                        },
                      }
                    this.client = document.secretNetworkSigningClient(environment, this.address, gasParams)
                  } catch (error) {
                    console.error(error)
                  }
                } else {
                  alert("Please use the recent version of keplr extension");
                }
              }

              result = await this.client.execute(contractAddress, msg)
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
            if (err.message.includes('decoding bech32 failed')) {
              errorDisplayMessage = 'Smart contract address is invalid.'
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
