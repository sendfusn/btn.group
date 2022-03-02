$(document).ready(function(){
  if($("#secret-network-password-manager").length) {
    var calculateGas = function(minGas, dataLength) {
      let gasBuffer = 80_000
      let gas = minGas + gasBuffer
      gas += dataLength * 15
      return String(Math.ceil(gas / 100) * 100 * document.secretNetwork.gasAndDelayFactor)
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

    this.addressAliasAddress = 'secret19993tt7657ljrzt27dh8wm7kxfedgezyuva96w';
    this.addressAliasDataHash = 'D3194D7CEBE185E50C4D3CD3CF40827F58DFC48971EE330087CEFA8395FA0B6E'
    this.passwordManagerContractAddress = 'secret1x56ls7efhdy8axktua0gzuc7muvgwnr98gh54j';
    this.passwordManagerContractDataHash = 'F466CF15F3186F1816D4D6A4BCEE6998E512179E5DBA9F2922DCCA7640381217'
    this.chosenPosition;
    this.authentications = []
    this.authenticationsFormatted = []

    // datatable
    this.datatable = window.$('#authentications-table').DataTable({
      columns: [
          { data: 'position', title: "#" },
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
        return 'position_' + a['position'];
      },
    });

    // listeners
    $("a[href^='#tab-2-1']").click(function(e){
      this.datatable.clear()
    }.bind(this))

    $("a[href^='#tab-2-3']").click(function(e){
      if(this.authentications[this.chosenPosition].revealed) {
        $('.reveal-button').addClass('d-none')
      } else {
        if(this.addressOwnsAuthentication(this.searchedAddress)) {
          $('.reveal-button').removeClass('d-none')
        } else {
          $('.reveal-button').addClass('d-none')
        }
      }
    }.bind(this))

    $("a[href^='#tab-2-4']").click(function(e){
      this.setShowTableData()
      if(this.authentications[this.chosenPosition].revealed) {
        $('.reveal-button').addClass('d-none')
      } else {
        if(this.addressOwnsAuthentication(this.searchedAddress)) {
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
          await document.connectKeplrWallet()
          if (document.secretNetwork.walletAddress) {
            let params = {
              sender: document.secretNetwork.walletAddress,
              contract: this.passwordManagerContractAddress,
              codeHash: this.passwordManagerContractDataHash,
              msg: { show: { position: Number(this.chosenPosition) } },
              sentFunds: [], // optional
            }
            let response = await document.secretNetwork.executeContract(params, this.gasReveal())
            let resultText = '';
            response['data'].forEach(function(x){ resultText += String.fromCharCode(x) })
            let authentication = JSON.parse(resultText)['show']['authentication']
            authentication['revealed'] = true
            this.chosenPosition = authentication['position']
            this.authentications[this.chosenPosition] = authentication
            this.authenticationsFormatted[this.chosenPosition] = authentication
            this.setPasswordManagerUpdateForm()
            this.setShowTableData()
            $button.addClass('d-none')
            document.showAlertSuccess('Revealed')
          }
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
        await document.connectKeplrWallet()
        if (document.secretNetwork.walletAddress) {
          let handleMsg = { send: { amount: '1000000', recipient: this.passwordManagerContractAddress, msg: Buffer.from(JSON.stringify({ create: { label: label, username: username, password: password, notes: notes } })).toString('base64') } }
          let params = {
            sender: document.secretNetwork.walletAddress,
            contract: document.secretNetwork.butt.address,
            codeHash: document.secretNetwork.butt.dataHash,
            msg: handleMsg,
            sentFunds: []
          }
          let response = await document.secretNetwork.executeContract(params, gas)
          let newAuthentication = {
            revealed: true
          } 
          _.each(response['logs'][0]['events'][1]['attributes'], function(kV){
            if (kV['key'] == 'id') {
              newAuthentication['id'] = kV['value']
            }
            if (kV['key'] == 'position') {
              newAuthentication['position'] = Number(kV['value'])
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
          this.chosenPosition = newAuthentication['position']
          this.authentications[newAuthentication['position']] = newAuthentication;
          this.authenticationsFormatted[newAuthentication['position']] = newAuthentication;
          document.querySelectorAll("a[href^='#tab-2-4']")[0].click()
          document.showAlertSuccess('Authentication created.')
          document.passwordManagerCreateForm.label.value = ''
          document.passwordManagerCreateForm.username.value = ''
          document.passwordManagerCreateForm.password.value = ''
          document.passwordManagerCreateForm.notes.value = ''
        }
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
      try {
        let queryParams;
        let searchParams;
        let searchType = document.passwordManagerSearchForm.searchType.value;
        this.searchedAddress = document.passwordManagerSearchForm.searchValue.value.toLowerCase();
        if (searchType == 'alias') {
          searchParams = { search: { search_type: searchType, search_value: this.searchedAddress } };
          queryParams = {
            address: this.addressAliasAddress,
            codeHash: this.addressAliasDataHash,
            query: searchParams
          }
          let result = await document.secretNetwork.queryContractSmart(queryParams)
          this.searchedAddress = result['attributes']['address']
        }
        let viewingKey = document.passwordManagerSearchForm.viewingKey.value;
        queryParams = {
          address: this.passwordManagerContractAddress,
          codeHash: this.passwordManagerContractDataHash,
          query: { hints: { address: this.searchedAddress, key: viewingKey } }
        }
        let response = await document.secretNetwork.queryContractSmart(queryParams)
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
      let position = Number(document.passwordManagerUpdateForm.position.value)
      let id = document.passwordManagerUpdateForm.id.value
      let label = document.passwordManagerUpdateForm.label.value
      let username = document.passwordManagerUpdateForm.username.value;
      let password = document.passwordManagerUpdateForm.password.value
      let notes = document.passwordManagerUpdateForm.notes.value;
      let dataLength = document.passwordManagerUpdateForm.position.value.length + id.length + label.length + username.length + password.length + notes.length
      let gas = calculateGas(122_000, dataLength)
      try {
        await document.connectKeplrWallet()
        if (document.secretNetwork.walletAddress) {
          let handleMsg = { update_authentication: { position: position, id: id, label: label, username: username, password: password, notes: notes } }
          let params = {
            sender: document.secretNetwork.walletAddress,
            contract: this.passwordManagerContractAddress,
            codeHash: this.passwordManagerContractDataHash,
            msg: handleMsg,
            sentFunds: [], // optional
          }
          let response = await document.secretNetwork.executeContract(params, gas)
          let resultText = '';
          response['data'].forEach(function(x){ resultText += String.fromCharCode(x) })
          let authentication = JSON.parse(resultText)['update_authentication']['authentication']
          authentication['revealed'] = true
          this.chosenPosition = authentication['position']
          this.authentications[this.chosenPosition] = authentication
          this.authenticationsFormatted[this.chosenPosition] = authentication
          this.setPasswordManagerUpdateForm()
          document.querySelectorAll("a[href^='#tab-2-4']")[0].click()
          document.showAlertSuccess('Update successful.')
        }
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
        await document.connectKeplrWallet()
        if (document.secretNetwork.walletAddress) {
          let viewingKey = document.setViewingKeyForm.viewingKey.value
          let padding = Math.random().toString().substr(2, Math.floor(Math.random() * (10 + Math.floor(Math.random() * 10)))) + Math.random().toString().substr(2, Math.floor(Math.random() * (10 + Math.floor(Math.random() * 10))))
          let handleMsg = { set_viewing_key: { key: viewingKey, padding: padding } }
          let params = {
            sender: document.secretNetwork.walletAddress,
            contract: this.passwordManagerContractAddress,
            codeHash: this.passwordManagerContractDataHash,
            msg: handleMsg,
            sentFunds: [], // optional
          }
          await document.secretNetwork.executeContract(params, this.gasSetViewingKey())
          document.showAlertSuccess('Viewing key set.')
        }
      }
      catch(err) {
        document.showAlertDanger(err)
      }
      finally {
        changeSubmitButtonToReady()
      }
    }

    this.gasReveal = function() {
      return String(50_000 * document.secretNetwork.gasAndDelayFactor)
    }

    this.gasSetViewingKey = function() {
      return String(50_000 * document.secretNetwork.gasAndDelayFactor)
    }

    this.setPasswordManagerUpdateForm = function() {
      document.passwordManagerUpdateForm.position.value = this.chosenPosition
      document.passwordManagerUpdateForm.id.value = this.authentications[this.chosenPosition]['id']
      document.passwordManagerUpdateForm.label.value = this.authentications[this.chosenPosition]['label']
      document.passwordManagerUpdateForm.username.value = this.authentications[this.chosenPosition]['username']
      document.passwordManagerUpdateForm.password.value = this.authentications[this.chosenPosition]['password']
      document.passwordManagerUpdateForm.notes.value = this.authentications[this.chosenPosition]['notes']
    }

    this.setShowTableData = function() {
      $('#position-table-data').text(this.chosenPosition)
      $('#table-title').text('Authentication #' + this.chosenPosition)
      $('#label-table-data').text(this.authenticationsFormatted[this.chosenPosition]['label'])
      $('#username-table-data').text(this.authenticationsFormatted[this.chosenPosition]['username'])
      $('#password-table-data').text(this.authenticationsFormatted[this.chosenPosition]['password'])
      $('#notes-table-data').text(this.authenticationsFormatted[this.chosenPosition]['notes'])
    }

    this.refreshTable = function(address, data) {
      this.datatable.clear()
      this.datatable.rows.add(data);
      this.datatable.draw();
      $('.edit-link').click(function(e){
        e.preventDefault()
        this.chosenPosition = e.currentTarget.parentNode.parentNode.id.split('_')[1]
        document.querySelectorAll("a[href^='#tab-2-3']")[0].click()
        this.setPasswordManagerUpdateForm()
      }.bind(this))

      $('.view-link').click(function(e){
        e.preventDefault()
        this.chosenPosition = e.currentTarget.parentNode.parentNode.id.split('_')[1]
        document.querySelectorAll("a[href^='#tab-2-4']")[0].click()
      }.bind(this))
      if(this.addressOwnsAuthentication(address)) {
        $('.edit-link').removeClass('d-none')
      } else {
        $('.edit-link').addClass('d-none')
      }
    }

    this.addressOwnsAuthentication = function(address) {
      return address.length > 5 && address == document.secretNetwork.walletAddress
    }

    document.activateKeplr()
  };
});
