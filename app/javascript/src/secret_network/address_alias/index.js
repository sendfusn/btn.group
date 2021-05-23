$(document).ready(function(){
  if($("#secret-network-address-alias-index").length) {
    window.onload = async () => {
      document.aliasSearchForm.onsubmit = () => {
        $("#search-button").prop("disabled", true);
        $("#result-container").addClass("d-none");
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        document.hideAllAlerts();
        (async () => {
          try {
            // Set environment
            let environment = document.featureEnvironment();
            let client =  document.secretNetworkClient(environment);
            let contractAddress = document.featureContractAddress(environment);
            let search_type = document.aliasSearchForm.searchType.value;
            let search_value = document.aliasSearchForm.searchValue.value;
            let search_params = { search_type: search_type, search_value: search_value };
            let result = await client.queryContractSmart(contractAddress, { search: search_params })
            $("#result-value").removeClass("d-none");
            // $("#result-value").html(document.prettyPrintJSON(result));
            let url = 'https://secretnodes.com/secret/chains/' + document.secretNetworkChainId(environment) + '/accounts/' + result['attributes']['address']
            let resultValueHtml = '<h3 class="mb-0">' + result['attributes']['alias'] + '</h3><a class="mb-3 d-block" target="_blank" rel="noopener" href="' + url + '">' + result['attributes']['address'] + '</a><img class="w-100" src="' + result['attributes']['avatar_url'] + '">'
            $("#result-value").html(resultValueHtml)
          }
          catch(err) {
            let errorDisplayMessage = err;
            if (err.message.includes('not_found')) {
              errorDisplayMessage = 'Alias not found'
            }
            document.showAlertDanger(errorDisplayMessage)
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
