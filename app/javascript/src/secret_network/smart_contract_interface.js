$(document).ready(function(){
  if($("#secret-network-smart-contract-interface").length) {
    document.activateKeplr()
    let paramCount = 0;

    // === LISTENERS ===
    $('#add-new-param').click(function(event){
      event.preventDefault();
      $('#params-container').append('<div class="param-container"><hr><div class="row"><div class="col-8"><div class="field-item"><label class="field-label" for="param-' + paramCount + '-key">Key</label><input autocomplete="off" class="input-bordered" id="param-' + paramCount + '-key"></div></div><div class="col-4 text-right"><a href="#" class="fa fa-times"></a></div><div class="col-8"><div class="field-item"><label class="field-label" for="param-' + paramCount + '-value">Value</label><input autocomplete="off" class="input-bordered" id="param-' + paramCount + '-value"></div></div><div class="col-4"><div class="field-item"><label class="field-label" for="param-' + paramCount + '-type">Type</label><select class="input-bordered" id="param-' + paramCount + '-type"><option value="raw">raw</option><option selected value="string">text / string</option></select></div></div></div></div>');
      $(".param-container .fa-times").click(function(){
        this.closest('.param-container').remove();
      })
      paramCount++;
    });

    $(document).on('keplr_connected', async(evt) => {
      $('.alert').removeClass('d-none')
      $('#loading-vip').removeClass('d-none')
      $('#pay-wall').addClass('d-none')
    })

    $(document).on('keplr_dismissed', async(evt) => {
      $('.alert').removeClass('d-none')
      $('#loading-vip').addClass('d-none')
      $('#pay-wall').removeClass('d-none')
    })

    $(document).on('vip_level_updated', async(evt) => {
      $('#loading-vip').addClass('d-none')
      if (document.secretNetwork.userVipLevel == 0) {
        $('#pay-wall').removeClass('d-none')
      } else {
        $('.alert').addClass('d-none')
        $('#add-new-param-container').removeClass('d-none')
      }
    })

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
          document.secretNetwork.environment = document.featureEnvironment();
          let chainId = document.secretNetwork.chainId(document.secretNetwork.environment)
          // Set params
          let contractAddress = document.secretNetworkSmartContractInterfaceForm.contractAddress.value;
          let functionName = document.secretNetworkSmartContractInterfaceForm.functionName.value;
          let params = {};
          let last_key;
          if (document.secretNetwork.walletAddress) {
            await document.secretNetwork.getAndSetUserVipLevel(document.secretNetwork.walletAddress)
            $('#loading-vip').addClass('d-none')
            if (document.secretNetwork.userVipLevel == 0) {
              $('#pay-wall').removeClass('d-none')
            } else {
              $('.alert').addClass('d-none')
              $('#add-new-param-container').removeClass('d-none')
            }
          }
          if (document.secretNetwork.userVipLevel > 0) {
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
          }
          let msg = { [functionName]: params }

          // Interact with smart contract
          let result;
          if(document.secretNetworkSmartContractInterfaceForm.interactionType.value == 'query') {
            let queryParams = {
              address: contractAddress,
              query: msg
            }
            result = await document.secretNetwork.queryContractSmart(queryParams);
          } else {
            await document.connectKeplrWallet()
            if (document.secretNetwork.walletAddress) {
              let params = {
                sender: document.secretNetwork.walletAddress,
                contract: contractAddress,
                msg: msg,
                sentFunds: [],
              }
              result = await document.secretNetwork.executeContract(params, 75_000, document.secretNetwork.environment)
            }
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
          document.showAlertDanger(err)
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
});
