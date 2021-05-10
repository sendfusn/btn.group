$(document).ready(function(){
  if($("#aliases-search").length) {
    window.onload = async () => {
      const {
        CosmWasmClient,
      } = require('secretjs');
      const httpUrl = '/datahub';
      const client = new CosmWasmClient(httpUrl);
      const contractAddress = 'secret17fkl85nexfne274s578rsuatm62j96lvgmfs7u'
      // Load environment variables

      $("#search-button").prop("disabled", false);
      $("#loading").addClass("d-none")
      $("#ready").removeClass("d-none")

      document.aliasSearchForm.onsubmit = () => {
        $("#search-button").prop("disabled", true);
        $("#result").addClass("d-none");
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        document.hideAllAlerts();
        (async () => {
          try {
            let alias = document.aliasSearchForm.alias.value;
            let result = await client.queryContractSmart(contractAddress, { show: { alias_string: alias }})
            $("#result").removeClass("d-none");
            $("#human-address").text(result.alias.human_address)
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
