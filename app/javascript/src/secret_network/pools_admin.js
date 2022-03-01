$(document).ready(function(){
  if($("#secret-network-pools-admin").length) {
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
        let queryParams = {
          address: poolAddress,
          codeHash: poolDataHash,
        }
        if ($selector.find('.category').first().text() == 'profit_distributor') {
          queryParams.query = {config: {}}
          response = await document.secretNetwork.queryContractSmart(queryParams)
          depositableAmountTotal = response['config']['total_shares']
        } else {
          queryParams.query = {pool: {}}
          response = await document.secretNetwork.queryContractSmart(queryParams)
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
  };
});
