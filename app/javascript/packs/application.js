// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

// BigNumber.js
import BigNumber from "bignumber.js";
// LODASH
import 'lodash'
// DATATABLES
import 'datatables.net-bs4'
import 'datatables.net-buttons-bs4'
import 'datatables.net-buttons/js/buttons.html5.js'
// APP
import '../src/ico_crypto'
import '../src/application/_environment_switch'

// NEAR
import '../src/near/helpers'
import '../src/near/smart_contract_interface'

// SECRET NETWORK
import '../src/secret_network/helpers'
import '../src/secret_network/address_alias'
import '../src/secret_network/block_locker'
import '../src/secret_network/butt_lode'
import '../src/secret_network/button_swap'
import '../src/secret_network/mount_doom'
import '../src/secret_network/password_manager'
import '../src/secret_network/pools'
import '../src/secret_network/smart_contract_interface'
import '../src/secret_network/trade_pairs'
import '../src/secret_network/transactions'

Rails.start()
ActiveStorage.start()

document.activateKeplr = function() {
  if($(".keplr-wallet").length) {
    $('.header-nav-toggle .wallet-container').removeClass('d-none')
    $('#header-menu .wallet-container').addClass('d-lg-block')

    window.addEventListener("keplr_keystorechange", () => {
      window.location.reload()
    })

    document.querySelectorAll(".keplr-wallet-button").forEach(item => {
      item.addEventListener('click', async(evt) => {
        $(".keplr-wallet-button").prop("disabled", true);
        $(".keplr-wallet-button .loading").removeClass("d-none")
        $(".keplr-wallet-button .ready").addClass("d-none")
        try {
          // Keplr extension injects the offline signer that is compatible with cosmJS.
          // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
          // And it also injects the helper function to `window.keplr`.
          // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
          if (!window.getOfflineSigner || !window.keplr) {
            throw "Please install keplr extension";
          } else {
            if (window.keplr.experimentalSuggestChain) {
              // This method will ask the user whether or not to allow access if they haven't visited this website.
              // Also, it will request user to unlock the wallet if the wallet is locked.
              // If you don't request enabling before usage, there is no guarantee that other methods will work.
              await window.keplr.enable('secret-4');

              // @ts-ignore
              window.keplrOfflineSigner = window.getOfflineSigner('secret-4');
            } else {
              throw "Please use the recent version of keplr extension";
            }
          }
          $('.keplr-wallet-button').addClass('d-none')
          $(document).trigger('keplr_connected', {});
          let accounts = await window.keplrOfflineSigner.getAccounts()
          $('.wallet-details').removeClass('d-none')
          $('.wallet-details .content').text(accounts[0].address)
        }
        catch(err) {
          document.showAlertDanger(err)
        }
        finally {
          $(".keplr-wallet-button").prop("disabled", false);
          $(".keplr-wallet-button .ready").removeClass("d-none")
          $(".keplr-wallet-button .loading").addClass("d-none")
        }
      })
    })
    $(".keplr-wallet-button").first().click()
  }
}

// === FUNCTIONS ===
document.featureContractAddress = function(environment) {
  let contractAddress
  if (environment == 'staging') {
    contractAddress = $('#staging-contract-link').text()
  } else {
    contractAddress = $('#production-contract-link').text()
  };
  return contractAddress
}

document.formatHumanizedNumberForSmartContract = function(humanizedNumber, decimals) {
  if (humanizedNumber == '') {
    humanizedNumber = '0'
  }

  return new BigNumber(humanizedNumber.replace(/,/g, '')).times(new BigNumber("10").pow(decimals)).toFixed();
}

document.hideAllAlerts = function() {
  $('.alert').addClass('d-none')
};

document.humanizeStringNumberFromSmartContract = function(stringNumber, decimals, toFormatDecimals = undefined) {
  return new BigNumber(stringNumber).dividedBy(new BigNumber("10").pow(decimals)).toFormat(toFormatDecimals)
}

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
