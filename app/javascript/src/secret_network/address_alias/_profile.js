$(document).ready(function(){
  if($("#secret-network-address-alias-profile").length){
    const {
      SigningCosmWasmClient,
    } = require('secretjs');

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
                      amount: [{ amount: '200000', denom: 'uscrt' }],
                      gas: '200000',
                    },
                    exec: {
                      amount: [{ amount: '200000', denom: 'uscrt' }],
                      gas: '200000',
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
          $("#result-container").addClass("d-none");
          $("#result-value-container").addClass("d-none");
          document.showAlertSuccess('Alias destroyed.')
        }
        catch(err) {
          console.error(err)
          document.showAlertDanger(err)
        }
        finally {
          $("#delete-button").prop("disabled", false);
          $("#delete-loading").addClass("d-none")
          $("#delete-ready").removeClass("d-none")
        }
      })();
    })  
  }
})
