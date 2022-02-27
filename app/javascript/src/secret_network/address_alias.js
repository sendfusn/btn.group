$(document).ready(function(){
  if($("#secret-network-address-alias").length) {
    window.onload = async() => {
      this.addressAliasContractAddress = 'secret19993tt7657ljrzt27dh8wm7kxfedgezyuva96w'
      this.addressAliasContractDataHash = 'D3194D7CEBE185E50C4D3CD3CF40827F58DFC48971EE330087CEFA8395FA0B6E'

      // === FUNCTIONS ===
      this.gasCreate = function() {
        return String(100_000 * document.secretNetwork.gasAndDelayFactor)
      }

      this.gasDelete = function() {
        return String(50_000 * document.secretNetwork.gasAndDelayFactor)
      }

      document.aliasDeleteForm.onsubmit = async (e) => {
        e.preventDefault()
        $("#delete-button").prop("disabled", true);
        $("#delete-loading").removeClass("d-none")
        $("#delete-ready").addClass("d-none")
        try {
          await document.connectKeplrWallet()
          if (document.secretNetwork.walletAddress) {
            let alias = $("#delete-button").data('alias');
            let params = {
              sender: document.secretNetwork.walletAddress,
              contract: this.addressAliasContractAddress,
              codeHash: this.addressAliasContractDataHash, // optional but way faster
              msg: { destroy: { alias: alias } },
              sentFunds: [], // optional
            }
            await document.secretNetwork.executeContract(params, this.gasDelete())
            $("#result-value").html('')
            $("#result-container").addClass("d-none");
            $("#result-value-container").addClass("d-none");
            document.showAlertSuccess('Alias deleted.')
          }
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          $("#delete-button").prop("disabled", false);
          $("#delete-loading").addClass("d-none")
          $("#delete-ready").removeClass("d-none")
        }
      }

      document.aliasCreateForm.onsubmit = async (e) => {
        e.preventDefault()
        $("#create-button").prop("disabled", true);
        $("#create-button").find(".loading").removeClass("d-none")
        $("#create-button").find(".ready").addClass("d-none")
        document.hideAllAlerts();
        try {
          await document.connectKeplrWallet()
          if (document.secretNetwork.walletAddress) {
            let alias = document.aliasCreateForm.alias.value
            let avatarUrl = document.aliasCreateForm.avatarUrl.value;
            let handleMsg = { send: { amount: '1000000', recipient: this.addressAliasContractAddress, msg: Buffer.from(JSON.stringify({ create: { alias: alias, avatar_url: avatarUrl } })).toString('base64') } }
            let params = {
              sender: document.secretNetwork.walletAddress,
              contract: document.secretNetwork.butt.address,
              codeHash: document.secretNetwork.butt.dataHash, // optional but way faster
              msg: handleMsg,
              sentFunds: [], // optional
            }
            let response = await document.secretNetwork.executeContract(params, this.gasCreate())
            console.log(response)
            $("#result-value-container").removeClass("d-none");
            // $("#result-value").html(document.prettyPrintJSON(result));
            let url = 'https://secretnodes.com/secret/chains/' + document.secretNetwork.chainId() + '/accounts/' + document.secretNetwork.walletAddress
            let resultValueHtml = '<h3 class="mb-0">' + alias + '</h3><a class="mb-3 d-block" target="_blank" rel="noopener" href="' + url + '">' + document.secretNetwork.walletAddress + '</a><img class="w-100" src="' + avatarUrl + '">'
            $("#result-value").html(resultValueHtml)
            // Set data on delete button
            $("#delete-button").data('alias', alias)
            $("#result-container").removeClass("d-none");
            $('#delete-button').removeClass('d-none')
            $('html, body').animate({
                scrollTop: $("#result-container").offset().top
            }, 2000);
          }
        }
        catch(err) {
          document.showAlertDanger(err.msg)
        }
        finally {
          $("#create-button").prop("disabled", false);
          $("#create-button").find(".loading").addClass("d-none")
          $("#create-button").find(".ready").removeClass("d-none")
        }
      };

      document.aliasSearchForm.onsubmit = async (e) => {
        e.preventDefault()
        $("#search-button").prop("disabled", true);
        $("#result-container").addClass("d-none");
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        document.hideAllAlerts();
        try {
          let search_type = document.aliasSearchForm.searchType.value;
          let search_value = document.aliasSearchForm.searchValue.value;
          let search_params = { search_type: search_type, search_value: search_value };
          let queryParams = {
            address: this.addressAliasContractAddress,
            codeHash: this.addressAliasContractDataHash,
            query: { search: search_params }
          }
          let result = await document.secretNetwork.queryContractSmart(queryParams)
          $("#result-value-container").removeClass("d-none");
          // $("#result-value").html(document.prettyPrintJSON(result));
          let url = 'https://secretnodes.com/secret/chains/' + document.secretNetwork.chainId() + '/accounts/' + result['attributes']['address']
          let resultValueHtml = '<h3 class="mb-0">' + result['attributes']['alias'] + '</h3><a class="mb-3 d-block" target="_blank" rel="noopener" href="' + url + '">' + result['attributes']['address'] + '</a><img class="w-100" src="' + result['attributes']['avatar_url'] + '">'
          $("#result-value").html(resultValueHtml)
          $("#result-container").removeClass("d-none");
          if (document.secretNetwork.walletAddress) {
            $("#delete-button").data('alias', result['attributes']['alias'])
            if (document.secretNetwork.walletAddress == result['attributes']['address']) {
              $('#delete-button').removeClass('d-none')
            } else {
              $('#delete-button').addClass('d-none')
            }
          }
        }
        catch(err) {
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
      };

      document.activateKeplr()
    }

    // === CLOUDINARY ===
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
        let imageUrl = result.info.secure_url
        if (result.info.coordinates) {
          let splitUrl = result.info.secure_url.split("upload/")
          let coordinates = result.info.coordinates.custom
          let transformationString = 'upload/c_crop,x_' + coordinates[0][0] + ',y_' + coordinates[0][1] + ',h_' + coordinates[0][2] + ',w_' + coordinates[0][3] + '/'
          imageUrl = splitUrl[0] + transformationString +  splitUrl[1]
        }
        $("#avatar-url").val(imageUrl);
      }
    })

    document.getElementById("cloudinary-upload-widget").addEventListener("click", function(evt){
      myWidget.open();
      evt.preventDefault();
    }, false);
  };
});
