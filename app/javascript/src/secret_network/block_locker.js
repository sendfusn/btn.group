$(document).ready(function(){
  if($("#secret-network-block-locker").length) {
    window.onload = async () => {
      document.activateKeplr()
      this.address;
      this.buttcoinAddress = 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt';
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.contractAddress = document.featureContractAddress(this.environment);
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.keplrOfflineSigner;

      $(document).on('keplr_connected', async(evt) => {
        let accounts = await window.keplrOfflineSigner.getAccounts()
        this.address = accounts[0].address;
        document.blockLockerViewWhenLockedForm.walletAddress.value = this.address
      })

      this.disableForm = function() {
        $(".submit-button").prop("disabled", true);
        $("#result-container").addClass("d-none");
        $(".loading").removeClass("d-none")
        $(".ready").addClass("d-none")
        document.hideAllAlerts();
      }

      this.enableForm = function() {
        $(".submit-button").prop("disabled", false);
        $(".loading").addClass("d-none")
        $(".ready").removeClass("d-none")
      }

      document.blockLockerCreateOrUpdateForm.onsubmit = async (e) => {
        e.preventDefault()
        this.disableForm()
        let handleMsg;
        try {
          if (!window.getOfflineSigner || !window.keplr) {
            throw("Please install keplr extension")
          } else {
            if (window.keplr.experimentalSuggestChain) {
              // This method will ask the user whether or not to allow access if they haven't visited this website.
              // Also, it will request user to unlock the wallet if the wallet is locked.
              // If you don't request enabling before usage, there is no guarantee that other methods will work.
              await window.keplr.enable(this.chainId);
            } else {
              throw("Please use the recent version of keplr extension")
            }
          }
          let contractAddressToExecute = this.buttcoinAddress;
          let content = undefined;
          let passphrase = undefined;
          let resultText = "";
          let whitelistedAddresses = undefined;
          if (document.blockLockerCreateOrUpdateForm.content.value.length > 0) {
            content = document.blockLockerCreateOrUpdateForm.content.value
          }
          if (document.blockLockerCreateOrUpdateForm.passphrase.value.length > 0) {
            passphrase = document.blockLockerCreateOrUpdateForm.passphrase.value
          }
          if (document.blockLockerCreateOrUpdateForm.whitelistedAddress1.value.length > 0 || document.blockLockerCreateOrUpdateForm.whitelistedAddress2.value.length > 0 || document.blockLockerCreateOrUpdateForm.whitelistedAddress3.value.length > 0) {
            whitelistedAddresses = []
            if (document.blockLockerCreateOrUpdateForm.whitelistedAddress1.value.length) {
              whitelistedAddresses.push(document.blockLockerCreateOrUpdateForm.whitelistedAddress1.value)
            }
            if (document.blockLockerCreateOrUpdateForm.whitelistedAddress2.value.length) {
              whitelistedAddresses.push(document.blockLockerCreateOrUpdateForm.whitelistedAddress2.value)
            }
            if (document.blockLockerCreateOrUpdateForm.whitelistedAddress3.value.length) {
              whitelistedAddresses.push(document.blockLockerCreateOrUpdateForm.whitelistedAddress3.value)
            }
          }
          handleMsg = { send: { amount: "1000000", recipient: this.contractAddress, msg: Buffer.from(JSON.stringify({ create_or_update_locker: { content: content, passphrase: passphrase, whitelisted_addresses: whitelistedAddresses } })).toString('base64') } };
          let gasParams = {
              exec: {
                amount: [{ amount: '200000', denom: 'uscrt' }],
                gas: '200000',
              },
            }
          this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
          resultText = "Locker updated."
          await this.client.execute(contractAddressToExecute, handleMsg)
          document.showAlertSuccess(resultText)
          $(e.target)[0].reset()
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          this.enableForm()
        }
      };

      document.blockLockerUnlockForm.onsubmit = async (e) => {
        e.preventDefault()
        this.disableForm()
        let handleMsg;
        try {
          if (!window.getOfflineSigner || !window.keplr) {
            throw("Please install keplr extension")
          } else {
            if (window.keplr.experimentalSuggestChain) {
              // This method will ask the user whether or not to allow access if they haven't visited this website.
              // Also, it will request user to unlock the wallet if the wallet is locked.
              // If you don't request enabling before usage, there is no guarantee that other methods will work.
              await window.keplr.enable(this.chainId);
            } else {
              throw("Please use the recent version of keplr extension")
            }
          }
          let contractAddressToExecute = this.buttcoinAddress;
          let resultText = "";
          confirm("Are you sure you want to unlock? Once unlocked, the current contents of the locker can be accessed with only the passphrase forever.")
          handleMsg = { send: { amount: "1000000", recipient: this.contractAddress, msg: Buffer.from(JSON.stringify({ unlock_locker: { address: document.blockLockerUnlockForm.walletAddress.value } })).toString('base64') } };
          let gasParams = {
              exec: {
                amount: [{ amount: '100000', denom: 'uscrt' }],
                gas: '100000',
              },
            }
          this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
          resultText = "If the locker exists and you're allowed to unlock it, it will be unlocked."
          await this.client.execute(contractAddressToExecute, handleMsg)
          document.showAlertSuccess(resultText)
          $(e.target)[0].reset()
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          this.enableForm()
        }
      };

      document.blockLockerViewWhenLockedForm.onsubmit = async (e) => {
        e.preventDefault()
        this.disableForm()
        let handleMsg;
        let result;
        try {
          if (!window.getOfflineSigner || !window.keplr) {
            throw("Please install keplr extension")
          } else {
            if (window.keplr.experimentalSuggestChain) {
              // This method will ask the user whether or not to allow access if they haven't visited this website.
              // Also, it will request user to unlock the wallet if the wallet is locked.
              // If you don't request enabling before usage, there is no guarantee that other methods will work.
              await window.keplr.enable(this.chainId);
            } else {
              throw("Please use the recent version of keplr extension")
            }
          }
          let contractAddressToExecute = this.buttcoinAddress;
          let resultText = "";
          contractAddressToExecute = this.contractAddress;
          handleMsg = { get_user_locker: {} };
          let gasParams = {
              exec: {
                amount: [{ amount: '37500', denom: 'uscrt' }],
                gas: '37500',
              },
            }
          this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
          result = await this.client.execute(contractAddressToExecute, handleMsg)
          result['data'].forEach(function(x){ resultText += String.fromCharCode(x) })
          result = JSON.parse(resultText)
          // Display results
          $("#result-value").html(document.prettyPrintJSON(result));
          $("#result-container").removeClass("d-none");
          $('html, body').animate({
              scrollTop: $("#result-container").offset().top
          }, 2000);
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          this.enableForm()
        }
      };

      document.blockLockerViewWhenUnlockedForm.onsubmit = async (e) => {
        e.preventDefault()
        this.disableForm()
        let handleMsg;
        let result;
        try {
          handleMsg = { user_locker: { address: document.blockLockerViewWhenUnlockedForm.walletAddress.value, passphrase: document.blockLockerViewWhenUnlockedForm.passphrase.value } };
          result = await this.client.queryContractSmart(this.contractAddress, handleMsg)
          // Display results
          $("#result-value").html(document.prettyPrintJSON(result));
          $("#result-container").removeClass("d-none");
          $('html, body').animate({
              scrollTop: $("#result-container").offset().top
          }, 2000);
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          this.enableForm()
        }
      };
    }
  };
});
