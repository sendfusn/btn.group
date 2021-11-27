$(document).ready(function(){
  if($("#secret-network-block-locker").length) {
    // Listeners
    $('input[type=radio][name=interactionType]').on('change', function() {
      resetInputs();
      var radVal = $(this).val();
      if (radVal == 'handleCreateOrUpdate') {
        $('#content-form-group').removeClass('d-none')
        $('#passphrase-form-group').removeClass('d-none')
        $('#whitelisted-address-1-form-group').removeClass('d-none')
        $('#whitelisted-address-2-form-group').removeClass('d-none')
        $('#whitelisted-address-3-form-group').removeClass('d-none')

        // Wallet address form group
        $('#wallet-address-form-group').addClass('d-none')
      } else if (radVal == 'handleUnlock') {
        $('#content-form-group').addClass('d-none')
        $('#passphrase-form-group').addClass('d-none')
        $('#whitelisted-address-1-form-group').addClass('d-none')
        $('#whitelisted-address-2-form-group').addClass('d-none')
        $('#whitelisted-address-3-form-group').addClass('d-none')

        // Wallet address form group
        $('#wallet-address-form-group').removeClass('d-none')
        $('#wallet-address').prop('disabled', false)
        $('#wallet-address').val("")
      } else if (radVal == 'handleViewLocker') {
        $('#content-form-group').addClass('d-none')
        $('#passphrase-form-group').addClass('d-none')
        $('#whitelisted-address-1-form-group').addClass('d-none')
        $('#whitelisted-address-2-form-group').addClass('d-none')
        $('#whitelisted-address-3-form-group').addClass('d-none')

        // Wallet address form group
        $('#wallet-address-form-group').removeClass('d-none')
        $('#wallet-address').prop('disabled', true)
        $('#wallet-address').val("The wallet you request this from.")
      } else if (radVal == 'queryViewLocker') {
        $('#content-form-group').addClass('d-none')
        $('#passphrase-form-group').removeClass('d-none')
        $('#whitelisted-address-1-form-group').addClass('d-none')
        $('#whitelisted-address-2-form-group').addClass('d-none')
        $('#whitelisted-address-3-form-group').addClass('d-none')

        // Wallet address form group
        $('#wallet-address-form-group').removeClass('d-none')
        $('#wallet-address').prop('disabled', false)
        $('#wallet-address').val("")
      }
    })

    window.onload = async () => {
      this.address;
      this.buttcoinAddress = 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt';
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.contractAddress = document.featureContractAddress(this.environment);
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.keplrOfflineSigner;

      document.blockLockerForm.onsubmit = async (e) => {
        e.preventDefault()
        $("#submit-button").prop("disabled", true);
        $("#result-container").addClass("d-none");
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        let handleMsg;
        let result;
        document.hideAllAlerts();
        try {
          if (document.blockLockerForm.interactionType.value == 'queryViewLocker') {
            handleMsg = { user_locker: { address: document.blockLockerForm.walletAddress.value, passphrase: document.blockLockerForm.passphrase.value } };
            result = await this.client.queryContractSmart(this.contractAddress, handleMsg)
            // Display results
            $("#result-value").removeClass("d-none");
            $("#result-value").html(document.prettyPrintJSON(result));
            $("#result-container").removeClass("d-none");
            $('html, body').animate({
                scrollTop: $("#result-container").offset().top
            }, 2000);
          } else {
            if (!window.getOfflineSigner || !window.keplr) {
              throw("Please install keplr extension")
            } else {
              if (window.keplr.experimentalSuggestChain) {
                // This method will ask the user whether or not to allow access if they haven't visited this website.
                // Also, it will request user to unlock the wallet if the wallet is locked.
                // If you don't request enabling before usage, there is no guarantee that other methods will work.
                await window.keplr.enable(this.chainId);
                this.keplrOfflineSigner = window.getOfflineSigner(this.chainId);
                const accounts = await this.keplrOfflineSigner.getAccounts();
                this.address = accounts[0].address;
              } else {
                throw("Please use the recent version of keplr extension")
              }
            }
            let contractAddressToExecute = this.buttcoinAddress;
            let content = undefined;
            let passphrase = undefined;
            let resultText = "";
            let whitelistedAddresses = undefined;
            if (document.blockLockerForm.interactionType.value == 'handleCreateOrUpdate') {
              if (document.blockLockerForm.content.value.length > 0) {
                content = document.blockLockerForm.content.value
              }
              if (document.blockLockerForm.passphrase.value.length > 0) {
                passphrase = document.blockLockerForm.passphrase.value
              }
              if (document.blockLockerForm.whitelistedAddress1.value.length > 0 || document.blockLockerForm.whitelistedAddress2.value.length > 0 || document.blockLockerForm.whitelistedAddress3.value.length > 0) {
                whitelistedAddresses = []
                if (document.blockLockerForm.whitelistedAddress1.value.length) {
                  whitelistedAddresses.push(document.blockLockerForm.whitelistedAddress1.value)
                }
                if (document.blockLockerForm.whitelistedAddress2.value.length) {
                  whitelistedAddresses.push(document.blockLockerForm.whitelistedAddress2.value)
                }
                if (document.blockLockerForm.whitelistedAddress3.value.length) {
                  whitelistedAddresses.push(document.blockLockerForm.whitelistedAddress3.value)
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
              resultText = "Locked updated."
            } else if (document.blockLockerForm.interactionType.value == 'handleUnlock') {
              confirm("Are you sure you want to unlock? Once unlocked, the current contents of the locker can be accessed with only the passphrase forever.")
              handleMsg = { send: { amount: "1000000", recipient: this.contractAddress, msg: Buffer.from(JSON.stringify({ unlock_locker: { address: document.blockLockerForm.walletAddress.value } })).toString('base64') } };
              let gasParams = {
                  exec: {
                    amount: [{ amount: '100000', denom: 'uscrt' }],
                    gas: '100000',
                  },
                }
              this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
              resultText = "If the locker exists and you're allowed to unlock it, it will be unlocked."
            } else if (document.blockLockerForm.interactionType.value == 'handleViewLocker') {
              contractAddressToExecute = this.contractAddress;
              handleMsg = { get_user_locker: {} };
              let gasParams = {
                  exec: {
                    amount: [{ amount: '37500', denom: 'uscrt' }],
                    gas: '37500',
                  },
                }
              this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
            }
            result = await this.client.execute(contractAddressToExecute, handleMsg)
            if (resultText.length > 0) {
              document.showAlertSuccess(resultText)
            } else {
              result['data'].forEach(function(x){ resultText += String.fromCharCode(x) })
              result = JSON.parse(resultText)
              // Display results
              $("#result-value").removeClass("d-none");
              $("#result-value").html(document.prettyPrintJSON(result));
              $("#result-container").removeClass("d-none");
              $('html, body').animate({
                  scrollTop: $("#result-container").offset().top
              }, 2000);
            }
          }
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          // Enable form
          $("#submit-button").prop("disabled", false);
          $("#loading").addClass("d-none")
          $("#ready").removeClass("d-none")
        }
      };
    }

    function resetInputs() {
      document.blockLockerForm.content.value = ""
      document.blockLockerForm.passphrase.value = ""
      document.blockLockerForm.walletAddress.value = ""
      document.blockLockerForm.whitelistedAddress1.value = ""
      document.blockLockerForm.whitelistedAddress2.value = ""
      document.blockLockerForm.whitelistedAddress3.value = ""
    }
  };
});