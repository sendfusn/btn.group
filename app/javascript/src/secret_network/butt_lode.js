$(document).ready(function(){
  if($("#secret-network-butt-lode").length) {
    const {
      SigningCosmWasmClient,
    } = require('secretjs');

    window.onload = async () => {
      this.admin;
      this.buttcoinBalance;
      this.buttcoinContractAddress = "secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt";
      this.buttLodeAddress = 'secret1l9msv9yu7mgxant4stu89p0hqugz6j2frj7ne5';
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.keplrOfflineSigner  = window.getOfflineSigner(this.chainId);
      this.receivableAddress;

      try {
        let result = await this.client.queryContractSmart(this.buttLodeAddress, { config: {} })
        this.admin = result['admin']
        $('#admin-table-data').text(this.admin)
        if (result['new_admin_nomination']) {
          $('#new-admin-nomination-table-data').text(result['new_admin_nomination'])
          $('#admin-change-allowed-from-table-data').text(new Date(result['admin_change_allowed_from'] * 1_000))
        } else {
          $('#new-admin-nomination-table-data').text('nil')
          $('#admin-change-allowed-from-table-data').text('nil')
        }
        if (result['new_receivable_address_nomination']) {
          $('#new-receivable-address-nomination-table-data').text(result['new_receivable_address_nomination'])
          $('#receivable-address-change-allowed-from-table-data').text(new Date(result['receivable_address_change_allowed_from'] * 1_000))
        } else {
          $('#new-receivable-address-nomination-table-data').text('nil')
          $('#receivable-address-change-allowed-from-table-data').text('nil')
        }
        this.receivableAddress = result['receivable_address']
        $('input[name=receivableAddress]').first().val(this.receivableAddress)
        $('#receivable-address-table-data').text(this.receivableAddress)
        let balance_response = await this.client.queryContractSmart(this.buttcoinContractAddress, { balance: { address: this.buttLodeAddress, key: 'DoTheRightThing.' } });
        this.buttcoinBalance = applyDecimals(balance_response["balance"]["amount"], 6).toLocaleString('en', { minimumFractionDigits: 6 })
        $('#butt-balance-table-data').text(this.buttcoinBalance)
        $('#buttcoin-amount').val(this.buttcoinBalance)
      } catch(err) {
        document.showAlertDanger(err)
      }

      document['buttLodeSendForm'].onsubmit = async (e) => {
        e.preventDefault()
        this.client = new SigningCosmWasmClient(
          document.secretNetworkHttpUrl(this.environment),
          this.admin,
          this.keplrOfflineSigner,
          window.getEnigmaUtils(this.chainId),
          {
            exec: {
              amount: [{ amount: '75000', denom: 'uscrt' }],
              gas: '75000',
            },
          },
        );
        $sendButton = $("#butt-lode-send-button")
        $sendButtonLoading = $("#butt-lode-send-button-loading")
        $sendButtonReady = $("#butt-lode-send-button-ready")
        $sendButton.prop("disabled", true);
        $sendButtonLoading.removeClass("d-none")
        $sendButtonReady.addClass("d-none")
        try {
          let amount = document['buttLodeSendForm'].amount.value;
          amount = amount.replace(/,/g, '');
          amount = (amount * Math.pow(10, 6)).toFixed(0)
          let handleMsg = { send_token: { amount: amount, token: { address: this.buttcoinContractAddress, contract_hash: "F8B27343FF08290827560A1BA358EECE600C9EA7F403B02684AD87AE7AF0F288" } } }
          let response = await this.client.execute(this.buttLodeAddress, handleMsg)
          document.showAlertSuccess("Send successful");
          document['buttLodeSendForm'].amount.value = ''
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          $sendButton.prop("disabled", false);
          $sendButtonLoading.addClass("d-none")
          $sendButtonReady.removeClass("d-none")
        }
      }
    }

    function applyDecimals(amount, decimals) {
      return amount / parseFloat("1" + '0'.repeat(decimals))
    }
  }  
})
