$(document).ready(function(){
  if($("#secret-network-address-alias").length) {
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
      this.environment = 'production';
      this.contractAddress = document.featureContractAddress(this.environment);
      this.chainId = document.secretNetworkChainId(this.environment)
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)

      $("#delete-button").click(function(){
        (async () => {
          $("#delete-button").prop("disabled", true);
          $("#delete-loading").removeClass("d-none")
          $("#delete-ready").addClass("d-none")
          try {
            // Keplr extension injects the offline signer that is compatible with cosmJS.
            // You can get this offline signer from `window.getOfflineSigner(this.chainId:string)` after load event.
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
                  let gasParams = {
                      exec: {
                        amount: [{ amount: '200000', denom: 'uscrt' }],
                        gas: '200000',
                      },
                    }
                  this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
                } catch (error) {
                  console.error(error)
                }
              } else {
                alert("Please use the recent version of keplr extension");
              }
            }

            let alias = $("#delete-button").data('alias');
            let handleMsg = { destroy: { alias: alias } }
            let response = await this.client.execute(this.contractAddress, handleMsg)
            $("#result-value").html('')
            $("#result-container").addClass("d-none");
            $("#result-value-container").addClass("d-none");
            document.showAlertSuccess('Alias deleted.')
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

      document.aliasCreateForm.onsubmit = () => {
        (async () => {
          $("#create-button").prop("disabled", true);
          $("#create-button").find(".loading").removeClass("d-none")
          $("#create-button").find(".ready").addClass("d-none")
          document.hideAllAlerts();
          try {
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
                  let gasParams = {
                      exec: {
                        amount: [{ amount: '200000', denom: 'uscrt' }],
                        gas: '200000',
                      },
                    }
                  this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
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
            let response = await this.client.execute(this.contractAddress, handleMsg)
            $("#result-value-container").removeClass("d-none");
            // $("#result-value").html(document.prettyPrintJSON(result));
            let url = 'https://secretnodes.com/secret/chains/' + this.chainId + '/accounts/' + this.address
            let resultValueHtml = '<h3 class="mb-0">' + alias + '</h3><a class="mb-3 d-block" target="_blank" rel="noopener" href="' + url + '">' + this.address + '</a><img class="w-100" src="' + avatarUrl + '">'
            $("#result-value").html(resultValueHtml)
            // Set data on delete button
            $("#delete-button").data('environment', environment)
            $("#delete-button").data('alias', alias)
            $("#result-container").removeClass("d-none");
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
            $("#create-button").find(".loading").addClass("d-none")
            $("#create-button").find(".ready").removeClass("d-none")
          }
        })();

        return false;
      };

      document.aliasSearchForm.onsubmit = () => {
        let client = document.secretNetworkClient(this.environment);
        $("#search-button").prop("disabled", true);
        $("#result-container").addClass("d-none");
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        document.hideAllAlerts();
        (async () => {
          try {
            let search_type = document.aliasSearchForm.searchType.value;
            let search_value = document.aliasSearchForm.searchValue.value;
            let search_params = { search_type: search_type, search_value: search_value };
            let result = await client.queryContractSmart(this.contractAddress, { search: search_params })
            $("#result-value-container").removeClass("d-none");
            // $("#result-value").html(document.prettyPrintJSON(result));
            let url = 'https://secretnodes.com/secret/chains/' + this.chainId + '/accounts/' + result['attributes']['address']
            let resultValueHtml = '<h3 class="mb-0">' + result['attributes']['alias'] + '</h3><a class="mb-3 d-block" target="_blank" rel="noopener" href="' + url + '">' + result['attributes']['address'] + '</a><img class="w-100" src="' + result['attributes']['avatar_url'] + '">'
            $("#result-value").html(resultValueHtml)
            // Set data on delete button
            $("#delete-button").data('alias', result['attributes']['alias'])
            $("#result-container").removeClass("d-none");
          }
          catch(err) {
            console.error(err)
            let errorDisplayMessage = err;
            if (err.message.includes('not_found')) {
              errorDisplayMessage = 'Alias not found.'
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
