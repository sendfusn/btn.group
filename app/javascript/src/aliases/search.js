window.onload = async () => {
  if($("#aliases-search").length) {
    const { CosmWasmClient } = require('secretjs');
    // var chainId = 'holodeck-2';
    const client = new CosmWasmClient("https://bootstrap.secrettestnet.io")
    const contracts = await client.getContracts(28039)
    const contractAddress = contracts[0].address

    // Keplr extension injects the offline signer that is compatible with cosmJS.
    // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
    // And it also injects the helper function to `window.keplr`.
    // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
    if (!window.getOfflineSigner || !window.keplr) {
      alert("Please install keplr extension");
    }

    document.aliasSearchForm.onsubmit = () => {
      $("#search-button").prop("disabled", true);
      $("#result").addClass("d-none");
      $("#alert-danger").addClass("d-none");
      (async () => {
        try {
          let alias = document.aliasSearchForm.alias.value;
          let result = await client.queryContractSmart(contractAddress, { "show": { "alias_string": alias }})
          $("#result").removeClass("d-none");
          $("#human-address").text(result.alias.human_address)
        }
        catch(err) {
          $("#alert-danger").removeClass("d-none")
          $("#alert-danger").text(err)
        }
        finally {
          $("#search-button").prop("disabled", false);
        }
      })();

      return false;
    };
  }
};
