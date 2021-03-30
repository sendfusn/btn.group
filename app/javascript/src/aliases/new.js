$(document).ready(function(){
  if($("#aliases-new").length) {
    window.onload = async () => { 
      const { SigningCosmWasmClient } = require('secretjs');
      var chainId = 'holodeck-2';

      // Keplr extension injects the offline signer that is compatible with cosmJS.
      // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
      // And it also injects the helper function to `window.keplr`.
      // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
      if (!window.getOfflineSigner || !window.keplr) {
        alert("Please install keplr extension");
      } else {
        if (window.keplr.experimentalSuggestChain) {
          try {
            // Setup Secret Testnet (not needed on mainnet)
            // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
            // cosmoshub-3 is integrated to Keplr so the code should return without errors.
            // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
            // If the user approves, the chain will be added to the user's Keplr extension.
            // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
            // If the same chain id is already registered, it will resolve and not require the user interactions.
            await window.keplr.experimentalSuggestChain({
              chainId: chainId,
              chainName: 'Secret Testnet',
              rpc: 'http://bootstrap.secrettestnet.io:26657',
              rest: 'https://bootstrap.secrettestnet.io',
              bip44: {
                coinType: 529,
              },
              coinType: 529,
              stakeCurrency: {
                coinDenom: 'SCRT',
                coinMinimalDenom: 'uscrt',
                coinDecimals: 6,
              },
              bech32Config: {
                bech32PrefixAccAddr: 'secret',
                bech32PrefixAccPub: 'secretpub',
                bech32PrefixValAddr: 'secretvaloper',
                bech32PrefixValPub: 'secretvaloperpub',
                bech32PrefixConsAddr: 'secretvalcons',
                bech32PrefixConsPub: 'secretvalconspub',
              },
              currencies: [
                {
                  coinDenom: 'SCRT',
                  coinMinimalDenom: 'uscrt',
                  coinDecimals: 6,
                },
              ],
              feeCurrencies: [
                {
                  coinDenom: 'SCRT',
                  coinMinimalDenom: 'uscrt',
                  coinDecimals: 6,
                },
              ],
              gasPriceStep: {
                low: 0.1,
                average: 0.25,
                high: 0.4,
              },
              features: ['secretwasm'],
            });

            // This method will ask the user whether or not to allow access if they haven't visited this website.
            // Also, it will request user to unlock the wallet if the wallet is locked.
            // If you don't request enabling before usage, there is no guarantee that other methods will work.
            await window.keplr.enable(chainId);

            // @ts-ignore
            const keplrOfflineSigner = window.getOfflineSigner(chainId);
            const accounts = await keplrOfflineSigner.getAccounts();
            var address = accounts[0].address;
            var cosmJS = new SigningCosmWasmClient(
              'https://bootstrap.secrettestnet.io/',
              address,
              keplrOfflineSigner,
              window.getEnigmaUtils(chainId),
              {
                init: {
                  amount: [{ amount: '300000', denom: 'uscrt' }],
                  gas: '300000',
                },
                exec: {
                  amount: [{ amount: '300000', denom: 'uscrt' }],
                  gas: '300000',
                },
              },
            );
            $("#create-button").prop("disabled", false);
          } catch (error) {
            console.error(error)
          }
        } else {
          alert("Please use the recent version of keplr extension");
        }
      }

      document.aliasCreateForm.onsubmit = () => {
        (async () => {
          $("#create-button").prop("disabled", true);
          const contracts = await cosmJS.getContracts(28101)
          const contractAddress = contracts[0].address
          try {
            let alias = document.aliasCreateForm.alias.value;
            let handleMsg = { create: {alias_string: alias} }
            let promise = cosmJS.execute(contractAddress, handleMsg);
            promise.then(
              function(value) {
                console.log(value)
                $("#create-button").prop("disabled", false);
              },
              function(error) {
                console.log(error)
                $("#create-button").prop("disabled", false);
              }
            );
          }
          catch(err) {
            $("#alert-danger").removeClass("d-none")
            $("#alert-danger").text(err)
            $("#create-button").prop("disabled", false);
          }
        })();

        return false;
      };
    };
  };
});
