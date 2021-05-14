// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

// BOOTSTRAP IS DEFINED AT BOTTOM OF APPLICATION.HTML.HAML

// APP
import '../src/block_locker/new'
import '../src/block_locker/show'
import '../src/invoices/edit'
import '../src/secret_alias/new'
import '../src/secret_alias/index'
import '../src/smart_contract_querier_secret_network/index'

Rails.start()
ActiveStorage.start()

document.hideAllAlerts = function() {
  $('.alert').addClass('d-none')
};

document.showAlertDanger = function(text) {
  $("#alert-danger").removeClass("d-none")
  $("#alert-danger").text(text)
}

document.showAlertSuccess = function(text) {
  $("#alert-success").removeClass("d-none")
  $("#alert-success").text(text)
}
