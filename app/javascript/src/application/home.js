$(document).ready(function(){
  if($("#home").length) {
    window.onload = async () => {
      // Contracts
      this.tokenSaleContractAddress = 'secret1j6fpcsxp2ts9d8rsh3uj9srvdh0vvg4ewe7tsa';
      this.environment = 'production'
      this.chainId = document.secretNetworkChainId(this.environment)
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)

      this.updateUserInterface = async () => {
        try {
          let client =  document.secretNetworkClient(this.environment);
          let tokenSaleContractConfig = await client.queryContractSmart(this.tokenSaleContractAddress, { config: {} })
          let totalRaised = parseFloat(tokenSaleContractConfig['total_raised']) * 3 / 1000000
          $('#total-raised').text(totalRaised.toLocaleString() + '/3,000,000')
          let percentageSwapped = Math.round(totalRaised / 3_000_000 * 100)
          $('#percentage-swapped').text(percentageSwapped + '%')
          $('#swap-progress-percent').attr("data-percent", percentageSwapped);
          $('#swap-progress-percent').attr("style", 'width: ' + percentageSwapped + '%;');
        } catch(err) {
          let errorDisplayMessage = err;
          document.showAlertDanger(errorDisplayMessage)     
        }
      }

      this.updateUserInterface()
    }
  };
});
