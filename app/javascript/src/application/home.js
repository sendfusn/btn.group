$(document).ready(function(){
  if($("#home").length) {
    window.onload = async () => {
      // Contracts
      this.tokenSaleContractAddress = 'secret16jue55lf0kt7uz00kzg309ljzttjps2uy9zesc';
      this.environment = 'production'
      this.chainId = document.secretNetworkChainId(this.environment)
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)

      this.updateUserInterface = async () => {
        try {
          let client =  document.secretNetworkClient(this.environment);
          let tokenSaleContractConfig = await client.queryContractSmart(this.tokenSaleContractAddress, { config: {} })
          let totalRaised = parseFloat(tokenSaleContractConfig['total_raised']) / 1000000
          $('#total-raised').text(totalRaised.toLocaleString() + '/11,000,006')
          let percentageSwapped = Math.round(totalRaised / 11_000_006 * 100)
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
