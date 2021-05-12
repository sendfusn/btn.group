$(document).ready(function(){
  if($("#secret-network-smart-contract-querier").length) {
    window.onload = async () => {
      const {
        CosmWasmClient,
      } = require('secretjs');
      const httpUrl = '/datahub';
      const client = new CosmWasmClient(httpUrl);

      document.secretNetworkSmartContractQuerierForm.onsubmit = () => {
        $("#search-button").prop("disabled", true);
        $("#result-container").addClass("d-none");
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        document.hideAllAlerts();
        (async () => {
          try {
            let contractAddress = document.secretNetworkSmartContractQuerierForm.contractAddress.value;
            let functionName = document.secretNetworkSmartContractQuerierForm.functionName.value;
            let param_one_key = document.secretNetworkSmartContractQuerierForm.paramOneKey.value;
            let param_one_value = document.secretNetworkSmartContractQuerierForm.paramOneValue.value;
            let result = await client.queryContractSmart(contractAddress, { [functionName]: { [param_one_key]: param_one_value }});
            console.log(result);
            $("#result-container").removeClass("d-none");
            $("#result-value").html(syntaxHighlight(result));
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
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

function syntaxHighlight(json) {
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
