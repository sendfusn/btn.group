// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

// BOOTSTRAP & jquery IS DEFINED AT BOTTOM OF APPLICATION.HTML.HAML

import 'lodash'

// APP
import '../src/secret_network/block_locker/new'
import '../src/secret_network/block_locker/show'
import '../src/secret_network/invoices/edit'
import '../src/secret_network/address_alias/new'
import '../src/secret_network/address_alias/index'
import '../src/secret_network/smart_contract_querier/index'
import '../src/secret_network/transactions/index'

Rails.start()
ActiveStorage.start()

document.hideAllAlerts = function() {
  $('.alert').addClass('d-none')
};

document.prettyPrintJSON = function(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
      cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
};

document.secretNetworkClient = function(environment) {
  const {
    CosmWasmClient,
  } = require('secretjs');

  let http_url = '/datahub';
  if (environment == 'staging') {
    http_url = http_url + '_staging'
  };
  return new CosmWasmClient(http_url)
}

document.showAlertDanger = function(text) {
  $("#alert-danger").removeClass("d-none")
  $("#alert-danger").text(text)
}

document.showAlertSuccess = function(text) {
  $("#alert-success").removeClass("d-none")
  $("#alert-success").text(text)
}
