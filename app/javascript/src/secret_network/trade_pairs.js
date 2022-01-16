import BigNumber from "bignumber.js";

$(document).ready(function(){
  if($("#secret-network-trade-pairs").length) {
    // === LISTENERS ===
    window.onload = async () => {
      this.tradePairs = []
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      // datatable
      this.datatable = window.$('#trade-pairs-table').DataTable({
        columns: [
            { data: 'poolId', title: "ID" },
            { data: 'crypto0Symbol', title: "Crypto 0" },
            { data: 'crypto1Symbol', title: "Crypto 1" },
            { data: 'crypto0AmountBefore', title: "Crypto 0 Before ($)" },
            { data: 'crypto0Amount', title: "Crypto 0 After ($)" },
            { data: 'crypto1AmountBefore', title: "Crypto 1 Before ($)" },
            { data: 'crypto1Amount', title: "Crypto 1 After ($)" },
        ],
        dom: '<"top"i>frtp',
        ordering: true,
        // order: [[5, 'desc']],
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
        setTimeout(function(){
          location.reload()
        }, 60_000);
      }

      this.queryPoolFromBlockchain = async(tradePair) => {
        if (tradePair['protocol'] && tradePair['cryptocurrency_pools'].length) {
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
            let asset_0_symbol;
            let asset_1_symbol;
            let asset_0_amount;
            let asset_0_before_amount;
            let asset_1_amount;
            let asset_1_before_amount;
            let coinGeckoIdsPresent = true;
            tradePair['cryptocurrency_pools'].forEach((cryptocurrencyPool) => {
              if (cryptocurrencyPool['cryptocurrency_role'] == 'deposit') {
                let cryptocurrency = cryptocurrencyPool['cryptocurrency']
                if (!cryptocurrency['coin_gecko_id']) {
                  coinGeckoIdsPresent = false
                }
                if (asset_0_symbol) {
                  asset_1_symbol = cryptocurrency['symbol']
                } else {
                  asset_0_symbol = cryptocurrency['symbol']
                }
              }
            })
            if (!coinGeckoIdsPresent) {
              return
            }
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
            for (let cp of tradePair['cryptocurrency_pools']) {
              if (cp['cryptocurrency_role'] == 'deposit') {
                let cryptocurrency = cp['cryptocurrency']
                let amount;
                if (cryptocurrency['smart_contract']) {
                  if (asset_0_address == cryptocurrency['smart_contract']['address']) {
                    amount = asset_0_amount
                    asset_0_before_amount = new BigNumber(cp['amount']).dividedBy(new BigNumber("10").pow(cryptocurrency['decimals'])).times(cryptocurrency['price'])
                    asset_0_amount = new BigNumber(asset_0_amount).dividedBy(new BigNumber("10").pow(cryptocurrency['decimals'])).times(cryptocurrency['price'])
                  } else if (asset_1_address == cryptocurrency['smart_contract']['address']) {
                    amount = asset_1_amount
                    asset_1_before_amount = new BigNumber(cp['amount']).dividedBy(new BigNumber("10").pow(cryptocurrency['decimals'])).times(cryptocurrency['price'])
                    asset_1_amount = new BigNumber(asset_1_amount).dividedBy(new BigNumber("10").pow(cryptocurrency['decimals'])).times(cryptocurrency['price'])
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
            tradePairForDataTable['crypto0Symbol'] = asset_0_symbol
            tradePairForDataTable['crypto0AmountBefore'] = asset_0_before_amount.toFormat(2)
            tradePairForDataTable['crypto0Amount'] = asset_0_amount.toFormat(2)
            tradePairForDataTable['crypto1Symbol'] = asset_1_symbol
            tradePairForDataTable['crypto1AmountBefore'] = asset_1_before_amount.toFormat(2)
            tradePairForDataTable['crypto1Amount'] = asset_1_amount.toFormat(2)
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
