$(document).ready(function(){
  if($("#secret-network-butt-lode").length) {
    window.onload = async () => {
      document.activateKeplr()
      this.admin;
      this.buttonBalance;
      this.buttLodeAddress = 'secret1l9msv9yu7mgxant4stu89p0hqugz6j2frj7ne5';
      this.buttLodeDataHash = '99F94EDC0D744B35A8FBCBDC8FB71C140CFA8F3F91FAD8C35B7CC37862A4AC95';
      this.client = document.secretNetwork.client(document.secretNetwork.environment);
      this.receivableAddress;

      try {
        let result = await this.client.queryContractSmart(this.buttLodeAddress, { config: {} }, undefined, this.buttLodeDataHash)
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
        let balance_response = await this.client.queryContractSmart(document.secretNetwork.butt.address, { balance: { address: this.buttLodeAddress, key: 'DoTheRightThing.' } }, undefined, document.secretNetwork.butt.dataHash);
        this.buttonBalance = applyDecimals(balance_response["balance"]["amount"], 6).toLocaleString('en', { minimumFractionDigits: 6 })
        $('#butt-balance-table-data').text(this.buttonBalance)
        $('#buttcoin-amount').val(this.buttonBalance)
      } catch(err) {
        document.showAlertDanger(err)
      }

      document['buttLodeSendForm'].onsubmit = async (e) => {
        e.preventDefault()
        let gasParams = {
            exec: {
              amount: [{ amount: '75000', denom: 'uscrt' }],
              gas: '75000',
            },
          }
        this.client = document.secretNetwork.signingClient(document.secretNetwork.environment, this.admin, gasParams)
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
          let handleMsg = { send_token: { amount: amount, token: { address: document.secretNetwork.butt.address, contract_hash: document.secretNetwork.butt.dataHash } } }
          let response = await this.client.execute(this.buttLodeAddress, handleMsg, '', [], gasParams.exec, this.buttLodeDataHash)
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
