$(document).ready(function(){
  if($("#secret-network-buttcoin-index").length) {
    const {
      SigningCosmWasmClient,
    } = require('secretjs');

    window.onload = async () => {
      // Events
      $sefiBalance = $('#sefi-balance')
      $sefiBalance.click(function(e) {
        $('#sefi-input').val($sefiBalance.text())
      })

      // Contracts
      this.buttcoinContractAddress = 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt';
      this.sefiContractAddress = 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt';
      this.tokenSaleContractAddress = 'secret1j6fpcsxp2ts9d8rsh3uj9srvdh0vvg4ewe7tsa';
      this.environment = 'production'
      this.chainId = document.secretNetworkChainId(this.environment)
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)

      document.buttcoinSwapForm.onsubmit = async (e) => {
        e.preventDefault()
        $("#swap-button").prop("disabled", true);
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        try {
          let sefiToSwap = document.buttcoinSwapForm.sefi.value;
          let handleMsg = { send: { amount: (sefiToSwap * 1000_000).toString(), recipient: this.tokenSaleContractAddress, msg: '' } }
          let response = await this.client.execute(this.sefiContractAddress, handleMsg)
          document.showAlertSuccess("Swap successful");
          document.buttcoinSwapForm.sefi.value = ''
          this.updateUserInterface()
        }
        catch(err) {
          let errorDisplayMessage = err;
          document.showAlertDanger(errorDisplayMessage)
        }
        finally {
          $("#swap-button").prop("disabled", false);
          $("#loading").addClass("d-none")
          $("#ready").removeClass("d-none")
        }
      };

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

              // Suggest to add Buttcoin to Keplr wallet
              await window.keplr.suggestToken(this.chainId, this.buttcoinContractAddress);

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
            } else {
              throw "Please use the recent version of keplr extension";
            }
          }
          $('#connect-wallet-form').addClass('d-none')
          $('#buttcoin-swap-form').removeClass('d-none')
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

      this.updateUserInterface = async () => {
        try {
          let client =  document.secretNetworkClient(this.environment);
          let tokenSaleContractConfig = await client.queryContractSmart(this.tokenSaleContractAddress, { config: {} })
          let totalRaised = parseFloat(tokenSaleContractConfig['total_raised']) / 1000000
          $('#total-raised').text(totalRaised.toLocaleString() + '/3,000,000')
          let percentageSwapped = Math.round(totalRaised / 3_000_000 * 100)
          $('#percentage-swapped').text(percentageSwapped + '%')
          $('#swap-progress-percent').attr("data-percent", percentageSwapped);
          $('#swap-progress-percent').attr("style", 'width: ' + percentageSwapped + '%;');
          // Get and set SEFI balance
          let sefiViewingKey = await window.keplr.getSecret20ViewingKey(this.chainId, this.sefiContractAddress)
          let sefiBalance = await client.queryContractSmart(this.sefiContractAddress, { balance: { address: this.address, key: sefiViewingKey } })
          $('#sefi-balance').text((sefiBalance['balance']['amount'] / 1_000_000))
        } catch(err) {
          let errorDisplayMessage = err;
          document.showAlertDanger(errorDisplayMessage)     
        }
      }

      this.updateUserInterface()
      $('#connect-wallet-form').submit()
    }
  };
});
