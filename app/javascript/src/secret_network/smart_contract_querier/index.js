$(document).ready(function(){
  if($("#secret-network-smart-contract-querier").length) {
    window.onload = async () => {
      let param_count = 0;
      $('#add-new-param').click(function(event){
        event.preventDefault();
        $('#params-container').append('<hr><div class="row"><div class="col-8 mb-3"><label class="form-label" for="param-' + param_count + '-key">Key</label><input autocomplete="off" class="form-control" id="param-' + param_count + '-key"></div><div class="col-8 mb-3"><label class="form-label" for="param-' + param_count + '-value">Value</label><input autocomplete="off" class="form-control" id="param-' + param_count + '-value"></div><div class="col-4 mb-3"><label class="form-label" for="param-' + param_count + '-type">Type</label><select class="form-control" id="param-' + param_count + '-type"><option value="number">number</option><option selected value="string">text / string</option></select></div></div>');
        param_count++;
      });

      document.secretNetworkSmartContractQuerierForm.onsubmit = () => {
        // Disable form
        $("#search-button").prop("disabled", true);
        $("#result-container").addClass("d-none");
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        document.hideAllAlerts();
        (async () => {
          try {
            // Set environment
            let environment = document.secretNetworkSmartContractQuerierForm.environment.value;
            let client =  document.secretNetworkClient(environment);

            // Set params
            let contractAddress = document.secretNetworkSmartContractQuerierForm.contractAddress.value;
            let functionName = document.secretNetworkSmartContractQuerierForm.functionName.value;

            let params = {};
            let last_key;
            $('#params-container input').each(function(index){
              if (index % 3 == 0) {
                last_key = this.value;
              } else if (index % 3 == 1) {
                if (last_key.length) {
                  if (this.value.length) {
                    params[last_key] = this.value;
                  }
                }
              } else {
                if (this.value == 'number') {
                  if (last_key.length) {
                    if (params[last_key].length) {
                      params[last_key] == parseFloat(params[last_key])
                    }
                  }
                }
              }
            })

            // Query smart contract
            let result = await client.queryContractSmart(contractAddress, { [functionName]: params });

            // Display results
            $("#result-value").removeClass("d-none");
            $("#result-value").html(document.prettyPrintJSON(result));
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
            $("#result-container").removeClass("d-none");
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
