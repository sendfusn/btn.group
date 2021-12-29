$(document).ready(function(){
  if($("#secret-network-trade-pairs").length) {
    document.activateKeplr()
    // === LISTENERS ===
    window.onload = async () => {
      document.activateKeplr()
      this.tradePairs = []
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      // datatable
      this.datatable = window.$('#trade-pairs-table').DataTable({
        columns: [
            { data: 'poolId', title: "ID" },
            { data: 'poolAddress', title: "Trade pair" },
            { data: 'crypto0Address', title: "Crypto 0" },
            { data: 'crypto1Address', title: "Crypto 1" },
            { data: 'crypto0Amount', title: "Crypto 0 amount" },
            { data: 'crypto1Amount', title: "Crypto 1 amount" },
        ],
        dom: '<"top"i>frtp',
        ordering: false,
        paging: false,
        rowId: function(a) {
          return 'position_' + a['position'];
        },
      });
      this.tradePairsFormatted = []

      this.getAndSetTradePairs = async() => {
        let result = await $.ajax({
          url: '/pools',
          type: 'GET'
        })
        this.tradePairs = result
        for (const el of this.tradePairs) {
          await this.queryPoolFromBlockchain(el);
        }
        location.reload()
      }

      this.queryPoolFromBlockchain = async(tradePair) => {
        if (tradePair['protocol']) {
          let protocolIdentifier = tradePair['protocol']['identifier']
          let address = tradePair['smart_contract']['address']
          let msg = { pool: {} };
          if (protocolIdentifier == 'sienna') {
            msg = 'pair_info'
          }
          let tradePairForDataTable = {}
          try {
            let result = await this.client.queryContractSmart(address, msg);
            let asset_0_address;
            let asset_1_address;
            let asset_0_amount;
            let asset_1_amount;
            let enabled;
            if (protocolIdentifier == 'sienna') {
              asset_0_address = result['pair_info'][
              'pair']['token_0']['custom_token']['contract_addr']
              asset_0_amount = result['pair_info']['amount_0']
              asset_1_address = result['pair_info']['pair']['token_1']['custom_token']['contract_addr']
              asset_1_amount = result['pair_info']['amount_1']
            } else if (protocolIdentifier == 'secret_swap') {
              if (result['assets'][0]['info']['token']) {
                asset_0_address = result['assets'][0]['info']['token']['contract_addr']
              } else {
                asset_0_address = ''
              }
              asset_0_amount = result['assets'][0]['amount']
              if (result['assets'][1]['info']['token']) {
                asset_1_address = result['assets'][1]['info']['token']['contract_addr']
              } else {
                asset_1_address = ''
              }
              asset_1_amount = result['assets'][1]['amount']
            }
            if ((Number(asset_0_amount) + Number(asset_1_amount) > 0) && asset_0_address.length > 0 && asset_1_address.length > 0) {
              enabled = true
            } else {
              enabled = false
            }
            console.log(tradePair)
            console.log(tradePair['enabled'])
            console.log(enabled)
            console.log(tradePair['enabled'] != enabled)
            if (tradePair['enabled'] != enabled) {
              let updateResult = await $.ajax({
                url: '/pools/' + tradePair['id'],
                type: 'put',
                data: { pool: { enabled: enabled } },
                dataType: 'json'
              })
            }
            for (let cp of tradePair['cryptocurrency_pools']) {
              if (cp['cryptocurrency_role'] == 'deposit') {
                let cryptocurrency = cp['cryptocurrency']
                let amount;
                if (cryptocurrency['smart_contract']) {
                  if (asset_0_address == cryptocurrency['smart_contract']['address']) {
                    amount = asset_0_amount
                  } else if (asset_1_address == cryptocurrency['smart_contract']['address']) {
                    amount = asset_1_amount
                  }
                } else {
                  if (asset_0_address == undefined) {
                    amount = asset_0_amount
                  } else if (asset_1_address == undefined) {
                    amount = asset_1_amount
                  }
                }
                if (amount != cp['amount']) {
                  try {
                    let updateResult = await $.ajax({
                      url: '/cryptocurrency_pools/' + cp['id'],
                      type: 'put',
                      data: { cryptocurrency_pool: { amount: amount } },
                      dataType: 'json'
                    })
                  } catch(error) {
                    document.showAlertDanger(error)
                  }
                }
              }
            }

            tradePairForDataTable['poolId'] = tradePair['id']
            tradePairForDataTable['poolAddress'] = address
            tradePairForDataTable['crypto0Address'] = asset_0_address
            tradePairForDataTable['crypto0Amount'] = asset_0_amount
            tradePairForDataTable['crypto1Address'] = asset_1_address
            tradePairForDataTable['crypto1Amount'] = asset_1_amount
            this.tradePairsFormatted.unshift(tradePairForDataTable)
            this.datatable.clear()
            this.datatable.rows.add(this.tradePairsFormatted);
            this.datatable.draw();
          } catch (error) {
            document.showAlertDanger(error)
          }
        }
      }

      this.getAndSetTradePairs()
    }
  }
})
