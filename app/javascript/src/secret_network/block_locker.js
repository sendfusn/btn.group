$(document).ready(function(){
  if($("#secret-network-block-locker").length) {
    window.onload = async () => {
      this.blockLockerContractAddress = 'secret1dww8fs5xlj6es5vwyp7ccgm4xclkmhxajxfaqa';
      this.blockLockerContractDataHash = '9EF097E81EAB5AEC8594F8860AE47ED859FB6363C836F63BF02F01BE58343D36'
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
          await document.connectKeplrWallet()
          if (document.secretNetwork.walletAddress) {
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
            handleMsg = { send: { amount: "1000000", recipient: this.blockLockerContractAddress, msg: Buffer.from(JSON.stringify({ create_or_update_locker: { content: content, passphrase: passphrase, whitelisted_addresses: whitelistedAddresses } })).toString('base64') } };
            let gasParams = {
              exec: {
                amount: [{ amount: '200000', denom: 'uscrt' }],
                gas: '200000',
              },
            }
            resultText = "Locker updated."
            await document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams).execute(document.secretNetwork.butt.address, handleMsg, '', [], gasParams.exec, document.secretNetwork.butt.dataHash)
            document.showAlertSuccess(resultText)
            $(e.target)[0].reset()
          }
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
          await document.connectKeplrWallet()
          if (document.secretNetwork.walletAddress) {
            let resultText = "";
            confirm("Are you sure you want to unlock? Once unlocked, the current contents of the locker can be accessed with only the passphrase forever.")
            handleMsg = { send: { amount: "1000000", recipient: this.blockLockerContractAddress, msg: Buffer.from(JSON.stringify({ unlock_locker: { address: document.blockLockerUnlockForm.walletAddress.value } })).toString('base64') } };
            let gasParams = {
                exec: {
                  amount: [{ amount: '100000', denom: 'uscrt' }],
                  gas: '100000',
                },
              }
            resultText = "If the locker exists and you're allowed to unlock it, it will be unlocked."
            await document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams).execute(document.secretNetwork.butt.address, handleMsg, '', [], gasParams.exec, document.secretNetwork.butt.dataHash)
            document.showAlertSuccess(resultText)
            $(e.target)[0].reset()
          }
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
          await document.connectKeplrWallet()
          if (document.secretNetwork.walletAddress) {
            let resultText = "";
            handleMsg = { get_user_locker: {} };
            let gasParams = {
                exec: {
                  amount: [{ amount: '37500', denom: 'uscrt' }],
                  gas: '37500',
                },
              }
            result = await document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams).execute(this.blockLockerContractAddress, handleMsg, '', [], gasParams.exec, this.blockLockerContractDataHash)
            result['data'].forEach(function(x){ resultText += String.fromCharCode(x) })
            result = JSON.parse(resultText)
            // Display results
            $("#result-value").html(document.prettyPrintJSON(result));
            $("#result-container").removeClass("d-none");
            $('html, body').animate({
                scrollTop: $("#result-container").offset().top
            }, 2000);
          }
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
          result = await document.secretNetwork.client().queryContractSmart(this.blockLockerContractAddress, handleMsg, undefined, this.blockLockerContractDataHash)
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

      document.activateKeplr()
    }
  };
});
