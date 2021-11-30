$(document).ready(function(){
  if($("#secret-network-password-manager").length) {
    var changeSubmitButtonToLoading = function() {
      $('button[type="submit"]').prop("disabled", true)
      $(".loading").removeClass("d-none")
      $(".ready").addClass("d-none")
    }

    var changeSubmitButtonToReady = function() {
      $('button[type="submit"]').prop("disabled", false)
      $(".loading").addClass("d-none")
      $(".ready").removeClass("d-none")
    }

    window.onload = () => {
      this.buttcoinAddress = 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt';
      this.environment = 'production';
      this.contractAddress = document.featureContractAddress(this.environment);
      this.chainId = document.secretNetworkChainId(this.environment)
      this.chosenAuthenticationId;
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.authentications = []

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
                defaultContent: '<a href="#"><em class="fa fa-eye mr-2"></em></a><a href="#"><em class="fa fa-edit"></em></a>',
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
        $(document.querySelectorAll("a[href^='#tab-2-3']")[0].parentElement).addClass('d-none')
        $(document.querySelectorAll("a[href^='#tab-2-4']")[0].parentElement).addClass('d-none')
      })

      $("a[href^='#tab-2-2']").click(function(e){
        $(document.querySelectorAll("a[href^='#tab-2-3']")[0].parentElement).addClass('d-none')
        $(document.querySelectorAll("a[href^='#tab-2-4']")[0].parentElement).addClass('d-none')
      })

      $("a[href^='#tab-2-3']").click(function(e){
        $(document.querySelectorAll("a[href^='#tab-2-4']")[0].parentElement).addClass('d-none')
      })

      $("a[href^='#tab-2-4']").click(function(e){
        $(document.querySelectorAll("a[href^='#tab-2-3']")[0].parentElement).addClass('d-none')
      })

      $('.input-group-append .fa-eye').click(function(e){
        let inputType = e.currentTarget.parentNode.parentNode.parentElement.children[0].type
        if(inputType == 'text') {
          e.currentTarget.parentNode.parentNode.parentElement.children[0].type = 'password'
        } else {
          e.currentTarget.parentNode.parentNode.parentElement.children[0].type = 'text'
        }
      })

      $('button .fa-edit').parent().click(function(e){
        e.preventDefault()
        document.querySelectorAll("a[href^='#tab-2-3']")[0].click()
        $(document.querySelectorAll("a[href^='#tab-2-3']")[0].parentElement).removeClass('d-none')
        this.setPasswordManagerUpdateForm()
      }.bind(this))

      $('button .fa-eye').closest('button').click(function(e){
        $("#tab-2-3 button .loading").removeClass('d-none');
        $("#tab-2-3 button .ready").addClass('d-none');
        $("#tab-2-4 button .loading").removeClass('d-none');
        $("#tab-2-4 button .ready").addClass('d-none');
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
            this.authentications[this.chosenAuthenticationId].username = authentication['username']
            this.authentications[this.chosenAuthenticationId].password = authentication['password']
            this.authentications[this.chosenAuthenticationId].notes = authentication['notes']
            this.authentications[this.chosenAuthenticationId].revealed = true
            this.setPasswordManagerUpdateForm()
            this.setShowTableData()
            document.showAlertSuccess('Revealed')
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
            $("#tab-2-3 button .loading").addClass('d-none');
            $("#tab-2-3 button .ready").removeClass('d-none');
            $("#tab-2-4 button .loading").addClass('d-none');
            $("#tab-2-4 button .ready").removeClass('d-none');
          }
        })();
      }.bind(this))

      // === FORMS ===
      document.passwordManagerCreateForm.onsubmit = async (e) => {
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
                      amount: [{ amount: '100000', denom: 'uscrt' }],
                      gas: '100000',
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
          let label = document.passwordManagerCreateForm.label.value
          let username = document.passwordManagerCreateForm.username.value;
          let password = document.passwordManagerCreateForm.password.value
          let notes = document.passwordManagerCreateForm.notes.value;
          let handleMsg = { send: { amount: '1000000', recipient: this.contractAddress, msg: Buffer.from(JSON.stringify({ create: { label: label, username: username, password: password, notes: notes } })).toString('base64') } }
          let response = await this.client.execute(this.buttcoinAddress, handleMsg)
          _.each(response['logs'][0]['events'][1]['attributes'], function(kV){
            if (kV['id']) {

            }
            if (kV['label']) {

            }
            if (kV['username']) {

            }
            if (kV['password']) {

            }
            if (kV['notes']) {

            }
          })
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
        $(".table-responsive").addClass("d-none");
        changeSubmitButtonToLoading()
        let client = document.secretNetworkClient(this.environment);
        try {
          let address = document.passwordManagerSearchForm.address.value;
          let viewingKey = document.passwordManagerSearchForm.viewingKey.value;
          let params = { address: address, key: viewingKey };
          let response = await client.queryContractSmart(this.contractAddress, { hints: params })
          if (response['viewing_key_error']) {
            throw(response['viewing_key_error']['msg'])
          }
          this.authentications = response['hints']['hints'];
          this.authenticationsFormatted = _.map(response['hints']['hints'], function(authentication){
            authentication['username'] += '...'
            authentication['password'] += '...'
            authentication['notes'] += '...'
            return authentication
          });
          this.datatable.rows.add(this.authenticationsFormatted);
          this.datatable.draw();
          $(".table-responsive").removeClass("d-none");
          $('td .fa-edit').click(function(e){
            e.preventDefault()
            this.chosenAuthenticationId = e.currentTarget.parentNode.parentNode.parentNode.id.split('_')[1]
            document.querySelectorAll("a[href^='#tab-2-3']")[0].click()
            $(document.querySelectorAll("a[href^='#tab-2-3']")[0].parentElement).removeClass('d-none')
            this.setPasswordManagerUpdateForm()
          }.bind(this))

          $('td .fa-eye').click(function(e){
            e.preventDefault()
            this.chosenAuthenticationId = e.currentTarget.parentNode.parentNode.parentNode.id.split('_')[1]
            document.querySelectorAll("a[href^='#tab-2-4']")[0].click()
            $(document.querySelectorAll("a[href^='#tab-2-4']")[0].parentElement).removeClass('d-none')
            this.setShowTableData()
          }.bind(this))
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
        $('#label-table-data').text(this.authentications[this.chosenAuthenticationId]['label'])
        $('#username-table-data').text(this.authentications[this.chosenAuthenticationId]['username'])
        $('#password-table-data').text(this.authentications[this.chosenAuthenticationId]['password'])
        $('#notes-table-data').text(this.authentications[this.chosenAuthenticationId]['notes'])
      }
    }
  };
});
