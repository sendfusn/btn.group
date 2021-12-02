$(document).ready(function(){
  if($("#secret-network-password-manager").length) {
    var calculateGas = function(minGas, dataLength) {
      let gasBuffer = 30_000
      let gas = minGas + gasBuffer
      gas += dataLength * 15
      return String(Math.ceil(gas / 100) * 100)
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

    $("#set-key-button").click(function(e){
      document.querySelectorAll("a[href^='#tab-2-1-2']")[0].click()
    })

    window.onload = () => {
      this.addressAliasAddress = 'secret19993tt7657ljrzt27dh8wm7kxfedgezyuva96w';
      this.buttcoinAddress = 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt';
      this.environment = 'production';
      this.contractAddress = document.featureContractAddress(this.environment);
      this.chainId = document.secretNetworkChainId(this.environment)
      this.chosenAuthenticationId;
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.authentications = []
      this.authenticationsFormatted = []

      // datatable
      this.datatable = window.$('#authentications-table').DataTable({
        columns: [
            { data: 'id', title: "id" },
            { data: 'label', title: "label" },
            { data: 'username', title: "username" },
            { data: 'password', title: "password" },
            { data: 'notes', title: "notes" },
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<a href="#" class="mr-3 view-link">View</a><a href="#" class="edit-link">Edit</a>',
                orderable: false,
                width: '91px'
            },
        ],
        dom: '<"top"i>frtp',
        ordering: false,
        paging: false,
        rowId: function(a) {
          return 'id_' + a['id'];
        },
      });

      // listeners
      $("a[href^='#tab-2-1']").click(function(e){
        this.datatable.clear()
      }.bind(this))

      $("a[href^='#tab-2-3']").click(function(e){
        if(this.authentications[this.chosenAuthenticationId].revealed) {
          $('.reveal-button').addClass('d-none')
        } else {
          if(this.addressOwnsAuthenthication(this.searchedAddress)) {
            $('.reveal-button').removeClass('d-none')
          } else {
            $('.reveal-button').addClass('d-none')
          }
        }
      }.bind(this))

      $("a[href^='#tab-2-4']").click(function(e){
        this.setShowTableData()
        if(this.authentications[this.chosenAuthenticationId].revealed) {
          $('.reveal-button').addClass('d-none')
        } else {
          if(this.addressOwnsAuthenthication(this.searchedAddress)) {
            $('.reveal-button').removeClass('d-none')
            $('#edit-button').removeClass('d-none')
          } else {
            $('.reveal-button').addClass('d-none')
            $('#edit-button').addClass('d-none')
          }
        }
      }.bind(this))

      $('.input-group-append .fa-eye').click(function(e){
        let inputType = e.currentTarget.parentNode.parentNode.parentElement.children[0].type
        if(inputType == 'text') {
          e.currentTarget.parentNode.parentNode.parentElement.children[0].type = 'password'
        } else {
          e.currentTarget.parentNode.parentNode.parentElement.children[0].type = 'text'
        }
      })

      $('#edit-button').click(function(e){
        document.querySelectorAll("a[href^='#tab-2-3']")[0].click()
        this.setPasswordManagerUpdateForm()
      }.bind(this))

      $('.reveal-button').click(function(e){
        let $button = $('.reveal-button');
        let $loading = $button.children('.loading')
        let $ready = $button.children('.ready')
        $button.prop("disabled", true)
        $loading.removeClass('d-none');
        $ready.addClass('d-none');
        (async () => {
          try {
            // Keplr extension injects the offline signer that is compatible with cosmJS.
            // You can get this offline signer from `window.getOfflineSigner(this.chainId:string)` after load event.
            // And it also injects the helper function to `window.keplr`.
            // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
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
                  document.showAlertDanger(error)
                }
              } else {
                alert("Please use the recent version of keplr extension");
              }
            }
            let handleMsg = { show: { id: Number(this.chosenAuthenticationId) } }
            let response = await this.client.execute(this.contractAddress, handleMsg)
            let resultText = '';
            response['data'].forEach(function(x){ resultText += String.fromCharCode(x) })
            let authentication = JSON.parse(resultText)['show']['authentication']
            authentication['revealed'] = true
            this.chosenAuthenticationId = authentication['id']
            this.authentications[this.chosenAuthenticationId] = authentication
            this.authenticationsFormatted[this.chosenAuthenticationId] = authentication
            this.setPasswordManagerUpdateForm()
            this.setShowTableData()
            $button.addClass('d-none')
            document.showAlertSuccess('Revealed')
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
            $button.prop("disabled", false)
            $loading.addClass('d-none');
            $ready.removeClass('d-none');
          }
        })();
      }.bind(this))

      // === FORMS ===
      document.passwordManagerCreateForm.onsubmit = async (e) => {
        e.preventDefault()
        changeSubmitButtonToLoading()
        let label = document.passwordManagerCreateForm.label.value
        let username = document.passwordManagerCreateForm.username.value;
        let password = document.passwordManagerCreateForm.password.value
        let notes = document.passwordManagerCreateForm.notes.value;
        let dataLength = label.length + username.length + password.length + notes.length
        let gas = calculateGas(180_000, dataLength)
        try {
          // Keplr extension injects the offline signer that is compatible with cosmJS.
          // You can get this offline signer from `window.getOfflineSigner(this.chainId:string)` after load event.
          // And it also injects the helper function to `window.keplr`.
          // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
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
                      amount: [{ amount: gas, denom: 'uscrt' }],
                      gas: gas,
                    },
                  }
                this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
              } catch (error) {
                document.showAlertDanger(error)
              }
            } else {
              alert("Please use the recent version of keplr extension");
            }
          }
          let handleMsg = { send: { amount: '1000000', recipient: this.contractAddress, msg: Buffer.from(JSON.stringify({ create: { label: label, username: username, password: password, notes: notes } })).toString('base64') } }
          let response = await this.client.execute(this.buttcoinAddress, handleMsg)
          let newAuthentication = {
            revealed: true
          } 
          _.each(response['logs'][0]['events'][1]['attributes'], function(kV){
            if (kV['key'] == 'id') {
              newAuthentication['id'] = Number(kV['value'])
            }
            if (kV['key'] == 'label') {
              newAuthentication['label'] = kV['value']
            }
            if (kV['key'] == 'username') {
              newAuthentication['username'] = kV['value']
            }
            if (kV['key'] == 'password') {
              newAuthentication['password'] = kV['value']
            }
            if (kV['key'] == 'notes') {
              newAuthentication['notes'] = kV['value']
            }
          })
          this.chosenAuthenticationId = newAuthentication['id']
          this.authentications[newAuthentication['id']] = newAuthentication;
          this.authenticationsFormatted[newAuthentication['id']] = newAuthentication;
          document.querySelectorAll("a[href^='#tab-2-4']")[0].click()
          document.showAlertSuccess('Authentication created.')
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          changeSubmitButtonToReady()
        }
      }

      document.passwordManagerSearchForm.onsubmit = async (e) => {
        e.preventDefault()
        this.datatable.clear()
        $(".table-responsive").addClass("d-none");
        changeSubmitButtonToLoading()
        let client = document.secretNetworkClient(this.environment);
        try {
          let searchType = document.passwordManagerSearchForm.searchType.value;
          this.searchedAddress = document.passwordManagerSearchForm.searchValue.value.toLowerCase();
          if (searchType == 'alias') {
            let searchParams = { search_type: searchType, search_value: this.searchedAddress };
            let result = await client.queryContractSmart(this.addressAliasAddress, { search: searchParams })
            this.searchedAddress = result['attributes']['address']
          }
          let viewingKey = document.passwordManagerSearchForm.viewingKey.value;
          let params = { address: this.searchedAddress, key: viewingKey };
          let response = await client.queryContractSmart(this.contractAddress, { hints: params })
          if (response['viewing_key_error']) {
            throw(response['viewing_key_error']['msg'])
          }
          this.authentications = _.cloneDeep(response['hints']['hints']);
          this.authenticationsFormatted = _.map(response['hints']['hints'], function(authentication){
            authentication['username'] += '...'
            authentication['password'] += '...'
            authentication['notes'] += '...'
            return authentication
          });
          this.refreshTable(this.searchedAddress, this.authenticationsFormatted)
          $(".table-responsive").removeClass("d-none");
        }
        catch(err) {
          if (err instanceof Object) {
            if (err.message.includes('not_found')) {
              err = 'Alias not found.'
            }
          }
          document.showAlertDanger(err)
        }
        finally {
          changeSubmitButtonToReady()
        }
      }

      document.passwordManagerUpdateForm.onsubmit = async (e) => {
        e.preventDefault()
        changeSubmitButtonToLoading()
        let id = Number(document.passwordManagerUpdateForm.id.value)
        let label = document.passwordManagerUpdateForm.label.value
        let username = document.passwordManagerUpdateForm.username.value;
        let password = document.passwordManagerUpdateForm.password.value
        let notes = document.passwordManagerUpdateForm.notes.value;
        let dataLength = document.passwordManagerUpdateForm.id.value.length + label.length + username.length + password.length + notes.length
        let gas = calculateGas(122_000, dataLength)
        try {
          // Keplr extension injects the offline signer that is compatible with cosmJS.
          // You can get this offline signer from `window.getOfflineSigner(this.chainId:string)` after load event.
          // And it also injects the helper function to `window.keplr`.
          // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
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
                      amount: [{ amount: gas, denom: 'uscrt' }],
                      gas: gas,
                    },
                  }
                this.client = document.secretNetworkSigningClient(this.environment, this.address, gasParams)
              } catch (error) {
                document.showAlertDanger(error)
              }
            } else {
              alert("Please use the recent version of keplr extension");
            }
          }
          let handleMsg = { update_authentication: { id: id, label: label, username: username, password: password, notes: notes } }
          let response = await this.client.execute(this.contractAddress, handleMsg)
          let resultText = '';
          response['data'].forEach(function(x){ resultText += String.fromCharCode(x) })
          let authentication = JSON.parse(resultText)['update_authentication']['authentication']
          authentication['revealed'] = true
          this.chosenAuthenticationId = authentication['id']
          this.authentications[this.chosenAuthenticationId] = authentication
          this.authenticationsFormatted[this.chosenAuthenticationId] = authentication
          this.setPasswordManagerUpdateForm()
          document.querySelectorAll("a[href^='#tab-2-4']")[0].click()
          document.showAlertSuccess('Update successful.')
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          changeSubmitButtonToReady()
        }
      }

      document.setViewingKeyForm.onsubmit = async(e) => {
        e.preventDefault()
        changeSubmitButtonToLoading()
        try {
          // Keplr extension injects the offline signer that is compatible with cosmJS.
          // You can get this offline signer from `window.getOfflineSigner(this.chainId:string)` after load event.
          // And it also injects the helper function to `window.keplr`.
          // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
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
                document.showAlertDanger(error)
              }
            } else {
              alert("Please use the recent version of keplr extension");
            }
          }

          let viewingKey = document.setViewingKeyForm.viewingKey.value
          let padding = Math.random().toString().substr(2, Math.floor(Math.random() * (10 + Math.floor(Math.random() * 10)))) + Math.random().toString().substr(2, Math.floor(Math.random() * (10 + Math.floor(Math.random() * 10))))
          let handleMsg = { set_viewing_key: { key: viewingKey, padding: padding } }
          let response = await this.client.execute(this.contractAddress, handleMsg)
          document.showAlertSuccess('Viewing key set.')
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          changeSubmitButtonToReady()
        }
      }

      this.setPasswordManagerUpdateForm = function() {
        document.passwordManagerUpdateForm.id.value = this.chosenAuthenticationId
        document.passwordManagerUpdateForm.label.value = this.authentications[this.chosenAuthenticationId]['label']
        document.passwordManagerUpdateForm.username.value = this.authentications[this.chosenAuthenticationId]['username']
        document.passwordManagerUpdateForm.password.value = this.authentications[this.chosenAuthenticationId]['password']
        document.passwordManagerUpdateForm.notes.value = this.authentications[this.chosenAuthenticationId]['notes']
      }

      this.setShowTableData = function() {
        $('#id-table-data').text(this.chosenAuthenticationId)
        $('#table-title').text('Authentication #' + this.chosenAuthenticationId)
        $('#label-table-data').text(this.authenticationsFormatted[this.chosenAuthenticationId]['label'])
        $('#username-table-data').text(this.authenticationsFormatted[this.chosenAuthenticationId]['username'])
        $('#password-table-data').text(this.authenticationsFormatted[this.chosenAuthenticationId]['password'])
        $('#notes-table-data').text(this.authenticationsFormatted[this.chosenAuthenticationId]['notes'])
      }

      this.refreshTable = function(address, data) {
        this.datatable.clear()
        this.datatable.rows.add(data);
        this.datatable.draw();
        $('.edit-link').click(function(e){
          e.preventDefault()
          this.chosenAuthenticationId = e.currentTarget.parentNode.parentNode.id.split('_')[1]
          document.querySelectorAll("a[href^='#tab-2-3']")[0].click()
          this.setPasswordManagerUpdateForm()
        }.bind(this))

        $('.view-link').click(function(e){
          e.preventDefault()
          this.chosenAuthenticationId = e.currentTarget.parentNode.parentNode.id.split('_')[1]
          document.querySelectorAll("a[href^='#tab-2-4']")[0].click()
        }.bind(this))
        if(this.addressOwnsAuthenthication(address)) {
          $('.edit-link').removeClass('d-none')
        } else {
          $('.edit-link').addClass('d-none')
        }
      }

      this.addressOwnsAuthenthication = function(address) {
        return address.length > 5 && address == $("#navbar-wallet-address").text()
      }
    }
  };
});
