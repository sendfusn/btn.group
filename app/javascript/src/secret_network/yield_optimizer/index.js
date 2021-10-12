$(document).ready(function(){
  if($("#secret-network-yield-optimizer").length) {
    const {
      SigningCosmWasmClient,
    } = require('secretjs');

    window.onload = async () => {
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      let cryptocurrencies = {
        butt: {
          address: 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt',
          logo: 'https://siasky.net/AAB1xbkxt91L2pStCCLRe-s2BG0N03K8OCugzeG8MSAP5g',
          symbol: 'BUTT'
        },
        butt_swbtc_lp: {
          address: 'secret19kh9wmzulxv8lw0e0fyxjxmwtmln2fqpnetucl',
          asset_one: 'butt',
          asset_two: 'swbtc',
          symbol: 'BUTT-sWBTC LP'
        },
        sbnb_bsc: {
          address: 'secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5',
          logo: 'https://siasky.net/AACF1KK4sIYJAvdd7DcxQUJdW_1n8lnb7l7k2k1TYZoeag',
          symbol: 'sBNB(BSC)'
        },
        sdai_eth: {
          address: 'secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq',
          logo: 'https://siasky.net/CADFDvkEPwGfeBEJPJIV5ZjOzyAvLTs2Ib2HFkdSy2y9Ng',
          symbol: 'sDAI'
        },
        sdot_bsc: {
          address: 'secret1px5mtmjh072znpez4fjpmxqsv3hpevdpyu9l4v',
          logo: 'https://siasky.net/AABoC4jQvXmvz_dwuegzpIW1wmiZpETMqZBj0lMH599SHw',
          symbol: 'sDOT(BSC)'
        },
        sefi: {
          address: 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt',
          logo: 'https://siasky.net/AABeTmPkxJ8CuGzgqCQM7sR0Y-3rTPZHJo4Jc9KObuTyBQ',
          symbol: 'SEFI'
        },
        sefi_susdc_eth_lp: {
          address: 'secret14cxq26u8f9zpd09a72uznwz7kew9yc085d08hy',
          asset_one: 'sefi',
          asset_two: 'susdc_eth',
          symbol: 'SEFI-sUSDC(ETH)'
        },
        sefi_sxmr_lp: {
          address: 'secret132zd4csn5xfellxa9xp94t7dl32jqk5lu4hump',
          asset_one: 'sefi',
          asset_two: 'sxmr',
          symbol: 'SEFI-sXMR'
        },
        seth_bsc: {
          address: 'secret1m6a72200733a7jnm76xrznh9cpmt4kf5ql0a6t',
          logo: 'https://siasky.net/AADSgvwvMSA3YjxpWGBtObf1zODXGCut10bt66Jr8DUhcw',
          symbol: 'sETH(BSC)'
        },
        seth_eth: {
          address: 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw',
          logo: 'https://siasky.net/AAAyGsQVk6vF6wYWUUvFMqkVX4LlNpCg432ucBCAgw9Hyw',
          symbol: 'sETH(ETH)'
        },
        seth_eth_seth_bsc_lp: {
          address: 'secret1ry9s8al2w2my4z7jqhtve9fqkesqapn0mrjr3z',
          asset_one: 'seth_eth',
          asset_two: 'seth_bsc',
          symbol: 'sETH(ETH)-sETH(BSC)'
        },
        seth_eth_swbtc_eth_lp: {
          address: 'secret1k2u3khzp59mp6wz2q4ulwhhy4rqpez63ln2fy6',
          asset_one: 'seth_eth',
          asset_two: 'swbtc',
          symbol: 'sETH(ETH)-sWBTC(ETH)'
        },
        slink_eth: {
          address: 'secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw',
          logo: 'https://siasky.net/AABTb2I_YOOB4x-PZDltgjTiuP92_fFwo5Z0MMLADr_OWg',
          symbol: 'sLINK(ETH)'
        },
        smana_eth: {
          address: 'secret178t2cp33hrtlthphmt9lpd25qet349mg4kcega',
          logo: 'https://siasky.net/AAARSocbMzqrBV1oATe-H4OXhS01c8OMNXcetLoVzTJ14w',
          symbol: 'sMANA(ETH)'
        },
        socean_eth: {
          address: 'secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps',
          logo: 'https://siasky.net/GAB8EwAVnvjYW8ynq6zCMyBJpRrpMyEBbOWrSanyGm2veA',
          symbol: 'sOCEAN(ETH)'
        },
        srsr_eth: {
          address: 'secret1vcm525c3gd9g5ggfqg7d20xcjnmcc8shh902un',
          logo: 'https://siasky.net/AAC6eLf4brMjdRRTPePDbuq4QgxLn2HIN9Kd66DQHJGPvg',
          symbol: 'sRSR(ETH)'
        },
        srune_eth: {
          address: 'secret1el5uj9ns9sty682dem033pt50xsv5mklmsvy24',
          logo: 'https://siasky.net/AADMji-JPI3F-JuP4G4eMfnq4ilKyxWrVR1-2d5BCosk3g',
          symbol: 'sRUNE(ETH)'
        },
        sscrt: {
          address: 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek',
          logo: 'https://siasky.net/AACL5VVg8IZC4H_9cTiaPSzvD8hXmaJYXFc2t8piZgf5Ig',
          symbol: 'sSCRT'
        },
        sscrt_sbnb_bsc_lp: {
          address: 'secret1jr99mtjs87hsx6hs36ze2l5efgj2x0gqrmya0p',
          asset_one: 'sscrt',
          asset_two: 'sbnb_bsc',
          symbol: 'sSCRT-sBNB(BSC)'
        },
        sscrt_sdai_eth_lp: {
          address: 'secret1sj65pd9fqgwyj0a9ctl4cecp62y52z5nzpq60r',
          asset_one: 'sscrt',
          asset_two: 'sdai_eth',
          symbol: 'sSCRT-sDAI(ETH)'
        },
        sscrt_sdot_bsc_lp: {
          address: 'secret1wrajc66xjst7mkjn383ymvtl54jaslalkhxt6e',
          asset_one: 'sscrt',
          asset_two: 'sdot_bsc',
          symbol: 'sSCRT-sDOT(BSC)'
        },
        sscrt_sefi_lp: {
          address: 'secret1709qy2smh0r7jjac0qxfgjsqn7zpvgthsdz025',
          asset_one: 'sscrt',
          asset_two: 'sefi',
          symbol: 'sSCRT-SEFI'
        },
        sscrt_seth_eth_lp: {
          address: 'secret14zv2fdsfwqzxqt7s2ushp4c4jr56ysyld5zcdf',
          asset_one: 'sscrt',
          asset_two: 'seth_eth',
          symbol: 'sSCRT-sETH(ETH)'
        },
        sscrt_slink_eth_lp: {
          address: 'secret1x8244a7l2fr642axef0sl5z3jw2pn75rp36hxs',
          asset_one: 'sscrt',
          asset_two: 'slink_eth',
          symbol: 'sSCRT-sLINK(ETH)'
        },
        sscrt_smana_eth_lp: {
          address: 'secret1u9zfyh7d4mgf44f3y8fhz4e70dhjzd5e5df8hp',
          asset_one: 'sscrt',
          asset_two: 'smana_eth',
          symbol: 'sSCRT-sMANA(ETH)'
        },
        sscrt_socean_eth_lp: {
          address: 'secret13ns5mzms67jttq5cnv76j5lgtd0xf69sv4sdpq',
          asset_one: 'sscrt',
          asset_two: 'socean_eth',
          symbol: 'sSCRT-sOCEAN(ETH)'
        },
        sscrt_srsr_eth_lp: {
          address: 'secret1g97kxc857asparfgdudzkzyq5akd74xmup52uj',
          asset_one: 'sscrt',
          asset_two: 'srsr_eth',
          symbol: 'sSCRT-sRSR(ETH)'
        },
        sscrt_srune_eth_lp: {
          address: 'secret1j8vs8v729vregluuzr5n4zr77ztaleqtqcw026',
          asset_one: 'sscrt',
          asset_two: 'srune_eth',
          symbol: 'sSCRT-sRUNE(ETH)'
        },
        sscrt_suni_eth_lp: {
          address: 'secret1pmt7ncuhau2g7h9snygx2tlkzqnks3uz5edgyc',
          asset_one: 'sscrt',
          asset_two: 'suni_eth',
          symbol: 'sSCRT-sUNI(ETH)'
        },
        sscrt_susdt_eth_lp: {
          address: 'secret1gyct75dc2pf20vtj3l86k2jxg79mffyh9ljve3',
          asset_one: 'sscrt',
          asset_two: 'susdt_eth',
          symbol: 'sSCRT-sUSDT(ETH)'
        },
        sscrt_swbtc_eth_lp: {
          address: 'secret10x0k62eaal4q3t9c200qvmgftahxjqvdawn69c',
          asset_one: 'sscrt',
          asset_two: 'swbtc',
          symbol: 'sSCRT-sWBTC(ETH)'
        },
        sscrt_syfi_eth_lp: {
          address: 'secret1zra95h6nf4kc49x59x66t7crxxl79hr5nph882',
          asset_one: 'sscrt',
          asset_two: 'syfi_eth',
          symbol: 'sSCRT-sYFI(ETH) LP'
        },
        suni_eth: {
          address: 'secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te',
          logo: 'https://siasky.net/EAB_e9XgWK_CrqcZFUvD7LirQox_lakStwc8YKJCWfkf-A',
          symbol: 'sUNI(ETH)'
        },
        susdc_bsc: {
          address: 'secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg',
          logo: 'https://siasky.net/AADY8NK1wfSi7DUdrDRk9k9Gr80EeTWnLoq1mLIAbGg3_A',
          symbol: 'sUSDC(BSC)'
        },
        susdc_eth: {
          address: 'secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv',
          logo: 'https://siasky.net/AABXRSQbMXk8PLV3CkBPSl4NW2WsSQvyOkZZRfsZeaW4Ww',
          symbol: 'sUSDC(ETH)'
        },
        susdc_eth_susdc_bsc_lp: {
          address: 'secret163e9frya0vqar70s4j3na94apf0cffl2rjgmgg',
          asset_one: 'susdc_eth',
          asset_two: 'susdc_bsc',
          symbol: 'sUSDC(ETH)-sUSDC(BSC) LP'
        },
        susdt_eth: {
          address: 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f',
          logo: 'https://siasky.net/AAAbmpaWIL-4kXFj0xxrXsby7kSN9AQeyV6hBD65m2o9mg',
          symbol: 'sUSDT(ETH)'
        },
        swbtc: {
          address: 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a',
          logo: 'https://siasky.net/CADR09K2Etst36IFvwVUdFwO4WhD91YiURrWNwzq_-7m1A',
          symbol: 'sWBTC'
        },
        sxmr: {
          address: 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88',
          logo: 'https://siasky.net/FABkpNmXiHbaXby3duNfzFZXjDeLPxxhH2TAmBddKoGZhQ',
          symbol: 'sXMR'
        },
        syfi_eth: {
          address: 'secret15grq8y54tvc24j8hf8chunsdcr84fd3d30fvqv',
          logo: 'https://siasky.net/AAAPBQ2YpF1e6u3yrC1bL0UnzGYh2YVjWBeYODi4BsWIvg',
          symbol: 'sYFI(ETH)'
        }
      };
      this.height = undefined;
      let protocols = {
        secret_swap: {
          name: 'Secret Swap',
          url: 'https://app.secretswap.io/earn'
        }
      }
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.pools = [
        {
          title: 'Profit distributor',
          address: 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz',
          deposit_gas: '400000',
          deposit_msg: 'eyAiZGVwb3NpdF9idXR0Y29pbiI6IHt9IH0=',
          deposit_token: cryptocurrencies['butt'],
          earn_token: cryptocurrencies['sefi'],
          withdraw_gas: '400000',
        },
        {
          title: 'Earn Buttcoin',
          address: 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku',
          deposit_gas: '600000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['butt_swbtc_lp'],
          earn_token: cryptocurrencies['butt'],
          withdraw_gas: '600000',
        },
        {
          address: 'secret17gpz09yv0eyw633y459ncqmf4qsye9kwqecnvf',
          apy: '1,465',
          deposit_gas: '1600000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi'],
          earn_token: cryptocurrencies['sefi'],
          farm_contract_address: 'secret1knars62aly28xkqxe8xeqtf7ans8hqxgm6a05k',
          protocol: protocols['secret_swap'],
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '1600000',
        },
        {
          address: 'secret1yuxtccepn3n3z8stqq8cwkz2kvyjcx4nahcs0v',
          apy: '3,100',
          deposit_gas: '2800000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_sefi_lp'],
          earn_token: cryptocurrencies['sscrt_sefi_lp'],
          farm_contract_address: 'secret1twjquxp06j9ppyg4v6dr496fnmfcvzpx8weddm',
          protocol: protocols['secret_swap'],
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '2800000',
        },
        // Secret swap SEFI-sXMR - UPDATE CONTRACT ADDRESSES WHEN AVAILABLE
        {
          address: 'secret184tcgt7auytx786yylnf8cvtn22utvn2zaw7ej',
          deposit_gas: '1600000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi_sxmr_lp'],
          earn_token: cryptocurrencies['sefi_sxmr_lp'],
          farm_contract_address: 'secret1t7xqjaqx4jr68w0xwlqvwzwks2e2l0q24wjajf',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1600000',
          reward_token: cryptocurrencies['sefi'],
          under_maintenance: true,
        },
        // Secret swap SEFI-sUSDC(ETH) - UPDATE CONTRACT ADDRESSES WHEN AVAILABLE
        {
          address: 'secret184tcgt7auytx786yylnf8cvtn22utvn2zaw7ej',
          deposit_gas: '1600000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi_susdc_eth_lp'],
          earn_token: cryptocurrencies['sefi_susdc_eth_lp'],
          farm_contract_address: 'secret1t7xqjaqx4jr68w0xwlqvwzwks2e2l0q24wjajf',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1600000',
          reward_token: cryptocurrencies['sefi'],
          under_maintenance: true,
        },
      ]
      this.retryCount = 0;
      $.each(this.pools, function(index, value) {
        let html = '<div class="card mb-3"><div class="card-body"><div class="row"><div class="col-12">'
        if (value['title']) {
          html += '<h5>' + value['title'] + '</h5>'
        }
        html += '</div><div class="col-sm-7">'
        if (value['deposit_token'] == value['earn_token']) {
          html += '<div>Depoit & Earn</div>'
          html += '<span class="mr-2">'
          html += value['deposit_token']['symbol']
          if (value['deposit_token']['logo']) {
            html += '</span><span><img class="logo-avatar" src="'
            html += value['deposit_token']['logo']
          } else {
            html += '</span><span><img class="logo-avatar mr-1" src="'
            html += cryptocurrencies[value['deposit_token']['asset_one']]['logo']
            html += '"></span><span><img class="logo-avatar" src="'
            html += cryptocurrencies[value['deposit_token']['asset_two']]['logo']
          }
          html += '"></span>'
        } else {
          html += '<span class="mr-2">Deposit '
          html += value['deposit_token']['symbol']
          if (value['deposit_token']['logo']) {
            html += '</span><span><img class="logo-avatar" src="'
            html += value['deposit_token']['logo']
          } else {
            html += '</span><span><img class="logo-avatar mr-1" src="'
            html += cryptocurrencies[value['deposit_token']['asset_one']]['logo']
            html += '"></span><span><img class="logo-avatar" src="'
            html += cryptocurrencies[value['deposit_token']['asset_two']]['logo']
          }
          html += '"></span><br><span class="mr-2">Earn '
          html += value['earn_token']['symbol'] + '</span>'
          if (value['earn_token']['logo']) {
            html += '<span><img class="logo-avatar" src="'
            html += value['earn_token']['logo']
          } else {
            html += '</span><span><img class="logo-avatar mr-1" src="'
            html += cryptocurrencies[value['earn_token']['asset_one']]['logo']
            html += '"></span><span><img class="logo-avatar" src="'
            html += cryptocurrencies[value['earn_token']['asset_two']]['logo']
          }
          html += '"></span>'
        }
        if (value['protocol']) {
          html += '<br/><span>via </span><a href='
          html += value['protocol']['url']
          html += ' target="_blank" rel="noopener">'
          html += value['protocol']['name']
          html += '</a>'
        }
        html += '</div>'
        if (!value['under_maintenance']) {
          html += '<div class="col-sm-5">TVL: <span class="'
          html += value['address'] + '-total-shares"></span>'
          if (value['apy']) {
            html += '<br>APY: ~' + value['apy'] + '%'
          }
          if (value['farm_contract_address']) {
            html += '<br>Rewards to process: <span class="' + value['address'] + '-rewards-to-process"></span><span> ' + value['reward_token']['symbol'] + '</span>'
          } else {
            html += '<br>Claimable ' + value['earn_token']['symbol'] + ': <span class="' + value['address'] + '-claimable"></span>'
          }
          html += '</div>'
        }
        html += '</div>'
        if (value['under_maintenance']) {
          html += '<div class="row"><div class="col-12"><hr></div><div class="col-12"><h5>It\'s in the pipe 5 by 5</h5></div></div>'
        } else {
          html += '<div class="row"><div class="col-12"><hr></div><div class="col-sm-6">Depositable: <span class="'
          html += value['deposit_token']['address'] + '-balance-loading d-none">Loading...</span><span class="'
          html += value['deposit_token']['address'] + '-balance-link"><span class="'
          html += value['deposit_token']['address'] + '-balance"></span><button class="btn btn-light btn-sm ml-2 border '
          html += value['deposit_token']['address'] + '-balance-view-button d-none" type="button"><div class="d-none loading"><em aria-hidden="true" class="spinner-grow spinner-grow-sm" role="status"></em><em>Loading...</em></div><div class="ready"><div class="fas fa-search mr-1"></div>View</div></button></span><form name="'
          html += value['address'] + 'DepositForm"><div class="input-group mb-3"><input class="form-control" name="amount" autocomplete="off">'
          html += '<div class="input-group-append"><span class="input-group-text">'
          html += value['deposit_token']['symbol']
          html += '</span></div></div><button class="btn btn-primary btn-rg '
          html += value['address'] + '-deposit-button" type="submit"><div class="d-none '
          html += value['address'] + '-deposit-button-loading"><em aria-hidden="true" class="spinner-grow spinner-grow-sm" role="status"></em><em>Loading...</em></div><div class="'
          html += value['address'] + '-deposit-button-ready">Deposit</div></button></form></div><div class="col-sm-6">Withdrawable: <span class="'
          html += value['address'] + '-user-shares"></span><form name="'
          html += value['address'] + 'WithdrawForm"><div class="input-group mb-3"><input class="form-control" name="amount" autocomplete="off">'
          html += '<div class="input-group-append"><span class="input-group-text">'
          html += value['deposit_token']['symbol']
          html += '</span></div></div><button class="btn btn-primary btn-rg '
          html += value['address'] + '-withdraw-button" type="submit"><div class="d-none '
          html += value['address'] + '-withdraw-button-loading"><em aria-hidden="true" class="spinner-grow spinner-grow-sm" role="status"></em><em>Loading...</em></div><div class="'
          html += value['address'] + '-withdraw-button-ready">Withdraw</div></button></form></div></div></div>'
          if (value['farm_contract_address']) {
            html += '<div class="col-12"><hr/>* Fees: 5% of yield sent to profit distributor (smart contract)'
            html += '<br>* Rewards are reinvested every time a user deposits or withdraws</div>'
          }
          html += '</div>'
        }
        $("#pools").append(html);

        let balanceViewButtonSelector = '.' + value['deposit_token']['address'] + '-balance-view-button'
        let $balanceViewButton = $(balanceViewButtonSelector)
        document.querySelectorAll(balanceViewButtonSelector).forEach(item => {
          item.addEventListener('click', async(evt) => {
            $balanceViewButton.prop("disabled", true);
            $balanceViewButton.find('.loading').removeClass('d-none')
            $balanceViewButton.find('.ready').addClass('d-none')
            try {
              await window.keplr.suggestToken(this.chainId, value['deposit_token']['address']);
              this.updateWalletBalance(value['deposit_token']);
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
              amount = amount.replace(/,/g, '');
              let handleMsg = { send: { amount: (amount * 1_000_000).toFixed(0), recipient: value['address'], msg: value['deposit_msg'] } }
              let response = await this.client.execute(value['deposit_token']['address'], handleMsg)
              document.showAlertSuccess("Deposit successful");
              document[value['address'] + 'DepositForm'].amount.value = ''
              this.updatePoolInterface(value, true)
            }
            catch(err) {
              // When this error happens, it may or may not have have gone through. Not sure why Datahub is sending this error.
              // Doesn't matter how much gas I put up for some of these contracts. It either works or it doesn't
              if (err.message.includes('HTTP 502')) {
                // If TVL or Rewards to process has changed then it's a success, otherwise show gas error
                let tVLBeforeUpdate = $("." + value['address'] + "-total-shares").text()
                let rewardsToProcessBeforeUpdate = $("." + value['address'] + "-rewards-to-process").text()
                this.updateClaimable(value)
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
              let amount = document[value['address'] + 'WithdrawForm'].amount.value;
              amount = amount.replace(/,/g, '');
              let handleMsg;
              if (value['address'] == 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
                handleMsg = { withdraw: { shares_amount: (amount * 1_000_000).toFixed(0) } }
              } else if (value['address'] == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz') {
                handleMsg = { withdraw: { amount: (amount * 1_000_000).toFixed(0) } }
              } else {
                handleMsg = { withdraw: { incentivized_token_amount: (amount * 1_000_000).toFixed(0) } }
              }
              let response = await this.client.execute(value['address'], handleMsg)
              document.showAlertSuccess("Withdraw successful");
              document[value['address'] + 'WithdrawForm'].amount.value = ''
              this.updatePoolInterface(value, true)
            }
            catch(err) {
              // When this error happens, it may or may not have have gone through. Not sure why Datahub is sending this error.
              // Doesn't matter how much gas I put up for some of these contracts. It either works or it doesn't
              if (err.message.includes('HTTP 502')) {
                // If TVL or Rewards to process has changed then it's a success, otherwise show gas error
                let tVLBeforeUpdate = $("." + value['address'] + "-total-shares").text()
                let rewardsToProcessBeforeUpdate = $("." + value['address'] + "-rewards-to-process").text()
                this.updateClaimable(value)
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

      this.setClient = (gas) => {
        this.client = new SigningCosmWasmClient(
          this.httpUrl,
          this.address,
          this.keplrOfflineSigner,
          window.getEnigmaUtils(this.chainId),
          {
            exec: {
              amount: [{ amount: gas, denom: 'uscrt' }],
              gas: gas,
            },
          },
        );
      }

      document.connectWalletForm.onsubmit = async (e) => {
        e.preventDefault()
        $("#connect-wallet-button").prop("disabled", true);
        $("#connect-wallet-button-loading").removeClass("d-none")
        $("#connect-wallet-button-ready").addClass("d-none")

        try {
          // Keplr extension injects the offline signer that is compatible with cosmJS.
          // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
          // And it also injects the helper function to `window.keplr`.
          // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
          if (!window.getOfflineSigner || !window.keplr) {
            throw "Please install keplr extension";
          } else {
            if (window.keplr.experimentalSuggestChain) {
              // This method will ask the user whether or not to allow access if they haven't visited this website.
              // Also, it will request user to unlock the wallet if the wallet is locked.
              // If you don't request enabling before usage, there is no guarantee that other methods will work.
              await window.keplr.enable(this.chainId);

              // @ts-ignore
              this.keplrOfflineSigner = window.getOfflineSigner(this.chainId);
              const accounts = await this.keplrOfflineSigner.getAccounts();
              this.address = accounts[0].address;
              this.setClient('350000');
              this.account = await this.client.getAccount(this.address);
              this.updateUserInterface()
            } else {
              throw "Please use the recent version of keplr extension";
            }
          }
          $('#connect-wallet-form').addClass('d-none')
        }
        catch(err) {
          let errorDisplayMessage = err;
          document.showAlertDanger(errorDisplayMessage)
        }
        finally {
          $("#connect-wallet-button").prop("disabled", false);
          $("#connect-wallet-button-ready").removeClass("d-none")
          $("#connect-wallet-button-loading").addClass("d-none")
        }
      };

      this.updatePoolInterface = (pool, afterTransaction = false) => {
          this.updateWalletBalance(pool['deposit_token'])
          this.updateClaimable(pool)
          this.updateTotalShares(pool)
          this.updateUserWithdrawable(pool)
          if (afterTransaction) {
            this.updateWalletBalance(pool['reward_token'] || pool['earn_token'])
          }
      }

      this.updateUserInterface = () => {
        this.pools.forEach(function(pool, index) {
          this.updatePoolInterface(pool)
        }.bind(this));
      }

      this.updateUserWithdrawable = async(pool) => {
        let client = document.secretNetworkClient(this.environment);
        let $userShares = $('.' + pool['address'] + '-user-shares')
        let depositTokenSymbol = pool['deposit_token']['symbol']

        try {
          $userShares.text('Loading...');
          let userResponse;
          let withdrawable = 0;
          if (pool.address == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz') {
            userResponse = await client.queryContractSmart(pool.address, {user: {user_address: this.address}})
            withdrawable = userResponse['user']['shares']
          } else {
            userResponse = await client.queryContractSmart(pool.address, {user_info: {address: this.address}})
            withdrawable = userResponse['user_info']['shares']
            if (pool.address != 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
              // Factor in rewards when you get the chance
              let poolResponse = await client.queryContractSmart(pool.address, {pool: {}})
              let incentivizedTokenTotal = Number(poolResponse['pool']['incentivized_token_total']);
              if (Number(poolResponse['pool']['shares_total'] > 0)) {
                withdrawable = withdrawable * incentivizedTokenTotal / Number(poolResponse['pool']['shares_total'])
              } else {
                withdrawable = 0
              }
              
            }
          }
          $userShares.text((withdrawable / 1_000_000).toLocaleString('en', {maximumFractionDigits: 6}))
        } catch(err) {
          $userShares.text('0');
          console.log(err)
        }
      }

      this.updateClaimable = async(pool) => {
        let client = document.secretNetworkClient(this.environment);
        if (pool.farm_contract_address) {
          if (!pool.under_maintenance) {
            let $poolRewardsToProcess = $('.' + pool.address + '-rewards-to-process')
            try {
              $poolRewardsToProcess.text('Loading...');
              if (!this.height) {
                this.height = await client.getHeight();
              }
              let response = await client.queryContractSmart(pool.farm_contract_address, {rewards: { address: pool.address, height: this.height, key: "DoTheRightThing." }})
              $poolRewardsToProcess.text((response['rewards']['rewards'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 6}))
            } catch(err) {
              console.log(err)
              console.log(this.height)
              console.log(pool)
              if (this.retryCount < 5) {
                this.retryCount += 1
                this.updateClaimable(pool)
              }
            }
          }
        } else {
          let $poolClaimable = $('.' + pool.address + '-claimable')
          try {
            $poolClaimable.text('Loading...');
            if (pool.address == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz') {
              let response = await client.queryContractSmart(pool.address, {claimable_profit: { user_address: this.address}})
              $poolClaimable.text((response['claimable_profit']['amount'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 6}))
            } else {
              if (!this.height) {
                this.height = await client.getHeight();
              }
              let response = await client.queryContractSmart(pool.address, {pending_buttcoin: { address: this.address, height: this.height }})
              $poolClaimable.text((response['pending_buttcoin']['amount'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 6}))
            }
          } catch(err) {
            console.log(err)
            if (this.retryCount < 5) {
              this.retryCount += 1
              this.updateClaimable(pool)
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
          $(totalSharesSelector).text('Loading...')
          if (poolAddress == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz') {
            let config = await client.queryContractSmart(poolAddress, {config: {}})
            $(totalSharesSelector).text((config['config']['total_shares'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 6}) + ' ' + depositTokenSymbol)
          } else if (poolAddress == 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
            let response = await client.queryContractSmart(poolAddress, {pool: {}})
            $(totalSharesSelector).text((response['pool']['shares_total'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 6}) + ' ' + depositTokenSymbol)
          } else {
            let responseTwo = await client.queryContractSmart(poolAddress, {pool: {}})
            $(totalSharesSelector).text((responseTwo['pool']['incentivized_token_total'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 6}) + ' ' + depositTokenSymbol)
          }
        } catch(err) {
          console.log(err)
        }
      }

      this.updateWalletBalance = async(cryptocurrency) => {
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
          let balance = await client.queryContractSmart(address, { balance: { address: this.address, key: key } })
          $walletBalance.text((balance['balance']['amount'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 6}))
          $walletBalance.removeClass('d-none')
          $walletBalanceViewButton.addClass('d-none')
        } catch(err) {
          console.log(err)
          // If they don't have a viewing key, show the view balance button and hide the balance
          $walletBalance.addClass('d-none')
          $walletBalanceViewButton.removeClass('d-none')
        } finally {
          $walletBalanceLoading.addClass('d-none')
          $walletBalanceViewButton.find('.loading').addClass('d-none')
          $walletBalanceLink.removeClass('d-none')
        }
      }

      // Query profit distributor
      $('#connect-wallet-form').submit()
    }
  };
});
