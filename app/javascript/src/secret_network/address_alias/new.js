$(document).ready(function(){
  if($("#secret-network-address-alias-new").length) {
    const {
      SigningCosmWasmClient,
    } = require('secretjs');

    var myWidget = cloudinary.createUploadWidget({
      cloudName: 'hv5cxagki',
      cropping: true,
      uploadPreset: "yxh7df5b",
      multiple: false,
      maxImageFileSize: 5_000_000,
      resourceType: 'image'
      }, (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info);
        $("#avatar-url").val(result.info.url);
      }
    })
    document.getElementById("cloudinary-upload-widget").addEventListener("click", function(evt){
      myWidget.open();
      evt.preventDefault();
    }, false);


    window.onload = async () => {
      document.aliasCreateForm.onsubmit = () => {
        (async () => {
          $("#create-button").prop("disabled", true);
          $("#loading").removeClass("d-none")
          $("#ready").addClass("d-none")
          document.hideAllAlerts();
          try {
            // Set environment
            let environment = document.featureEnvironment();
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

            let alias = document.aliasCreateForm.alias.value;
            let avatarUrl = document.aliasCreateForm.avatarUrl.value;
            let handleMsg = { create: { alias: alias, avatar_url: avatarUrl } }
            let response = await this.client.execute(contractAddress, handleMsg)
            $("#result-value-container").removeClass("d-none");
            // $("#result-value").html(document.prettyPrintJSON(result));
            let url = 'https://secretnodes.com/secret/chains/' + chainId + '/accounts/' + this.address
            let resultValueHtml = '<h3 class="mb-0">' + alias + '</h3><a class="mb-3 d-block" target="_blank" rel="noopener" href="' + url + '">' + this.address + '</a><img class="w-100" src="' + avatarUrl + '">'
            $("#result-value").html(resultValueHtml)
            // Set data on delete button
            $("#delete-button").data('environment', environment)
            $("#delete-button").data('alias', alias)
            $("#result-container").removeClass("d-none");
            $("#delete-button").removeClass("d-none")
          }
          catch(err) {
            let errorDisplayMessage = err;
            if (err.message.includes('Address already has an alias')) {
              errorDisplayMessage = 'Address already has an alias.'
            }
            document.showAlertDanger(errorDisplayMessage)
          }
          finally {
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
