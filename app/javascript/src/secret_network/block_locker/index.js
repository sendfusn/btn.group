$(document).ready(function(){
  if($("#secret-network-block-locker").length) {
      // Listeners
      $('input[type=radio][name=interactionType]').on('change', function() {
        var radVal = $(this).val();
        if (radVal == 'handleCreateOrUpdate') {
          $('#content-form-group').removeClass('d-none')
          $('#content').prop('required', true)
          $('#passphrase-form-group').removeClass('d-none')
          $('#passphrase').prop('required', true)
          $('#whitelisted-address-1-form-group').removeClass('d-none')
          $('#whitelisted-address-1').prop('required', true)
          $('#whitelisted-address-2-form-group').removeClass('d-none')
          $('#whitelisted-address-2').prop('required', false)
          $('#whitelisted-address-3-form-group').removeClass('d-none')
          $('#whitelisted-address-3').prop('required', false)

          // Wallet address form group
          $('#wallet-address-form-group').addClass('d-none')
          $('#wallet-address').prop('required', false)
        } else if (radVal == 'handleUnlock') {
          $('#content-form-group').addClass('d-none')
          $('#content').prop('required', false)
          $('#passphrase-form-group').addClass('d-none')
          $('#passphrase').prop('required', false)
          $('#whitelisted-address-1-form-group').addClass('d-none')
          $('#whitelisted-address-1').prop('required', false)
          $('#whitelisted-address-2-form-group').addClass('d-none')
          $('#whitelisted-address-2').prop('required', false)
          $('#whitelisted-address-3-form-group').addClass('d-none')
          $('#whitelisted-address-3').prop('required', false)

          // Wallet address form group
          $('#wallet-address-form-group').removeClass('d-none')
          $('#wallet-address').prop('disabled', false)
          $('#wallet-address').prop('required', true)
          $('#wallet-address').val("")
        } else if (radVal == 'handleViewLocker') {
          $('#content-form-group').addClass('d-none')
          $('#content').prop('required', false)
          $('#passphrase-form-group').addClass('d-none')
          $('#passphrase').prop('required', false)
          $('#whitelisted-address-1-form-group').addClass('d-none')
          $('#whitelisted-address-1').prop('required', false)
          $('#whitelisted-address-2-form-group').addClass('d-none')
          $('#whitelisted-address-2').prop('required', false)
          $('#whitelisted-address-3-form-group').addClass('d-none')
          $('#whitelisted-address-3').prop('required', false)

          // Wallet address form group
          $('#wallet-address-form-group').removeClass('d-none')
          $('#wallet-address').prop('required', false)
          $('#wallet-address').prop('disabled', true)
          $('#wallet-address').val("The wallet you request this from.")
        } else if (radVal == 'queryViewLocker') {
          $('#content-form-group').addClass('d-none')
          $('#content').prop('required', false)
          $('#passphrase-form-group').removeClass('d-none')
          $('#passphrase').prop('required', true)
          $('#whitelisted-address-1-form-group').addClass('d-none')
          $('#whitelisted-address-1').prop('required', false)
          $('#whitelisted-address-2-form-group').addClass('d-none')
          $('#whitelisted-address-2').prop('required', false)
          $('#whitelisted-address-3-form-group').addClass('d-none')
          $('#whitelisted-address-3').prop('required', false)

          // Wallet address form group
          $('#wallet-address-form-group').removeClass('d-none')
          $('#wallet-address').prop('required', true)
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
          } else {
            const {
              SigningCosmWasmClient,
            } = require('secretjs');
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
              this.client = new SigningCosmWasmClient(
                this.httpUrl,
                this.address,
                this.keplrOfflineSigner,
                window.getEnigmaUtils(this.chainId),
                {
                  exec: {
                    amount: [{ amount: '400000', denom: 'uscrt' }],
                    gas: '400000',
                  },
                },
              );
            } else if (document.blockLockerForm.interactionType.value == 'handleUnlock') {
              handleMsg = { send: { amount: "1000000", recipient: this.contractAddress, msg: Buffer.from(JSON.stringify({ unlock_locker: { address: document.blockLockerForm.walletAddress.value } })).toString('base64') } };
              this.client = new SigningCosmWasmClient(
                this.httpUrl,
                this.address,
                this.keplrOfflineSigner,
                window.getEnigmaUtils(this.chainId),
                {
                  exec: {
                    amount: [{ amount: '150000', denom: 'uscrt' }],
                    gas: '150000',
                  },
                },
              );
            } else if (document.blockLockerForm.interactionType.value == 'handleViewLocker') {
              contractAddressToExecute = this.contractAddress;
              handleMsg = { get_user_locker: {} };
              this.client = new SigningCosmWasmClient(
                this.httpUrl,
                this.address,
                this.keplrOfflineSigner,
                window.getEnigmaUtils(this.chainId),
                {
                  exec: {
                    amount: [{ amount: '100000', denom: 'uscrt' }],
                    gas: '100000',
                  },
                },
              );
            }
            result = await this.client.execute(contractAddressToExecute, handleMsg)
            let resultText = ""
            result['data'].forEach(function(x){ resultText += String.fromCharCode(x) })
            result = JSON.parse(resultText)
          }
          // Display results
          $("#result-value").removeClass("d-none");
          $("#result-value").html(document.prettyPrintJSON(result));
          $("#result-container").removeClass("d-none");
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
  };
});
