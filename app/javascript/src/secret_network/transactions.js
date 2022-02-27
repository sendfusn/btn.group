$(document).ready(function(){
  if($("#secret-network-transactions").length) {
    window.onload = async () => {
      this.nonFungibleTokenAddress = 'secret1xx4fp7qgkyxdk9elrzd8v5p7gj28lvxprwl9lw'
      this.tokenAddress = document.secretNetwork.butt.address;
      this.tokenType = 'fungibleToken'

      // === LIST ===
      var options = {
        valueNames: ['address', 'symbol']
      };
      this.tokenList = new List('token-list', options);
      this.nftList = new List('nft-list', options)

      // === LISTENERS ===
      $('input[type=radio][name=tokenType]').change(function(e) {
        this.tokenType = e['target']['value']
        document.secretNetworkTransactionsForm.viewingKey.value = ''
        if (this.tokenType == 'nft') {
          $('#fungible-token-button').addClass('d-none')
          $('#non-fungible-token-button').removeClass('d-none')
          if (this.nonFungibleTokenAddress) {
            $('.other-field-item').addClass('d-none')
          } else {
            $('.other-field-item').removeClass('d-none')
          }
        } else if (this.tokenType == 'fungibleToken') {
          $('#fungible-token-button').removeClass('d-none')
          $('#non-fungible-token-button').addClass('d-none')
          if (this.tokenAddress) {
            $('.other-field-item').addClass('d-none')
          } else {
            $('.other-field-item').removeClass('d-none')
          }
        }
      }.bind(this));
      $('#viewing-key-container .fa-eye').click(function(){
        if($('#viewing-key-input').attr('type') == 'text') {
          $('#viewing-key-input').attr('type', 'password')
        } else {
          $('#viewing-key-input').attr('type', 'text')
        }
      })
      $('#address').change(function(){
        $('#viewing-key-input').val('')
      })
      $(document).on('keplr_connected', async(evt) => {
        $('.load-wallet-link').removeClass('d-none')
      })
      $(document).on('keplr_dismissed', async(evt) => {
        $('#loading-vip').addClass('d-none')
        $('#pay-wall').removeClass('d-none')
      })
      $(document).on('vip_level_updated', async(evt) => {
        $('#loading-vip').addClass('d-none')
        if (document.secretNetwork.userVipLevel == 0) {
          $('#pay-wall').removeClass('d-none')
        } else {
          $('.alert').addClass('d-none')
        }
      })

      document.querySelector('#load-from-keplr-button').addEventListener('click', async(evt) => {
        let $target = $('#load-from-keplr-button')
        $target.prop("disabled", true);
        $target.find('.loading').removeClass('d-none')
        $target.find('.ready').addClass('d-none')
        try {
          await document.connectKeplrWallet(false)
          if (document.secretNetwork.walletAddress) {
            let tokenAddress;
            if (this.tokenType == 'nft') {
              tokenAddress = this.nonFungibleTokenAddress
              if (!this.nonFungibleTokenAddress) {
                tokenAddress = document.secretNetworkTransactionsForm.otherTokenAddress.value;
              }
            } else {
              tokenAddress = this.tokenAddress
              if (!this.tokenAddress) {
                tokenAddress = document.secretNetworkTransactionsForm.otherTokenAddress.value;
              }
            }
            document.secretNetworkTransactionsForm.address.value = document.secretNetwork.walletAddress
            let key = await window.keplr.getSecret20ViewingKey(document.secretNetwork.chainId(), tokenAddress)
            document.secretNetworkTransactionsForm.viewingKey.value = key
          }
        } catch(err) {
          if (err['message'].includes('There is no matched secret20')) {
            document.showAlertInfo('No viewing key in wallet for this contract.')
          } else {
            document.showAlertDanger(err)
          }
        } finally {
          // Show ready ui
          $target.prop("disabled", false);
          $target.find('.loading').addClass('d-none')
          $target.find('.ready').removeClass('d-none')
        }
      })

      $('li.bg-white').click(function(e){
        e.preventDefault()
        this.updateAfterTokenSelect(e)
      }.bind(this))

      // === FUNCTIONS ===
      this.updateAfterTokenSelect = async(event) => {
        $('#viewing-key-input').val('')
        $('.modal').modal('hide');
        $('#input-text-1').val('');
        $('#input-text-2').val('');
        this.tokenList.search()
        this.nftList.search()
        let cloudinaryPublicId = event['currentTarget']['dataset']['cryptocurrencyCloudinaryPublicId']
        let symbol = event['currentTarget']['dataset']['cryptocurrencySymbol']
        if (!cloudinaryPublicId) {
          cloudinaryPublicId = 'external-content.duckduckgo-1_memqe7'
        }
        if(this.tokenType == 'nft') {
          this.nftAddress = event['currentTarget']['dataset']['cryptocurrencyAddress']
          $('#non-fungible-token-button .symbol').text(event['currentTarget']['dataset']['cryptocurrencyName'])
          $('#non-fungible-token-button .logo-avatar').attr('src', 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,f_auto,h_48,q_100,w_48/v1/' + cloudinaryPublicId)
        } else {
          this.tokenAddress = event['currentTarget']['dataset']['cryptocurrencyAddress']
          $('#fungible-token-button .symbol').text(symbol)
          $('#fungible-token-button .logo-avatar').attr('src', 'https://res.cloudinary.com/hv5cxagki/image/upload/c_scale,f_auto,h_48,q_100,w_48/v1/' + cloudinaryPublicId)
        }
        if (symbol == 'OTHER') {
          $('.other-field-item').removeClass('d-none')
        } else {
          $('.other-field-item').addClass('d-none')
        }
      }

      document.secretNetworkTransactionsForm.onsubmit = async (e) => {
        e.preventDefault()
        let address = document.secretNetworkTransactionsForm.address.value;
        let queryParams;
        let tokenAddress;
        let token_decimals;
        let token_symbol;
        let viewingKey = document.secretNetworkTransactionsForm.viewingKey.value;
        let params;
        if (this.tokenType == 'nft') {
          tokenAddress = this.nonFungibleTokenAddress
        } else {
          tokenAddress = this.tokenAddress
        }
        if (!tokenAddress) {
          tokenAddress = document.secretNetworkTransactionsForm.otherTokenAddress.value;
        }

        let transactions = [];
        // Reset transactions table and balance
        $transactionsTableBody = $('#transactions-table-body');
        $transactionsTableBody.html('')
        $("#balance").text('')
        $($('th')[2]).text('Amount')

        // Button to loading
        $("#search-button").prop("disabled", true);
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")

        // Hide alerts
        document.hideAllAlerts();

        try {
          // First we need to find out if the user has premium access
          await document.secretNetwork.getAndSetUserVipLevel(document.secretNetwork.walletAddress)
          if (document.secretNetwork.userVipLevel == 0) {
            $('#pay-wall').removeClass('d-none')
            document.secretNetworkTransactionsForm.page.value = 1
            document.secretNetworkTransactionsForm.pageSize.value = '10'
          } else {
            $('#pay-wall').addClass('d-none')
          }

          // Set params based on tokenType
          if (this.tokenType == 'nft') {
            params = {
              transaction_history: {
                address: address,
                viewing_key: viewingKey,
                page: parseFloat(document.secretNetworkTransactionsForm.page.value - 1),
                page_size: parseFloat(document.secretNetworkTransactionsForm.pageSize.value)
              }
            }
          } else {
            // Get the token info
            queryParams = {
              address: tokenAddress,
              query: { token_info: {} }
            }
            let token_info_response = await document.secretNetwork.queryContractSmart(queryParams);
            token_decimals = token_info_response["token_info"]["decimals"]
            token_symbol = token_info_response["token_info"]["symbol"]
            params = {
              transfer_history : {
                address: address,
                key: viewingKey,
                page: parseFloat(document.secretNetworkTransactionsForm.page.value - 1),
                page_size: parseFloat(document.secretNetworkTransactionsForm.pageSize.value)
              }
            }
          }

          // Get the transactions for that token
          queryParams = {
            address: tokenAddress,
            query: params
          }
          let transactions_response = await document.secretNetwork.queryContractSmart(queryParams);
          if (transactions_response['viewing_key_error']) {
            throw(transactions_response['viewing_key_error']['msg'])
          }
          let transactionsTableBodyContent = '';
          // Set params based on tokenType
          let txs;
          if (this.tokenType == 'nft') {
            txs = transactions_response["transaction_history"]["txs"]
          } else {
            txs = transactions_response["transfer_history"]["txs"]
          }

          await document.secretNetwork.transactions.getSmartContractsInTxs(address, txs)
          txs.forEach((value) => {
            // ID & Date
            transactionsTableBodyContent += '<tr><td>'
            if (value['block_time']) {
              let dateAsString = new Date(Number(value['block_time']) * 1000).toLocaleString(undefined, {dateStyle: 'short', timeStyle: 'short'});
              transactionsTableBodyContent += dateAsString + '<hr>'
            }
            let id = value['id']
            if (this.tokenType == 'nft') {
              id = value['tx_id']
            }
            transactionsTableBodyContent += 'id: #' + id + '</td><td>'

            // Description & Amount
            let amount;
            let descriptionAddress;
            let tokenId;
            if (this.tokenType == 'nft') {
              amount = 1
              if (address != value['action']['transfer']['recipient']) {
                amount *= -1
                descriptionAddress = value['action']['transfer']['recipient']
              } else {
                descriptionAddress = value['action']['transfer']['from']
              }
              tokenId = value['token_id']
            } else {
              amount = value['coins']['amount']
              amount = document.applyDecimals(amount, token_decimals)
              if (address != value['receiver']) {
                amount *= -1
                descriptionAddress = value['receiver']
              } else {
                descriptionAddress = value['from']
              }
            }
            
            let description = '<a href="'
            let smartContract = document.secretNetwork.smartContracts[descriptionAddress]
            if (smartContract) {
              description += 'https://secretnodes.com/secret/chains/secret-4/contracts/' + descriptionAddress + '" target="_blank">' + descriptionAddress + '</a>'
              description += '<hr>Contract label: ' + smartContract['label']
              if (tokenId) {
                description = description + '<br>Token id: ' + tokenId
              }
            } else {
              description += 'https://secretnodes.com/secret/chains/secret-4/accounts/' + descriptionAddress + '" target="_blank">' + descriptionAddress + '</a>'
              if (tokenId) {
                description = description + '<hr>Token id: ' + tokenId
              }
            }
            transactionsTableBodyContent += description + '</td><td>'
            transactionsTableBodyContent += parseFloat(amount).toLocaleString('en', { minimumFractionDigits: token_decimals }) + '</td></tr>'
          })
          transactionsTableBodyContent += '</tr>'
          $transactionsTableBody.html(transactionsTableBodyContent)
          // Add token symbol next to amount header
          let amountColumnHeader = 'Amount'
          if (this.tokenType == 'fungibleToken') {
            amountColumnHeader = 'Amount' + ' (' + token_symbol + ')'
          }
          $($('th')[2]).text(amountColumnHeader)

          // Get the balance for the token
          if (this.tokenType == 'nft') {
            params = {
              tokens: {
                limit: 1000,
                owner: address,
                viewing_key: viewingKey
              }
            }
          } else {
            params = {
              balance: {
                address: address,
                key: viewingKey
              }
            }
          }
          let queryParams2 = {
            address: tokenAddress,
            query: params
          }
          let response = await document.secretNetwork.queryContractSmart(queryParams2);
          // Display results
          let balance;
          if (this.tokenType == 'nft') {
            balance = response['token_list']['tokens'].length
          } else {
            balance = document.applyDecimals(response["balance"]["amount"], token_decimals).toLocaleString('en', { minimumFractionDigits: token_decimals }) + ' ' + token_symbol
          }
          $('#balance').text(balance)
        }
        catch(err) {
          console.error(err)
          let errorDisplayMessage = err
          if (err.message) {
            errorDisplayMessage = err.message;
          }
          if (errorDisplayMessage.includes('decoding bech32 failed')) {
            errorDisplayMessage = 'Token contract address is invalid.'
          }
          if (errorDisplayMessage.includes('{"generic_err":{"msg":"canonicalize_address errored: invalid checksum"}')) {
            errorDisplayMessage = 'Wallet address is invalid.'
          }
          document.showAlertDanger(errorDisplayMessage)
        }
        finally {
          // Enable form
          $("#search-button").prop("disabled", false);
          $("#loading").addClass("d-none")
          $("#ready").removeClass("d-none")
        }
      }
      document.activateKeplr()
    };
  }
});
