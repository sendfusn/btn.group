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
import '../src/application/_environment_switch'

// NEAR
import '../src/near/helpers'
import '../src/near/smart_contract_interface/index'

// SECRET NETWORK
import '../src/secret_network/helpers'
import '../src/secret_network/address_alias/_profile'
import '../src/secret_network/address_alias/new'
import '../src/secret_network/address_alias/index'
import '../src/secret_network/block_locker/index'
import '../src/secret_network/butt_lode'
import '../src/secret_network/dex_aggregator'
import '../src/secret_network/mount_doom/index'
import '../src/secret_network/smart_contract_interface/index'
import '../src/secret_network/transactions/index'
import '../src/secret_network/yield_optimizer/index'

Rails.start()
ActiveStorage.start()

// === LISTENERS ===
window.addEventListener("keplr_keystorechange", () => {
  if($("#secret-network-yield-optimizer").length ||
    $("#secret-network-transactions").length ||
    $("#secret-network-smart-contract-interface").length ||
    $("#secret-network-mount-doom").length ||
    $("#secret-network-block-locker").length ||
    $("#secret-network-address-alias-index").length ||
    $("#secret-network-dex-aggregator").length) {
    console.log("Key store in Keplr is changed. You may need to refetch the account info.")
    window.location.reload()
  }
})

document.featureContractAddress = function(environment) {
  let contractAddress
  if (environment == 'staging') {
    contractAddress = $('#staging-contract-link').text()
  } else {
    contractAddress = $('#production-contract-link').text()
  };
  return contractAddress
}

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

document.showAlertDanger = function(text) {
  if (text != "Error: Request rejected") {
    toastr.options.tapToDismiss = false
    toastr.options.closeDuration = 0;
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.options.closeButton = true;
    toastr.error(text);
  }
}

document.showAlertSuccess = function(text) {
  toastr.options.tapToDismiss = false
  toastr.options.closeDuration = 0;
  toastr.options.timeOut = 0;
  toastr.options.extendedTimeOut = 0;
  toastr.options.closeButton = true;
  toastr.success(text);
}
