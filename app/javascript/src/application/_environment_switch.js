$(document).ready(function(){
  if(('#production-switch').length) {
    if(('#feature-contracts').length) {
      $('#production-switch').change(function(){
        if (this.checked) {
          $('#production-contract-link').removeClass('d-none')
          $('#staging-contract-link').addClass('d-none')
        } else {
          $('#production-contract-link').addClass('d-none')
          $('#staging-contract-link').removeClass('d-none')
        }
      })
    }

    document.featureEnvironment = function() {
      let environment;
      if($('#production-switch')[0].checked) {
        environment = 'production'
      } else {
        environment = 'staging'
      }
      return environment
    }
  }
})