// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

// Popper.js
import 'popper.js';
import 'bootstrap';
// BigNumber.js
import BigNumber from "bignumber.js";
// LODASH
import 'lodash'
// DATATABLES
import 'datatables.net-bs4'
import 'datatables.net-buttons-bs4'
import 'datatables.net-buttons/js/buttons.html5.js'

// APP
import '../src/application/_environment_switch'
import '../src/ico_crypto'

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
import '../src/secret_network/pools_admin'
import '../src/secret_network/smart_contract_interface'
import '../src/secret_network/trade_pairs'
import '../src/secret_network/transactions'

Rails.start()
ActiveStorage.start()

document.activateKeplr = async() => {
  if($(".keplr-wallet").length) {
    let keplrSelector = ".keplr-wallet-button"
    $(keplrSelector).removeClass('d-none')
    window.addEventListener("keplr_keystorechange", () => {
      window.location.reload()
    })

    document.querySelectorAll(keplrSelector).forEach(item => {
      item.addEventListener('click', async(evt) => {
        await document.connectKeplrWallet()
      })
    })
    await document.connectKeplrWallet()
  }
}

// The environment for this always has to be production for the user vip level stuff
// But then does it mean that the user vip level stuff is going to be called every time?
document.connectKeplrWallet = async(getAndSetUserVipLevel = true) => {
  let $keplrButton = $(".keplr-wallet-button")
  $keplrButton.prop("disabled", true);
  $keplrButton.find(".loading").removeClass("d-none")
  $keplrButton.find(".ready").addClass("d-none")
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
    $keplrButton.addClass('d-none')
    let accounts = await window.keplrOfflineSigner.getAccounts()
    $('.wallet-details').removeClass('d-none')
    $('.wallet-address').text(accounts[0].address)
    document.secretNetwork.walletAddress = accounts[0].address
    if (getAndSetUserVipLevel) {
      document.secretNetwork.environment = 'production'
      await document.secretNetwork.getAndSetUserVipLevel(document.secretNetwork.walletAddress, document.secretNetwork.client())
    }
    // Only call this once
    // If the user changes wallets the page will refresh and this will still apply
    // If the user signs out then signs in, everything should look the same
    if (!document.secretNetwork.keplrConnectedTriggered) {
      $(document).trigger('keplr_connected', {});
      document.secretNetwork.keplrConnectedTriggered = true
    }
  }
  catch(err) {
    document.showAlertDanger(err)
    document.secretNetwork.keplrConnectedTriggered = false
    document.secretNetwork.walletAddress = undefined
    $(document).trigger('keplr_dismissed', {});
  }
  finally {
    $keplrButton.prop("disabled", false);
    $keplrButton.find(".loading").addClass("d-none")
    $keplrButton.find(".ready").removeClass("d-none")
  }
}

// === FUNCTIONS ===
document.applyDecimals = function(amount, decimals) {
  return amount / parseFloat("1" + '0'.repeat(decimals))
}

document.delay = async(ms) => {
  return new Promise(resolve => {
      setTimeout(() => { resolve('') }, ms);
  })
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

document.formatHumanizedNumberForSmartContract = function(humanizedNumber, decimals) {
  if (humanizedNumber == '') {
    humanizedNumber = '0'
  }

  return new BigNumber(humanizedNumber.replace(/,/g, '')).times(new BigNumber("10").pow(decimals)).toFixed();
}

document.hideAllAlerts = function() {
  $('.alert-error').addClass('d-none')
  $('.alert-success').addClass('d-none')
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

document.refreshBlockchainStats = function(id, delay) {
  setTimeout(function(){
    $.ajax({
      url: '/blockchains/' + id + '/stats'
    });
  }, delay);
}

document.showAlertInfo = function(text) {
  toastr.options.closeButton = true;
  toastr.options.closeDuration = 0;
  toastr.options.extendedTimeOut = 0;
  toastr.options.preventDuplicates = true;
  toastr.options.tapToDismiss = false
  toastr.options.timeOut = 0;
  toastr.info(text);
}

document.showAlertWarning = function(error) {
  toastr.options.closeButton = true;
  toastr.options.closeDuration = 0;
  toastr.options.extendedTimeOut = 0;
  toastr.options.preventDuplicates = true;
  toastr.options.tapToDismiss = false
  toastr.options.timeOut = 0;
  toastr.warning(error);
}

document.showAlertDanger = function(error) {
  if(error.message && error.message.includes('account sequence mismatch')) {
    document.showAlertWarning("Blockchain issue: Please try again.")
  } else if (error != "Error: Request rejected") {
    toastr.options.closeButton = true;
    toastr.options.closeDuration = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.options.preventDuplicates = true;
    toastr.options.tapToDismiss = false
    toastr.options.timeOut = 0;
    toastr.error(error);
  }
}

document.showAlertSuccess = function(text) {
  toastr.options.closeButton = true;
  toastr.options.closeDuration = 0;
  toastr.options.extendedTimeOut = 0;
  toastr.options.preventDuplicates = true;
  toastr.options.tapToDismiss = false
  toastr.options.timeOut = 0;
  toastr.success(text);
}
