$(document).ready(function(){
  if($("#secret-network-dex-aggregator").length) {
    // === LISTENERS ===
    $('#flip-token').click(function(event){
      event.preventDefault();
      let fromAddresss = document.secretNetworkDexAggregatorForm.fromTokenAddress.value
      let toAddress =document.secretNetworkDexAggregatorForm.toTokenAddress.value

      document.secretNetworkDexAggregatorForm.fromTokenAddress.value = toAddress
      document.secretNetworkDexAggregatorForm.fromAmount.value = ''
      document.secretNetworkDexAggregatorForm.toTokenAddress.value = fromAddresss
      document.secretNetworkDexAggregatorForm.toAmount.value = ''
    })

    document.secretNetworkDexAggregatorForm.onsubmit = () => {
      return false;
    };
  }
})
