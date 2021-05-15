$(document).ready(function(){
  if($("#secret-network-smart-contract-querier").length) {
    window.onload = async () => {
      const {
        CosmWasmClient,
      } = require('secretjs');

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
            let http_url = '/datahub';
            if (environment == 'staging') {
              http_url = http_url + '_staging'
            };
            let client =  new CosmWasmClient(http_url);

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
            $("#result-value").html(prettyPrintJSON(result));
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
