$(document).ready(function(){
  if($("#secret-network-dex-aggregator").length) {
    // === LISTENERS ===
    $('#flip-token').click(function(event){
      event.preventDefault();
      let fromAddresss = document.secretNetworkDexAggregatorForm.fromTokenAddress.value
      let toAddress =document.secretNetworkDexAggregatorForm.toTokenAddress.value

      document.secretNetworkDexAggregatorForm.fromTokenAddress.value = toAddress
      document.secretNetworkDexAggregatorForm.fromAmount.value = ''
      document.secretNetworkDexAggregatorForm.toTokenAddress.value = fromAddresss
      document.secretNetworkDexAggregatorForm.toAmount.value = ''
    })

    document.secretNetworkDexAggregatorForm.onsubmit = () => {
      return false;
    };

    window.onload = async () => {
      this.environment = 'production';
      this.chainId = document.secretNetworkChainId(this.environment);
      this.client = document.secretNetworkClient(this.environment);
      this.tradePairs = {}
      getAndSetTradePairs()

      let cryptocurrencies = {
        atom: {
          decimals: 6,
          denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
          symbol: 'ATOM'
        },
        butt: {
          address: 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt',
          decimals: 6,
          symbol: 'BUTT'
        },
        dvpn: {
          decimals: 6,
          denom: 'ibc/E83107E876FF194B54E9AC3099E49DBB7728156F250ABD3E997D2B7E89E0810B',
          symbol: 'DVPN'
        },
        luna: {
          decimals: 6,
          denom: 'ibc/D70B0FBF97AEB04491E9ABF4467A7F66CD6250F4382CE5192D856114B83738D2',
          symbol: 'LUNA'
        },
        osmo: {
          decimals: 6,
          denom: 'ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B',
          symbol: 'OSMO'
        },
        satom: {
          address: 'secret14mzwd0ps5q277l20ly2q3aetqe3ev4m4260gf4',
          decimals: 6,
          symbol: 'sATOM'
        },
        sbnb_bsc: {
          address: 'secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5',
          decimals: 18,
          symbol: 'sBNB(BSC)'
        },
        scrt: {
          decimals: 6,
          denom: 'uscrt',
          symbol: 'SCRT'
        },
        sdai_eth: {
          address: 'secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq',
          decimals: 18,
          symbol: 'sDAI'
        },
        sdot_bsc: {
          address: 'secret1px5mtmjh072znpez4fjpmxqsv3hpevdpyu9l4v',
          decimals: 18,
          symbol: 'sDOT(BSC)'
        },
        sdvpn: {
          address: 'secret1k8cge73c3nh32d4u0dsd5dgtmk63shtlrfscj5',
          decimals: 6,
          symbol: 'sDVPN'
        },
        sefi: {
          address: 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt',
          decimals: 6,
          symbol: 'SEFI'
        },
        seth_bsc: {
          address: 'secret1m6a72200733a7jnm76xrznh9cpmt4kf5ql0a6t',
          decimals: 18,
          symbol: 'sETH(BSC)'
        },
        seth_eth: {
          address: 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw',
          decimals: 18,
          symbol: 'sETH(ETH)'
        },
        sienna: {
          address: 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4',
          decimals: 18,
          symbol: 'SIENNA'
        },
        slink_bsc: {
          address: 'secret1trr50jqff3ncn099cpukehh8a4pjxu0d3m4ccq',
          decimals: 18,
          symbol: 'sLINK(BSC)'
        },
        slink_eth: {
          address: 'secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw',
          decimals: 18,
          symbol: 'sLINK(ETH)'
        },
        sluna: {
          address: 'secret1ra7avvjh9fhr7dtr3djutugwj59ptctsrakyyw',
          decimals: 6,
          symbol: 'sLUNA'
        },
        smana_eth: {
          address: 'secret178t2cp33hrtlthphmt9lpd25qet349mg4kcega',
          decimals: 18,
          symbol: 'sMANA(ETH)'
        },
        socean_eth: {
          address: 'secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps',
          decimals: 18,
          symbol: 'sOCEAN(ETH)'
        },
        sosmo: {
          address: 'secret1zwwealwm0pcl9cul4nt6f38dsy6vzplw8lp3qg',
          decimals: 6,
          symbol: 'sOSMO'
        },
        srsr_eth: {
          address: 'secret1vcm525c3gd9g5ggfqg7d20xcjnmcc8shh902un',
          decimals: 18,
          symbol: 'sRSR(ETH)'
        },
        srune_eth: {
          address: 'secret1el5uj9ns9sty682dem033pt50xsv5mklmsvy24',
          decimals: 18,
          symbol: 'sRUNE(ETH)'
        },
        sscrt: {
          address: 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek',
          decimals: 6,
          symbol: 'sSCRT'
        },
        suni_eth: {
          address: 'secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te',
          decimals: 18,
          symbol: 'sUNI(ETH)'
        },
        susdc_bsc: {
          address: 'secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg',
          decimals: 18,
          symbol: 'sUSDC(BSC)'
        },
        susdc_eth: {
          address: 'secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv',
          decimals: 6,
          symbol: 'sUSDC(ETH)'
        },
        susdt_eth: {
          address: 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f',
          decimals: 6,
          symbol: 'sUSDT(ETH)'
        },
        sust: {
          address: 'secret129h4vu66y3gry6wzwa24rw0vtqjyn8tujuwtn9',
          decimals: 6,
          symbol: 'sUST'
        },
        swbtc: {
          address: 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a',
          decimals: 8,
          symbol: 'sWBTC'
        },
        sxmr: {
          address: 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88',
          decimals: 12,
          symbol: 'sXMR'
        },
        syfi_eth: {
          address: 'secret15grq8y54tvc24j8hf8chunsdcr84fd3d30fvqv',
          decimals: 18,
          symbol: 'sYFI(ETH)'
        },
        ust: {
          decimals: 6,
          denom: 'ibc/4294C3DB67564CF4A0B2BFACC8415A59B38243F6FF9E288FBA34F9B4823BA16E',
          symbol: 'UST'
        },
      };
      this.height = undefined;
      this.protocols = {
        secret_swap: {
          name: 'Secret Swap',
          url: 'https://app.secretswap.io/'
        },
        sienna: {
          name: 'Sienna',
          url: 'https://app.sienna.network/swap/'
        }
      }
      this.httpUrl = document.secretNetworkHttpUrl(this.environment)
      this.pairs = [
        // Wrapping and unwrapping of tokens
        {
          address: cryptocurrencies['satom']['address'],
          cryptocurrency_one: cryptocurrencies['atom'],
          cryptocurrency_two: cryptocurrencies['satom'],
          gas: '',
        },
        {
          address: cryptocurrencies['sdvpn']['address'],
          cryptocurrency_one: cryptocurrencies['dvpn'],
          cryptocurrency_two: cryptocurrencies['sdvpn'],
          gas: '',
        },
        {
          address: cryptocurrencies['sluna']['address'],
          cryptocurrency_one: cryptocurrencies['luna'],
          cryptocurrency_two: cryptocurrencies['sluna'],
          gas: '',
        },
        {
          address: cryptocurrencies['sosmo']['address'],
          cryptocurrency_one: cryptocurrencies['osmo'],
          cryptocurrency_two: cryptocurrencies['sosmo'],
          gas: '',
        },
        {
          address: cryptocurrencies['sscrt']['address'],
          cryptocurrency_one: cryptocurrencies['scrt'],
          cryptocurrency_two: cryptocurrencies['sscrt'],
          gas: '',
        },
        {
          address: cryptocurrencies['sust']['address'],
          cryptocurrency_one: cryptocurrencies['ust'],
          cryptocurrency_two: cryptocurrencies['sust'],
          gas: '',
        },
        // Sienna pairs
        {
          address: 'secret12mhc3vl7gkwy96zc0uthcx66gt8fam2hqgkz4v',
          cryptocurrency_one: cryptocurrencies['sefi_satom_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1gzmeahvxmpvm8j7jr59nzyu7m9kfcyr03dr0jh',
          cryptocurrency_one: cryptocurrencies['sefi_sluna_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret16h2zlqp45wrj9l3p5px6j55thdxptmgs0j3ke0',
          cryptocurrency_one: cryptocurrencies['sefi_sosmo_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1vx2ecq5nmau722mmvx78dk388fnjqmyvapcyny',
          cryptocurrency_one: cryptocurrencies['sscrt_sefi_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1qncs7zvp8dxkw7e8m0stpqxgmpm705wrgu4jsd',
          cryptocurrency_one: cryptocurrencies['sefi_sxmr_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1angrgadt62w3vcf4q2yxnw5d3s02f9dsw0syan',
          cryptocurrency_one: cryptocurrencies['sefi_susdc_eth_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1ny3ycqfana9995dpfjquejjvx6qjvlnwenszz5',
          cryptocurrency_one: cryptocurrencies['sscrt_susdt_eth_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1ef32pr9st29f2k7qrjd4vgq3tj4dvgv66hsdj9',
          cryptocurrency_one: cryptocurrencies['sscrt_seth_eth_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1sxqv0m3r40yfplre9k8qdqjujypce9d0ux3mmu',
          cryptocurrency_one: cryptocurrencies['sscrt_swbtc_eth_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1y4e8c6rvz5hxjjdf7kxuc0uply8mdj9m880zkf',
          cryptocurrency_one: cryptocurrencies['sscrt_sbnb_bsc_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1qm0sfft5zgqw3r3h3ftzcpkvzlady7daaawlcs',
          cryptocurrency_one: cryptocurrencies['sscrt_sdot_bsc_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1w95sau5ll2cm0tdy2r0mf8m8572rhq7sumltam',
          cryptocurrency_one: cryptocurrencies['susdc_eth_susdc_bsc_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1ala3wd5jx8wvc23khnu7z4kglhpkvek843vgdf',
          cryptocurrency_one: cryptocurrencies['seth_eth_swbtc_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1f2gz25aw6mexw0m2vxm37yd6f3y94kn4zujs4c',
          cryptocurrency_one: cryptocurrencies['seth_bsc_seth_eth_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret18fs3zw3vel608zd2h9ldu735wjf5zzwvukf23v',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1c5qjspn066het2jn5ncw837ftnagq5t0c07tpe',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1408t0qkx9hn2r399z83t7mk5p8wcnhus9yj7uz',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1cwdy6wus2krp3vnvp6uvjtgn6ttmyjrt50rshc',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret15hevre4vmatpktxxv0pztmf5h53tts462t7490',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1gusv62nyqr46dpwp39428kfn7vlqm9uautzfvg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret16fuv6mjcffxzd6cwtqek5kym25e9f4g4rxlhq3',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1vm2g67q6hd46tj29d33ypu65sh07k83tvqv334',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1jsjhzghgxc3jg7twcm24mj55zm8q2kapu43z9c',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1tpx0x6048alwr5tdvs8l0kmufpwdh7y6q85nlt',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret13sepv96c76atfautrfdd7y7aa3wj2nwrwh297n',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1ukxu4dncppxfewn8f8vv6u7laqerwfhf9z5dky',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1wa3ffuaml5j9yrynjz6ja8q3kngregc95k05r7',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1df2u7aaj0df56rj2ptpp8u53xg5tu7zypcdh4m',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1nncjsmdhc0s474hkys6mmf7rwkgxqxtfsakfqg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret14cyph2purfswcwej9xtw86hr0xvrzj2wzgrst3',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1zh6elg70j9aah39w3gymnn6gx9ymexr9deejjs',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1dxyaykqlkzs6x2kg0u65q9v2cz35jzsmay7t3y',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1chnpt8dhg7xsy7w6n7nfprv860sq6x94w2vp2c',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret14q3rmr928enspkf76e0l0egumse5kufztu3e4g',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1hdmlyyshlm9wdzzzredgrfgqvj0qfga9dqv48l',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1wsyctve8keay992arwk4lv9u9flq8q983ejg2a',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret127m5s4ngjm3d9s4j4mklwrvce6wartfadtaj6q',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1fdqvh50k6xsqpccmnhlxjkthm6550pgrynxrrc',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1cxs2gdkveyw3r580ysxmh8ea5x4az7cvy76ufw',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret19lqma3p3hq9j552a6zgwq2k0x9wx0kf3d035ya',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret17gqwljkvvrtkvgaz532e5l0vzfgjynnamm3stg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret168tw9vzyl6zzcwnwls9vk5pqwn6wrx2ga5jcvr',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        {
          address: 'secret1aynzq6rz24grzsv7rw6auv9htvq4w9es7x2y7x',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['sienna'],
        },
        // Secret swap pairs
        {
          address: 'secret1pxp9wy9gv20kpaee6evsp9n4h6gptxxkwhwfaj',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1py6j9h7mfe87h9jud0e6zyk6qyhllz4r89xpe8',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1pq6q9wgnwp5vmw2mg4l4tjhn7g87nn258f57qg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1q00lhgule0mammrxdfn2e67uwhandgr5jhfvvm',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1qf03p2jeen2g5f5ttj0ttd4eyt2q9mr9pzmwum',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1zxpjz62wh9qc0q5d72ynx8l2rfj4fn39e63nmn',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1r4x95f8fzlkdn87a3gdr0xjuwe08qnkqdls5uz',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1rtgz90f7umulrg3a574p9n6d9hzcxmxqwdk9hj',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1rgky3ns9ua09rt059049yl0zqf3xjqxne7ezhp',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1ry9s8al2w2my4z7jqhtve9fqkesqapn0mrjr3z',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1zkckdmjv5f2wk6r6ehunvwse55xded0n6dwfs0',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1p839pa56c6lvnemmsv5f7rlz52qytsg8h8gm8g',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1rzq07mzyaqg0nxnk8kh9804dgj4ntduc35judn',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1pnefssturvfzm7dvk07495l564f7pe2v6qfmay',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1g66n0qn7ygu5gqz8cdrmfpwk5wu32rm3thlfzs',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1p5xrsvtazprqytshdhyqyf7487f2cwqm3px54s',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1rf4uqg4d2elmvp535ayhxwnrpdykmxan0nrwtg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1pmt7ncuhau2g7h9snygx2tlkzqnks3uz5edgyc',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1rdgh73kulr52q7r09x9d2r3528jq52es4dalnt',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1pukk3cvgdg3a9a72n9rkhcqk9fc9qgjpzlhlnl',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1yf5ha6ysgznlnedad4ggdcxl4zwtcucqvannlr',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1zra95h6nf4kc49x59x66t7crxxl79hr5nph882',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1qzemy8wsnr64m2s4k3772yf7mfdshksdlac6ff',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret18su923qzncs6gs3qt2j7qy28e57p94zaydjs25',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1x6zk42ayxu0wk5p905wkct8qgxk9afexkqyava',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1xhr2kt02t9wxwcfjj2me77yehar83dpw2kq07q',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1x8244a7l2fr642axef0sl5z3jw2pn75rp36hxs',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1fz6k6sxlnqwga9q67y9wly6q9hcknddn8alrtg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret183lq5e49veyushgu5s2ul3dup57z4qcacx7ek8',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret12um5gxf2vdm6vy4q36jcxlg9mc60y6wgewwxx9',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret12fnnk0k9n9d2wjuv3gz7nszazk5wvf6rqgce6s',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1fh9f4zquppnzp8wrhvy2pfkwyd4tadt530332a',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1fspv4fzc90g72r22djhhtf2jrxvcte3dsvp2dk',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1ff2z4d8zn7pd6ghshxwdmqudvw4p7zylvhel37',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1vmlnlyvgcdxrp3786gha42xwtsdktlgkn2z56d',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1gyct75dc2pf20vtj3l86k2jxg79mffyh9ljve3',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1f30aqh59eg5xhalsdc6u8cv26qe283ey9pp658',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1g97kxc857asparfgdudzkzyq5akd74xmup52uj',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1fey7tapcx47rl92xf97ftsk4njldrtdqkv4nsg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1gttky6spv8s4uev65ps8thszzapndjummghl0h',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret12dmwk3s0atewvcl4gzs6rh3puz29ahy0wwfhtj',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1rxrg8mp4qm5703ccz26lgh8hx7gpnkujrn6qcr',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1twjm5j6vdal6khekdr2krpqdmnhwx20p6je3p9',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1fq7n6wx33qeqfw3gltjy43x9er2al5m09nsqw6',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1f0zqcy62ge3jevrum4sxqnm9re44xnuyzalylh',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1vtlce7s4p8mk3y7cfnqq9rr7qs3pthk0v5g7yx',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1v82egg9xtycsaz0h3nqay0saq0dv296z4swjku',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret103e3kt05rt89fayp9y7w44wj4x3k5zumy6cdyc',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1wta3fmj23ltf4df8kt8ztu5wpmzauhlwyp0c2c',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1wrajc66xjst7mkjn383ymvtl54jaslalkhxt6e',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1dexxl42aknade3w2pj7tjc7eejd28s9cx6ar27',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1dtl3f7zva09wn0kclysqmpzzuaujd9v4tgsmly',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1dfzxr0nygttyw0xvhhgk2046t6mlj3lu7dn0hv',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1vatyq8lt3d34lm9xpnypwnv7ecc3g2t48qwmp3',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret10nh7zxf88q8t7zntnfq7wuu2ekjt6y9zv8hnas',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1wk20068ra0evzp58ac9flejzgucgfsn633pzrk',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1w779swgqkedkuqjs24ka4u900sdkm3khack0e7',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret10uk6nusgevq2mueat86ze5s4jd3r00gz5hffls',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1wdqv9g68l98vw5xdczjmj9zpldu8hf8v2d6ra4',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret10560sctknky3stzh2csk2uft7xqfvz798dp0a3',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret10x0k62eaal4q3t9c200qvmgftahxjqvdawn69c',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret10xdqg45lemuvg4855vljkmcyztf526jtmgc49z',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret13avjjq75jwqpthykw9vcjkqtqnvfjd2nwv5c9j',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1lamq00jwpms5hzel22rjgmd0v2wn8fep6rzhmh',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret10dfdkp3k7vjkqyn8g396rpza9t3wechpm8wnx0',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret15mp52phcct6f45tkhyvedhlt3zv9jn4ul44mfa',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1494aehy93xjdrsuhs7plp2ha0u9mrk8d9a4s4r',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret132zd4csn5xfellxa9xp94t7dl32jqk5lu4hump',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1samke0j286t44v72utzmm6dekea5z0v75sddwj',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1sk0l9gpx8aw22a4qlw47sgcuugaw00ztq5da5j',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1sj65pd9fqgwyj0a9ctl4cecp62y52z5nzpq60r',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret13ns5mzms67jttq5cnv76j5lgtd0xf69sv4sdpq',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret14zv2fdsfwqzxqt7s2ushp4c4jr56ysyld5zcdf',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1jta83ms8xe2nzmt4sg0mumqwuejx6wa7zqsduq',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1j8vs8v729vregluuzr5n4zr77ztaleqtqcw026',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1449vdd3sydkqy4nf2sqyty3tq3pp8kgxqel9zm',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1vwdklfh4h023tpgttnreyajedyfq8swyj22gzg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1jkcg9srf07pdcr79yy8vef9p9m8qut30xgatqj',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret153sh9337q6a46g39pdsx9e8sne6g0qz79qsvzq',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret14cxq26u8f9zpd09a72uznwz7kew9yc085d08hy',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1jp7f26yaa5yvk6a75ytaq5jnnntetlw38negl6',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1m25qmwkxcflzzsz5rfuty3yx3cll3rtzfwyx09',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1nx5g02estzh8ufqgwxse5s7hkvya6f6aha6kpc',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret15x63eu5wrqa8szmhkw3ams3x6eel4gpfx6rv22',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret10tl9at5y8awqyaanlg5f2fw63wjmg2l2x3m8ke',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret14qs40askz5ffysmr9s49xan6dqkfhd2jq8ct8c',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret15jlnng79vd7ut6qhkwtp6tudrv0gf6zfjqqm8d',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret15kkj9gyjurvxqcv63ly96lmc7vpcsllt65f7dv',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret14yfchhpzrdhj78tyk4d8un0t64s038szkk66n5',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1ecdsn7curwhnea8t93x6pervkkc0s0ef2jjyc6',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1jjxaany509v3kdhmvazrj7ln5klkflcjvx890a',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret14lhvcsqqpqx4uas9q6p0ueay7memsrdu29l4jv',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret14v9dc5kfe0aamnz73vtc2a6ph7klqh5lspdxrg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret14v9dc5kfe0aamnz73vtc2a6ph7klqh5lspdxrg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1kzxusez7c9frxf7yayztlrtsqtf20nhfu62d6l',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret17kaeu53n2na40z7cfxseaqycyzwkhgskrnj2s9',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1udcm40mkgw53hdus3tcf2xhup88sx6yns9xv23',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1e05xwjuhww4aql0xguzys63977mp27qlx6j4de',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1ejjy36t0sz8lxvy3p58hgg0gs5w2aw2rztwngy',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1ejjy36t0sz8lxvy3p58hgg0gs5w2aw2rztwngy',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1u2kes9x458mf7e7ghj5x2j9mmpr894qg9x0qm9',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1jr99mtjs87hsx6hs36ze2l5efgj2x0gqrmya0p',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1mm8g6wktv5vjfj6rs2jja2hq0rsjsugz658sup',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1mvwdz62tdqg4hnmmszlwppk9p85892pdecg99s',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1hudap8eslsxsd3qjw66gnqheeyaalds53s6cgz',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret14mzz277cnt8l4efnskzj4s3c04lx6njd52nfnn',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1hy8ajfzfj5yd70x7nhw9gd4qyyqqc4stgjqsr3',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret173jjaeen8jqm69z3s2rhfma5nwsx2vm00e58jg',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret145p9527297y5trecz3kf8yrma0ls2r40vedvga',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1ersk748pm763pjml54kzapycydu6uwtka8xe6t',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1k33pn6akw9ug8rdwyszeqzmr9k8ssxhvydmg8t',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1nc59zhtyqdxuutzu9a9qd35rgs6ad8c5mddh4p',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1uakhxh3qwe2k8khww709cpxlm8kmwapufmfrr0',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1mq2f0x9qyr2fwpyuaux3tehgvk8faz9ntazehd',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1ldac7f6372k5nte03u9ev9c0ls7le5sp09gz8d',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1mgznzddvnarq28eua9pqe3f44tnuuwrrkrvcsu',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret14v3p9xq0353fvwrhkjyv4c96vrujjvzwmqyq0k',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1k2u3khzp59mp6wz2q4ulwhhy4rqpez63ln2fy6',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1k2u3khzp59mp6wz2q4ulwhhy4rqpez63ln2fy6',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1u9zfyh7d4mgf44f3y8fhz4e70dhjzd5e5df8hp',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1m79q9hnz44xtndmlrd9p57tt6z3kjeecp7957u',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1c7far5kl8824jmqucyrfpwx43fa40ek902wwzc',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1mw60ydzyt8gmlmmg4gjv3vg8x5978p8dse8lhf',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1j479pa5agm0v3vdh8huahn87j4xd2d5t9syppl',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1le6k90dug7cvv22snfkdp55v3rrhgt5fj3vd7z',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret19sae9hy2jge29pl828mvwnrudym4zxvcwnsfjl',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1wvlwurtdylpqdmwjursrj4fwll4qg6a0k2fzla',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1t7ll7plda7cdkh0jdqpyxp8czcfzxr2k23smwz',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret135nxgj2gcy0dl5w5dt2tzuc2rzkveanrgegzj7',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1hystqn307ds2uh9uh7nk5qqp7qjjx25jzq8lh8',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1crht5ata6fcpxu3jkp7ldt2mu3nk864kkysraj',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1shuw8mcpumqa7zz29lu2nfmataddgwpjldhdwx',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1aw3tazur8g2mh22dv4k7kla07ew5egd20yjwzh',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1373gqnpkcrl0hd7pam79m73w5mdk2f6n4rtrwd',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1sd49834qql2rxkudz65rxftvv8kddg6vt5qg6y',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1zwzcv5fl5sckz7m052275gtlr3pu6wfm5dyt5n',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1matvvvf83pxz8v6cyxyte03pw2nhyyt9mhdfyd',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1v5cajmfmvq6t4kthxxs6ee99uw0d4hu8qfdnax',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret13t3agw0ly97plqavpua50lcd6h2hfx09lw57pk',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1qarc6vcjc3mk5ryu98x95fdhaxx064lknnl5qt',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1p9nyn4qenwxxzg2j9c3nsqfr9dd09xkne55qjm',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret139kzcvjdndz29zt5l5s45f7x06yqegy27jvluj',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1caqlkjngqsx037g8uy8wwvp6qp3kjlh3jz5t0n',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1qsv3pw4a32q9ckkvls3l7wczvdkr93ql0hnplv',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1pfv3yy29yxnjmtqg67acal2teq8ql5680vrlws',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret12d2hjgm2j90u94sxqnvg8cxz66jjp03dexm9mp',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret14978jvzdczhxrrscyzk8l547hvhquynu4s7y44',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1j0j44ffvt8y55scadw2q93rjwp2rstkzc3hcnd',
          cryptocurrency_one: cryptocurrencies['sefi_sdvpn_lp'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1yeakunry5d7knf093fl0eq95yxzwz9qve3v20p',
          cryptocurrency_one: cryptocurrencies['sust'],
          cryptocurrency_two: cryptocurrencies['sefi'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1hldl97njtqnqnp8khjlgne3hzmkzudm6xd3fag',
          cryptocurrency_one: cryptocurrencies['sefi'],
          cryptocurrency_two: cryptocurrencies['sluna'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1er4emyzgrfujvcpkm8njt3yfnuwmhya9pg9kz3',
          cryptocurrency_one: cryptocurrencies['sefi'],
          cryptocurrency_two: cryptocurrencies['sdvpn'],
          gas: '',
          protocol: protocols['secret_swap'],
        },
        {
          address: 'secret1km9y68snu30r8tampnfterhd8rf4vrry2rtzew',
          cryptocurrency_one: cryptocurrencies['sscrt'],
          cryptocurrency_two: cryptocurrencies['sdvpn'],
          gas: '',
          protocol: protocols['secret_swap'],
        }
      ]

      function getAndSetTradePairs() {
        this.tradePairs = {}
        var request = new XMLHttpRequest()
        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', '/pools', true)
        request.onload = function () {
          // Begin accessing JSON data here
          var data = JSON.parse(this.response)
          console.log(data)
          // data.forEach((tradePair) => {
          //   this.tradePairs[smartContract["address"]] = smartContract;
          // })
        }
        // Send request
        request.send()
      }
    }
  }
})
