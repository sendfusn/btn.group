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
        console.log(this.tradePairs)
        for (const el of this.tradePairs) {
          await this.queryPoolFromBlockchain(el);
        }
        this.getAndSetTradePairs()
      }

      this.queryPoolFromBlockchain = async(tradePair) => {
        if (tradePair['protocol']) {
          let protocolIdentifier = tradePair['protocol']['identifier']
          let address = tradePair['smart_contract']['address']
          let msg = { pool: {} };
          if (protocolIdentifier == 'sienna') {
            msg = 'pair_info'
          }
          try {
            let result = await this.client.queryContractSmart(address, msg);
            console.log(result)
            let asset_0_address;
            let asset_1_address;
            let asset_0_amount;
            let asset_1_amount;
            let enabled;
            if (protocolIdentifier == 'sienna') {
              // let totalLiquidity = result['total_liquidity']
              // let enabled;
              // if (Number(totalLiquidity) > 0) {
              //   enabled = true
              // } else {
              //   enabled = false
              // }
              asset_0_address = result['pair_info'][
              'pair']['token_0']['custom_token']['contract_addr']
              asset_0_amount == result['pair_info']['amount_0']
              asset_1_address = result['pair_info']['pair']['token_1']['custom_token']['contract_addr']
              asset_1_amount == result['pair_info']['amount_1']
            } else if (protocolIdentifier == 'secret_swap') {
              if (result['assets'][0]['info']['token']) {
                asset_0_address = result['assets'][0]['info']['token']['contract_addr']
              }
              asset_0_amount == result['assets'][0]['amount']
              if (result['assets'][1]['info']['token']) {
                asset_1_address = result['assets'][1]['info']['token']['contract_addr']
              }
              asset_1_amount == result['assets'][1]['amount']
            }
            if (Number(asset_0_amount) + Number(asset_1_amount) > 0) {
              enabled = true
            } else {
              enabled = false
            }
            if (tradePair['enabled'] != enabled) {
              let updateResult = await $.ajax({
                url: '/pools/' + tradePair['id'],
                type: 'put',
                data: { pool: { enabled: enabled } },
                dataType: 'json'
              })
              console.log(updateResult)
            }
            console.log(result)
          } catch (error) {
            console.error(error)
          }
        }
      }

      this.getAndSetTradePairs()
    }
  }
})
