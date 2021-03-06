$(document).ready(function(){
  if($("#secret-network-trade-pairs").length) {
    // === LISTENERS ===
    this.tradePairs = []
    this.client = document.secretNetwork.client();
    // datatable
    this.datatable = window.$('#trade-pairs-table').DataTable({
      columns: [
          { data: 'poolId', title: 'ID' },
          { data: 'crypto0Symbol', title: 'Crypto 0' },
          { data: 'crypto1Symbol', title: 'Crypto 1' },
          { data: 'crypto0Amount', title: 'Crypto 0 amount' },
          { data: 'crypto1Amount', title: 'Crypto 1 amount' },
          { data: 'shares', title: 'Shares' },
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
        url: '/pools?categories=trade_pair',
        type: 'GET'
      })
      this.tradePairs = result
      for (const el of this.tradePairs) {
        await this.queryPoolFromBlockchain(el);
      }
      await document.delay(120_000)
      location.reload()
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
          let asset_0_address;
          let asset_1_address;
          let asset_0_symbol;
          let asset_1_symbol;
          let asset_0_amount;
          let asset_1_amount;
          let sharesAmount;
          let queryParams = {
            address: address,
            codeHash: tradePair['smart_contract']['data_hash'],
            query: msg
          }
          let result = await document.secretNetwork.queryContractSmart(queryParams)
          if (protocolIdentifier == 'sienna') {
            asset_0_address = result['pair_info'][
            'pair']['token_0']['custom_token']['contract_addr']
            asset_0_amount = result['pair_info']['amount_0']
            asset_1_address = result['pair_info']['pair']['token_1']['custom_token']['contract_addr']
            asset_1_amount = result['pair_info']['amount_1']
            sharesAmount = result['pair_info']['total_liquidity']
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
            sharesAmount = result['total_share']
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
            } else if (cp['cryptocurrency_role'] == 'shares') {
              if (sharesAmount != cp['amount']) {
                try {
                  let updateResult = await $.ajax({
                    url: '/cryptocurrency_pools/' + cp['id'],
                    type: 'put',
                    data: { cryptocurrency_pool: { amount: sharesAmount } },
                    dataType: 'json'
                  })
                } catch(error) {
                  document.showAlertDanger(error)
                }
              }
            }
          }
          // Setting asset symbols and applying decimals to amounts after sending correct amounts to back end
          tradePair['cryptocurrency_pools'].forEach((cryptocurrencyPool) => {
            if (cryptocurrencyPool['cryptocurrency_role'] == 'deposit') {
              let cryptocurrency = cryptocurrencyPool['cryptocurrency']
              if (cryptocurrency.smart_contract) {
                if (asset_0_address == cryptocurrency.smart_contract.address) {
                  asset_0_symbol = cryptocurrency.symbol
                  asset_0_amount = document.applyDecimals(asset_0_amount, cryptocurrency.decimals)
                } else {
                  asset_1_symbol = cryptocurrency.symbol
                  asset_1_amount = document.applyDecimals(asset_1_amount, cryptocurrency.decimals)
                }
              } else {
                if (!asset_0_address) {
                  asset_0_symbol = cryptocurrency.symbol
                  asset_0_amount = document.applyDecimals(asset_0_amount, cryptocurrency.decimals)
                } else {
                  asset_1_symbol = cryptocurrency.symbol
                  asset_1_amount = document.applyDecimals(asset_1_amount, cryptocurrency.decimals)
                }
              }
            }
          })

          tradePairForDataTable['poolId'] = tradePair['id']
          tradePairForDataTable['crypto0Symbol'] = asset_0_symbol
          tradePairForDataTable['crypto0Amount'] = asset_0_amount
          tradePairForDataTable['crypto1Symbol'] = asset_1_symbol
          tradePairForDataTable['crypto1Amount'] = asset_1_amount
          tradePairForDataTable['shares'] = sharesAmount
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
})
