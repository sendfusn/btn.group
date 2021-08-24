$(document).ready(function(){
  if($("#secret-network-mount-doom").length) {
      // Listeners
      $('input[type=radio][name=functionType]').on('change', function() {
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
            let tokenAddress = document.mountDoomForm.tokenAddress.value;
            let contractHash = document.mountDoomForm.contractHash.value;
            let params = { balance:{ address: contractAddress, contract_hash: contractHash, key: "DoTheRightThing." } };
            let balance_response = await client.queryContractSmart(tokenAddress, params)
            if (balance_response["viewing_key_error"]) {
              throw balance_response["viewing_key_error"]["msg"]
            }
            $('#result-value').text(applyDecimals(balance_response["balance"]["amount"], token_decimals) + ' ' + token_symbol)
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
  };
});
