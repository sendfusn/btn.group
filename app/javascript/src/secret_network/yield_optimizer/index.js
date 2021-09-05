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
      this.buttContractAddress = 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt';
      this.profitDistributorAddress = 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz';
      this.sefiContractAddress = 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt';
      this.$buttWalletBalance = $('.butt-wallet-balance');
      this.$sefiWalletBalance = $('.sefi-wallet-balance');
      this.$buttWalletBalanceViewButton = $('.butt-wallet-balance-view-button');
      this.$sefiWalletBalanceViewButton = $('.sefi-wallet-balance-view-button');
      this.$profitDistributorTotalShares = $('.profit-distributor-total-shares');
      this.$profitDistributorUserClaimableProfit = $('.profit-distributor-claimable-profit');
      this.$profitDistributorUserShares = $('.profit-distributor-user-shares');

      // Listeners
      document.querySelector('#profit-distributor-collapse .butt-wallet-balance').addEventListener('click', (evt) => {
        $('#profit-distributor-deposit-input').val($('#profit-distributor-collapse .butt-wallet-balance').text().split(' ')[0])
      })
      document.querySelector('.butt-wallet-balance-view-button').addEventListener('click', async (evt) => {
        this.$buttWalletBalanceViewButton.prop("disabled", true);
        this.$buttWalletBalanceViewButton.find('.loading').removeClass('d-none')
        this.$buttWalletBalanceViewButton.find('.ready').addClass('d-none')
        try {
          await window.keplr.suggestToken(this.chainId, this.buttContractAddress);
          this.updateUserInterface();
          $(".butt-wallet-balance-loading").removeClass('d-none')
          this.$buttWalletBalanceViewButton.addClass('d-none')
        } catch(err) {
          let errorDisplayMessage = err;
          document.showAlertDanger(errorDisplayMessage)          
        } finally {
          // Show ready ui
          this.$buttWalletBalanceViewButton.prop("disabled", false);
          this.$buttWalletBalanceViewButton.find('.loading').addClass('d-none')
          this.$buttWalletBalanceViewButton.find('.ready').removeClass('d-none')
        }
      })
      document.querySelector('.sefi-wallet-balance-view-button').addEventListener('click', async (evt) => {
        this.$sefiWalletBalanceViewButton.prop("disabled", true);
        this.$sefiWalletBalanceViewButton.find('.loading').removeClass('d-none')
        this.$sefiWalletBalanceViewButton.find('.ready').addClass('d-none')
        try {
          await window.keplr.suggestToken(this.chainId, this.sefiContractAddress);
          this.updateUserInterface();
          $(".sefi-wallet-balance-loading").removeClass('d-none')
          this.$sefiWalletBalanceViewButton.addClass('d-none')
        } catch(err) {
          let errorDisplayMessage = err;
          document.showAlertDanger(errorDisplayMessage)          
        } finally {
          // Show ready ui
          this.$sefiWalletBalanceViewButton.prop("disabled", false);
          this.$sefiWalletBalanceViewButton.find('.loading').addClass('d-none')
          this.$sefiWalletBalanceViewButton.find('.ready').removeClass('d-none')
        }
      })

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
              this.updateUserInterface()
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

      document.profitDistributorDepositForm.onsubmit = async (e) => {
        e.preventDefault()
        $("#profit-distributor-deposit-button").prop("disabled", true);
        $("#profit-distributor-deposit-button-loading").removeClass("d-none")
        $("#profit-distributor-deposit-button-ready").addClass("d-none")
        try {
          let amount = document.profitDistributorDepositForm.amount.value;
          let handleMsg = { send: { amount: (amount * 1_000_000).toString(), recipient: this.profitDistributorAddress, msg: 'eyAiZGVwb3NpdF9idXR0Y29pbiI6IHt9IH0=' } }
          let response = await this.client.execute(this.buttContractAddress, handleMsg)
          document.showAlertSuccess("Deposit successful");
          document.profitDistributorDepositForm.amount.value = ''
          this.updateUserInterface()
        }
        catch(err) {
          let errorDisplayMessage = err;
          document.showAlertDanger(errorDisplayMessage)
        }
        finally {
          $("#profit-distributor-deposit-button").prop("disabled", false);
          $("#profit-distributor-deposit-button-loading").addClass("d-none")
          $("#profit-distributor-deposit-button-ready").removeClass("d-none")
        }
      };

      this.updateUserInterface = async () => {
        let client =  document.secretNetworkClient(this.environment);

        // User SEFI wallet balance
        try {
          let sefiViewingKey = await window.keplr.getSecret20ViewingKey(this.chainId, this.sefiContractAddress)
          // If they have the sefiViewingKey, replace the button with the balance
          let sefiBalance = await client.queryContractSmart(this.sefiContractAddress, { balance: { address: this.address, key: sefiViewingKey } })
          this.$sefiWalletBalance.text((sefiBalance['balance']['amount'] / 1_000_000) + ' SEFI')
          this.$sefiWalletBalance.removeClass('d-none')
          this.$sefiWalletBalanceViewButton.addClass('d-none')
        } catch(err) {
          console.log(err)
          // If they don't have a viewing key, show the view balance button and hide the balance
          this.$sefiWalletBalance.addClass('d-none')
          this.$sefiWalletBalanceViewButton.removeClass('d-none')
        } finally {
          $('.sefi-wallet-balance-loading').addClass('d-none')
          $('.sefi-wallet-balance-link').removeClass('d-none')
        }

        // User BUTT wallet balance
        try {
          this.$profitDistributorTotalShares.text('Loading...')
          let buttViewingKey = await window.keplr.getSecret20ViewingKey(this.chainId, this.buttContractAddress)
          // If they have the buttViewingKey, replace the button with the balance
          let buttBalance = await client.queryContractSmart(this.buttContractAddress, { balance: { address: this.address, key: buttViewingKey } })
          this.$buttWalletBalance.text((buttBalance['balance']['amount'] / 1_000_000) + ' BUTT')
          this.$buttWalletBalance.removeClass('d-none')
          this.$buttWalletBalanceViewButton.addClass('d-none')
        } catch(err) {
          console.log(err)
          // If they don't have a viewing key, show the view balance button and hide the balance
          this.$buttWalletBalance.addClass('d-none')
          this.$buttWalletBalanceViewButton.removeClass('d-none')
        } finally {
          $('.butt-wallet-balance-loading').addClass('d-none')
          $('.butt-wallet-balance-link').removeClass('d-none')
        }

        // Total shares from profit distributor
        try {
          let config = await client.queryContractSmart(this.profitDistributorAddress, {config: {}})
          this.$profitDistributorTotalShares.text((config['config']['total_shares'] / 1_000_000) + ' BUTT')
        } catch(err) {
          console.log(err)
        }

        // User details from profit distributor
        try {
          this.$profitDistributorUserShares.text('Loading...');
          let user = await client.queryContractSmart(this.profitDistributorAddress, {user: { user_address: this.address}})
          this.$profitDistributorUserShares.text((user['user']['shares'] / 1_000_000) + ' BUTT')
        } catch(err) {
          this.$profitDistributorUserShares.text('0 BUTT');
          console.log(err)
        }

        // User claimable profit from profit distributor
        try {
          this.$profitDistributorUserClaimableProfit.text('Loading...');
          let user = await client.queryContractSmart(this.profitDistributorAddress, {claimable_profit: { user_address: this.address}})
          this.$profitDistributorUserClaimableProfit.text((user['user']['shares'] / 1_000_000) + ' SEFI')
        } catch(err) {
          this.$profitDistributorUserClaimableProfit.text('0 SEFI');
          console.log(err)
        }
      }

      // Query profit distributor
      $('#connect-wallet-form').submit()
    }
  };
});
