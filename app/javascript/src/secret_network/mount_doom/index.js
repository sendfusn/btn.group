$(document).ready(function(){
  if($("#secret-network-mount-doom").length) {
    // Listeners
    $('input[type=radio][name=interactionType]').on('change', function() {
      var radVal = $(this).val();
      if (radVal == 'query') {
        $('#contract-hash-input-group').addClass('d-none')
        $('#contract-hash').prop('required', false)
        $('#transactions-container').removeClass('d-none')
      } else if (radVal == 'set') {
        $('#contract-hash-input-group').removeClass('d-none')
        $('#contract-hash').prop('required', true)
        $('#transactions-container').addClass('d-none')
        $transactionsTableBody = $('#transactions-table-body');
        $transactionsTableBody.html('')
        $("#balance").text('')
        $($('th')[2]).text('Amount')
      }
    })
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

    window.onload = async () => {
      document.mountDoomForm.onsubmit = () => {
        $("#submit-button").prop("disabled", true);
        $("#loading").removeClass("d-none")
        $("#ready").addClass("d-none")
        document.hideAllAlerts();

        (async () => {
          try {
            // Set environment
            let environment = document.featureEnvironment();
            let chainId = document.secretNetworkChainId(environment)
            let client =  document.secretNetworkClient(environment);
            let contractAddress = document.featureContractAddress(environment);
            let httpUrl = document.secretNetworkHttpUrl(environment)
            let tokenAddress = document.mountDoomForm.tokenAddress.value;
            if(document.mountDoomForm.interactionType.value == 'query') {
              // Reset transactions table and balance
              $transactionsTableBody = $('#transactions-table-body');
              $transactionsTableBody.html('')
              $("#balance").text('')
              $($('th')[2]).text('Amount')

              // Get the token info
              let token_info_response = await client.queryContractSmart(tokenAddress, { token_info: {} });
              let token_decimals = token_info_response["token_info"]["decimals"]
              let token_symbol = token_info_response["token_info"]["symbol"]

              // Get the transactions for that token
              let params = {
                transfer_history: {
                  address: contractAddress,
                  key: "DoTheRightThing.",
                  page: 0,
                  page_size: 1000
                }
              }
              let transactions_response = await client.queryContractSmart(tokenAddress, params);
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
                amount = applyDecimals(amount, token_decimals)
                let description = '<a href="'
                let descriptionAddress;
                if (contractAddress != value['receiver']) {
                  amount *= -1
                  descriptionAddress = value['receiver']
                } else {
                  descriptionAddress = value['from']
                }
                if (document.smartContracts[descriptionAddress]) {
                  description += 'https://secretnodes.com/secret/chains/secret-3/contracts/' + descriptionAddress + '" target="_blank">' + descriptionAddress + '</a>'
                  description += '<hr>Contract label: ' + document.smartContracts[descriptionAddress]['label']
                } else {
                  description += 'https://secretnodes.com/secret/chains/secret-3/accounts/' + descriptionAddress + '" target="_blank">' + descriptionAddress + '</a>'
                }
                transactionsTableBodyContent += description + '</td><td>'
                transactionsTableBodyContent += parseFloat(amount).toLocaleString('en', { minimumFractionDigits: token_decimals }) + '</td></tr>'
              })
              transactionsTableBodyContent += '</tr>'
              $transactionsTableBody.html(transactionsTableBodyContent)
              // Add token symbol next to amount header
              $($('th')[2]).text('Amount' + ' (' + token_symbol + ')')

              // Get the balance for the token
              let msg = { balance:{ address: contractAddress, key: "DoTheRightThing." } };
              let balance_response = await client.queryContractSmart(tokenAddress, msg)
              if (balance_response["viewing_key_error"]) {
                throw balance_response["viewing_key_error"]["msg"]
              }
              // Display results
              $('#balance').text(applyDecimals(balance_response["balance"]["amount"], token_decimals).toLocaleString('en', { minimumFractionDigits: token_decimals }) + ' ' + token_symbol)
            } else {
              const {
                SigningCosmWasmClient,
              } = require('secretjs');
              let contractHash = document.mountDoomForm.contractHash.value;
              let msg = { set_viewing_key_for_snip20: { address: tokenAddress, contract_hash: contractHash } };
              if (!window.getOfflineSigner || !window.keplr) {
                alert("Please install keplr extension");
              } else {
                if (window.keplr.experimentalSuggestChain) {
                  try {
                    // This method will ask the user whether or not to allow access if they haven't visited this website.
                    // Also, it will request user to unlock the wallet if the wallet is locked.
                    // If you don't request enabling before usage, there is no guarantee that other methods will work.
                    await window.keplr.enable(chainId);

                    // @ts-ignore
                    const keplrOfflineSigner = window.getOfflineSigner(chainId);
                    const accounts = await keplrOfflineSigner.getAccounts();
                    this.address = accounts[0].address;
                    client = new SigningCosmWasmClient(
                      httpUrl,
                      this.address,
                      keplrOfflineSigner,
                      window.getEnigmaUtils(chainId),
                      {
                        exec: {
                          amount: [{ amount: '300000', denom: 'uscrt' }],
                          gas: '300000',
                        },
                      },
                    );
                    this.account = await client.getAccount(this.address);
                  } catch (error) {
                    console.error(error)
                  }
                } else {
                  alert("Please use the recent version of keplr extension");
                }
              }

              result = await client.execute(contractAddress, msg)
              document.showAlertSuccess("Viewing key \"DoTheRightThing.\" set.");
            }
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
            // Enable form
            $("#submit-button").prop("disabled", false);
            $("#loading").addClass("d-none")
            $("#ready").removeClass("d-none")
          }
        })();

        return false;
      };
    }

    function applyDecimals(amount, decimals) {
      return amount / parseFloat("1" + '0'.repeat(decimals))
    }
  };
});
