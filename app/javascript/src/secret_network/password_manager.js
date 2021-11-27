$(document).ready(function(){
  if($("#secret-network-password-manager").length) {
    window.onload = () => {
      this.buttcoinAddress = 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt';
      this.environment = 'production';
      // this.contractAddress = document.featureContractAddress(this.environment);
      this.chainId = document.secretNetworkChainId(this.environment)
      this.chosenAuthenticationId;
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.authentications = [{ "id": "0", "label": "google", "username": "s", "password": "s", "notes": "v" }]

      // datatable
      this.datatable = window.$('#authentications-table').DataTable({
        columns: [
            { title: "id" },
            { title: "label" },
            { title: "username" },
            { title: "password" },
            { title: "notes" },
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<a href="#"><em class="fa fa-eye mr-2"></em></a><a href="#"><em class="fa fa-edit mr-2"></em></a><a href="#"><em class="fa fa-trash"></em></a>',
                orderable: false,
                width: '115px'
            },
        ],
        dom: '<"top"i>frtp',
        ordering: false,
        paging: false,
        rowId: function(a) {
          return 'id_' + a[0];
        },
      });
      this.datatable.rows.add([[this.authentications[0]['id'] ,this.authentications[0]['label'], this.authentications[0]['username'], this.authentications[0]['password'], this.authentications[0]['notes']]]);
      this.datatable.draw();

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

      $('button .fa-edit').parent().click(function(e){
        e.preventDefault()
        document.querySelectorAll("a[href^='#tab-2-3']")[0].click()
        $(document.querySelectorAll("a[href^='#tab-2-3']")[0].parentElement).removeClass('d-none')
        this.setPasswordManagerUpdateForm()
      }.bind(this))

      $('button .fa-eye').parent().click(function(e){
        e.preventDefault()
        this.authentications[this.chosenAuthenticationId].revealed = true
        this.authentications[this.chosenAuthenticationId].username = 'abc'
        this.authentications[this.chosenAuthenticationId].password = 'def'
        this.authentications[this.chosenAuthenticationId].notes = 'ghi'
        this.setPasswordManagerUpdateForm()
        this.setShowTableData()
        $('button .fa-eye').parent().addClass('d-none')
      }.bind(this))

      $('button .fa-trash').parent().click(function(e){
        e.preventDefault()
        this.authentications.splice(this.chosenAuthenticationId, 1)
        document.querySelectorAll("a[href^='#tab-2-1']")[0].click()
        $(document.querySelectorAll("a[href^='#tab-2-3']")[0].parentElement).addClass('d-none')
        $(document.querySelectorAll("a[href^='#tab-2-4']")[0].parentElement).addClass('d-none')
      }.bind(this))

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
        if(this.authentications[this.chosenAuthenticationId]['revealed']) {
          $('#username-table-data').text(this.authentications[this.chosenAuthenticationId]['username'])
          $('#password-table-data').text(this.authentications[this.chosenAuthenticationId]['password'])
          $('#notes-table-data').text(this.authentications[this.chosenAuthenticationId]['notes'])
        } else {
          $('#username-table-data').text(this.authentications[this.chosenAuthenticationId]['username'] + '*****')
          $('#password-table-data').text(this.authentications[this.chosenAuthenticationId]['password'] + '*****')
          $('#notes-table-data').text(this.authentications[this.chosenAuthenticationId]['notes'] + '*****')
        }
      }
    }
  };
});
