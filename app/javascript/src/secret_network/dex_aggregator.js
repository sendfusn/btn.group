$(document).ready(function(){
  if($("#secret-network-dex-aggregator").length) {
    // === LISTENERS ===
    $('#flip-token').click(function(event){
      let fromId = document.secretNetworkDexAggregatorForm.from.value
      let toId =document.secretNetworkDexAggregatorForm.to.value

      document.secretNetworkDexAggregatorForm.from.value = toId
      document.secretNetworkDexAggregatorForm.fromAmount.value = ''
      document.secretNetworkDexAggregatorForm.to.value = fromId
      document.secretNetworkDexAggregatorForm.toAmount.value = ''
    })

    window.onload = async () => {
      this.cryptocurrencies = {}
      this.tradePairs = []
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.height = undefined;
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.gasDeposit;
      this.gasRedeem;
      this.gasSiennaPerSwap;
      this.gasSecretSwapPerSwap;
      this.gasBase;
      // For each from to to option, we need to map out all options
      // there's technically a really really really big number of combinations
      // so it would have the base key as fhe from cryptocurrency id
      // and the next level of keys will be all the 
      // I think one of the rules should be that it never doubles back on the same pair
      // The other thing should be is that there should be a maximum of 5 swaps
      this.swapOptions = {
        1: {
          2: [[1], []],
          3: [[], []]
        }
      }

      this.getAndSetCryptocurrenciesAndTradePairs = async() => {
        let result = await $.ajax({
          url: '/pools?enabled=true',
          type: 'GET'
        })
        this.tradePairs = result
        result.forEach((tradePair) => {
          tradePair['cryptocurrency_pools'].forEach((cryptocurrencyPool) => {
            if (cryptocurrencyPool['cryptocurrency_role'] == 'deposit') {
              let cryptocurrency = cryptocurrencyPool['cryptocurrency']
              this.cryptocurrencies[cryptocurrency['id']] = cryptocurrency
            }
          })
        })
      }

      document.secretNetworkDexAggregatorForm.onsubmit = async (e) => {
        e.preventDefault()
        console.log(document.secretNetworkDexAggregatorForm.fromAmount.value)
        console.log(document.secretNetworkDexAggregatorForm.toAmount.value)
        console.log(this.cryptocurrencies)
        console.log(this.tradePairs)
      };

      this.getAndSetCryptocurrenciesAndTradePairs()
    }
  }
})
