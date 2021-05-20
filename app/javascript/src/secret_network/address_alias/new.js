$(document).ready(function(){
  if($("#secret-network-address-alias-new").length) {
    const {
      SigningCosmWasmClient,
    } = require('secretjs');

    window.onload = async () => {
      $("#create-button").prop("disabled", false);
      $("#loading").addClass("d-none")
      $("#ready").removeClass("d-none")

      document.aliasCreateForm.onsubmit = () => {
        (async () => {
          $("#create-button").prop("disabled", true);
          $("#loading").removeClass("d-none")
          $("#ready").addClass("d-none")
          document.hideAllAlerts();
          try {
            // Set environment
            let contractAddress;
            let environment;
            if (true == document.aliasCreateForm.production.value) {
              environment = 'production'
            } else {
              environment = 'staging'
            }
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

            if (environment == 'staging') {
              contractAddress = 'secret1ghzaz67v647drlghd6m8njgl5lhavcwkal97ju'
            } else {
              contractAddress = 'secret17fkl85nexfne274s578rsuatm62j96lvgmfs7u'
            };

            let alias = document.aliasCreateForm.alias.value;
            let handleMsg = { create: { alias: alias } }
            let response = await this.client.execute(contractAddress, handleMsg)
              .catch((err) => {
                document.showAlertDanger(err)
                $("#create-button").prop("disabled", false);
                $("#loading").addClass("d-none")
                $("#ready").removeClass("d-none")
              });
            document.showAlertSuccess('Alias created.')
            $("#create-button").prop("disabled", false);
            $("#loading").addClass("d-none")
            $("#ready").removeClass("d-none")
          }
          catch(err) {
            document.showAlertDanger(err)
            $("#create-button").prop("disabled", false);
            $("#loading").addClass("d-none")
            $("#ready").removeClass("d-none")
          }
        })();

        return false;
      };    
    };
  };
});
