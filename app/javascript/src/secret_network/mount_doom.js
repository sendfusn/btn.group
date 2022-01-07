$(document).ready(function(){
  if($("#secret-network-mount-doom").length) {
    getAndSetSmartContracts(1)
    function getAndSetSmartContracts(blockchainId) {
      document.smartContracts = {}
      var request = new XMLHttpRequest()
      // Open a new connection, using the GET request on the URL endpoint
      request.open('GET', '/smart_contracts?blockchain_id=' + blockchainId, true)
      request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response)
        data.forEach((smartContract) => {
          document.smartContracts[smartContract["address"]] = smartContract;
        })
      }
      // Send request
      request.send()
    }

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
      this.environment = 'production'
      this.chainId = document.secretNetworkChainId(this.environment)
      this.client = document.secretNetworkClient(this.environment);
      this.contractAddress = document.featureContractAddress(this.environment);

      document.mountDoomQueryForm.onsubmit = async (e) => {
        e.preventDefault()
        $nftsContainer = $('#nfts-container')
        $nftsContainer.addClass('d-none')
        $('#transactions-container').addClass('d-none')
        changeSubmitButtonToLoading()
        document.hideAllAlerts();
        try {
          let tokenAddress = document.mountDoomQueryForm.tokenAddress.value;
          let tokenType = document.mountDoomQueryForm.tokenType.value;
          if (tokenType == 'nft') {
            // Get the transactions for that token
            let params = {
              transaction_history: {
                address: this.contractAddress,
                viewing_key: "DoTheRightThing.",
              }
            }
            let transactions_response = await this.client.queryContractSmart(tokenAddress, params);
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
                  let nftInfoResponse = await this.client.queryContractSmart(tokenAddress, params);
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
            // Reset transactions table and balance
            $transactionsTableBody = $('#transactions-table-body');
            $transactionsTableBody.html('')
            $("#balance").text('')
            $($('th')[2]).text('Amount')
            // Get the token info
            let token_info_response = await this.client.queryContractSmart(tokenAddress, { token_info: {} });
            let token_decimals = token_info_response["token_info"]["decimals"]
            let token_symbol = token_info_response["token_info"]["symbol"]
            // Get the transactions for that token
            let params = {
              transfer_history: {
                address: this.contractAddress,
                key: "DoTheRightThing.",
                page: 0,
                page_size: 1000
              }
            }
            let transactions_response = await this.client.queryContractSmart(tokenAddress, params);
            if (transactions_response['viewing_key_error']) {
              throw(transactions_response['viewing_key_error']['msg'])
            }
            let transactionsTableBodyContent = '';
            _.each(transactions_response["transfer_history"]["txs"], function(value){
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
              if (this.contractAddress != value['receiver']) {
                amount *= -1
                descriptionAddress = value['receiver']
              } else {
                descriptionAddress = value['from']
              }
              if (document.smartContracts[descriptionAddress]) {
                description += 'https://secretnodes.com/secret/chains/secret-4/contracts/' + descriptionAddress + '" target="_blank">' + descriptionAddress + '</a>'
                description += '<hr>Contract label: ' + document.smartContracts[descriptionAddress]['label']
              } else {
                description += 'https://secretnodes.com/secret/chains/secret-4/accounts/' + descriptionAddress + '" target="_blank">' + descriptionAddress + '</a>'
              }
              transactionsTableBodyContent += description + '</td><td>'
              transactionsTableBodyContent += parseFloat(amount).toLocaleString('en', { minimumFractionDigits: token_decimals }) + '</td></tr>'
            }.bind(this))
            transactionsTableBodyContent += '</tr>'
            $transactionsTableBody.html(transactionsTableBodyContent)
            // Add token symbol next to amount header
            $($('th')[2]).text('Amount' + ' (' + token_symbol + ')')

            // Get the balance for the token
            let msg = { balance:{ address: this.contractAddress, key: "DoTheRightThing." } };
            let balance_response = await this.client.queryContractSmart(tokenAddress, msg)
            if (balance_response["viewing_key_error"]) {
              throw balance_response["viewing_key_error"]["msg"]
            }
            // Display results
            $('#balance').text(document.applyDecimals(balance_response["balance"]["amount"], token_decimals).toLocaleString('en', { minimumFractionDigits: token_decimals }) + ' ' + token_symbol)
            $('#transactions-container').removeClass('d-none')
          }
        }
        catch(err) {
          document.showAlertDanger(err)
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
          let tokenAddress = document.mountDoomSetViewingKeyForm.tokenAddress.value;
          let contractHash = document.mountDoomSetViewingKeyForm.contractHash.value;
          let msg = { set_viewing_key_for_snip20: { address: tokenAddress, contract_hash: contractHash } };
          if (!window.getOfflineSigner || !window.keplr) {
            alert("Please install keplr extension");
          } else {
            if (window.keplr.experimentalSuggestChain) {
              try {
                // This method will ask the user whether or not to allow access if they haven't visited this website.
                // Also, it will request user to unlock the wallet if the wallet is locked.
                // If you don't request enabling before usage, there is no guarantee that other methods will work.
                await window.keplr.enable(this.chainId);

                // @ts-ignore
                const keplrOfflineSigner = window.getOfflineSigner(this.chainId);
                const accounts = await keplrOfflineSigner.getAccounts();
                this.address = accounts[0].address;
                let gasParams = {
                    exec: {
                      amount: [{ amount: '50000', denom: 'uscrt' }],
                      gas: '50000',
                    },
                  }
                this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
              } catch (error) {
                console.error(error)
              }
            } else {
              alert("Please use the recent version of keplr extension");
            }
          }

          result = await this.client.execute(this.contractAddress, msg)
          document.showAlertSuccess("Viewing key \"DoTheRightThing.\" set.");
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
