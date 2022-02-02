$(document).ready(function(){
  if($("#secret-network-block-locker").length) {
    window.onload = async () => {
      document.activateKeplr()
      this.environment = 'production';
      this.contractAddress = document.featureContractAddress(this.environment);
      this.contractDataHash = '9EF097E81EAB5AEC8594F8860AE47ED859FB6363C836F63BF02F01BE58343D36'
      this.keplrOfflineSigner;

      $(document).on('keplr_connected', async(evt) => {
        document.blockLockerViewWhenLockedForm.walletAddress.value = document.secretNetwork.walletAddress
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
              await window.keplr.enable(document.secretNetwork.chainId(this.environment));
            } else {
              throw("Please use the recent version of keplr extension")
            }
          }
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
          this.client = document.secretNetwork.signingClient(this.environment, document.secretNetwork.walletAddress, gasParams)
          resultText = "Locker updated."
          await this.client.execute(document.secretNetwork.butt.address, handleMsg, '', [], gasParams.exec, document.secretNetwork.butt.dataHash)
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
              await window.keplr.enable(document.secretNetwork.chainId(this.environment));
            } else {
              throw("Please use the recent version of keplr extension")
            }
          }
          let resultText = "";
          confirm("Are you sure you want to unlock? Once unlocked, the current contents of the locker can be accessed with only the passphrase forever.")
          handleMsg = { send: { amount: "1000000", recipient: this.contractAddress, msg: Buffer.from(JSON.stringify({ unlock_locker: { address: document.blockLockerUnlockForm.walletAddress.value } })).toString('base64') } };
          let gasParams = {
              exec: {
                amount: [{ amount: '100000', denom: 'uscrt' }],
                gas: '100000',
              },
            }
          this.client = document.secretNetwork.signingClient(this.environment, document.secretNetwork.walletAddress, gasParams)
          resultText = "If the locker exists and you're allowed to unlock it, it will be unlocked."
          await this.client.execute(document.secretNetwork.butt.address, handleMsg, '', [], gasParams.exec, document.secretNetwork.butt.dataHash)
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
              await window.keplr.enable(document.secretNetwork.chainId(this.environment));
            } else {
              throw("Please use the recent version of keplr extension")
            }
          }
          let resultText = "";
          handleMsg = { get_user_locker: {} };
          let gasParams = {
              exec: {
                amount: [{ amount: '37500', denom: 'uscrt' }],
                gas: '37500',
              },
            }
          this.client = document.secretNetwork.signingClient(this.environment, document.secretNetwork.walletAddress, gasParams)
          result = await this.client.execute(this.contractAddress, handleMsg, '', [], gasParams.exec, this.contractDataHash)
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
          result = await document.secretNetwork.client(this.environment).queryContractSmart(this.contractAddress, handleMsg, undefined, this.contractDataHash)
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
