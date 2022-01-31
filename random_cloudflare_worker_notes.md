{"error":"rpc error: code = Unauthenticated desc = encrypted: qKF50ADYralzpNgt/Il6jZixAuI6/5Y1hQHZG6RO4YT3taA5zPAmkqIgknesG6+MtqEuPoNYaF7Q+jdGoSV2YfrfgEHA/DerEIoD6lwqZgSwn9PAHcwLRFQNwabHOfcZBQ2Kgy+tIubUAhM5VN6Fhg==: query contract failed"}


addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    ending = request.url.split('datahub/')[1]
    request = new Request(request)
    request.headers.set('Authorization', datahub_api_key)
    request.url = "https://secret-4--lcd--full.datahub.figment.io/" + ending
    return await fetch(request)
}



addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    // let address;
    let ending = request.url.split('datahub/')[1];
    let url = "https://secret-4--lcd--full.datahub.figment.io/";
    if (request.method == 'GET') {
      url = "https://secret-4--lcd--archive.datahub.figment.io/"
      url = url + ending
      request = new Request(url)
    } else {
      request = new Request(request)
    }
    // if (ending.includes('bank/balances')) {
    //     address = ending.split('bank/balances/')[1]
    //     ending = 'cosmos/bank/v1beta1/balances/' + address + '/uscrt'
    // }
    request.headers.set('Authorization', datahub_api_key)
    // let response = await fetch(request)
    // if (ending.includes('cosmos/bank/v1beta1/balances/')) {
    //     let originalBody = await response.json()
    //     let body = JSON.stringify({ height: response.headers.get('grpc-metadata-x-cosmos-block-height'), result: [originalBody['balance']] })
    //     response = new Response(body, response)
    // }
    // return response
    return await fetch(request)
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

addEventListener('scheduled', event => {
  event.waitUntil(
    handleSchedule(event.scheduledTime)
  )
})

async function handleSchedule(scheduledDate) {
    let url = "https://secret-4--lcd--full.datahub.figment.io/blocks/latest"
    request = new Request(url)
    request.headers.set('Authorization', datahub_api_key)
    let response = await fetch(request)
    return response
}

async function handleRequest(request) {
    let url = "https://secret-4--lcd--full.datahub.figment.io/blocks/latest"
    request = new Request(url)
    request.headers.set('Authorization', datahub_api_key)
    let response = await fetch(request)
    return response
}

// Worker

export default {
    fetch(request, env) {
        return handleRequest(request, env);
    }
}

async function handleRequest(request, env) {
    let id = env.Counter.idFromName("A");
    let obj = env.Counter.get(id);
    let resp = await obj.fetch(request.url);
    let count = await resp.text();

    return new Response("Durable Object 'A' count: " + count);
}

// Durable Object

export class BlockHeigh {
    constructor(state, env) {
        this.state = state;
        // `blockConcurrencyWhile()` ensures no requests are delivered until
        // initialization completes.
        this.state.blockConcurrencyWhile(async () => {
            let stored = await this.state.storage.get("value");
            this.value = stored || 0;
        })
    }

    // Handle HTTP requests from clients.
    async fetch(request) {
        // Apply requested action.
        let url = new URL(request.url);
        let currentValue = this.value;
        switch (url.pathname) {
        case "/increment":
            currentValue = ++this.value;
            await this.state.storage.put("value", this.value);
            break;
        case "/decrement":
            currentValue = --this.value;
            await this.state.storage.put("value", this.value);
            break;
        case "/":
            // Just serve the current value. No storage calls needed!
            break;
        default:
            return new Response("Not found", {status: 404});
        }

        // Return `currentValue`. Note that `this.value` may have been
        // incremented or decremented by a concurrent request when we
        // yielded the event loop to `await` the `storage.put` above!
        // That's why we stored the counter value created by this
        // request in `currentValue` before we used `await`.
        return new Response(currentValue);
    }
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    // Looks like archived api fixes all and can be used for post txs as well!
    let url = "https://secret-4--lcd--archive.datahub.figment.io/";
    // let url = "https://secret-4--lcd--full.datahub.figment.io/";
    // if (request.method == 'GET') {
    //   url = "https://secret-4--lcd--archive.datahub.figment.io/"
    // }
    url = url + request.url.split('datahub/')[1]
    // Need to create a new Request so that we update the url and set the Authorization
    request = new Request(url, request)
    request.headers.set('Authorization', datahub_api_key)
    let response = await fetch(request)
    // if (response.status == 500) {
    //   let responseJson = await response.json()
    //   if (responseJson['error'].includes('max_subscriptions_per_client')) {
    //     response = await retryRequest(request)
    //   }
    // }
    // console.log(response)
    return response
}

// Was thinking of using this for max_client_errors etc but looks like archived api fixes all
// async function retryRequest(request) {
//   request = new Request(request)
//   return await fetch(request)
// }
