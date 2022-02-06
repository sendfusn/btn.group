$(document).ready(function(){
  if($("#secret-network-mount-doom").length) {
    // Listeners 
    $('input[type=radio][name=tokenType]').change(function() {
      if (this.value == 'nft') {
        $('#fungibleTokenAddress').addClass('d-none')
        $('#nonFungibleTokenAddress').removeClass('d-none')
      } else if (this.value == 'snip-20') {
        $('#fungibleTokenAddress').removeClass('d-none')
        $('#nonFungibleTokenAddress').addClass('d-none')
      }
    });

    var changeSubmitButtonToLoading = function() {
      $('button[type="submit"]').prop("disabled", true)
      $("form .loading").removeClass("d-none")
      $("form .ready").addClass("d-none")
    }

    var changeSubmitButtonToReady = function() {
      $('button[type="submit"]').prop("disabled", false)
      $("form .loading").addClass("d-none")
      $("form .ready").removeClass("d-none")
    }

    window.onload = async () => {
      document.activateKeplr()
      this.mountDoomContractAddress = 'secret177e9pz4heqx3jtrxav3cqrq7jvp7uthhayk8uq';
      this.mountDoomContractDataHash = '8669D5303F367DEBA976820B36A89A80B88B4F0574C690FA7209D51C6BD18A53'
      document.mountDoomQueryForm.onsubmit = async (e) => {
        e.preventDefault()
        $nftsContainer = $('#nfts-container')
        $nftsContainer.addClass('d-none')
        $('#transactions-container').addClass('d-none')
        changeSubmitButtonToLoading()
        document.hideAllAlerts();
        try {
          let tokenType = document.mountDoomQueryForm.tokenType.value;
          if (tokenType == 'nft') {
            let tokenAddress = document.mountDoomQueryForm.nonFungibleTokenAddress.value;
            // Get the transactions for that token
            let params = {
              transaction_history: {
                address: this.mountDoomContractAddress,
                viewing_key: "DoTheRightThing.",
              }
            }
            let transactions_response = await document.secretNetwork.client().queryContractSmart(tokenAddress, params);
            if (transactions_response['viewing_key_error']) {
              throw(transactions_response['viewing_key_error']['msg'])
            }
            let txs = transactions_response['transaction_history']['txs']
            let nftsContainerHtml = ''
            _.each(txs, function(value) {
              (async () => {
                try {
                  let params = {
                    nft_info: {
                      token_id: value['token_id'],
                    }
                  }
                  let nftInfoResponse = await document.secretNetwork.client().queryContractSmart(tokenAddress, params);
                  let imageUrl;
                  let nftName;
                  console.log(nftInfoResponse)
                  if (nftInfoResponse['nft_info']['token_uri']) {
                    let result = await $.ajax({
                      url: nftInfoResponse['nft_info']['token_uri'],
                      type: 'GET'
                    })
                    imageUrl = result['image']
                    nftName = result['name']
                  } else if(nftInfoResponse['nft_info']['extension']['image']) {
                    imageUrl = nftInfoResponse['nft_info']['extension']['image']
                    nftName = nftInfoResponse['nft_info']['extension']['name']
                  } else {
                    imageUrl = nftInfoResponse['nft_info']['extension']['media'][0]['url']
                    nftName = nftInfoResponse['nft_info']['extension']['name']
                  }
                  nftsContainerHtml += '<div class="col-sm-6 col-md-4 col-lg-6 col-xl-4 col-xxl-3 mb-4"><div class="blog mb-0">'
                  nftsContainerHtml += '<div class="blog-photo"><img class="w-100" src="' + imageUrl + '"></div>'
                  nftsContainerHtml += '<div class="blog-text"><h5 class="title title-sm">' + nftName + '</h5>'
                  nftsContainerHtml += '</div></div></div>'
                  $nftsContainer.html(nftsContainerHtml)
                  $nftsContainer.removeClass('d-none')
                }
                catch(err) {
                  document.showAlertDanger(err)
                }
              })();
            }.bind(this))
          } else {
            let tokenAddress = document.mountDoomQueryForm.fungibleTokenAddress.value;
            // Reset transactions table and balance
            $transactionsTableBody = $('#transactions-table-body');
            $transactionsTableBody.html('')
            $("#balance").text('')
            $($('th')[2]).text('Amount')
            // Get the token info
            let token_info_response = await document.secretNetwork.client().queryContractSmart(tokenAddress, { token_info: {} });
            let token_decimals = token_info_response["token_info"]["decimals"]
            let token_symbol = token_info_response["token_info"]["symbol"]
            // Get the transactions for that token
            let params = {
              transfer_history: {
                address: this.mountDoomContractAddress,
                key: "DoTheRightThing.",
                page: 0,
                page_size: 1000
              }
            }
            let transactions_response = await document.secretNetwork.client().queryContractSmart(tokenAddress, params);
            if (transactions_response['viewing_key_error']) {
              throw(transactions_response['viewing_key_error']['msg'])
            }
            let transactionsTableBodyContent = '';
            let txs = transactions_response["transfer_history"]["txs"]
            await document.secretNetwork.transactions.getSmartContractsInTxs(this.mountDoomContractAddress, txs)
            txs.forEach((value) => {
              // ID & Date
              transactionsTableBodyContent += '<tr><td>'
              if (value['block_time']) {
                let options = { year: 'numeric', month: 'short', day: 'numeric' };
                let dateAsString = new Date(Number(value['block_time']) * 1000).toLocaleDateString(undefined, options);
                transactionsTableBodyContent += dateAsString + '<hr>'
              }
              transactionsTableBodyContent += 'id: #' + value['id'] + '</td><td>'
              // Description & Amount
              let amount = value['coins']['amount']
              amount = document.applyDecimals(amount, token_decimals)
              let description = '<a href="'
              let descriptionAddress;
              if (this.mountDoomContractAddress != value['receiver']) {
                amount *= -1
                descriptionAddress = value['receiver']
              } else {
                descriptionAddress = value['from']
              }
              let smartContract = document.secretNetwork.smartContracts[descriptionAddress]
              if (smartContract) {
                description += 'https://secretnodes.com/secret/chains/secret-4/contracts/' + descriptionAddress + '" target="_blank">' + descriptionAddress + '</a>'
                description += '<hr>Contract label: ' + smartContract['label']
              } else {
                description += 'https://secretnodes.com/secret/chains/secret-4/accounts/' + descriptionAddress + '" target="_blank">' + descriptionAddress + '</a>'
              }
              transactionsTableBodyContent += description + '</td><td>'
              transactionsTableBodyContent += parseFloat(amount).toLocaleString('en', { minimumFractionDigits: token_decimals }) + '</td></tr>'
            })
            transactionsTableBodyContent += '</tr>'
            $transactionsTableBody.html(transactionsTableBodyContent)
            // Add token symbol next to amount header
            $($('th')[2]).text('Amount' + ' (' + token_symbol + ')')

            // Get the balance for the token
            let msg = { balance:{ address: this.mountDoomContractAddress, key: "DoTheRightThing." } };
            let balance_response = await document.secretNetwork.client().queryContractSmart(tokenAddress, msg)
            if (balance_response["viewing_key_error"]) {
              throw balance_response["viewing_key_error"]["msg"]
            }
            // Display results
            $('#balance').text(document.applyDecimals(balance_response["balance"]["amount"], token_decimals).toLocaleString('en', { minimumFractionDigits: token_decimals }) + ' ' + token_symbol)
            $('#transactions-container').removeClass('d-none')
          }
        }
        catch(err) {
          if(err.message && err.message.includes('Wrong viewing key')) {
            document.showAlertWarning('Viewing key not set: Please set on the "Set viewing key" tab.')
          } else {
            document.showAlertDanger(err)
          }
        }
        finally {
          changeSubmitButtonToReady()
        }
      };

      document.mountDoomSetViewingKeyForm.onsubmit = async (e) => {
        e.preventDefault()
        changeSubmitButtonToLoading()
        document.hideAllAlerts();
        try {
          await document.connectKeplrWallet()
          if (document.secretNetwork.walletAddress) {
            let tokenAddress = document.mountDoomSetViewingKeyForm.tokenAddress.value;
            let contractHash = document.mountDoomSetViewingKeyForm.contractHash.value;
            let msg = { set_viewing_key_for_snip20: { address: tokenAddress, contract_hash: contractHash } };
            let gasParams = {
              exec: {
                amount: [{ amount: '50000', denom: 'uscrt' }],
                gas: '50000',
              },
            }
            await document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams).client.execute(this.mountDoomContractAddress, msg, '', [], gasParams.exec, this.mountDoomContractDataHash)
            document.showAlertSuccess("Viewing key \"DoTheRightThing.\" set.");
          }
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          changeSubmitButtonToReady()
        }
      };
    }
  };
});
