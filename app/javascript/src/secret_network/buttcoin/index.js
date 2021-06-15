$(document).ready(function(){
  if($("#secret-network-buttcoin-index").length) {
    const {
      SigningCosmWasmClient,
    } = require('secretjs');

    window.onload = async () => {
      // Contracts
      this.buttContractAddress = 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt';
      this.sefiContractAddress = 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt';
      this.tokenSaleContractAddress = 'secret1j6fpcsxp2ts9d8rsh3uj9srvdh0vvg4ewe7tsa';
      this.environment = 'production'
      this.chainId = document.secretNetworkChainId(this.environment)
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.$sefiBalance = $('#sefi-balance')
      this.$buttBalanceViewButton = $('#butt-balance-view-button')
      this.$sefiBalanceViewButton = $('#sefi-balance-view-button')

      // Listeners
      document.querySelector('#sefi-balance').addEventListener('click', (evt) => {
        $('#sefi-input').val(this.$sefiBalance.text())
      })
      document.querySelector('#butt-balance-view-button').addEventListener('click', async (evt) => {
        let $target = $('#butt-balance-view-button')
        $target.prop("disabled", true);
        $target.find('.loading').removeClass('d-none')
        $target.find('.ready').addClass('d-none')
        try {
          await window.keplr.suggestToken(this.chainId, this.buttContractAddress);
          this.updateUserBalances();
          $("#butt-balance-loading").removeClass('d-none')
          $target.addClass('d-none')
        } catch(err) {
          let errorDisplayMessage = err;
          document.showAlertDanger(errorDisplayMessage)          
        } finally {
          // Show ready ui
          $target.prop("disabled", false);
          $target.find('.loading').addClass('d-none')
          $target.find('.ready').removeClass('d-none')
        }
      })
      document.querySelector('#sefi-balance-view-button').addEventListener('click', async (evt) => {
        let $target = $('#sefi-balance-view-button')
        $target.prop("disabled", true);
        $target.find('.loading').removeClass('d-none')
        $target.find('.ready').addClass('d-none')
        try {
          await window.keplr.suggestToken(this.chainId, this.sefiContractAddress);
          this.updateUserBalances();
          $("#sefi-balance-loading").removeClass('d-none')
          $target.addClass('d-none')
        } catch(err) {
          let errorDisplayMessage = err;
          document.showAlertDanger(errorDisplayMessage)          
        } finally {
          // Show ready ui
          $target.prop("disabled", false);
          $target.find('.loading').addClass('d-none')
          $target.find('.ready').removeClass('d-none')
        }
      })

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
              this.updateUserBalances()
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

      this.updateUserBalances = async () => {
        let client =  document.secretNetworkClient(this.environment);

        // Check if user has a viewing key for SEFI
        try {
          let sefiViewingKey = await window.keplr.getSecret20ViewingKey(this.chainId, this.sefiContractAddress)
          // If they have the sefiViewingKey, replace the button with the balance
          let sefiBalance = await client.queryContractSmart(this.sefiContractAddress, { balance: { address: this.address, key: sefiViewingKey } })
          this.$sefiBalance.text((sefiBalance['balance']['amount'] / 1_000_000))
          this.$sefiBalance.removeClass('d-none')
          this.$sefiBalanceViewButton.addClass('d-none')
        } catch(err) {
          console.log(err)
          // If they don't have a viewing key, show the view balance button and hide the balance
          this.$sefiBalance.addClass('d-none')
          this.$sefiBalanceViewButton.removeClass('d-none')
        } finally {
          $('#sefi-balance-loading').addClass('d-none')
          $('#sefi-balance-link').removeClass('d-none')
        }

        // Check if user has a viewing key for BUTT
        try {
          let buttViewingKey = await window.keplr.getSecret20ViewingKey(this.chainId, this.buttContractAddress)
          // If they have the buttViewingKey, replace the button with the balance
          let buttBalance = await client.queryContractSmart(this.buttContractAddress, { balance: { address: this.address, key: buttViewingKey } })
          $('#butt-balance').text((buttBalance['balance']['amount'] / 1_000_000))
          $('#butt-balance').removeClass('d-none')
          this.$buttBalanceViewButton.addClass('d-none')
        } catch(err) {
          console.log(err)
          // If they don't have a viewing key, show the view balance button and hide the balance
          $('#butt-balance').addClass('d-none')
          this.$buttBalanceViewButton.removeClass('d-none')
        } finally {
          $('#butt-balance-loading').addClass('d-none')
        }
      }

      this.updateUserInterface = async () => {
        let client =  document.secretNetworkClient(this.environment);

        try {
          let tokenSaleContractConfig = await client.queryContractSmart(this.tokenSaleContractAddress, { config: {} })
          let totalRaised = parseFloat(tokenSaleContractConfig['total_raised']) / 1000000
          $('#total-raised').text(totalRaised.toLocaleString() + '/3,000,000')
          let percentageSwapped = Math.round(totalRaised / 3_000_000 * 100)
          $('#percentage-swapped').text(percentageSwapped + '%')
          $('#swap-progress-percent').attr("data-percent", percentageSwapped);
          $('#swap-progress-percent').attr("style", 'width: ' + percentageSwapped + '%;');
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
