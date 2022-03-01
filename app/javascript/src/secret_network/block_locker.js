$(document).ready(function(){
  if($("#secret-network-block-locker").length) {
    this.blockLockerContractAddress = 'secret1dww8fs5xlj6es5vwyp7ccgm4xclkmhxajxfaqa';
    this.blockLockerContractDataHash = '9EF097E81EAB5AEC8594F8860AE47ED859FB6363C836F63BF02F01BE58343D36'

    // === LISTENERS ===
    $(document).on('keplr_connected', async(evt) => {
      document.blockLockerViewWhenLockedForm.walletAddress.value = document.secretNetwork.walletAddress
    })

    // === FUNCTIONS ===
    this.gasCreateOrUpdate = function(){
      return String(200_000 * document.secretNetwork.gasAndDelayFactor)
    }
    this.gasUnlock = function() {
      return String(100_000 * document.secretNetwork.gasAndDelayFactor)
    }
    this.gasViewWhenLocked = function() {
      return String(37_500 * document.secretNetwork.gasAndDelayFactor)
    }

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
      try {
        await document.connectKeplrWallet()
        if (document.secretNetwork.walletAddress) {
          let content = undefined;
          let passphrase = undefined;
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
              whitelistedAddresses.push(document.blockLockerCreateOrUpdateForm.whitelistedAddress1.value.toLowerCase())
            }
            if (document.blockLockerCreateOrUpdateForm.whitelistedAddress2.value.length) {
              whitelistedAddresses.push(document.blockLockerCreateOrUpdateForm.whitelistedAddress2.value.toLowerCase())
            }
            if (document.blockLockerCreateOrUpdateForm.whitelistedAddress3.value.length) {
              whitelistedAddresses.push(document.blockLockerCreateOrUpdateForm.whitelistedAddress3.value.toLowerCase())
            }
            if (whitelistedAddresses.includes(document.secretNetwork.walletAddress.toLowerCase())) {
              throw('Recovery address must be different to wallet address.')
            }
          }
          let handleMsg = { send: { amount: "1000000", recipient: this.blockLockerContractAddress, msg: Buffer.from(JSON.stringify({ create_or_update_locker: { content: content, passphrase: passphrase, whitelisted_addresses: whitelistedAddresses } })).toString('base64') } };
          let params = {
            sender: document.secretNetwork.walletAddress,
            contract: document.secretNetwork.butt.address,
            codeHash: document.secretNetwork.butt.dataHash, // optional but way faster
            msg: handleMsg,
            sentFunds: [], // optional
          }
          await document.secretNetwork.executeContract(params, this.gasCreateOrUpdate())
          document.showAlertSuccess("Locker updated.")
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
      try {
        await document.connectKeplrWallet()
        if (document.secretNetwork.walletAddress) {
          let resultText = "If the locker exists and you're allowed to unlock it, it will be unlocked.";
          confirm("Are you sure you want to unlock? Once unlocked, the current contents of the locker can be accessed with only the passphrase forever.")
          let handleMsg = { send: { amount: "1000000", recipient: this.blockLockerContractAddress, msg: Buffer.from(JSON.stringify({ unlock_locker: { address: document.blockLockerUnlockForm.walletAddress.value } })).toString('base64') } };
          let params = {
            sender: document.secretNetwork.walletAddress,
            contract: document.secretNetwork.butt.address,
            codeHash: document.secretNetwork.butt.dataHash,
            msg: handleMsg,
            sentFunds: [],
          }
          await document.secretNetwork.executeContract(params, this.gasUnlock())
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
      try {
        await document.connectKeplrWallet()
        if (document.secretNetwork.walletAddress) {
          let handleMsg = { get_user_locker: {} };
          let params = {
            sender: document.secretNetwork.walletAddress,
            contract: this.blockLockerContractAddress,
            codeHash: this.blockLockerContractDataHash,
            msg: handleMsg,
            sentFunds: [],
          }
          let result = await document.secretNetwork.executeContract(params, this.gasViewWhenLocked())
          let resultText = "";
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
      try {
        let handleMsg = { user_locker: { address: document.blockLockerViewWhenUnlockedForm.walletAddress.value, passphrase: document.blockLockerViewWhenUnlockedForm.passphrase.value } };
        let queryParams = {
          address: this.blockLockerContractAddress,
          codeHash: this.blockLockerContractDataHash,
          query: handleMsg
        }
        let result = await document.secretNetwork.queryContractSmart(queryParams)
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
  };
});
