// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

// BOOTSTRAP & jquery IS DEFINED AT BOTTOM OF APPLICATION.HTML.HAML

import 'lodash'
// DATATABLES
import 'datatables.net-bs4'
import 'datatables.net-buttons-bs4'
import 'datatables.net-buttons/js/buttons.html5.js'

// APP
import '../src/application/_environment_switch'
import '../src/features/index'
import '../src/secret_network/block_locker/new'
import '../src/secret_network/block_locker/show'
import '../src/secret_network/invoices/edit'
import '../src/secret_network/address_alias/_profile'
import '../src/secret_network/address_alias/new'
import '../src/secret_network/address_alias/index'
import '../src/secret_network/smart_contract_interface/index'
import '../src/secret_network/transactions/index'

Rails.start()
ActiveStorage.start()

// This needs to be called within an es6 function e.g. onload = () => etc
document.connectWallet = function(chainId) {
  // Keplr extension injects the offline signer that is compatible with cosmJS.
  // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
  // And it also injects the helper function to `window.keplr`.
  // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
  if (!window.getOfflineSigner || !window.keplr) {
    alert("Please install keplr extension");
  } else {
    if (window.keplr.experimentalSuggestChain) {
      (async () => {
        try {
          // This method will ask the user whether or not to allow access if they haven't visited this website.
          // Also, it will request user to unlock the wallet if the wallet is locked.
          // If you don't request enabling before usage, there is no guarantee that other methods will work.
          await window.keplr.enable(chainId);

          // @ts-ignore
          const keplrOfflineSigner = window.getOfflineSigner(chainId);
          const accounts = await keplrOfflineSigner.getAccounts();
          this.address = accounts[0].address;
          $('#address').val(this.address);
        } catch (error) {
          console.error(error)
        }
      })();
    } else {
      alert("Please use the recent version of keplr extension");
    }
  }
}

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

// This is only for queries. See the SigningCosmWasmClient for handle actions.
document.secretNetworkClient = function(environment) {
  const {
    CosmWasmClient,
  } = require('secretjs');

  return new CosmWasmClient(document.secretNetworkHttpUrl(environment))
}

document.secretNetworkChainId = function(environment) {
  let chainId = 'secret-2'
  if (environment == 'staging') {
    chainId = 'holodeck-2'
  };
  return chainId
}

document.secretNetworkHttpUrl = function(environment) {
  let http_url = '/datahub';
  if (environment == 'staging') {
    http_url = http_url + '_staging'
  };
  return http_url
}

document.showAlertDanger = function(text) {
  toastr.options.tapToDismiss = false
  toastr.options.closeDuration = 0;
  toastr.options.timeOut = 0;
  toastr.options.extendedTimeOut = 0;
  toastr.options.closeButton = true;
  toastr.error(text);
}

document.showAlertSuccess = function(text) {
  toastr.options.tapToDismiss = false
  toastr.options.closeDuration = 0;
  toastr.options.timeOut = 0;
  toastr.options.extendedTimeOut = 0;
  toastr.options.closeButton = true;
  toastr.success(text);
}
