import BigNumber from "bignumber.js";

$(document).ready(function(){
  if($("#secret-network-pools").length) {
    window.onload = async () => {
      let cryptocurrencies = {
        butt: {
          address: 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt',
          dataHash: 'F8B27343FF08290827560A1BA358EECE600C9EA7F403B02684AD87AE7AF0F288',
          decimals: 6,
          symbol: 'BUTT'
        },
        butt_swbtc_lp: {
          address: 'secret19kh9wmzulxv8lw0e0fyxjxmwtmln2fqpnetucl',
          asset_one: 'butt',
          asset_two: 'swbtc',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'BUTT-sWBTC'
        },
        butt_sxmr_lp: {
          address: 'secret1any3nf7mays46ry4w7enrfqnk837yz9h2zqdrf',
          asset_one: 'butt',
          asset_two: 'sxmr',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'BUTT-sXMR'
        },
        satom: {
          address: 'secret14mzwd0ps5q277l20ly2q3aetqe3ev4m4260gf4',
          dataHash: 'AD91060456344FC8D8E93C0600A3957B8158605C044B3BEF7048510B3157B807',
          decimals: 6,
          symbol: 'sATOM'
        },
        sbnb_bsc: {
          address: 'secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5',
          dataHash: 'D0DB7128B8697419AD915C9FA2C2B2DA462634AB95CBB3CA187564A1275561CF',
          decimals: 18,
          symbol: 'sBNB(BSC)'
        },
        sdot_bsc: {
          address: 'secret1px5mtmjh072znpez4fjpmxqsv3hpevdpyu9l4v',
          dataHash: 'D0DB7128B8697419AD915C9FA2C2B2DA462634AB95CBB3CA187564A1275561CF',
          decimals: 18,
          symbol: 'sDOT(BSC)'
        },
        sdvpn: {
          address: 'secret1k8cge73c3nh32d4u0dsd5dgtmk63shtlrfscj5',
          dataHash: 'AD91060456344FC8D8E93C0600A3957B8158605C044B3BEF7048510B3157B807',
          decimals: 6,
          symbol: 'sDVPN'
        },
        sefi: {
          address: 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt',
          dataHash: 'C7FE67B243DFEDC625A28ADA303434D6F5A46A3086E7D2B5063A814E9F9A379D',
          decimals: 6,
          symbol: 'SEFI'
        },
        sefi_satom_lp: {
          address: 'secret1w8l6c4fgc4nj2nwxadpmza4kt44xzd72pjn29u',
          asset_one: 'sefi',
          asset_two: 'satom',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'SEFI-sATOM'
        },
        sefi_sdvpn_lp: {
          address: 'secret1prxa3js02lys75a48hru944j5knszzr5tyehar',
          asset_one: 'sefi',
          asset_two: 'sdvpn',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'SEFI-sDVPN'
        },
        sefi_sluna_lp: {
          address: 'secret1ff99syuvgpfj5pdg8vw88c6lz796lclvyu3hem',
          asset_one: 'sefi',
          asset_two: 'sluna',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'SEFI-sLUNA'
        },
        sefi_sosmo_lp: {
          address: 'secret13zae8r3zlms9e6f4gvy2252w2z5ffqxslu35wu',
          asset_one: 'sefi',
          asset_two: 'sosmo',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'SEFI-sOSMO'
        },
        sefi_susdc_eth_lp: {
          address: 'secret1mm7df4ygxwlfg0l70jrrkshlhtp8vv5n7hj9rr',
          asset_one: 'sefi',
          asset_two: 'susdc_eth',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'SEFI-sUSDC(ETH)'
        },
        sefi_sxmr_lp: {
          address: 'secret1xug4dc46sqlcaetm5c72qhjtedh05922uac9k2',
          asset_one: 'sefi',
          asset_two: 'sxmr',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'SEFI-sXMR'
        },
        seth_bsc_seth_eth_lp: {
          address: 'secret1c9ky0x6fj5gc0qw6tedxsng50mjl3szn7xhjeu',
          asset_one: 'seth_bsc',
          asset_two: 'seth_eth',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'sETH(BSC)-sETH(ETH)'
        },
        seth_eth_swbtc_lp: {
          address: 'secret1nvqrwwr9942gn89nk44nf2nku6gr7u8tsg6z45',
          asset_one: 'seth_eth',
          asset_two: 'swbtc',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'sETH(ETH)-sWBTC'
        },
        seth_bsc: {
          address: 'secret1m6a72200733a7jnm76xrznh9cpmt4kf5ql0a6t',
          dataHash: 'D0DB7128B8697419AD915C9FA2C2B2DA462634AB95CBB3CA187564A1275561CF',
          decimals: 18,
          symbol: 'sETH(BSC)'
        },
        seth_eth: {
          address: 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw',
          dataHash: '2DA545EBC441BE05C9FA6338F3353F35AC02EC4B02454BC49B1A66F4B9866AED',
          decimals: 18,
          symbol: 'sETH(ETH)'
        },
        sienna: {
          address: 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4',
          dataHash: 'C1DC8261059FEE1DE9F1873CD1359CCD7A6BC5623772661FA3D55332EB652084',
          decimals: 18,
          symbol: 'SIENNA'
        },
        sluna: {
          address: 'secret1ra7avvjh9fhr7dtr3djutugwj59ptctsrakyyw',
          dataHash: 'AD91060456344FC8D8E93C0600A3957B8158605C044B3BEF7048510B3157B807',
          decimals: 6,
          symbol: 'sLUNA'
        },
        sosmo: {
          address: 'secret1zwwealwm0pcl9cul4nt6f38dsy6vzplw8lp3qg',
          dataHash: 'AD91060456344FC8D8E93C0600A3957B8158605C044B3BEF7048510B3157B807',
          decimals: 6,
          symbol: 'sOSMO'
        },
        sscrt: {
          address: 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek',
          dataHash: 'AF74387E276BE8874F07BEC3A87023EE49B0E7EBE08178C49D0A49C3C98ED60E',
          decimals: 6,
          symbol: 'sSCRT'
        },
        sscrt_sbnb_bsc_lp: {
          address: 'secret1le3d0fgkrzd433fdnetdqslfxmugvg0tuaqspe',
          asset_one: 'sscrt',
          asset_two: 'sbnb_bsc',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'sSCRT-sBNB(BSC)'
        },
        sscrt_sdot_bsc_lp: {
          address: 'secret1mc656zt6g37u2ufqp2tw8kaj5jxpujylfzw8yw',
          asset_one: 'sscrt',
          asset_two: 'sdot_bsc',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'sSCRT-sDOT(BSC)'
        },
        sscrt_sefi_lp: {
          address: 'secret1709qy2smh0r7jjac0qxfgjsqn7zpvgthsdz025',
          asset_one: 'sscrt',
          asset_two: 'sefi',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'sSCRT-SEFI'
        },
        sscrt_seth_eth_lp: {
          address: 'secret17gja535zp09t9mlzzxndqqg4gzvhg0vsklhd54',
          asset_one: 'sscrt',
          asset_two: 'seth_eth',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'sSCRT-sETH(ETH)'
        },
        sscrt_susdt_eth_lp: {
          address: 'secret1cgd6gcc4uyrxmzsmk4tpeta8auzcgwk4n5ngrx',
          asset_one: 'sscrt',
          asset_two: 'susdt_eth',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'sSCRT-sUSDT(ETH)'
        },
        sscrt_swbtc_eth_lp: {
          address: 'secret1xxvqanj85m7dppplku5782cn9hl8askqd329sv',
          asset_one: 'sscrt',
          asset_two: 'swbtc',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'sSCRT-sWBTC(ETH)'
        },
        susdc_bsc: {
          address: 'secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg',
          dataHash: 'D0DB7128B8697419AD915C9FA2C2B2DA462634AB95CBB3CA187564A1275561CF',
          decimals: 18,
          symbol: 'sUSDC(BSC)'
        },
        susdc_eth: {
          address: 'secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv',
          dataHash: '2DA545EBC441BE05C9FA6338F3353F35AC02EC4B02454BC49B1A66F4B9866AED',
          decimals: 6,
          symbol: 'sUSDC(ETH)'
        },
        susdc_eth_susdc_bsc_lp: {
          address: 'secret163e9frya0vqar70s4j3na94apf0cffl2rjgmgg',
          asset_one: 'susdc_eth',
          asset_two: 'susdc_bsc',
          dataHash: 'EA3DF9D5E17246E4EF2F2E8071C91299852A07A84C4EB85007476338B7547CE8',
          decimals: 6,
          symbol: 'sUSDC(ETH)-sUSDC(BSC)'
        },
        susdt_eth: {
          address: 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f',
          dataHash: '2DA545EBC441BE05C9FA6338F3353F35AC02EC4B02454BC49B1A66F4B9866AED',
          decimals: 6,
          symbol: 'sUSDT(ETH)'
        },
        swbtc: {
          address: 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a',
          dataHash: '2DA545EBC441BE05C9FA6338F3353F35AC02EC4B02454BC49B1A66F4B9866AED',
          decimals: 8,
          symbol: 'sWBTC'
        },
        sxmr: {
          address: 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88',
          dataHash: '667A3DBEC9096DE530A5521A83E6090DF0956475BD4ACC8D05F382D4F8FFDD05',
          decimals: 12,
          symbol: 'sXMR'
        }
      };
      this.pools = [
        // This has to be first position in array
        {
          address: 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz',
          dataHash: 'BF78E4C9A6E0563072D36DEF3D6C44FB2BD8FED15932A5ECAD4915200D728813',
          deposit_gas: '112500',
          deposit_msg: 'eyAiZGVwb3NpdF9idXR0Y29pbiI6IHt9IH0=',
          deposit_token: cryptocurrencies['butt'],
          earn_token: cryptocurrencies['sefi'],
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '112500',
        },
        // This has to be second position in array
        {
          address: 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku',
          dataHash: 'A66AD14E31CBC2AB25B3A7B7085F0BC345E65C09649C49EA88CD77A4987AA0A5',
          deposit_gas: '262500',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['butt_swbtc_lp'],
          earn_token: cryptocurrencies['butt'],
          reward_token: cryptocurrencies['butt'],
          withdraw_gas: '262500',
        },
        {
          address: 'secret17gpz09yv0eyw633y459ncqmf4qsye9kwqecnvf',
          dataHash: '3D83E7A7A192A57198049481A74888B340D2B1C4F5A33A6083C3500FA53E05DC',
          deposit_gas: '400000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi'],
          earn_token: cryptocurrencies['sefi'],
          farm_contract_address: 'secret1knars62aly28xkqxe8xeqtf7ans8hqxgm6a05k',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '400000',
        },
        {
          address: 'secret1zy4qj454r8pxp7xrrsfyg39mjw37p59pcqxzt6',
          dataHash: 'A454B82B242B48CA88342ED6BA61439B12D2B1FD8A8FDB0233D6077D3BCECF87',
          deposit_gas: '937500',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi_satom_lp'],
          earn_token: cryptocurrencies['sefi_satom_lp'],
          farm_contract_address: 'secret1ga4yptznzm6ycrru3d02g6596cs7wgkugv9pmc',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '937500',
        },
        {
          address: 'secret1e20srxwp706dcntvgaxqrfza7v8km3wj493q87',
          dataHash: 'A454B82B242B48CA88342ED6BA61439B12D2B1FD8A8FDB0233D6077D3BCECF87',
          deposit_gas: '937500',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi_sluna_lp'],
          earn_token: cryptocurrencies['sefi_sluna_lp'],
          farm_contract_address: 'secret1hzul4anur0lw3mq4t0sg95ew27hjg8x9tz6jes',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '937500',
        },
        {
          address: 'secret1h382lgl6u3djn62elh3lw25qjk9rnm890ynzww',
          dataHash: 'A454B82B242B48CA88342ED6BA61439B12D2B1FD8A8FDB0233D6077D3BCECF87',
          deposit_gas: '937500',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi_sosmo_lp'],
          earn_token: cryptocurrencies['sefi_sosmo_lp'],
          farm_contract_address: 'secret170mt93k5fh07vdhdvu585mxv2e7j7me2xtkae9',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '937500',
        },
        {
          address: 'secret1yuxtccepn3n3z8stqq8cwkz2kvyjcx4nahcs0v',
          dataHash: 'A454B82B242B48CA88342ED6BA61439B12D2B1FD8A8FDB0233D6077D3BCECF87',
          deposit_gas: '937500',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_sefi_lp'],
          earn_token: cryptocurrencies['sscrt_sefi_lp'],
          farm_contract_address: 'secret1twjquxp06j9ppyg4v6dr496fnmfcvzpx8weddm',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          reward_token: cryptocurrencies['sefi'],
          withdraw_gas: '937500',
        },
        {
          address: 'secret1wgqv5ch9njg454ru5pau02ut7mh5wjf2rr3gmj',
          dataHash: 'A454B82B242B48CA88342ED6BA61439B12D2B1FD8A8FDB0233D6077D3BCECF87',
          deposit_gas: '937500',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi_sxmr_lp'],
          earn_token: cryptocurrencies['sefi_sxmr_lp'],
          farm_contract_address: 'secret1pqvny7lp32z939vtd08jhe66cxl0qp3quxyls5',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          withdraw_gas: '937500',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret1xec2u79g8qx7krz48lk3xsmr3crmyvp6tp46jn',
          dataHash: 'A454B82B242B48CA88342ED6BA61439B12D2B1FD8A8FDB0233D6077D3BCECF87',
          deposit_gas: '937500',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi_susdc_eth_lp'],
          earn_token: cryptocurrencies['sefi_susdc_eth_lp'],
          farm_contract_address: 'secret16ahwz30chht7wg926tfaj07563hkmemad4nnzm',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          withdraw_gas: '937500',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret1rtu4dnkknlsuxwunc0ufry8se78vjul4953l5z',
          dataHash: '44B1B5807377D957CB7252CDE9F45940982C0452CF190E175D62E7662347A165',
          deposit_gas: '1125000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_susdt_eth_lp'],
          earn_token: cryptocurrencies['sscrt_susdt_eth_lp'],
          farm_contract_address: 'secret1ny8nvnya5q4zcxpyldvdhts0uvh26heny8ynuj',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          withdraw_gas: '1125000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret199pnc4xusvazp73ns95mylqeq9m4xcr8k4fzku',
          dataHash: '44B1B5807377D957CB7252CDE9F45940982C0452CF190E175D62E7662347A165',
          deposit_gas: '1125000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_seth_eth_lp'],
          earn_token: cryptocurrencies['sscrt_seth_eth_lp'],
          farm_contract_address: 'secret17r72nj7yhc0fnm3ay8j8tluqqd2twj60lvwr3w',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          withdraw_gas: '1125000',
          reward_token: cryptocurrencies['sefi'],
        },
        // {
        //   address: 'secret1vpvypnlcz0kng32qlp4727tx87e2kauffng79v',
        //   deposit_gas: '1125000',
        //   deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
        //   deposit_token: cryptocurrencies['sscrt_swbtc_eth_lp'],
        //   earn_token: cryptocurrencies['sscrt_swbtc_eth_lp'],
        //   farm_contract_address: 'secret1enpte7ll3r4zrs70najmf7g83hdzy33wmdx7nk',
        //   withdraw_gas: '1125000',
        //   reward_token: cryptocurrencies['sefi'],
        // },
        {
          address: 'secret18ys9t245ejrx06zmfj6mkvnrd8wrupdanfvnxp',
          dataHash: '44B1B5807377D957CB7252CDE9F45940982C0452CF190E175D62E7662347A165',
          deposit_gas: '1125000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sscrt_sbnb_bsc_lp'],
          earn_token: cryptocurrencies['sscrt_sbnb_bsc_lp'],
          farm_contract_address: 'secret16pqkssv08hjfmamrcz9gruhxxsuvc25n4gq0s2',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          withdraw_gas: '1125000',
          reward_token: cryptocurrencies['sefi'],
        },
        // {
        //   address: 'secret19dq8df5jyqqd7v6eugk4c255lgasj76kug242c',
        //   deposit_gas: '1125000',
        //   deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
        //   deposit_token: cryptocurrencies['sscrt_sdot_bsc_lp'],
        //   earn_token: cryptocurrencies['sscrt_sdot_bsc_lp'],
        //   farm_contract_address: 'secret1geklww0t0kwehc2w9llwce2wkg40pp4ljfpa8m',
        //   withdraw_gas: '1125000',
        //   reward_token: cryptocurrencies['sefi'],
        // },
        {
          address: 'secret1k38fm5942tnyl7jqct0nxkluldl84gldhravql',
          dataHash: '44B1B5807377D957CB7252CDE9F45940982C0452CF190E175D62E7662347A165',
          deposit_gas: '1125000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['susdc_eth_susdc_bsc_lp'],
          earn_token: cryptocurrencies['susdc_eth_susdc_bsc_lp'],
          farm_contract_address: 'secret1rcvjaua8dfhjlh0kwhrsj54l4aj46mu5evgqwq',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          withdraw_gas: '1125000',
          reward_token: cryptocurrencies['sefi'],
        },
        // {
        //   address: 'secret1uwr63xusz285r9ztqx6f4mx2jg6yug5f405ajm',
        //   deposit_gas: '1050000',
        //   deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
        //   deposit_token: cryptocurrencies['seth_eth_swbtc_lp'],
        //   earn_token: cryptocurrencies['seth_eth_swbtc_lp'],
        //   farm_contract_address: 'secret1zsnjdcjwpyamc98lyvd5v8u9rw0949px6r5agg',
        //   withdraw_gas: '1050000',
        //   reward_token: cryptocurrencies['sefi'],
        // },
        {
          address: 'secret19fj9cvqnzpf7fjczc4e8sgrc62jfv9ay5a7j82',
          dataHash: '7F2CD7ED1969D142BDCAC1F2AAEB9D1E5C0B11768C79B1C1DB8CB9557DB97D34',
          deposit_gas: '1050000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['seth_bsc_seth_eth_lp'],
          earn_token: cryptocurrencies['seth_bsc_seth_eth_lp'],
          farm_contract_address: 'secret1s3gg4l6u2vpewqp2lpupqwr52ktdak00rq05ms',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          withdraw_gas: '1050000',
          reward_token: cryptocurrencies['sefi'],
        },
        {
          address: 'secret1gvhhhpqreh36kq6ds7h365tf2jr38dxenkg4rs',
          dataHash: 'A454B82B242B48CA88342ED6BA61439B12D2B1FD8A8FDB0233D6077D3BCECF87',
          deposit_gas: '1050000',
          deposit_msg: 'eyAiZGVwb3NpdF9pbmNlbnRpdml6ZWRfdG9rZW4iOiB7fSB9',
          deposit_token: cryptocurrencies['sefi_sdvpn_lp'],
          earn_token: cryptocurrencies['sefi_sdvpn_lp'],
          farm_contract_address: 'secret1zyd8tdq5wxe7jmmhw99uwh3qwwhx5cphu85lya',
          farm_contract_data_hash: 'C644EDD309DE7FD865B4FBE22054BCBE85A6C0B8ABF5F110053FE1B2D0E8A72A',
          withdraw_gas: '1050000',
          reward_token: cryptocurrencies['sefi'],
        }
      ]
      this.retryCount = 0;
      $.each(this.pools, function(index, value) {
        let balanceViewButtonSelector = '.' + value['deposit_token']['address'] + '-balance-view-button'
        let $balanceViewButton = $(balanceViewButtonSelector)
        document.querySelectorAll(balanceViewButtonSelector).forEach(item => {
          item.addEventListener('click', async(evt) => {
            $balanceViewButton.prop("disabled", true);
            $balanceViewButton.find('.loading').removeClass('d-none')
            $balanceViewButton.find('.ready').addClass('d-none')
            try {
              await document.connectKeplrWallet()
              if (document.secretNetwork.walletAddress) {
                await window.keplr.suggestToken(document.secretNetwork.chainId(), value['deposit_token']['address']);
                this.updateWalletBalance(value['deposit_token'], value);
                $balanceViewButton.addClass('d-none')
              }
            } catch(err) {
              let errorDisplayMessage = err;
              document.showAlertDanger(errorDisplayMessage)          
            } finally {
              // Show ready ui
              $balanceViewButton.prop("disabled", false);
              $balanceViewButton.find('.loading').addClass('d-none')
              $balanceViewButton.find('.ready').removeClass('d-none')
            }
          })
        })

        let $depositButton = $('.' + value['address'] + '-deposit-button')
        let $depositButtonLoading = $('.' + value['address'] + '-deposit-button-loading')
        let $depositButtonReady = $('.' + value['address'] + '-deposit-button-ready')
        if(!value['under_maintenance']) {
          document[value['address'] + 'DepositForm'].onsubmit = async (e) => {
            e.preventDefault()
            this.retryCount = 0;
            let gasParams = {
              exec: {
                amount: [{ amount: value['deposit_gas'], denom: 'uscrt' }],
                gas: value['deposit_gas'],
              },
            }
            this.client = document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams)
            $depositButton.prop("disabled", true);
            $depositButtonLoading.removeClass("d-none")
            $depositButtonReady.addClass("d-none")
            try {
              await document.connectKeplrWallet()
              if (document.secretNetwork.walletAddress) {
                let amount = document[value['address'] + 'DepositForm'].amount.value;
                amount = document.formatHumanizedNumberForSmartContract(amount, value['deposit_token']['decimals'])
                let handleMsg = { send: { amount: amount, recipient: value['address'], msg: value['deposit_msg'] } }
                let response = await this.client.execute(value['deposit_token']['address'], handleMsg, '', [], gasParams.exec, value['deposit_token']['dataHash'])
                await document.delay(5_000)
                document.showAlertSuccess("Deposit successful");
                document[value['address'] + 'DepositForm'].amount.value = ''
                this.updatePoolInterface(value, true)
              }
            }
            catch(err) {
              // When this error happens, it may or may not have have gone through. Not sure why Datahub is sending this error.
              // Doesn't matter how much gas I put up for some of these contracts. It either works or it doesn't
              if (err.message.includes('HTTP 502') || err.message.includes('timed out waiting for tx to be included in a block')) {
                // If TVL or Rewards to process has changed then it's a success, otherwise show gas error
                let tVLBeforeUpdate = $("." + value['address'] + "-total-shares").text()
                let rewardsToProcessBeforeUpdate = $("." + value['address'] + "-rewards-to-process").text()
                await document.delay(5_000)
                await this.updateRewards(value)
                await this.updateTotalShares(value)
                let tVLAfterUpdate = $("." + value['address'] + "-total-shares").text()
                let rewardsToProcessAfterUpdate = $("." + value['address'] + "-rewards-to-process").text()
                if (tVLBeforeUpdate != tVLAfterUpdate || rewardsToProcessBeforeUpdate != rewardsToProcessAfterUpdate) {
                  this.updatePoolInterface(value, true)
                  document.showAlertSuccess("Deposit successful");
                  document[value['address'] + 'DepositForm'].amount.value = ''
                } else {
                  let errorDisplayMessage = "Out of gas. Please set a higher gas amount and try again.";
                  document.showAlertDanger(errorDisplayMessage)
                }
              } else {
                document.showAlertDanger(err)
              }
            }
            finally {
              $depositButton.prop("disabled", false);
              $depositButtonLoading.addClass("d-none")
              $depositButtonReady.removeClass("d-none")
              if (value['farm_contract_address'] && value['reward_token'] == cryptocurrencies['sefi']) {
                this.updateRewards(this.pools[0])
              }
            }
          };

          let $withdrawButton = $('.' + value['address'] + '-withdraw-button')
          let $withdrawButtonLoading = $('.' + value['address'] + '-withdraw-button-loading')
          let $withdrawButtonReady = $('.' + value['address'] + '-withdraw-button-ready')
          document[value['address'] + 'WithdrawForm'].onsubmit = async (e) => {
            e.preventDefault()
            this.retryCount = 0;
            $withdrawButton.prop("disabled", true);
            $withdrawButtonLoading.removeClass("d-none")
            $withdrawButtonReady.addClass("d-none")
            try {
              await document.connectKeplrWallet()
              if (document.secretNetwork.walletAddress) {
                let amount = document[value['address'] + 'WithdrawForm'].amount.value
                amount = document.formatHumanizedNumberForSmartContract(amount, value['deposit_token']['decimals'])
                let handleMsg;
                if (value['address'] == 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
                  handleMsg = { withdraw: { shares_amount: amount } }
                } else if (value['address'] == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz' || value['address'] == 'secret1wuxwnfrkdnysww5nq4v807rj3ksrdv3j5eenv2' || value['address'] == 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan') {
                  handleMsg = { withdraw: { amount: amount } }
                } else {
                  handleMsg = { withdraw: { incentivized_token_amount: amount } }
                }
                let gasParams = {
                  exec: {
                    amount: [{ amount: value['withdraw_gas'], denom: 'uscrt' }],
                    gas: value['withdraw_gas'],
                  },
                }
                this.client = document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams)
                let response = await this.client.execute(value['address'], handleMsg, '', [], gasParams.exec, value['dataHash'])
                await document.delay(5_000)
                document.showAlertSuccess("Withdraw successful");
                document[value['address'] + 'WithdrawForm'].amount.value = ''
                this.updatePoolInterface(value, true)
              }
            }
            catch(err) {
              console.log(err)
              window.error = err
              // When this error happens, it may or may not have have gone through. Not sure why Datahub is sending this error.
              // Doesn't matter how much gas I put up for some of these contracts. It either works or it doesn't
              if (err.message.includes('HTTP 502') || err.message.includes('timed out waiting for tx to be included in a block')) {
                // If TVL or Rewards to process has changed then it's a success, otherwise show gas error
                let tVLBeforeUpdate = $("." + value['address'] + "-total-shares").text()
                let rewardsToProcessBeforeUpdate = $("." + value['address'] + "-rewards-to-process").text()
                await document.delay(5_000)
                await this.updateRewards(value)
                await this.updateTotalShares(value)
                let tVLAfterUpdate = $("." + value['address'] + "-total-shares").text()
                let rewardsToProcessAfterUpdate = $("." + value['address'] + "-rewards-to-process").text()
                if (tVLBeforeUpdate != tVLAfterUpdate || rewardsToProcessBeforeUpdate != rewardsToProcessAfterUpdate) {
                  this.updatePoolInterface(value, true)
                  document.showAlertSuccess("Withdraw successful");
                  document[value['address'] + 'WithdrawForm'].amount.value = ''
                } else {
                  let errorDisplayMessage = "Out of gas. Please set a higher gas amount and try again.";
                  document.showAlertDanger(errorDisplayMessage)
                }
              } else {
                document.showAlertDanger(err)
              }
            }
            finally {
              $withdrawButton.prop("disabled", false);
              $withdrawButtonLoading.addClass("d-none")
              $withdrawButtonReady.removeClass("d-none")
              if (value['farm_contract_address'] && value['reward_token'] == cryptocurrencies['sefi']) {
                this.updateRewards(this.pools[0])
              }
            }
          };
        }
      }.bind(this))

      this.updatePoolInterface = async(pool, afterTransaction, poolDetailsOnly = false, userDetailsOnly = false, height = undefined) => {
        if (poolDetailsOnly) {
          this.updateTotalShares(pool)
          if (pool['farm_contract_address']) {
            this.updateRewards(pool, afterTransaction, height)
          }
        } else if (userDetailsOnly) {
          this.updateWalletBalance(pool['deposit_token'], pool)
          this.updateUserWithdrawable(pool)
          if (!pool['farm_contract_address']) {
            this.updateRewards(pool, afterTransaction, height)
          }
        } else {
          this.updateTotalShares(pool)
          this.updateWalletBalance(pool['deposit_token'], pool)
          this.updateUserWithdrawable(pool)
          this.updateRewards(pool, afterTransaction, height)
        }
      }

      this.updateUserInterface = async(poolDetailsOnly = false, userDetailsOnly = false) => {
        let height = await document.secretNetwork.getBlockHeight()
        for (const [index, pool] of this.pools.entries()) {
          this.updatePoolInterface(pool, false, poolDetailsOnly, userDetailsOnly, height)
        }
      }

      this.updateUserWithdrawable = async(pool) => {
        let $userShares = $('.' + pool['address'] + '-user-shares')
        let depositTokenSymbol = pool['deposit_token']['symbol']

        try {
          $userShares.text('Loading...');
          let userResponse;
          let withdrawable = new BigNumber("0");
          if (pool.address == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz' || pool.address == 'secret1wuxwnfrkdnysww5nq4v807rj3ksrdv3j5eenv2' || pool.address == 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan') {
            userResponse = await document.secretNetwork.client().queryContractSmart(pool.address, {user: {user_address: document.secretNetwork.walletAddress}}, undefined, pool.dataHash)
            withdrawable = new BigNumber(userResponse['user']['shares'])
          } else {
            userResponse = await document.secretNetwork.client().queryContractSmart(pool.address, {user_info: {address: document.secretNetwork.walletAddress}}, undefined, pool.dataHash)
            withdrawable = new BigNumber(userResponse['user_info']['shares'])
            if (pool.address != 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
              // Factor in rewards when you get the chance
              let poolResponse = await document.secretNetwork.client().queryContractSmart(pool.address, {pool: {}}, undefined, pool.dataHash)
              let incentivizedTokenTotal = new BigNumber(poolResponse['pool']['incentivized_token_total']);
              if (new BigNumber(poolResponse['pool']['shares_total']) > 0) {
                withdrawable = withdrawable.multipliedBy(incentivizedTokenTotal).dividedBy(new BigNumber(poolResponse['pool']['shares_total']))
              } else {
                withdrawable = new BigNumber("0");
              }
              
            }
          }
          if (withdrawable > 0) {
            withdrawable = withdrawable.dividedBy(new BigNumber("10").pow(pool['deposit_token']['decimals'])).decimalPlaces(pool['deposit_token']['decimals'])
          }
          $userShares.text(withdrawable.toFormat())
        } catch(err) {
          $userShares.text('0');
          if (!err.message.includes('{"not_found":{"kind":"cw_profit_distributor::state::User"}}')) {
            console.log(err)
          }
        }
      }

      this.updateRewards = async(pool, afterTransaction = false, height = undefined) => {
        if (pool.farm_contract_address) {
          if (!pool.under_maintenance) {
            let $poolRewardsToProcess = $('.' + pool.address + '-rewards-to-process')
            if (afterTransaction) {
              $poolRewardsToProcess.text('0');
            } else {
              try {
                $poolRewardsToProcess.text('Loading...');
                if (!height) {
                  height = await document.secretNetwork.client().getHeight();
                }
                let response = await document.secretNetwork.client().queryContractSmart(pool.farm_contract_address, {rewards: { address: pool.address, height: height, key: "DoTheRightThing." }}, undefined, pool.farm_contract_data_hash)
                $poolRewardsToProcess.text(document.humanizeStringNumberFromSmartContract(response['rewards']['rewards'], pool['reward_token']['decimals']))
              } catch(err) {
                console.log(err)
                if (this.retryCount < 5) {
                  setTimeout(function(){
                    this.retryCount += 1
                    this.updateRewards(pool)
                  }.bind(this), 5000);
                }
              }
            }
          }
        } else {
          if (document.secretNetwork.walletAddress) {
            let $poolClaimable = $('.' + pool.address + '-claimable')
            if (afterTransaction) {
              $poolClaimable.text('0');
            } else {
              try {
                $poolClaimable.text('Loading...');
                if (pool.address == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz' || pool.address == 'secret1wuxwnfrkdnysww5nq4v807rj3ksrdv3j5eenv2' || pool.address == 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan') {
                  let response = await document.secretNetwork.client().queryContractSmart(pool.address, {claimable_profit: { user_address: document.secretNetwork.walletAddress}}, undefined, pool.dataHash)
                  $poolClaimable.text(document.humanizeStringNumberFromSmartContract(response['claimable_profit']['amount'], pool['reward_token']['decimals']))
                } else {
                  if (!height) {
                    height = await document.secretNetwork.client().getHeight();
                  }
                  let response = await document.secretNetwork.client().queryContractSmart(pool.address, {pending_buttcoin: { address: document.secretNetwork.walletAddress, height: height }}, undefined, pool.dataHash)
                  $poolClaimable.text(document.humanizeStringNumberFromSmartContract(response['pending_buttcoin']['amount'], 6))
                }
              } catch(err) {
                if (err.message.includes('{"not_found":{"kind":"cw_profit_distributor::state::User"}}') || err.message.includes('{"not_found":{"kind":"cw_profit_distributor_b::state::User"}}')) {
                  $poolClaimable.text('0');
                } else {
                  console.log(err)
                  if (this.retryCount < 5) {
                    setTimeout(function(){
                      this.retryCount += 1
                      this.updateRewards(pool)
                    }.bind(this), 5000);
                  }
                }
              }
            }
          }
        }
      }

      this.updateTotalShares = async(pool) => {
        try {
          let poolAddress = pool.address
          let depositTokenSymbol = pool['deposit_token']['symbol']
          let totalSharesSelector = '.' + poolAddress + '-total-shares'
          let humanizedStringNumberFromSmartContract;
          $(totalSharesSelector).text('Loading...')
          if (poolAddress == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz' || poolAddress == 'secret1wuxwnfrkdnysww5nq4v807rj3ksrdv3j5eenv2' || poolAddress == 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan') {
            let config = await document.secretNetwork.client().queryContractSmart(poolAddress, {config: {}}, undefined, pool.dataHash)
            humanizedStringNumberFromSmartContract = document.humanizeStringNumberFromSmartContract(config['config']['total_shares'], pool['deposit_token']['decimals'], 0)
          } else if (poolAddress == 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
            let response = await document.secretNetwork.client().queryContractSmart(poolAddress, {pool: {}}, undefined, pool.dataHash)
            humanizedStringNumberFromSmartContract = document.humanizeStringNumberFromSmartContract(response['pool']['shares_total'], pool['deposit_token']['decimals'], 0)
          } else {
            let responseTwo = await document.secretNetwork.client().queryContractSmart(poolAddress, {pool: {}}, undefined, pool.dataHash)
            humanizedStringNumberFromSmartContract = document.humanizeStringNumberFromSmartContract(responseTwo['pool']['incentivized_token_total'], pool['deposit_token']['decimals'], 0)
          }
          $(totalSharesSelector).text(humanizedStringNumberFromSmartContract + ' ' + depositTokenSymbol)
        } catch(err) {
          console.log(err)
        }
      }

      this.updateWalletBalance = async(cryptocurrency, pool) => {
        let address = cryptocurrency['address']
        let $walletBalance = $('.' + address + '-balance')
        let $walletBalanceLink = $('.' + address + '-balance-link')
        let $walletBalanceLoading = $('.' + address + '-balance-loading')
        let $walletBalanceViewButton = $('.' + address + '-balance-view-button')
        try {
          await document.connectKeplrWallet()
          if (document.secretNetwork.walletAddress) {
            $walletBalance.addClass('d-none')
            $walletBalanceLoading.removeClass('d-none')
            let key = await window.keplr.getSecret20ViewingKey(document.secretNetwork.chainId(), address)
            // If they have the key, replace the button with the balance
            let balanceResponse = await document.secretNetwork.client().queryContractSmart(address, { balance: { address: document.secretNetwork.walletAddress, key: key } }, undefined, cryptocurrency['dataHash'])
            let balanceFormatted = document.humanizeStringNumberFromSmartContract(balanceResponse['balance']['amount'], cryptocurrency['decimals'])
            $walletBalance.text(balanceFormatted)
            $walletBalance.removeClass('d-none')
            $walletBalanceViewButton.addClass('d-none')
          }
        } catch(err) {
          console.log(err)
          if (err.message.includes('502')) {
            if (this.retryCount < 5) {
              setTimeout(function(){
                this.retryCount += 1
                this.updatePoolInterface(pool, true)
              }.bind(this), 5000);
            }
          } else {
            // If they don't have a viewing key, show the view balance button and hide the balance
            $walletBalance.addClass('d-none')
            $walletBalanceViewButton.removeClass('d-none')
          }
        } finally {
          $walletBalanceLoading.addClass('d-none')
          $walletBalanceViewButton.find('.loading').addClass('d-none')
          $walletBalanceLink.removeClass('d-none')
        }
      }

      $('.fa-sync').click(function(event){
        event.preventDefault()
        let poolAddress = $(event.currentTarget).closest('a')[0]['dataset']['poolAddress']
        this.pools.forEach(pool => {
          if (pool['address'] == poolAddress) {
            this.updatePoolInterface(pool, false)
          }
        })
      }.bind(this))

      $(document).on('keplr_connected', async(evt) => {
        $('.deposit-withdraw-forms-container').removeClass('d-none')
        this.updateUserInterface(false, true)
      })

      document.querySelector('#claim-sefi').addEventListener('click', async(evt) => {
        if (this.pools[0]['address'] == 'secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz') {
          let $claimSEFI = $('#claim-sefi')
          $claimSEFI.prop("disabled", true);
          $claimSEFI.find('.loading').removeClass("d-none")
          $claimSEFI.find('.ready').addClass("d-none")
          try {
            await document.connectKeplrWallet()
            if (document.secretNetwork.walletAddress) {
              let gasParams = {
                exec: {
                  amount: [{ amount: this.pools[0]['deposit_gas'], denom: 'uscrt' }],
                  gas: this.pools[0]['deposit_gas'],
                },
              }
              let handleMsg = { send: { amount: '0', recipient: this.pools[0]['address'], msg: this.pools[0]['deposit_msg'] } }
              let response = await document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams).execute(this.pools[0]['deposit_token']['address'], handleMsg, '', [], gasParams.exec, this.pools[0]['deposit_token']['dataHash'])
              document.showAlertSuccess("Claim successful");
              $claimSEFI.find('.secret1ccgl5ys39zprnw2jq8g3eq00jd83temmqversz-claimable').text('0')
            }
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
            $claimSEFI.prop("disabled", false);
            $claimSEFI.find('.loading').addClass("d-none")
            $claimSEFI.find('.ready').removeClass("d-none")
          }
        }
      })

      document.querySelector('#claim-butt').addEventListener('click', async(evt) => {
        if (this.pools[1]['address'] == 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku') {
          let $claimBUTT = $('#claim-butt')
          $claimBUTT.prop("disabled", true);
          $claimBUTT.find('.loading').removeClass("d-none")
          $claimBUTT.find('.ready').addClass("d-none")
          try {
            await document.connectKeplrWallet()
            if (document.secretNetwork.walletAddress) {
              let gasParams = {
                exec: {
                  amount: [{ amount: this.pools[1]['deposit_gas'], denom: 'uscrt' }],
                  gas: this.pools[1]['deposit_gas'],
                },
              }
              let handleMsg = { send: { amount: '0', recipient: this.pools[1]['address'], msg: this.pools[1]['deposit_msg'] } }
              let response = await document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams).execute(this.pools[1]['deposit_token']['address'], handleMsg, '', [], gasParams.exec, this.pools[1]['deposit_token']['dataHash'])
              document.showAlertSuccess("Claim successful");
              $claimBUTT.find('.secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku-claimable').text('0')
            }
          }
          catch(err) {
            document.showAlertDanger(err)
          }
          finally {
            $claimBUTT.prop("disabled", false);
            $claimBUTT.find('.loading').addClass("d-none")
            $claimBUTT.find('.ready').removeClass("d-none")
          }
        }
      })

      // document.querySelector('#claim-profit-distributor-b-butt').addEventListener('click', async(evt) => {
      //   if (this.pools[2]['address'] == 'secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan') {
      //     let $claimBUTT = $('#claim-profit-distributor-b-butt')
      //     let gasParams = {
      //       exec: {
      //         amount: [{ amount: this.pools[2]['deposit_gas'], denom: 'uscrt' }],
      //         gas: this.pools[2]['deposit_gas'],
      //       },
      //     }
      //     this.client = document.secretNetwork.signingClient(document.secretNetwork.walletAddress, gasParams)
      //     $claimBUTT.prop("disabled", true);
      //     $claimBUTT.find('.loading').removeClass("d-none")
      //     $claimBUTT.find('.ready').addClass("d-none")
      //     try {
      //       let handleMsg = { send: { amount: '0', recipient: this.pools[2]['address'], msg: this.pools[2]['deposit_msg'] } }
      //       let response = await this.client.execute(this.pools[2]['deposit_token']['address'], handleMsg, '', [], gasParams.exec, this.pools[2]['deposit_token']['dataHash'])
      //       document.showAlertSuccess("Claim successful");
      //       $claimBUTT.find('.secret1sxmznzev9vcnw8yenjddgtfucpu7ymw6emkzan-claimable').text('0')
      //     }
      //     catch(err) {
      //       document.showAlertDanger(err)
      //     }
      //     finally {
      //       $claimBUTT.prop("disabled", false);
      //       $claimBUTT.find('.loading').addClass("d-none")
      //       $claimBUTT.find('.ready').removeClass("d-none")
      //     }
      //   }
      // })
      document.activateKeplr()
      // A bit hacky but leave it for now.
      // Querying buttlode config so that reg-tx gets called just here and everything else can by async without having to make that call
      await document.secretNetwork.client().queryContractSmart('secret1l9msv9yu7mgxant4stu89p0hqugz6j2frj7ne5', { config: {} }, undefined, '99F94EDC0D744B35A8FBCBDC8FB71C140CFA8F3F91FAD8C35B7CC37862A4AC95');
      this.updateUserInterface(true, false)
    }
  };
});
