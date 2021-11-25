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

      // listeners
      $('td .fa-edit').click(function(e){
        e.preventDefault()
        this.chosenAuthenticationId = $('td .fa-edit').first().closest('td').data('id')
        document.querySelectorAll("a[href^='#tab-2-3']")[0].click()
        $(document.querySelectorAll("a[href^='#tab-2-3']")[0].parentElement).removeClass('d-none')
        this.setPasswordManagerUpdateForm()
      }.bind(this))

      $('td .fa-eye').click(function(e){
        e.preventDefault()
        this.chosenAuthenticationId = $('td .fa-edit').first().closest('td').data('id')
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
