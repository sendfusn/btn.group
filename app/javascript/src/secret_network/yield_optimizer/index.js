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
        sefi: {
          address: 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt',
          logo: 'https://siasky.net/AABeTmPkxJ8CuGzgqCQM7sR0Y-3rTPZHJo4Jc9KObuTyBQ',
          symbol: 'SEFI'
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
        swbtc: {
          address: 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a',
          logo: 'https://siasky.net/CADR09K2Etst36IFvwVUdFwO4WhD91YiURrWNwzq_-7m1A',
          symbol: 'sWBTC'
        }
      };
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
          deposit_gas: '300000',
          deposit_token: cryptocurrencies['butt'],
          earn_token: cryptocurrencies['sefi'],
          withdraw_gas: '300000',
        },
        {
          title: 'Earn Buttcoin',
          address: 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku',
          deposit_gas: '600000',
          deposit_token: cryptocurrencies['butt_swbtc_lp'],
          earn_token: cryptocurrencies['butt'],
          withdraw_gas: '600000',
        },
        // Secret swap SEFI - UPDATE CONTRACT ADDRESSES WHEN AVAILABLE
        {
          address: 'secret184tcgt7auytx786yylnf8cvtn22utvn2zaw7ej',
          deposit_gas: '1800000',
          deposit_token: cryptocurrencies['sefi'],
          earn_token: cryptocurrencies['sefi'],
          farm_contract_address: 'secret1wuhypk53eukm9xvlzu2z30rtyqfh74qtqgvlvr',
          protocol: protocols['secret_swap'],
          withdraw_gas: '1300000',
        },
        // Secret swap sUSDC(ETH)-sUSDC(BSC)- UPDATE CONTRACT ADDRESSES WHEN AVAILABLE
        {
          address: 'secret184tcgt7auytx786yylnf8cvtn22utvn2zaw7ej',
          deposit_gas: '300000',
          deposit_token: cryptocurrencies['susdc_eth_susdc_bsc_lp'],
          earn_token: cryptocurrencies['susdc_eth_susdc_bsc_lp'],
          farm_contract_address: 'secret1t7xqjaqx4jr68w0xwlqvwzwks2e2l0q24wjajf',
          protocol: protocols['secret_swap'],
          withdraw_gas: '300000',
        },
      ]
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
        if (!value['farm_contract_address']) {
          html += '<div class="col-sm-5">TVL: <span class="'
          html += value['address'] + '-total-shares"></span>'
          html += '<br>Claimable ' + value['earn_token']['symbol'] + ': <span class="' + value['address'] + '-claimable"></span></div>'
        }
        html += '</div>'
        if (value['farm_contract_address']) {
          html += '<div class="row"><div class="col-12"><hr></div><div class="col-12"><h5>This will be live once Secret Swap initiates their new earn contracts.</h5></div></div>'
        } else {
          html += '<div class="row"><div class="col-12"><hr></div><div class="col-sm-6">Depositable: <span class="'
          html += value['deposit_token']['address'] + '-balance-loading d-none">Loading...</span><span class="'
          html += value['deposit_token']['address'] + '-balance-link"><span class="'
          html += value['deposit_token']['address'] + '-balance"></span><button class="btn btn-light btn-sm ml-2 border '
          html += value['deposit_token']['address'] + '-balance-view-button d-none" type="button"><div class="d-none loading"><em aria-hidden="true" class="spinner-grow spinner-grow-sm" role="status"></em><em>Loading...</em></div><div class="ready"><div class="fas fa-search mr-1"></div>View</div></button></span><form name="'
          html += value['address'] + 'DepositForm"><div class="input-group mb-3"><input class="form-control" name="amount">'
          html += '<div class="input-group-append"><span class="input-group-text">'
          html += value['deposit_token']['symbol']
          html += '</span></div></div><button class="btn btn-primary btn-rg '
          html += value['address'] + '-deposit-button" type="submit"><div class="d-none '
          html += value['address'] + '-deposit-button-loading"><em aria-hidden="true" class="spinner-grow spinner-grow-sm" role="status"></em><em>Loading...</em></div><div class="'
          html += value['address'] + '-deposit-button-ready">Deposit</div></button></form></div><div class="col-sm-6">Withdrawable: <span class="'
          html += value['address'] + '-user-shares"></span><form name="'
          html += value['address'] + 'WithdrawForm"><div class="input-group mb-3"><input class="form-control" name="amount">'
          html += '<div class="input-group-append"><span class="input-group-text">'
          html += value['deposit_token']['symbol']
          html += '</span></div></div><button class="btn btn-primary btn-rg '
          html += value['address'] + '-withdraw-button" type="submit"><div class="d-none '
          html += value['address'] + '-withdraw-button-loading"><em aria-hidden="true" class="spinner-grow spinner-grow-sm" role="status"></em><em>Loading...</em></div><div class="'
          html += value['address'] + '-withdraw-button-ready">Withdraw</div></button></form></div></div></div>'
          if (value['farm_contract_address']) {
            html += '<div class="col-12"><hr/>Fees: 5% of yield sent to profit distributor (smart contract)</div>'
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
        if(!value['farm_contract_address']) {
          document[value['address'] + 'DepositForm'].onsubmit = async (e) => {
            e.preventDefault()
            this.setClient(value['deposit_gas']);
            $depositButton.prop("disabled", true);
            $depositButtonLoading.removeClass("d-none")
            $depositButtonReady.addClass("d-none")
            try {
              let amount = document[value['address'] + 'DepositForm'].amount.value;
              amount = amount.replace(/,/g, '');
              let handleMsg = { send: { amount: (amount * 1_000_000).toString(), recipient: this.profitDistributorAddress, msg: 'eyAiZGVwb3NpdF9idXR0Y29pbiI6IHt9IH0=' } }
              let response = await this.client.execute(value['deposit_token']['address'], handleMsg)
              document.showAlertSuccess("Deposit successful");
              document[value['address'] + 'DepositForm'].amount.value = ''
              this.updateUserInterface()
            }
            catch(err) {
              let errorDisplayMessage = err;
              document.showAlertDanger(errorDisplayMessage)
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
            this.setClient(value['withdraw_gas']);
            $withdrawButton.prop("disabled", true);
            $withdrawButtonLoading.removeClass("d-none")
            $withdrawButtonReady.addClass("d-none")
            try {
              let amount = document[value['address'] + 'WithdrawForm'].amount.value;
              amount = amount.replace(/,/g, '');
              let handleMsg = { withdraw: { amount: (amount * 1_000_000).toString() } }
              let response = await this.client.execute(value['address'], handleMsg)
              document.showAlertSuccess("Withdraw successful");
              document[value['address'] + 'WithdrawForm'].amount.value = ''
              this.updateUserInterface()
            }
            catch(err) {
              let errorDisplayMessage = err;
              document.showAlertDanger(errorDisplayMessage)
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

      this.updateUserInterface = () => {
        this.pools.forEach(function(value, index) {
          this.updateWalletBalance(value['deposit_token'])
          this.updateClaimable(value)
          this.updateTotalShares(value)
          this.updateUserWithdrawable(value)
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
              withdrawable = withdrawable * incentivizedTokenTotal / Number(poolResponse['pool']['shares_total'])
            }
          }
          $userShares.text((withdrawable / 1_000_000).toLocaleString('en', {maximumFractionDigits: 18}))
        } catch(err) {
          $userShares.text('0 ' + depositTokenSymbol);
          console.log(err)
        }
      }

      this.updateClaimable = async(pool) => {
        if (!pool.farm_contract_address) {
          let client = document.secretNetworkClient(this.environment);
          let $poolClaimable = $('.' + pool.address + '-claimable')
          try {
            $poolClaimable.text('Loading...');
            let message;
            if (pool.address == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz') {
              let response = await client.queryContractSmart(pool.address, {claimable_profit: { user_address: this.address}})
              $poolClaimable.text((response['claimable_profit']['amount'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 18}))
            } else {
              let height = await client.getHeight();
              let response = await client.queryContractSmart(pool.address, {pending_buttcoin: { address: this.address, height: height }})
              $poolClaimable.text((response['pending_buttcoin']['amount'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 18}))
            }
          } catch(err) {
            $poolClaimable.text('0');
            console.log(err)
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
            $(totalSharesSelector).text((config['config']['total_shares'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 18}) + ' ' + depositTokenSymbol)
          } else if (poolAddress == 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
            let response = await client.queryContractSmart(poolAddress, {pool: {}})
            $(totalSharesSelector).text((response['pool']['shares_total'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 18}) + ' ' + depositTokenSymbol)
          } else {
            let responseTwo = await client.queryContractSmart(poolAddress, {pool: {}})
            $(totalSharesSelector).text((responseTwo['pool']['incentivized_token_total'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 18}) + ' ' + depositTokenSymbol)
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
          $walletBalance.text((balance['balance']['amount'] / 1_000_000).toLocaleString('en', {maximumFractionDigits: 18}))
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

      // document.spySEFIV2DepositForm.onsubmit = async (e) => {
      //   e.preventDefault()
      //   this.setClient('1800000');
      //   $("#spy-sefi-v2-deposit-button").prop("disabled", true);
      //   $("#spy-sefi-v2-deposit-button-loading").removeClass("d-none")
      //   $("#spy-sefi-v2-deposit-button-ready").addClass("d-none")
      //   try {
      //     let amount = document.spySEFIV2DepositForm.amount.value;
      //     amount = amount.replace(/,/g, '');
      //     let handleMsg = { send: { amount: (amount * 1_000_000).toString(), recipient: this.yieldOptimizerSpySEFIAddress, msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9' } }
      //     let response = await this.client.execute(this.SEFIAddress, handleMsg)
      //     document.showAlertSuccess("Deposit successful");
      //     document.spySEFIV2DepositForm.amount.value = ''
      //     this.updateUserInterface()
      //   }
      //   catch(err) {
      //     let errorDisplayMessage = err;
      //     document.showAlertDanger(errorDisplayMessage)
      //   }
      //   finally {
      //     $("#spy-sefi-v2-deposit-button").prop("disabled", false);
      //     $("#spy-sefi-v2-deposit-button-loading").addClass("d-none")
      //     $("#spy-sefi-v2-deposit-button-ready").removeClass("d-none")
      //   }
      // };

      // document.spySEFIV2WithdrawForm.onsubmit = async (e) => {
      //   e.preventDefault()
      //   this.setClient('1300000');
      //   $("#spy-sefi-v2-withdraw-button").prop("disabled", true);
      //   $("#spy-sefi-v2-withdraw-button-loading").removeClass("d-none")
      //   $("#spy-sefi-v2-withdraw-button-ready").addClass("d-none")
      //   try {
      //     let amount = document.spySEFIV2WithdrawForm.amount.value;
      //     amount = amount.replace(/,/g, '');
      //     let handleMsg = { withdraw: { incentivized_token_amount: (amount * 1_000_000).toString() } }
      //     let response = await this.client.execute(this.yieldOptimizerSpySEFIAddress, handleMsg)
      //     document.showAlertSuccess("Withdraw successful");
      //     document.spySEFIV2WithdrawForm.amount.value = ''
      //     this.updateUserInterface()
      //   }
      //   catch(err) {
      //     let errorDisplayMessage = err;
      //     document.showAlertDanger(errorDisplayMessage)
      //   }
      //   finally {
      //     $("#spy-sefi-v2-withdraw-button").prop("disabled", false);
      //     $("#spy-sefi-v2-withdraw-button-loading").addClass("d-none")
      //     $("#spy-sefi-v2-withdraw-button-ready").removeClass("d-none")
      //   }
      // };

      // document.yieldOptimizerBDepositForm.onsubmit = async (e) => {
      //   e.preventDefault()
      //   this.setClient('600000');
      //   $("#yield-optimizer-b-deposit-button").prop("disabled", true);
      //   $("#yield-optimizer-b-deposit-button-loading").removeClass("d-none")
      //   $("#yield-optimizer-b-deposit-button-ready").addClass("d-none")
      //   try {
      //     let amount = document.yieldOptimizerBDepositForm.amount.value;
      //     amount = amount.replace(/,/g, '');
      //     let handleMsg = { send: { amount: (amount * 1_000_000).toString(), recipient: this.yieldOptimizerBAddress, msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9' } }
      //     let response = await this.client.execute(this.buttSWBTCLPContractAddress, handleMsg)
      //     document.showAlertSuccess("Deposit successful");
      //     document.yieldOptimizerBDepositForm.amount.value = ''
      //     this.updateYieldOptimizerBUserShares();
      //     this.updateYieldOptimizerBUserClaimableButt();
      //     this.updateYieldOptimizerBTotalShares();
      //     this.updateBUTTSWBTCLPWalletBalance()
      //   }
      //   catch(err) {
      //     let errorDisplayMessage = err;
      //     document.showAlertDanger(errorDisplayMessage)
      //   }
      //   finally {
      //     $("#yield-optimizer-b-deposit-button").prop("disabled", false);
      //     $("#yield-optimizer-b-deposit-button-loading").addClass("d-none")
      //     $("#yield-optimizer-b-deposit-button-ready").removeClass("d-none")
      //   }
      // };

      // document.yieldOptimizerBWithdrawForm.onsubmit = async (e) => {
      //   e.preventDefault()
      //   this.setClient('600000');
      //   $("#yield-optimizer-b-withdraw-button").prop("disabled", true);
      //   $("#yield-optimizer-b-withdraw-button-loading").removeClass("d-none")
      //   $("#yield-optimizer-b-withdraw-button-ready").addClass("d-none")
      //   try {
      //     let amount = document.yieldOptimizerBWithdrawForm.amount.value;
      //     amount = amount.replace(/,/g, '');
      //     let handleMsg = { withdraw: { shares_amount: (amount * 1_000_000).toString() } }
      //     let response = await this.client.execute(this.yieldOptimizerBAddress, handleMsg)
      //     document.showAlertSuccess("Withdraw successful");
      //     document.yieldOptimizerBWithdrawForm.amount.value = ''
      //     this.updateYieldOptimizerBUserShares();
      //     this.updateYieldOptimizerBUserClaimableButt();
      //     this.updateYieldOptimizerBTotalShares();
      //     this.updateBUTTSWBTCLPWalletBalance()
      //   }
      //   catch(err) {
      //     let errorDisplayMessage = err;
      //     document.showAlertDanger(errorDisplayMessage)
      //   }
      //   finally {
      //     $("#yield-optimizer-b-withdraw-button").prop("disabled", false);
      //     $("#yield-optimizer-b-withdraw-button-loading").addClass("d-none")
      //     $("#yield-optimizer-b-withdraw-button-ready").removeClass("d-none")
      //   }
      // };

      // this.updateYieldOptimizerSpySEFIV2UserWithdrawable = async() => {
      //   let client = document.secretNetworkClient(this.environment);

      //   try {
      //     this.$yieldOptimizerSpySEFIV2UserWithdrawable.text('Loading...');
      //     let height = await client.getHeight();
      //     let rewardsResponse = await client.queryContractSmart(this.spySEFIAddress, {rewards: { address: this.yieldOptimizerSpySEFIAddress, key: 'DoTheRightThing.', height: height }});
      //     let totalClaimableRewards = Number(rewardsResponse['rewards']['rewards']);
      //     let response = await client.queryContractSmart(this.yieldOptimizerSpySEFIAddress, {user_info: { address: this.address}})
      //     let poolResponse = await client.queryContractSmart(this.yieldOptimizerSpySEFIAddress, {pool: {}})
      //     let userShares = Number(response['user_info']['shares']);
      //     let incentivizedTokenTotal = Number(poolResponse['pool']['incentivized_token_total']);
      //     let sharesTotal = Number(poolResponse['pool']['shares_total']);
      //     let userWithdrawable = 0;
      //     if (sharesTotal > 0) {
      //       let userRewards = totalClaimableRewards * 9_500 / 10_000 * userShares / sharesTotal
      //       userWithdrawable = userShares * incentivizedTokenTotal / sharesTotal + userRewards;
      //     };
      //     this.$yieldOptimizerSpySEFIV2UserWithdrawable.text((userWithdrawable / 1_000_000).toLocaleString('en', {maximumFractionDigits: 6}) + ' SEFI')
      //   } catch(err) {
      //     this.$yieldOptimizerSpySEFIV2UserWithdrawable.text('0 SEFI');
      //     console.log(err)
      //   }
      // }

      // Query profit distributor
      $('#connect-wallet-form').submit()
    }
  };
});
