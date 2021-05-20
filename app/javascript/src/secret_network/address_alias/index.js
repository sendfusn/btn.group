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
            let contractAddress;
            let environment;
            if (true == document.aliasSearchForm.production.checked) {
              environment = 'production'
            } else {
              environment = 'staging'
            }            
            let client =  document.secretNetworkClient(environment);
            if (environment == 'staging') {
              contractAddress = 'secret1ghzaz67v647drlghd6m8njgl5lhavcwkal97ju'
            } else {
              contractAddress = 'secret17fkl85nexfne274s578rsuatm62j96lvgmfs7u'
            };
            let search_type = document.aliasSearchForm.searchType.value;
            let search_value = document.aliasSearchForm.searchValue.value;
            let search_params = { search_type: search_type, search_value: search_value };
            let result = await client.queryContractSmart(contractAddress, { search: search_params })
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
