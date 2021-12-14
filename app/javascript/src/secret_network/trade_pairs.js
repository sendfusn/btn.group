$(document).ready(function(){
  if($("#secret-network-trade-pairs").length) {
    // === LISTENERS ===
    window.onload = async () => {
      this.tradePairs = []
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)

      this.getAndSetTradePairs = async() => {
        let result = await $.ajax({
          url: '/pools',
          type: 'GET'
        })
        this.tradePairs = result
        $("#results").html(123)
        console.log(this.tradePairs)
        for (const el of this.tradePairs) {
          await this.queryPoolFromBlockchain(el);
        }
      }

      this.queryPoolFromBlockchain = async(tradePair) => {
        let protocolIdentifier = tradePair['protocol']['identifier']
        let address = tradePair['smart_contract']['address']
        let msg = { pool: {} }
        if (protocolIdentifier == 'sienna') {
          msg = 'pair_info'
        }
        try {
          let result = await this.client.queryContractSmart(address, msg);
          console.log(result)
        } catch (error) {
          console.error(error)
        }
      }

      this.getAndSetTradePairs()
    }
  }
})
