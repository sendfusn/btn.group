$(document).ready(function(){
  if($("#secret-network-password-manager").length) {
    window.onload = () => {
      this.buttcoinAddress = 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt';
      this.environment = 'production';
      // this.contractAddress = document.featureContractAddress(this.environment);
      this.chainId = document.secretNetworkChainId(this.environment)
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      window.authentications = [{ "id": "0", "label": "google", "username": "s", "password": "s", "notes": "v" }]

      // listeners
      $('.fa-edit').click(function(e){
        e.preventDefault()
        let id = $('.fa-edit').first().closest('td').data('id')
        document.querySelectorAll("a[href^='#tab-2-3']")[0].click()
        $(document.querySelectorAll("a[href^='#tab-2-3']")[0].parentElement).removeClass('d-none')
        document.passwordManagerUpdateForm.id.value = id
        document.passwordManagerUpdateForm.label.value = window.authentications[id]['label']
        document.passwordManagerUpdateForm.username.value = window.authentications[id]['username']
        document.passwordManagerUpdateForm.password.value = window.authentications[id]['password']
        document.passwordManagerUpdateForm.notes.value = window.authentications[id]['notes']
      })
    }
  };
});
