$(document).ready(function(){
  if($("#secret-network-dex-aggregator").length) {
    window.onload = async () => {
      this.cryptocurrencies = {}
      this.tradePairs = {}
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
      this.swapPaths = {};

      // === LISTENERS ===
      $('#flip-token').click(function(event){
        let fromId = document.secretNetworkDexAggregatorForm.from.value
        let toId =document.secretNetworkDexAggregatorForm.to.value

        document.secretNetworkDexAggregatorForm.from.value = toId
        document.secretNetworkDexAggregatorForm.fromAmount.value = ''
        document.secretNetworkDexAggregatorForm.to.value = fromId
        document.secretNetworkDexAggregatorForm.toAmount.value = ''
      })
      $("#from-amount-input").on("input", function(){
          // Print entered value in a div box
          this.getSwapPaths(document.secretNetworkDexAggregatorForm.from.value)
      }.bind(this));

      this.getAndSetCryptocurrenciesAndTradePairs = async() => {
        let result = await $.ajax({
          url: '/pools?enabled=true',
          type: 'GET'
        })
        result.forEach((tradePair) => {
          this.tradePairs[tradePair['id']] = tradePair
          tradePair['cryptocurrency_pools'].forEach((cryptocurrencyPool) => {
            if (cryptocurrencyPool['cryptocurrency_role'] == 'deposit') {
              let cryptocurrency = cryptocurrencyPool['cryptocurrency']
              this.cryptocurrencies[cryptocurrency['id']] = cryptocurrency
            }
          })
        })
      }

      this.getSwapPaths = async(from_id) => {
        if (this.swapPaths[from_id] == undefined) {
          this.swapPaths[from_id] = {}
          let url = "/swap_paths?from_id=" + from_id + "&to_id=" + from_id;
          let result = await $.ajax({
            url: url,
            type: 'GET'
          })
          result.forEach((swapPath) => {
            this.getResultOfSwaps(from_id, swapPath['swap_path_as_array'])
            this.swapPaths[from_id][swapPath['id']] = swapPath
          })
        }
        console.log(this.swapPaths)
      }

      this.getResultOfSwaps = async(fromId, swapPath) => {
        let resultAmount;
        for (const el of swapPath) {
          resultAmount = await this.querySwapSimulation(this.tradePairs[Number(el)]);
        }
      }

      this.querySwapSimulation = function() {}

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
