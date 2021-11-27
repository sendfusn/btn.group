import BigNumber from "bignumber.js";

$(document).ready(function(){
  if($("#secret-network-pools").length) {
    window.onload = async () => {
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      let cryptocurrencies = {
        butt: {
          address: 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt',
          decimals: 6,
          symbol: 'BUTT'
        },
        butt_swbtc_lp: {
          address: 'secret19kh9wmzulxv8lw0e0fyxjxmwtmln2fqpnetucl',
          asset_one: 'butt',
          asset_two: 'swbtc',
          decimals: 6,
          symbol: 'BUTT-sWBTC'
        },
        butt_sxmr_lp: {
          address: 'secret1any3nf7mays46ry4w7enrfqnk837yz9h2zqdrf',
          asset_one: 'butt',
          asset_two: 'sxmr',
          decimals: 6,
          symbol: 'BUTT-sXMR'
        },
        sbnb_bsc: {
          address: 'secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5',
          decimals: 18,
          symbol: 'sBNB(BSC)'
        },
        sdai_eth: {
          address: 'secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq',
          decimals: 18,
          symbol: 'sDAI'
        },
        sdot_bsc: {
          address: 'secret1px5mtmjh072znpez4fjpmxqsv3hpevdpyu9l4v',
          decimals: 18,
          symbol: 'sDOT(BSC)'
        },
        sefi: {
          address: 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt',
          decimals: 6,
          symbol: 'SEFI'
        },
        sefi_susdc_eth_lp: {
          address: 'secret1mm7df4ygxwlfg0l70jrrkshlhtp8vv5n7hj9rr',
          asset_one: 'sefi',
          asset_two: 'susdc_eth',
          decimals: 6,
          symbol: 'SEFI-sUSDC(ETH)'
        },
        sefi_sxmr_lp: {
          address: 'secret1xug4dc46sqlcaetm5c72qhjtedh05922uac9k2',
          asset_one: 'sefi',
          asset_two: 'sxmr',
          decimals: 6,
          symbol: 'SEFI-sXMR'
        },
        seth_bsc_seth_eth_lp: {
          address: 'secret1c9ky0x6fj5gc0qw6tedxsng50mjl3szn7xhjeu',
          asset_one: 'seth_bsc',
          asset_two: 'seth_eth',
          decimals: 6,
          symbol: 'sETH(BSC)-sETH(ETH)'
        },
        seth_eth_swbtc_lp: {
          address: 'secret1nvqrwwr9942gn89nk44nf2nku6gr7u8tsg6z45',
          asset_one: 'seth_eth',
          asset_two: 'swbtc',
          decimals: 6,
          symbol: 'sETH(ETH)-sWBTC'
        },
        seth_bsc: {
          address: 'secret1m6a72200733a7jnm76xrznh9cpmt4kf5ql0a6t',
          decimals: 18,
          symbol: 'sETH(BSC)'
        },
        seth_eth: {
          address: 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw',
          decimals: 18,
          symbol: 'sETH(ETH)'
        },
        sienna: {
          address: 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4',
          decimals: 18,
          symbol: 'SIENNA'
        },
        smana_eth: {
          address: 'secret178t2cp33hrtlthphmt9lpd25qet349mg4kcega',
          decimals: 18,
          symbol: 'sMANA(ETH)'
        },
        socean_eth: {
          address: 'secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps',
          decimals: 18,
          symbol: 'sOCEAN(ETH)'
        },
        srsr_eth: {
          address: 'secret1vcm525c3gd9g5ggfqg7d20xcjnmcc8shh902un',
          decimals: 18,
          symbol: 'sRSR(ETH)'
        },
        srune_eth: {
          address: 'secret1el5uj9ns9sty682dem033pt50xsv5mklmsvy24',
          decimals: 18,
          symbol: 'sRUNE(ETH)'
        },
        sscrt: {
          address: 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek',
          decimals: 6,
          symbol: 'sSCRT'
        },
        sscrt_sbnb_bsc_lp: {
          address: 'secret1le3d0fgkrzd433fdnetdqslfxmugvg0tuaqspe',
          asset_one: 'sscrt',
          asset_two: 'sbnb_bsc',
          decimals: 6,
          symbol: 'sSCRT-sBNB(BSC)'
        },
        sscrt_sdot_bsc_lp: {
          address: 'secret1mc656zt6g37u2ufqp2tw8kaj5jxpujylfzw8yw',
          asset_one: 'sscrt',
          asset_two: 'sdot_bsc',
          decimals: 6,
          symbol: 'sSCRT-sDOT(BSC)'
        },
        sscrt_sefi_lp: {
          address: 'secret1709qy2smh0r7jjac0qxfgjsqn7zpvgthsdz025',
          asset_one: 'sscrt',
          asset_two: 'sefi',
          decimals: 6,
          symbol: 'sSCRT-SEFI'
        },
        sscrt_seth_eth_lp: {
          address: 'secret17gja535zp09t9mlzzxndqqg4gzvhg0vsklhd54',
          asset_one: 'sscrt',
          asset_two: 'seth_eth',
          decimals: 6,
          symbol: 'sSCRT-sETH(ETH)'
        },
        sscrt_slink_eth_lp: {
          address: 'secret1rldr66767a4gz3adkq2vgndwgnxlfqqae4fgen',
          asset_one: 'sscrt',
          asset_two: 'slink_eth',
          decimals: 6,
          symbol: 'sSCRT-sLINK(ETH)'
        },
        sscrt_susdt_eth_lp: {
          address: 'secret1cgd6gcc4uyrxmzsmk4tpeta8auzcgwk4n5ngrx',
          asset_one: 'sscrt',
          asset_two: 'susdt_eth',
          decimals: 6,
          symbol: 'sSCRT-sUSDT(ETH)'
        },
        sscrt_swbtc_eth_lp: {
          address: 'secret1xxvqanj85m7dppplku5782cn9hl8askqd329sv',
          asset_one: 'sscrt',
          asset_two: 'swbtc',
          decimals: 6,
          symbol: 'sSCRT-sWBTC(ETH)'
        },
        suni_eth: {
          address: 'secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te',
          decimals: 18,
          symbol: 'sUNI(ETH)'
        },
        susdc_bsc: {
          address: 'secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg',
          decimals: 18,
          symbol: 'sUSDC(BSC)'
        },
        susdc_eth: {
          address: 'secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv',
          decimals: 6,
          symbol: 'sUSDC(ETH)'
        },
        susdc_eth_susdc_bsc_lp: {
          address: 'secret163e9frya0vqar70s4j3na94apf0cffl2rjgmgg',
          asset_one: 'susdc_eth',
          asset_two: 'susdc_bsc',
          decimals: 6,
          symbol: 'sUSDC(ETH)-sUSDC(BSC)'
        },
        susdt_eth: {
          address: 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f',
          decimals: 6,
          symbol: 'sUSDT(ETH)'
        },
        swbtc: {
          address: 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a',
          decimals: 8,
          symbol: 'sWBTC'
        },
        sxmr: {
          address: 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88',
          decimals: 12,
          symbol: 'sXMR'
        },
        syfi_eth: {
          address: 'secret15grq8y54tvc24j8hf8chunsdcr84fd3d30fvqv',
          decimals: 18,
          symbol: 'sYFI(ETH)'
        }
      };
      this.height = undefined;
      let protocols = {
        secret_swap: {
          name: 'Secret Swap',
          url: 'https://app.secretswap.io/earn'
        },
        sienna: {
          name: 'Sienna',
          url: 'https://app.sienna.network/swap/earn'
        }
      }
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.pools = [
        // This has to be first position in array
        {
          address: 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz',
          deposit_gas: '150000',
          deposit_msg: 'eyAiZGVwb3NpdF9idXR0Y29pbiI6IHt9IH0=',
          deposit_token: cryptocurrencies['butt'],
          earn_token: cryptocurrencies['sefi'],
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '150000',
        },
        // This has to be second position in array
        {
          address: 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku',
          deposit_gas: '350000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['butt_swbtc_lp'],
          earn_token: cryptocurrencies['butt'],
          reward_token: cryptocurrencies['butt'],
          withdraw_gas: '350000',
        },
        // This has to be third position in array
        // {
        //   address: 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan',
        //   deposit_gas: '150000',
        //   deposit_msg: 'eyJkZXBvc2l0Ijoge319',
        //   deposit_token: cryptocurrencies['butt_sxmr_lp'],
        //   earn_token: cryptocurrencies['butt_sxmr_lp'],
        //   reward_token: cryptocurrencies['butt'],
        //   withdraw_gas: '150000',
        // },
        {
          address: 'secret17gpz09yv0eyw633y459ncqmf4qsye9kwqecnvf',
          deposit_gas: '800000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi'],
          earn_token: cryptocurrencies['sefi'],
          farm_contract_address: 'secret1knars62aly28xkqxe8xeqtf7ans8hqxgm6a05k',
          protocol: protocols['secret_swap'],
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '800000',
        },
        {
          address: 'secret1yuxtccepn3n3z8stqq8cwkz2kvyjcx4nahcs0v',
          deposit_gas: '1250000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_sefi_lp'],
          earn_token: cryptocurrencies['sscrt_sefi_lp'],
          farm_contract_address: 'secret1twjquxp06j9ppyg4v6dr496fnmfcvzpx8weddm',
          protocol: protocols['secret_swap'],
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '1250000',
        },
        {
          address: 'secret1wgqv5ch9njg454ru5pau02ut7mh5wjf2rr3gmj',
          deposit_gas: '1250000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi_sxmr_lp'],
          earn_token: cryptocurrencies['sefi_sxmr_lp'],
          farm_contract_address: 'secret1pqvny7lp32z939vtd08jhe66cxl0qp3quxyls5',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1250000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret1xec2u79g8qx7krz48lk3xsmr3crmyvp6tp46jn',
          deposit_gas: '1250000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi_susdc_eth_lp'],
          earn_token: cryptocurrencies['sefi_susdc_eth_lp'],
          farm_contract_address: 'secret16ahwz30chht7wg926tfaj07563hkmemad4nnzm',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1250000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret1rtu4dnkknlsuxwunc0ufry8se78vjul4953l5z',
          deposit_gas: '1500000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_susdt_eth_lp'],
          earn_token: cryptocurrencies['sscrt_susdt_eth_lp'],
          farm_contract_address: 'secret1ny8nvnya5q4zcxpyldvdhts0uvh26heny8ynuj',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1500000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret199pnc4xusvazp73ns95mylqeq9m4xcr8k4fzku',
          deposit_gas: '1500000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_seth_eth_lp'],
          earn_token: cryptocurrencies['sscrt_seth_eth_lp'],
          farm_contract_address: 'secret17r72nj7yhc0fnm3ay8j8tluqqd2twj60lvwr3w',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1500000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret1vpvypnlcz0kng32qlp4727tx87e2kauffng79v',
          deposit_gas: '1500000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_swbtc_eth_lp'],
          earn_token: cryptocurrencies['sscrt_swbtc_eth_lp'],
          farm_contract_address: 'secret1enpte7ll3r4zrs70najmf7g83hdzy33wmdx7nk',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1500000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret18ys9t245ejrx06zmfj6mkvnrd8wrupdanfvnxp',
          deposit_gas: '1500000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_sbnb_bsc_lp'],
          earn_token: cryptocurrencies['sscrt_sbnb_bsc_lp'],
          farm_contract_address: 'secret16pqkssv08hjfmamrcz9gruhxxsuvc25n4gq0s2',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1500000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret19dq8df5jyqqd7v6eugk4c255lgasj76kug242c',
          deposit_gas: '1500000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_sdot_bsc_lp'],
          earn_token: cryptocurrencies['sscrt_sdot_bsc_lp'],
          farm_contract_address: 'secret1geklww0t0kwehc2w9llwce2wkg40pp4ljfpa8m',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1500000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret1k38fm5942tnyl7jqct0nxkluldl84gldhravql',
          deposit_gas: '1500000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['susdc_eth_susdc_bsc_lp'],
          earn_token: cryptocurrencies['susdc_eth_susdc_bsc_lp'],
          farm_contract_address: 'secret1rcvjaua8dfhjlh0kwhrsj54l4aj46mu5evgqwq',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1500000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret1uwr63xusz285r9ztqx6f4mx2jg6yug5f405ajm',
          deposit_gas: '1500000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['seth_eth_swbtc_lp'],
          earn_token: cryptocurrencies['seth_eth_swbtc_lp'],
          farm_contract_address: 'secret1zsnjdcjwpyamc98lyvd5v8u9rw0949px6r5agg',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1500000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret19fj9cvqnzpf7fjczc4e8sgrc62jfv9ay5a7j82',
          deposit_gas: '1500000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['seth_bsc_seth_eth_lp'],
          earn_token: cryptocurrencies['seth_bsc_seth_eth_lp'],
          farm_contract_address: 'secret1s3gg4l6u2vpewqp2lpupqwr52ktdak00rq05ms',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1500000',
          reward_token: cryptocurrencies['sefi'],
        },
      ]
      this.retryCount = 0;
      $.each(this.pools, function(index, value) {
        let balanceViewButtonSelector = '.' + value['deposit_token']['address'] + '-balance-view-button'
        let $balanceViewButton = $(balanceViewButtonSelector)
        document.querySelectorAll(balanceViewButtonSelector).forEach(item => {
          item.addEventListener('click', async(evt) => {
            $balanceViewButton.prop("disabled", true);
            $balanceViewButton.find('.loading').removeClass('d-none')
            $balanceViewButton.find('.ready').addClass('d-none')
            try {
              await window.keplr.suggestToken(this.chainId, value['deposit_token']['address']);
              this.updateWalletBalance(value['deposit_token'], value);
              $balanceViewButton.addClass('d-none')
            } catch(err) {
              let errorDisplayMessage = err;
              document.showAlertDanger(errorDisplayMessage)          
            } finally {
              // Show ready ui
              $balanceViewButton.prop("disabled", false);
              $balanceViewButton.find('.loading').addClass('d-none')
              $balanceViewButton.find('.ready').removeClass('d-none')
            }
          })
        })

        let $depositButton = $('.' + value['address'] + '-deposit-button')
        let $depositButtonLoading = $('.' + value['address'] + '-deposit-button-loading')
        let $depositButtonReady = $('.' + value['address'] + '-deposit-button-ready')
        if(!value['under_maintenance']) {
          document[value['address'] + 'DepositForm'].onsubmit = async (e) => {
            e.preventDefault()
            this.height = undefined;
            this.retryCount = 0;
            this.setClient(value['deposit_gas']);
            $depositButton.prop("disabled", true);
            $depositButtonLoading.removeClass("d-none")
            $depositButtonReady.addClass("d-none")
            try {
              let amount = document[value['address'] + 'DepositForm'].amount.value;
              amount = this.formatStringNumberForSmartContract(amount, value['deposit_token']['decimals'])
              let handleMsg = { send: { amount: amount, recipient: value['address'], msg: value['deposit_msg'] } }
              let response = await this.client.execute(value['deposit_token']['address'], handleMsg)
              document.showAlertSuccess("Deposit successful");
              document[value['address'] + 'DepositForm'].amount.value = ''
              this.updatePoolInterface(value, true)
            }
            catch(err) {
              // When this error happens, it may or may not have have gone through. Not sure why Datahub is sending this error.
              // Doesn't matter how much gas I put up for some of these contracts. It either works or it doesn't
              if (err.message.includes('HTTP 502') || err.message.includes('timed out waiting for tx to be included in a block')) {
                // If TVL or Rewards to process has changed then it's a success, otherwise show gas error
                let tVLBeforeUpdate = $("." + value['address'] + "-total-shares").text()
                let rewardsToProcessBeforeUpdate = $("." + value['address'] + "-rewards-to-process").text()
                this.updateRewards(value)
                this.updateTotalShares(value)
                let tVLAfterUpdate = $("." + value['address'] + "-total-shares").text()
                let rewardsToProcessAfterUpdate = $("." + value['address'] + "-rewards-to-process").text()
                if (tVLBeforeUpdate != tVLAfterUpdate || rewardsToProcessBeforeUpdate != rewardsToProcessAfterUpdate) {
                  this.updatePoolInterface(value, true)
                  document.showAlertSuccess("Deposit successful");
                  document[value['address'] + 'DepositForm'].amount.value = ''
                } else {
                  let errorDisplayMessage = "Out of gas. Please set a higher gas amount and try again.";
                  document.showAlertDanger(errorDisplayMessage)
                }
              } else {
                let errorDisplayMessage = err;
                document.showAlertDanger(errorDisplayMessage)
              }
            }
            finally {
              $depositButton.prop("disabled", false);
              $depositButtonLoading.addClass("d-none")
              $depositButtonReady.removeClass("d-none")
            }
          };

          let $withdrawButton = $('.' + value['address'] + '-withdraw-button')
          let $withdrawButtonLoading = $('.' + value['address'] + '-withdraw-button-loading')
          let $withdrawButtonReady = $('.' + value['address'] + '-withdraw-button-ready')
          document[value['address'] + 'WithdrawForm'].onsubmit = async (e) => {
            e.preventDefault()
            this.height = undefined;
            this.retryCount = 0;
            this.setClient(value['withdraw_gas']);
            $withdrawButton.prop("disabled", true);
            $withdrawButtonLoading.removeClass("d-none")
            $withdrawButtonReady.addClass("d-none")
            try {
              let amount = document[value['address'] + 'WithdrawForm'].amount.value
              amount = this.formatStringNumberForSmartContract(amount, value['deposit_token']['decimals'])
              let handleMsg;
              if (value['address'] == 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
                handleMsg = { withdraw: { shares_amount: amount } }
              } else if (value['address'] == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz' || value['address'] == 'secret1wuxwnfrkdnysww5nq4v807rj3ksrdv3j5eenv2' || value['address'] == 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan') {
                handleMsg = { withdraw: { amount: amount } }
              } else {
                handleMsg = { withdraw: { incentivized_token_amount: amount } }
              }
              let response = await this.client.execute(value['address'], handleMsg)
              document.showAlertSuccess("Withdraw successful");
              document[value['address'] + 'WithdrawForm'].amount.value = ''
              this.updatePoolInterface(value, true)
            }
            catch(err) {
              // When this error happens, it may or may not have have gone through. Not sure why Datahub is sending this error.
              // Doesn't matter how much gas I put up for some of these contracts. It either works or it doesn't
              if (err.message.includes('HTTP 502') || err.message.includes('timed out waiting for tx to be included in a block')) {
                // If TVL or Rewards to process has changed then it's a success, otherwise show gas error
                let tVLBeforeUpdate = $("." + value['address'] + "-total-shares").text()
                let rewardsToProcessBeforeUpdate = $("." + value['address'] + "-rewards-to-process").text()
                this.updateRewards(value)
                this.updateTotalShares(value)
                let tVLAfterUpdate = $("." + value['address'] + "-total-shares").text()
                let rewardsToProcessAfterUpdate = $("." + value['address'] + "-rewards-to-process").text()
                if (tVLBeforeUpdate != tVLAfterUpdate || rewardsToProcessBeforeUpdate != rewardsToProcessAfterUpdate) {
                  this.updatePoolInterface(value, true)
                  document.showAlertSuccess("Withdraw successful");
                  document[value['address'] + 'WithdrawForm'].amount.value = ''
                } else {
                  let errorDisplayMessage = "Out of gas. Please set a higher gas amount and try again.";
                  document.showAlertDanger(errorDisplayMessage)
                }
              } else {
                let errorDisplayMessage = err;
                document.showAlertDanger(errorDisplayMessage)
              }
            }
            finally {
              $withdrawButton.prop("disabled", false);
              $withdrawButtonLoading.addClass("d-none")
              $withdrawButtonReady.removeClass("d-none")
            }
          };
        }
      }.bind(this))

      this.formatStringNumberForSmartContract = (stringNumber, decimals) => {
        if (stringNumber == '') {
          stringNumber = '0'
        }

        return new BigNumber(stringNumber.replace(/,/g, '')).times(new BigNumber("10").pow(decimals)).toFixed();
      }

      this.humanizeStringNumberFromSmartContract = (stringNumber, decimals, toFormatDecimals = undefined) => {
        return new BigNumber(stringNumber).dividedBy(new BigNumber("10").pow(decimals)).toFormat(toFormatDecimals)
      }

      this.setClient = (gas) => {
        let gasParams = {
            exec: {
              amount: [{ amount: gas, denom: 'uscrt' }],
              gas: gas,
            },
          }
        this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
      }

      this.updatePoolInterface = (pool, afterTransaction, poolDetailsOnly = false, userDetailsOnly = false) => {
        if (poolDetailsOnly) {
          this.updateRewards(pool, afterTransaction)
          this.updateTotalShares(pool)
        } else if (userDetailsOnly) {
          this.updateWalletBalance(pool['deposit_token'], pool)
          this.updateRewards(pool, afterTransaction)
          this.updateUserWithdrawable(pool)
          if (afterTransaction) {
            this.updateWalletBalance(pool['reward_token'] || pool['earn_token'], pool)
          }
        } else {
          this.updateWalletBalance(pool['deposit_token'], pool)
          this.updateRewards(pool, afterTransaction)
          this.updateUserWithdrawable(pool)
          if (afterTransaction) {
            this.updateWalletBalance(pool['reward_token'] || pool['earn_token'], pool)
          }
          this.updateTotalShares(pool)
        }
      }

      this.updateUserInterface = (poolDetailsOnly = false, userDetailsOnly = false) => {
        this.pools.forEach(function(pool, index) {
          this.updatePoolInterface(pool, false, poolDetailsOnly, userDetailsOnly)
        }.bind(this));
      }

      this.updateUserWithdrawable = async(pool) => {
        let client = document.secretNetworkClient(this.environment);
        let $userShares = $('.' + pool['address'] + '-user-shares')
        let depositTokenSymbol = pool['deposit_token']['symbol']

        try {
          $userShares.text('Loading...');
          let userResponse;
          let withdrawable = new BigNumber("0");
          if (pool.address == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz' || pool.address == 'secret1wuxwnfrkdnysww5nq4v807rj3ksrdv3j5eenv2' || pool.address == 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan') {
            userResponse = await client.queryContractSmart(pool.address, {user: {user_address: this.address}})
            withdrawable = new BigNumber(userResponse['user']['shares'])
          } else {
            userResponse = await client.queryContractSmart(pool.address, {user_info: {address: this.address}})
            withdrawable = new BigNumber(userResponse['user_info']['shares'])
            if (pool.address != 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
              // Factor in rewards when you get the chance
              let poolResponse = await client.queryContractSmart(pool.address, {pool: {}})
              let incentivizedTokenTotal = new BigNumber(poolResponse['pool']['incentivized_token_total']);
              if (new BigNumber(poolResponse['pool']['shares_total']) > 0) {
                withdrawable = withdrawable.multipliedBy(incentivizedTokenTotal).dividedBy(new BigNumber(poolResponse['pool']['shares_total']))
              } else {
                withdrawable = new BigNumber("0");
              }
              
            }
          }
          if (withdrawable > 0) {
            withdrawable = withdrawable.dividedBy(new BigNumber("10").pow(pool['deposit_token']['decimals'])).decimalPlaces(pool['deposit_token']['decimals'])
          }
          $userShares.text(withdrawable.toFormat())
        } catch(err) {
          $userShares.text('0');
          if (!err.message.includes('{"not_found":{"kind":"cw_profit_distributor::state::User"}}')) {
            console.log(err)
          }
        }
      }

      this.updateRewards = async(pool, afterTransaction = false) => {
        let client = document.secretNetworkClient(this.environment);
        if (pool.farm_contract_address) {
          if (!pool.under_maintenance) {
            let $poolRewardsToProcess = $('.' + pool.address + '-rewards-to-process')
            if (afterTransaction) {
              $poolRewardsToProcess.text('0');
            } else {
              try {
                $poolRewardsToProcess.text('Loading...');
                if (!this.height) {
                  this.height = await client.getHeight();
                }
                let response = await client.queryContractSmart(pool.farm_contract_address, {rewards: { address: pool.address, height: this.height, key: "DoTheRightThing." }})
                $poolRewardsToProcess.text(this.humanizeStringNumberFromSmartContract(response['rewards']['rewards'], pool['reward_token']['decimals']))
              } catch(err) {
                console.log(err)
                if (this.retryCount < 5) {
                  setTimeout(function(){
                    this.retryCount += 1
                    this.height = undefined
                    this.updateRewards(pool)
                  }.bind(this), 5000);
                }
              }
            }
          }
        } else {
          if (this.address) {
            let $poolClaimable = $('.' + pool.address + '-claimable')
            if (afterTransaction) {
              $poolClaimable.text('0');
            } else {
              try {
                $poolClaimable.text('Loading...');
                if (pool.address == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz' || pool.address == 'secret1wuxwnfrkdnysww5nq4v807rj3ksrdv3j5eenv2' || pool.address == 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan') {
                  let response = await client.queryContractSmart(pool.address, {claimable_profit: { user_address: this.address}})
                  $poolClaimable.text(this.humanizeStringNumberFromSmartContract(response['claimable_profit']['amount'], pool['reward_token']['decimals']))
                } else {
                  if (!this.height) {
                    this.height = await client.getHeight();
                  }
                  let response = await client.queryContractSmart(pool.address, {pending_buttcoin: { address: this.address, height: this.height }})
                  $poolClaimable.text(this.humanizeStringNumberFromSmartContract(response['pending_buttcoin']['amount'], 6))
                }
              } catch(err) {
                if (err.message.includes('{"not_found":{"kind":"cw_profit_distributor::state::User"}}') || err.message.includes('{"not_found":{"kind":"cw_profit_distributor_b::state::User"}}')) {
                  $poolClaimable.text('0');
                } else {
                  console.log(err)
                  if (this.retryCount < 5) {
                    setTimeout(function(){
                      this.retryCount += 1
                      this.height = undefined
                      this.updateRewards(pool)
                    }.bind(this), 5000);
                  }
                }
              }
            }
          }
        }
      }

      this.updateTotalShares = async(pool) => {
        try {
          let poolAddress = pool.address
          let depositTokenSymbol = pool['deposit_token']['symbol']
          let totalSharesSelector = '.' + poolAddress + '-total-shares'
          let client = document.secretNetworkClient(this.environment);
          let humanizedStringNumberFromSmartContract;
          $(totalSharesSelector).text('Loading...')
          if (poolAddress == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz' || poolAddress == 'secret1wuxwnfrkdnysww5nq4v807rj3ksrdv3j5eenv2' || poolAddress == 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan') {
            let config = await client.queryContractSmart(poolAddress, {config: {}})
            humanizedStringNumberFromSmartContract = this.humanizeStringNumberFromSmartContract(config['config']['total_shares'], pool['deposit_token']['decimals'], 0)
          } else if (poolAddress == 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
            let response = await client.queryContractSmart(poolAddress, {pool: {}})
            humanizedStringNumberFromSmartContract = this.humanizeStringNumberFromSmartContract(response['pool']['shares_total'], pool['deposit_token']['decimals'], 0)
          } else {
            let responseTwo = await client.queryContractSmart(poolAddress, {pool: {}})
            humanizedStringNumberFromSmartContract = this.humanizeStringNumberFromSmartContract(responseTwo['pool']['incentivized_token_total'], pool['deposit_token']['decimals'], 0)
          }
          $(totalSharesSelector).text(humanizedStringNumberFromSmartContract + ' ' + depositTokenSymbol)
        } catch(err) {
          console.log(err)
        }
      }

      this.updateWalletBalance = async(cryptocurrency, pool) => {
        let address = cryptocurrency['address']
        let client = document.secretNetworkClient(this.environment);
        let $walletBalance = $('.' + address + '-balance')
        let $walletBalanceLink = $('.' + address + '-balance-link')
        let $walletBalanceLoading = $('.' + address + '-balance-loading')
        let $walletBalanceViewButton = $('.' + address + '-balance-view-button')
        try {
          $walletBalance.addClass('d-none')
          $walletBalanceLoading.removeClass('d-none')
          let key = await window.keplr.getSecret20ViewingKey(this.chainId, address)
          // If they have the key, replace the button with the balance
          let balanceResponse = await client.queryContractSmart(address, { balance: { address: this.address, key: key } })
          let balanceFormatted = this.humanizeStringNumberFromSmartContract(balanceResponse['balance']['amount'], cryptocurrency['decimals'])
          $walletBalance.text(balanceFormatted)
          $walletBalance.removeClass('d-none')
          $walletBalanceViewButton.addClass('d-none')
        } catch(err) {
          console.log(err)
          if (err.message.includes('502')) {
            if (this.retryCount < 5) {
              setTimeout(function(){
                this.retryCount += 1
                this.updatePoolInterface(pool, true)
              }.bind(this), 5000);
            }
          } else {
            // If they don't have a viewing key, show the view balance button and hide the balance
            $walletBalance.addClass('d-none')
            $walletBalanceViewButton.removeClass('d-none')
          }
        } finally {
          $walletBalanceLoading.addClass('d-none')
          $walletBalanceViewButton.find('.loading').addClass('d-none')
          $walletBalanceLink.removeClass('d-none')
        }
      }

      $(document).on('keplr_connected', async(evt) => {
        let accounts = await window.keplrOfflineSigner.getAccounts()
        this.address = accounts[0].address;
        this.updateUserInterface(false, true)
      })

      document.querySelector('#claim-sefi').addEventListener('click', async(evt) => {
        if (this.pools[0]['address'] == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz') {
          let $claimSEFI = $('#claim-sefi')
          this.setClient(this.pools[0]['deposit_gas']);
          $claimSEFI.prop("disabled", true);
          $claimSEFI.find('.loading').removeClass("d-none")
          $claimSEFI.find('.ready').addClass("d-none")
          try {
            let handleMsg = { send: { amount: '0', recipient: this.pools[0]['address'], msg: this.pools[0]['deposit_msg'] } }
            let response = await this.client.execute(this.pools[0]['deposit_token']['address'], handleMsg)
            document.showAlertSuccess("Claim successful");
            $claimSEFI.find('.secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz-claimable').text('0')
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
            $claimSEFI.prop("disabled", false);
            $claimSEFI.find('.loading').addClass("d-none")
            $claimSEFI.find('.ready').removeClass("d-none")
          }
        }
      })

      document.querySelector('#claim-butt').addEventListener('click', async(evt) => {
        if (this.pools[1]['address'] == 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
          let $claimBUTT = $('#claim-butt')
          this.setClient(this.pools[1]['deposit_gas']);
          $claimBUTT.prop("disabled", true);
          $claimBUTT.find('.loading').removeClass("d-none")
          $claimBUTT.find('.ready').addClass("d-none")
          try {
            let handleMsg = { send: { amount: '0', recipient: this.pools[1]['address'], msg: this.pools[1]['deposit_msg'] } }
            let response = await this.client.execute(this.pools[1]['deposit_token']['address'], handleMsg)
            document.showAlertSuccess("Claim successful");
            $claimBUTT.find('.secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku-claimable').text('0')
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
            $claimBUTT.prop("disabled", false);
            $claimBUTT.find('.loading').addClass("d-none")
            $claimBUTT.find('.ready').removeClass("d-none")
          }
        }
      })

      // document.querySelector('#claim-profit-distributor-b-butt').addEventListener('click', async(evt) => {
      //   if (this.pools[2]['address'] == 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan') {
      //     let $claimBUTT = $('#claim-profit-distributor-b-butt')
      //     this.setClient(this.pools[2]['deposit_gas']);
      //     $claimBUTT.prop("disabled", true);
      //     $claimBUTT.find('.loading').removeClass("d-none")
      //     $claimBUTT.find('.ready').addClass("d-none")
      //     try {
      //       let handleMsg = { send: { amount: '0', recipient: this.pools[2]['address'], msg: this.pools[2]['deposit_msg'] } }
      //       let response = await this.client.execute(this.pools[2]['deposit_token']['address'], handleMsg)
      //       document.showAlertSuccess("Claim successful");
      //       $claimBUTT.find('.secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan-claimable').text('0')
      //     }
      //     catch(err) {
      //       document.showAlertDanger(err)
      //     }
      //     finally {
      //       $claimBUTT.prop("disabled", false);
      //       $claimBUTT.find('.loading').addClass("d-none")
      //       $claimBUTT.find('.ready').removeClass("d-none")
      //     }
      //   }
      // })

      this.updateUserInterface(true, false)
    }
  };
});
