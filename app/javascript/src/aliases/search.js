$(document).ready(function(){
  if($("#aliases-search").length) {
    window.onload = async () => {
      const { CosmWasmClient } = require('secretjs');
      // var chainId = 'holodeck-2';
      const client = new CosmWasmClient("https://bootstrap.secrettestnet.io")
      const contracts = await client.getContracts(28101)
      const contractAddress = contracts[0].address

      // Keplr extension injects the offline signer that is compatible with cosmJS.
      // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
      // And it also injects the helper function to `window.keplr`.
      // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
      if (!window.getOfflineSigner || !window.keplr) {
        alert("Please install keplr extension");
      }

      $("#search-button").prop("disabled", false);

      document.aliasSearchForm.onsubmit = () => {
        $("#search-button").prop("disabled", true);
        $("#result").addClass("d-none");
        document.hideAllAlerts();
        (async () => {
          try {
            let alias = document.aliasSearchForm.alias.value;
            let result = await client.queryContractSmart(contractAddress, { "show": { "alias_string": alias }})
            $("#result").removeClass("d-none");
            $("#human-address").text(result.alias.human_address)
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
            $("#search-button").prop("disabled", false);
          }
        })();

        return false;
      };
    }
  };
});
