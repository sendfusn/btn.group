$(document).ready(function(){
  if($("#aliases-search").length) {
    window.onload = async () => {
      const customFees = {
        upload: {
          amount: [{ amount: '2000000', denom: 'uscrt' }],
          gas: '2000000',
        },
        init: {
          amount: [{ amount: '500000', denom: 'uscrt' }],
          gas: '500000',
        },
        exec: {
          amount: [{ amount: '500000', denom: 'uscrt' }],
          gas: '500000',
        },
        send: {
          amount: [{ amount: '80000', denom: 'uscrt' }],
          gas: '80000',
        },
      };

      require('dotenv').config();
      const {
        EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey,
      } = require('secretjs');
      const httpUrl = `https://secret-2--lcd--full.datahub.figment.io/apikey/${API_KEY}/`;

      // 1. Initialize client
      const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();

      const client = new SigningCosmWasmClient(
        httpUrl,
        accAddress,
        (signBytes) => signingPen.sign(signBytes),
        txEncryptionSeed, customFees,
      );
      var contractAddress = 'secret1zm55tcme6epjl4jt30v05gh9xetyp9e3vvv6nr'

      // Load environment variables


      // Keplr extension injects the offline signer that is compatible with cosmJS.
      // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
      // And it also injects the helper function to `window.keplr`.
      // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
      if (!window.getOfflineSigner || !window.keplr) {
        alert("Please install keplr extension");
      }

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
            console.log(contractAddress)
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
