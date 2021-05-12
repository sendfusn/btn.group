$(document).ready(function(){
  if($("#secret-network-smart-contract-querier").length) {
    window.onload = async () => {
      const {
        CosmWasmClient,
      } = require('secretjs');

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
            let http_url = '/datahub';
            if (environment == 'staging') {
              http_url = http_url + '_staging'
            };
            let client =  new CosmWasmClient(http_url);

            // Set params
            let contractAddress = document.secretNetworkSmartContractQuerierForm.contractAddress.value;
            let functionName = document.secretNetworkSmartContractQuerierForm.functionName.value;

            let param_one_key = document.secretNetworkSmartContractQuerierForm.paramOneKey.value;
            let param_one_value = document.secretNetworkSmartContractQuerierForm.paramOneValue.value;

            let param_two_key = document.secretNetworkSmartContractQuerierForm.paramTwoKey.value;
            let param_two_value = document.secretNetworkSmartContractQuerierForm.paramTwoValue.value;

            let param_three_key = document.secretNetworkSmartContractQuerierForm.paramThreeKey.value;
            let param_three_value = document.secretNetworkSmartContractQuerierForm.paramThreeValue.value;

            let param_four_key = document.secretNetworkSmartContractQuerierForm.paramFourKey.value;
            let param_four_value = document.secretNetworkSmartContractQuerierForm.paramFourValue.value;

            // Query smart contract
            let result = await client.queryContractSmart(contractAddress, { [functionName]: { [param_one_key]: param_one_value, [param_two_key]: param_two_value, [param_three_key]: param_three_value, [param_four_key]: parseFloat(param_four_value) }});

            // Display results
            $("#result-container").removeClass("d-none");
            $("#result-value").html(prettyPrintJSON(result));
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
  };
});

function prettyPrintJSON(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
