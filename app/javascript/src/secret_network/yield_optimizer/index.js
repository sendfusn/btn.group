$(document).ready(function(){
  if($("#secret-network-yield-optimizer").length) {
    const {
      SigningCosmWasmClient,
    } = require('secretjs');

    window.onload = async () => {
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.profitDistributorAddress = 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz';

      document.connectWalletForm.onsubmit = async (e) => {
        e.preventDefault()
        $("#connect-wallet-button").prop("disabled", true);
        $("#connect-wallet-button-loading").removeClass("d-none")
        $("#connect-wallet-button-ready").addClass("d-none")

        try {
          // Keplr extension injects the offline signer that is compatible with cosmJS.
          // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
          // And it also injects the helper function to `window.keplr`.
          // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
          if (!window.getOfflineSigner || !window.keplr) {
            throw "Please install keplr extension";
          } else {
            if (window.keplr.experimentalSuggestChain) {
              // This method will ask the user whether or not to allow access if they haven't visited this website.
              // Also, it will request user to unlock the wallet if the wallet is locked.
              // If you don't request enabling before usage, there is no guarantee that other methods will work.
              await window.keplr.enable(this.chainId);

              // @ts-ignore
              const keplrOfflineSigner = window.getOfflineSigner(this.chainId);
              const accounts = await keplrOfflineSigner.getAccounts();
              this.address = accounts[0].address;
              this.client = new SigningCosmWasmClient(
                this.httpUrl,
                this.address,
                keplrOfflineSigner,
                window.getEnigmaUtils(this.chainId),
                {
                  exec: {
                    amount: [{ amount: '500000', denom: 'uscrt' }],
                    gas: '500000',
                  },
                },
              );
              this.account = await this.client.getAccount(this.address);
              // this.updateUserBalances()
            } else {
              throw "Please use the recent version of keplr extension";
            }
          }
          $('#connect-wallet-form').addClass('d-none')
        }
        catch(err) {
          let errorDisplayMessage = err;
          document.showAlertDanger(errorDisplayMessage)
        }
        finally {
          $("#connect-wallet-button").prop("disabled", false);
          $("#connect-wallet-button-ready").removeClass("d-none")
          $("#connect-wallet-button-loading").addClass("d-none")
        }
      };

      // Query profit distributor
      // result = await this.client.queryContractSmart(contractAddress, msg);
      $('#connect-wallet-form').submit()
    }
  };
});
