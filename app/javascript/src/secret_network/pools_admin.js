$(document).ready(function(){
  if($("#secret-network-pools-admin").length) {
    window.onload = async () => {
      // === INTERVALS ===
      setInterval(function() {
        this.updatePoolDepositableAmounts
      }.bind(this), 30_000);

      // === FUNCTIONS ===
      this.updatePoolDepositableAmounts = () => {
        document.querySelectorAll('tbody tr').forEach(selector => {
          this.updatePoolDepositableAmount(selector)
        })
      }

      this.updatePoolDepositableAmount = async(selector) => {
        try {
          let $selector = $(selector)
          $selector.find('.depositable-amount').text('')
          let poolAddress = $selector.find('.address').first().text()
          let poolDataHash = $selector.find('.data-hash').first().text()
          let category = $selector.find('.category').first().text()
          let response;
          let depositableAmountTotal;
          let cpId = $selector.find('.pool-cryptocurrency-deposit-id').first().text()
          if ($selector.find('.category').first().text() == 'profit_distributor') {
            response = await document.secretNetwork.client().queryContractSmart(poolAddress, {config: {}}, undefined, poolDataHash)
            depositableAmountTotal = response['config']['total_shares']
          } else {
            response = await document.secretNetwork.client().queryContractSmart(poolAddress, {pool: {}}, undefined, poolDataHash)
            if (category == 'farm') {
              depositableAmountTotal = response['pool']['shares_total']
            } else {
              depositableAmountTotal = response['pool']['incentivized_token_total']
            }
          }
          await $.ajax({
            url: '/cryptocurrency_pools/' + cpId,
            type: 'put',
            data: { cryptocurrency_pool: { amount: depositableAmountTotal } },
            dataType: 'json'
          })
          $selector.find('.depositable-amount').text(depositableAmountTotal)
        } catch(err) {
          document.showAlertDanger(err)          
        }
      }

      this.updatePoolDepositableAmounts()
    }
  };
});
