$(document).ready(function(){
  if($("#secret-network-mount-doom").length) {
      // Listeners
      $('input[type=radio][name=interactionType]').on('change', function() {
        var radVal = $(this).val();
        if (radVal == 'query') {
          $('#contract-hash-input-group').addClass('d-none')
          $('#contract-hash').prop('required', false)
        } else if (radVal == 'set') {
          $('#contract-hash-input-group').removeClass('d-none')
          $('#contract-hash').prop('required', true)
        }
      })

    window.onload = async () => {
      document.mountDoomForm.onsubmit = () => {
        $("#submit-button").prop("disabled", true);
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
            let httpUrl = document.secretNetworkHttpUrl(environment)
            let tokenAddress = document.mountDoomForm.tokenAddress.value;
            if(document.mountDoomForm.interactionType.value == 'query') {
              let msg = { balance:{ address: contractAddress, key: "DoTheRightThing." } };
              let balance_response = await client.queryContractSmart(tokenAddress, msg)
              if (balance_response["viewing_key_error"]) {
                throw balance_response["viewing_key_error"]["msg"]
              }
              document.showAlertSuccess(balance_response["balance"]["amount"]);
            } else {
              const {
                SigningCosmWasmClient,
              } = require('secretjs');
              let contractHash = document.mountDoomForm.contractHash.value;
              let msg = { set_viewing_key_for_snip20: { address: tokenAddress, contract_hash: contractHash } };
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

              result = await this.client.execute(contractAddress, msg)
              document.showAlertSuccess("Viewing key \"DoTheRightThing.\" set.");
            }
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
            // Enable form
            $("#submit-button").prop("disabled", false);
            $("#loading").addClass("d-none")
            $("#ready").removeClass("d-none")
          }
        })();

        return false;
      };
    }

    function applyDecimals(amount, decimals) {
      return amount / parseFloat("1" + '0'.repeat(decimals))
    }
  };
});
