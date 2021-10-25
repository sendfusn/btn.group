# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

def initialized_server?
  defined?(Rails::Server) || (defined?(::Puma) && File.basename($PROGRAM_NAME).starts_with?('puma')) ||
    (defined?(::Nack::Server) && File.basename($PROGRAM_NAME).starts_with?('nack')) # nack is Pow
end

module PayMeCrypto
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1
    config.active_job.queue_adapter = :sidekiq
    config.after_initialize do
      x = [
        {
          "decimals": 6,
          "name": 'sALT',
          "symbol": 'SALT',
          "address": 'secret1vp5vrl0wacxlkh03xkcvfh6q9tcrw4qrl4q4a5'
        },
        {
          "decimals": 6,
          "name": '脇山珠美',
          "symbol": 'TAMA',
          "address": 'secret1vp5rxq3wrh4udzwdv6aglgf2wnlughnevlk3ka'
        },
        {
          "decimals": 6,
          "name": 'TONE',
          "symbol": 'TONE',
          "address": 'secret1qqpr2peug780t6zcwc84k7n2hsfs4g7an2p60k'
        },
        {
          "decimals": 6,
          "name": 'Pugacoin',
          "symbol": 'PGC',
          "address": 'secret19r9h2ftaeuj5gg6jf6p33qkmdddnegz3qsla6a'
        },
        {
          "decimals": 8,
          "name": 'secretBitcoin',
          "symbol": 'SBTC',
          "address": 'secret1vzmhwq7xn80uxrstqujr0pa6ecqd377c09kp7v'
        },
        {
          "decimals": 18,
          "name": 'VENOM',
          "symbol": 'VENOM',
          "address": 'secret1j3zryd8m22hexd6a6kfwpev7galll7rg86wnha'
        },
        {
          "decimals": 6,
          "name": 'AwesomeClubofSecrets',
          "symbol": 'ACLS',
          "address": 'secret1n0uy6gjam529ckx4c73nt4ngdqh5rhecradj36'
        },
        {
          "decimals": 6,
          "name": 'yukari',
          "symbol": 'YKR',
          "address": 'secret1060uzt6sv4vdk60slcq5tv2dksceud9gakcrsf'
        },
        {
          "decimals": 6,
          "name": 'Tester-Token',
          "symbol": 'TST',
          "address": 'secret1mv87nygmypumk4hr2m383auhrm3f0e9jr0lmx0'
        },
        {
          "decimals": 6,
          "name": 'Test-Token Generation',
          "symbol": 'TTG',
          "address": 'secret1e46tdj4eyjjcp0t4h8r5ldhlzm24q52huy7xtk'
        },
        {
          "decimals": 6,
          "name": 'TestToken',
          "symbol": 'TTG',
          "address": 'secret14a4mcf8jvfcqfe3d8yh9en8ng8qrf09err0fcu'
        },
        {
          "decimals": 6,
          "name": 'AwesomeClubofSecret',
          "symbol": 'ACLS',
          "address": 'secret196vrdcdq303lm7zuzg948e5aygr9cyentphrrr'
        },
        {
          "decimals": 6,
          "name": 'dsecret',
          "symbol": 'DSCRT',
          "address": 'secret17t5px00xptzaatxmfxwqazxfcemuhcnvyvj8d2'
        },
        {
          "decimals": 3,
          "name": 'fatsecret',
          "symbol": 'FATS',
          "address": 'secret1xzlgeyuuyqje79ma6vllregprkmgwgavk8y798'
        },
        {
          "decimals": 18,
          "name": 'Sailonseas',
          "symbol": 'SAILS',
          "address": 'secret1dfatr4xkzy7nk8zdk9fhd5p4erxnnnr8euj7vx'
        },
        {
          "decimals": 6,
          "name": 'TrumpToken',
          "symbol": 'TRUMP',
          "address": 'secret1x6szvwznwegyzx8qrg3pshldzggfk9l8juypgy'
        },
        {
          "decimals": 18,
          "name": 'Sailors',
          "symbol": 'SAIL',
          "address": 'secret130l874k7exjjz0nxy2f37m97rrrw3fryeg2l3w'
        },
        {
          "decimals": 18,
          "name": 'COBRA',
          "symbol": 'COBRA',
          "address": 'secret187fqtewaqvvu6qwx0xdfy9ll9uqmuwap26jt9n'
        },
        {
          "decimals": 6,
          "name": 'ElonMusk',
          "symbol": 'MUSK',
          "address": 'secret1jnr60t884ya6cn93ulh7dk6nnw5zt6e46f6p93'
        },
        {
          "decimals": 6,
          "name": 'SecretPugaCoin',
          "symbol": 'PGC',
          "address": 'secret1gv6l62pfzaauyl0sjznczjdxk3x4ez2sfm3hx8'
        },
        {
          "decimals": 4,
          "name": 'Factory-Coin',
          "symbol": 'FCTRY',
          "address": 'secret14wtpgyx30lhddp3mjlyrw3mpmp30dsnlx4xwc2'
        },
        {
          "decimals": 12,
          "name": 'AwesomeCLubofSecrets',
          "symbol": 'ACLS',
          "address": 'secret1cdwmqmxxst5jlt0ydxk8ne83y9cqu0rfmzm27a'
        },
        {
          "decimals": 3,
          "name": 'FatSecretCoin',
          "symbol": 'FATSC',
          "address": 'secret1fvv35matn7elnlezezxq093my7lce504eufpg3'
        },
        {
          "decimals": 6,
          "name": 'Enjin',
          "symbol": 'ENJ',
          "address": 'secret16efkcwgj3vkxsfvk4j6zjz05ukfxg35zsrj0vs'
        },
        {
          "decimals": 0,
          "name": 'SANTA',
          "symbol": 'SANTA',
          "address": 'secret1fwl2pj854662zt5daf9kf9ya8qkvxmsdu3eg0d'
        },
        {
          "decimals": 1,
          "name": 'sSANTA',
          "symbol": 'SANTA',
          "address": 'secret1tdc6edlgr0h9sf8u4n3utrq37vek6smxc59sl7'
        },
        {
          "decimals": 18,
          "name": 'Sailorsonseas',
          "symbol": 'SAILS',
          "address": 'secret1u7cwp8q0fsllf7kcfr3rqjyx4fy8y4ru064977'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-SecretSwap-LP-Token-secret1rgky3ns9ua09rt059049yl0zqf3xjqxne7ezhp',
          "symbol": 'SWAP-LP',
          "address": 'secret1709qy2smh0r7jjac0qxfgjsqn7zpvgthsdz025'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-SecretSwap-LP-Token-secret1rxrg8mp4qm5703ccz26lgh8hx7gpnkujrn6qcr',
          "symbol": 'SWAP-LP',
          "address": 'secret1l3azwns4uqglmu42hnjgfrlqc7hhqulq05cheg'
        },
        {
          "decimals": 6,
          "name": 'secret1r0l0g7l07y7xrpyys80z3qu2eqvnfjlpcees2x-secret1vp5vrl0wacxlkh03xkcvfh6q9tcrw4qrl4q4a5-SecretSwap-LP-Token-secret1fey7tapcx47rl92xf97ftsk4njldrtdqkv4nsg',
          "symbol": 'SWAP-LP',
          "address": 'secret1uvy5c30vefcneej7x35rq5lryqghlad45z2mdk'
        },
        {
          "decimals": 6,
          "name": 'secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps-secret1vcm525c3gd9g5ggfqg7d20xcjnmcc8shh902un-SecretSwap-LP-Token-secret1nx5g02estzh8ufqgwxse5s7hkvya6f6aha6kpc',
          "symbol": 'SWAP-LP',
          "address": 'secret1kp9nhawtxgxue2qggnatt73f75vh55c9fq876l'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret14zv2fdsfwqzxqt7s2ushp4c4jr56ysyld5zcdf',
          "symbol": 'SWAP-LP',
          "address": 'secret17gja535zp09t9mlzzxndqqg4gzvhg0vsklhd54'
        },
        {
          "decimals": 6,
          "name": 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv-SecretSwap-LP-Token-secret1gttky6spv8s4uev65ps8thszzapndjummghl0h',
          "symbol": 'SWAP-LP',
          "address": 'secret1a8eyzn6028867pe5kq4tkrgmmr0s7nsu92zzdt'
        },
        {
          "decimals": 6,
          "name": 'secret1gv6l62pfzaauyl0sjznczjdxk3x4ez2sfm3hx8-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret10xdqg45lemuvg4855vljkmcyztf526jtmgc49z',
          "symbol": 'SWAP-LP',
          "address": 'secret144sqq0cvpcpdzkjrrznu09xyqg97elmx4pjyw0'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg-SecretSwap-LP-Token-secret1j479pa5agm0v3vdh8huahn87j4xd2d5t9syppl',
          "symbol": 'SWAP-LP',
          "address": 'secret1z85uum7arwlsqf04yq8kn5v8tvc5lafrrmxsxs'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1m6a72200733a7jnm76xrznh9cpmt4kf5ql0a6t-SecretSwap-LP-Token-secret1le6k90dug7cvv22snfkdp55v3rrhgt5fj3vd7z',
          "symbol": 'SWAP-LP',
          "address": 'secret1q34lhchwu2fuvq6lzel0gu8ks9t6n0ms495mku'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-SecretSwap-LP-Token-secret19sae9hy2jge29pl828mvwnrudym4zxvcwnsfjl',
          "symbol": 'SWAP-LP',
          "address": 'secret1tg20pah6325j9d5r3ctjhwy6w7xnfax4gguuy6'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps-SecretSwap-LP-Token-secret1wvlwurtdylpqdmwjursrj4fwll4qg6a0k2fzla',
          "symbol": 'SWAP-LP',
          "address": 'secret1weyh46jss73vehxhfw6mf5gyuckt8k79kxs7gf'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1el5uj9ns9sty682dem033pt50xsv5mklmsvy24-SecretSwap-LP-Token-secret1t7ll7plda7cdkh0jdqpyxp8czcfzxr2k23smwz',
          "symbol": 'SWAP-LP',
          "address": 'secret12tnxcfmkrequtculmc00t6r0tzec64we5zzr0c'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1px5mtmjh072znpez4fjpmxqsv3hpevdpyu9l4v-SecretSwap-LP-Token-secret135nxgj2gcy0dl5w5dt2tzuc2rzkveanrgegzj7',
          "symbol": 'SWAP-LP',
          "address": 'secret1e8v8jdg77u9rkevlk0e6czyff4n42e7qmuqy4l'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg-SecretSwap-LP-Token-secret1hystqn307ds2uh9uh7nk5qqp7qjjx25jzq8lh8',
          "symbol": 'SWAP-LP',
          "address": 'secret1xjlr9v7gffvdjzve9803rh6r4kazahla8sfuw7'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1gjay0a6m3wa92hm464p7t9v64q74azgxkz7at3-SecretSwap-LP-Token-secret1crht5ata6fcpxu3jkp7ldt2mu3nk864kkysraj',
          "symbol": 'SWAP-LP',
          "address": 'secret1d7v473at8h0mryxt8j5qyxuhgl3chd4j52amfw'
        },
        {
          "decimals": 18,
          "name": 'VBWxYql7rV',
          "symbol": 'SETH',
          "address": 'secret1mer0n9pn2efavlnckpm5v03uw5mshds4l9lm2n'
        },
        {
          "decimals": 18,
          "name": 'secret-yfi',
          "symbol": 'SYFI',
          "address": 'secret15grq8y54tvc24j8hf8chunsdcr84fd3d30fvqv'
        },
        {
          "decimals": 18,
          "name": 'secret-comp',
          "symbol": 'SCOMP',
          "address": 'secret1szqzgpl9w42kekla57609y6dq2r39nf0ncx400'
        },
        {
          "decimals": 18,
          "name": 'secret-maker',
          "symbol": 'SMKR',
          "address": 'secret1tqltnm8f53xnprmnlurczf6sr86a4mgztafxzp'
        },
        {
          "decimals": 6,
          "name": 'secret-usdc',
          "symbol": 'SUSDC',
          "address": 'secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv'
        },
        {
          "decimals": 18,
          "name": 'secret-ocean',
          "symbol": 'SOCEAN',
          "address": 'secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps'
        },
        {
          "decimals": 18,
          "name": 'secret-dai',
          "symbol": 'SDAI',
          "address": 'secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq'
        },
        {
          "decimals": 6,
          "name": 'TckDevTest',
          "symbol": 'TCKTE',
          "address": 'secret1ruy36qywhm6vnxvvl7sdqsrgmed73e6t5tz7ln'
        },
        {
          "decimals": 6,
          "name": 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-secret1xzlgeyuuyqje79ma6vllregprkmgwgavk8y798-SecretSwap-LP-Token-secret10dfdkp3k7vjkqyn8g396rpza9t3wechpm8wnx0',
          "symbol": 'SWAP-LP',
          "address": 'secret17e9ygy6e990t8gsfe8gf8lg429pncsn22wm9cu'
        },
        {
          "decimals": 6,
          "name": 'BidenBucks',
          "symbol": 'BIDEN',
          "address": 'secret1z344anxg2gzfqvsw2sat9kczrzk4qx6fslh59r'
        },
        {
          "decimals": 6,
          "name": 'testsss',
          "symbol": 'PAT',
          "address": 'secret1z3jzg3cz3k4wvzl6uu9kgcfy70u7np9hf08hl0'
        },
        {
          "decimals": 6,
          "name": 'TOKEN',
          "symbol": 'TOKEN',
          "address": 'secret1plk4r3vp80uzxjcy5mmcct7uy0qpqra7q36mnn'
        },
        {
          "decimals": 6,
          "name": 'secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv-secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg-SecretSwap-LP-Token-secret1g66n0qn7ygu5gqz8cdrmfpwk5wu32rm3thlfzs',
          "symbol": 'SWAP-LP',
          "address": 'secret163e9frya0vqar70s4j3na94apf0cffl2rjgmgg'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-SecretSwap-LP-Token-secret1rzq07mzyaqg0nxnk8kh9804dgj4ntduc35judn',
          "symbol": 'SWAP-LP',
          "address": 'secret1a9pqlergw53c0fc2nh8fuwk6vem4j4z7ywz02s'
        },
        {
          "decimals": 6,
          "name": 'secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5-secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg-SecretSwap-LP-Token-secret1p5xrsvtazprqytshdhyqyf7487f2cwqm3px54s',
          "symbol": 'SWAP-LP',
          "address": 'secret17udwye2ew0kl8vx3pphyas2ytrru7e0lv7sxrr'
        },
        {
          "decimals": 6,
          "name": 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-secret1vcm525c3gd9g5ggfqg7d20xcjnmcc8shh902un-SecretSwap-LP-Token-secret14lhvcsqqpqx4uas9q6p0ueay7memsrdu29l4jv',
          "symbol": 'SWAP-LP',
          "address": 'secret17de3ltvztmmutujlg3lwlpsmzeeykjzru8et6d'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv-SecretSwap-LP-Token-secret14cxq26u8f9zpd09a72uznwz7kew9yc085d08hy',
          "symbol": 'SWAP-LP',
          "address": 'secret1mm7df4ygxwlfg0l70jrrkshlhtp8vv5n7hj9rr'
        },
        {
          "decimals": 6,
          "name": 'secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te-secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps-SecretSwap-LP-Token-secret1kzxusez7c9frxf7yayztlrtsqtf20nhfu62d6l',
          "symbol": 'SWAP-LP',
          "address": 'secret169j4wejhtq6s8cqptae09ftjnnm8ekkjk73hgd'
        },
        {
          "decimals": 6,
          "name": 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-secret1m6a72200733a7jnm76xrznh9cpmt4kf5ql0a6t-SecretSwap-LP-Token-secret1ry9s8al2w2my4z7jqhtve9fqkesqapn0mrjr3z',
          "symbol": 'SWAP-LP',
          "address": 'secret1c9ky0x6fj5gc0qw6tedxsng50mjl3szn7xhjeu'
        },
        {
          "decimals": 6,
          "name": 'secret1l5gtpejl5dcjupa9ac2hyd5q88vhp72dgnagx3-secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-SecretSwap-LP-Token-secret10560sctknky3stzh2csk2uft7xqfvz798dp0a3',
          "symbol": 'SWAP-LP',
          "address": 'secret160ru64uhkwu562qvh20xnm98w4a4g006aq9s7p'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret120vtzu6xjprp6pq0r8wprf3jlp86xr8uu0nlc5-SecretSwap-LP-Token-secret1dtl3f7zva09wn0kclysqmpzzuaujd9v4tgsmly',
          "symbol": 'SWAP-LP',
          "address": 'secret1vrmfs5ql8w3uajer2jqr2x2prffmssa0r8zrhm'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1t6228qgqgkwhnsegk84ahljgw2cj7f9xprk9zd-SecretSwap-LP-Token-secret1dexxl42aknade3w2pj7tjc7eejd28s9cx6ar27',
          "symbol": 'SWAP-LP',
          "address": 'secret1efcwgj5jn0jdqw387p83lyg0tgfff5xycde84x'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-SecretSwap-LP-Token-secret1sj65pd9fqgwyj0a9ctl4cecp62y52z5nzpq60r',
          "symbol": 'SWAP-LP',
          "address": 'secret17w0wjempgtt8ngn59y7cwlae02kve5jzar4xmw'
        },
        {
          "decimals": 6,
          "name": 'secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw-secret1trr50jqff3ncn099cpukehh8a4pjxu0d3m4ccq-SecretSwap-LP-Token-secret10uk6nusgevq2mueat86ze5s4jd3r00gz5hffls',
          "symbol": 'SWAP-LP',
          "address": 'secret1uv0f8uhr06ezme9fsudk5gclexd6j46rkjfxwj'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1ryh523y4e3233hphrkdslegszqz8syjfpthcpp-SecretSwap-LP-Token-secret103e3kt05rt89fayp9y7w44wj4x3k5zumy6cdyc',
          "symbol": 'SWAP-LP',
          "address": 'secret1hsd23gm7ces9rf24e0mryhywlcl4l5903pwrts'
        },
        {
          "decimals": 18,
          "name": 'secret-ETH',
          "symbol": 'SETH',
          "address": 'secret1a0vrl5r9g8g4fk8dx908q50gzerax8whx02zc4'
        },
        {
          "decimals": 18,
          "name": 'secret-rsr',
          "symbol": 'SRSR',
          "address": 'secret1vcm525c3gd9g5ggfqg7d20xcjnmcc8shh902un'
        },
        {
          "decimals": 6,
          "name": '1XWktTRxQ5',
          "symbol": 'SUSDT',
          "address": 'secret1quuj8vzvg3phu0qemtpxn2dj983qnugasghpl0'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-SecretSwap-LP-Token-secret1rgky3ns9ua09rt059049yl0zqf3xjqxne7ezhp',
          "symbol": 'SWAP-LP',
          "address": 'secret1709qy2smh0r7jjac0qxfgjsqn7zpvgthsdz025'
        },
        {
          "decimals": 18,
          "name": 'secret-uni',
          "symbol": 'SUNI',
          "address": 'secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te'
        },
        {
          "decimals": 6,
          "name": 'secret-usdt',
          "symbol": 'SUSDT',
          "address": 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f'
        },
        {
          "decimals": 18,
          "name": 'secret-link',
          "symbol": 'SLINK',
          "address": 'secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw'
        },
        {
          "decimals": 18,
          "name": 'uni-wscrt-eth',
          "symbol": 'UNILP',
          "address": 'secret1d673zrls7z5sd7nzqavqs4uzahnzqxq9zk7e62'
        },
        {
          "decimals": 18,
          "name": 'secret-eth',
          "symbol": 'SETH',
          "address": 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw'
        },
        {
          "decimals": 6,
          "name": 'sscrt',
          "symbol": 'SSCRT',
          "address": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek'
        },
        {
          "decimals": 18,
          "name": 'secret-bat',
          "symbol": 'BAT',
          "address": 'secret1nq7resltu9870ar7vdu2suhzplx84800jfj2ja'
        },
        {
          "decimals": 6,
          "name": '5OzvP9b8S5',
          "symbol": 'SUSDT',
          "address": 'secret18068v5mmuvne9muzk0a4w30tzyxe7e4cfvenp8'
        },
        {
          "decimals": 8,
          "name": 'secret-renbtc',
          "symbol": 'SRNBTC',
          "address": 'secret13j9sg2lpmwl92taac4lr3xqhslnm2yjm4nsmzl'
        },
        {
          "decimals": 8,
          "name": 'secret-wbtc',
          "symbol": 'SWBTC',
          "address": 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a'
        },
        {
          "decimals": 6,
          "name": '5zqjouqt8e',
          "symbol": 'SUSDT',
          "address": 'secret1843g3cwa5cxpzszkta0r9thvwk8690j5cfq9mh'
        },
        {
          "decimals": 18,
          "name": 'secret-snx',
          "symbol": 'SSNX',
          "address": 'secret15c5ftq4rq7xq3tml4nphv2fvz3u7kg73a583qp'
        },
        {
          "decimals": 18,
          "name": 'secret-comp',
          "symbol": 'SCOMP',
          "address": 'secret1szqzgpl9w42kekla57609y6dq2r39nf0ncx400'
        },
        {
          "decimals": 6,
          "name": 'secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps-secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw-SecretSwap-LP-Token-secret1xhr2kt02t9wxwcfjj2me77yehar83dpw2kq07q',
          "symbol": 'SWAP-LP',
          "address": 'secret1ket00reye5tuaurqd3lh4kplsz4rjpe7hepmzf'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret16euwqyntvsp0fp2rstmggw77w5xgz2z26cpwxj-SecretSwap-LP-Token-secret1ecdsn7curwhnea8t93x6pervkkc0s0ef2jjyc6',
          "symbol": 'SWAP-LP',
          "address": 'secret1mcknw376ayfqykvvz8grya9kdwtev36luhtmrm'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te-SecretSwap-LP-Token-secret1pmt7ncuhau2g7h9snygx2tlkzqnks3uz5edgyc',
          "symbol": 'SWAP-LP',
          "address": 'secret1m8msletvevuj2vsl8rcvqq9esflxmmnd2lf7yd'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1vcm525c3gd9g5ggfqg7d20xcjnmcc8shh902un-SecretSwap-LP-Token-secret18su923qzncs6gs3qt2j7qy28e57p94zaydjs25',
          "symbol": 'SWAP-LP',
          "address": 'secret1cucs46suavgnajd050qxh2923nqtnu7p67zwkj'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1wp8aj7tja30cek5wf5jwcv0xalw8vmdasfv2lh-SecretSwap-LP-Token-secret14mzz277cnt8l4efnskzj4s3c04lx6njd52nfnn',
          "symbol": 'SWAP-LP',
          "address": 'secret1uf6kk3a6damq93w6gnjj4xyr4xdpj86kzpvrwh'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5-SecretSwap-LP-Token-secret1jr99mtjs87hsx6hs36ze2l5efgj2x0gqrmya0p',
          "symbol": 'SWAP-LP',
          "address": 'secret1le3d0fgkrzd433fdnetdqslfxmugvg0tuaqspe'
        },
        {
          "decimals": 6,
          "name": 'secret1xzlgeyuuyqje79ma6vllregprkmgwgavk8y798-secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-SecretSwap-LP-Token-secret1vatyq8lt3d34lm9xpnypwnv7ecc3g2t48qwmp3',
          "symbol": 'SWAP-LP',
          "address": 'secret1e60sgjs6vpsa0g30psjtup03urk3ggjdjqg9ln'
        },
        {
          "decimals": 6,
          "name": 'secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps-secret1ukn328k6y3th5nw9z00p8lvk5s7m05cr9p06cu-SecretSwap-LP-Token-secret1zxpjz62wh9qc0q5d72ynx8l2rfj4fn39e63nmn',
          "symbol": 'SWAP-LP',
          "address": 'secret1e9hqygaphtnp34tjv80pzpgm0r8jjug6eduz2c'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw-SecretSwap-LP-Token-secret14qs40askz5ffysmr9s49xan6dqkfhd2jq8ct8c',
          "symbol": 'SWAP-LP',
          "address": 'secret13leg3yqs3jfw4cuq5dyqeczkk9grx330dfezvp'
        },
        {
          "decimals": 6,
          "name": 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret1ff2z4d8zn7pd6ghshxwdmqudvw4p7zylvhel37',
          "symbol": 'SWAP-LP',
          "address": 'secret1hat67au4nzpvjxuzz68540cnwng2mujpa23248'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-SecretSwap-LP-Token-secret1gyct75dc2pf20vtj3l86k2jxg79mffyh9ljve3',
          "symbol": 'SWAP-LP',
          "address": 'secret1cgd6gcc4uyrxmzsmk4tpeta8auzcgwk4n5ngrx'
        },
        {
          "decimals": 6,
          "name": 'ScrtMoon',
          "symbol": 'SMOON',
          "address": 'secret1r0l0g7l07y7xrpyys80z3qu2eqvnfjlpcees2x'
        },
        {
          "decimals": 6,
          "name": 'sscrt-check',
          "symbol": 'BIG',
          "address": 'secret1604c95mmn3mqnhh2tl8aw8h22z2kem8qkksxhv'
        },
        {
          "decimals": 18,
          "name": 'secret-zrx',
          "symbol": 'ZRX',
          "address": 'secret120vtzu6xjprp6pq0r8wprf3jlp86xr8uu0nlc5'
        },
        {
          "decimals": 6,
          "name": 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret1rtgz90f7umulrg3a574p9n6d9hzcxmxqwdk9hj',
          "symbol": 'SWAP-LP',
          "address": 'secret1azv7mn6q7pqd2wqevx59rcprxnnalkxchhf3va'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1el5uj9ns9sty682dem033pt50xsv5mklmsvy24-SecretSwap-LP-Token-secret1j8vs8v729vregluuzr5n4zr77ztaleqtqcw026',
          "symbol": 'SWAP-LP',
          "address": 'secret1kg24nc3v4wm4vzufup8fvmvffxtm8425uwfvqd'
        },
        {
          "decimals": 6,
          "name": 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-SecretSwap-LP-Token-secret1x6zk42ayxu0wk5p905wkct8qgxk9afexkqyava',
          "symbol": 'SWAP-LP',
          "address": 'secret14rxhuxq79lhfy37htl7xkpwqekyhry59xpvjhn'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv-SecretSwap-LP-Token-secret1uakhxh3qwe2k8khww709cpxlm8kmwapufmfrr0',
          "symbol": 'SWAP-LP',
          "address": 'secret1azgy8zx6duz2s4yhxqvghsd25gnun6hefy7ff4'
        },
        {
          "decimals": 6,
          "name": 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-secret1ukn328k6y3th5nw9z00p8lvk5s7m05cr9p06cu-SecretSwap-LP-Token-secret1wta3fmj23ltf4df8kt8ztu5wpmzauhlwyp0c2c',
          "symbol": 'SWAP-LP',
          "address": 'secret1ej6n3a6zcdchvqxdjwqrj9ks7683m8fhvz9846'
        },
        {
          "decimals": 18,
          "name": 'secret-sushi',
          "symbol": 'SSUSHI',
          "address": 'secret19uje5xy80rm6rfu03df2xea532mcalw9hv8vf9'
        },
        {
          "decimals": 18,
          "name": 'secret-yfl',
          "symbol": 'YFL',
          "address": 'secret1jk0tw00vs23n8jwqdzrxtln6ww2a3k6em7s0p2'
        },
        {
          "decimals": 0,
          "name": 'secret-kidney-type-0',
          "symbol": 'SKDNY',
          "address": 'secret1049zqe7c3uxnp258r2pf2l3npgzj9pcn725h63'
        },
        {
          "decimals": 18,
          "name": 'secret-aave',
          "symbol": 'SAAVE',
          "address": 'secret1yxwnyk8htvvq25x2z87yj0r5tqpev452fk6h5h'
        },
        {
          "decimals": 18,
          "name": 'secret-band',
          "symbol": 'SBAND',
          "address": 'secret1p4zvqgxggrrk435nj94p6la2g4xd0rwssgzpsr'
        },
        {
          "decimals": 18,
          "name": 'secret-bac',
          "symbol": 'SBAC',
          "address": 'secret1ezg8weaamcr99848qhkqcf2ap5xz7nwe3cy22x'
        },
        {
          "decimals": 18,
          "name": 'secret-knc',
          "symbol": 'SKNC',
          "address": 'secret1rs389ss2jch4xjmxv5guru86s8y839nmjsrm5d'
        },
        {
          "decimals": 18,
          "name": 'secret-matic',
          "symbol": 'MATIC',
          "address": 'secret1pse3xfvv5pq5jw04wcaxhnhn7jqamfhcpm7j3t'
        },
        {
          "decimals": 18,
          "name": 'secret-ren',
          "symbol": 'SREN',
          "address": 'secret1s4fllut0e6vw0k3fxsg4fs6fm2ad6hn09zwgwv'
        },
        {
          "decimals": 18,
          "name": 'secret-dpi',
          "symbol": 'SDPI',
          "address": 'secret1ukn328k6y3th5nw9z00p8lvk5s7m05cr9p06cu'
        },
        {
          "decimals": 18,
          "name": 'secret-tusd',
          "symbol": 'STUSD',
          "address": 'secret1ryh523y4e3233hphrkdslegszqz8syjfpthcpp'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps-SecretSwap-LP-Token-secret13ns5mzms67jttq5cnv76j5lgtd0xf69sv4sdpq',
          "symbol": 'SWAP-LP',
          "address": 'secret1kduh3vlszmg3snq36k6s8l4v8s26z47m3q9haa'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1jk0tw00vs23n8jwqdzrxtln6ww2a3k6em7s0p2-SecretSwap-LP-Token-secret1wk20068ra0evzp58ac9flejzgucgfsn633pzrk',
          "symbol": 'SWAP-LP',
          "address": 'secret1s3czdpm5kxc2ql6mnl8c8y3xpak0y7yk2c674c'
        },
        {
          "decimals": 6,
          "name": 'secret15grq8y54tvc24j8hf8chunsdcr84fd3d30fvqv-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret1zra95h6nf4kc49x59x66t7crxxl79hr5nph882',
          "symbol": 'SWAP-LP',
          "address": 'secret1he6rzcet6jcwryu544a5zkkadxee4sk0umu703'
        },
        {
          "decimals": 6,
          "name": 'secret1xzlgeyuuyqje79ma6vllregprkmgwgavk8y798-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret1fspv4fzc90g72r22djhhtf2jrxvcte3dsvp2dk',
          "symbol": 'SWAP-LP',
          "address": 'secret1kg8pd6ag4cx72302uflm5n8nau2m6k7q9efck3'
        },
        {
          "decimals": 6,
          "name": 'secret1s4fllut0e6vw0k3fxsg4fs6fm2ad6hn09zwgwv-secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-SecretSwap-LP-Token-secret1dfzxr0nygttyw0xvhhgk2046t6mlj3lu7dn0hv',
          "symbol": 'SWAP-LP',
          "address": 'secret1kjefu42ujfdfcm7fq4rk08x30u5z8jtdwvndr3'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1px5mtmjh072znpez4fjpmxqsv3hpevdpyu9l4v-SecretSwap-LP-Token-secret1wrajc66xjst7mkjn383ymvtl54jaslalkhxt6e',
          "symbol": 'SWAP-LP',
          "address": 'secret1mc656zt6g37u2ufqp2tw8kaj5jxpujylfzw8yw'
        },
        {
          "decimals": 6,
          "name": 'secret1d673zrls7z5sd7nzqavqs4uzahnzqxq9zk7e62-secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-SecretSwap-LP-Token-secret1mm8g6wktv5vjfj6rs2jja2hq0rsjsugz658sup',
          "symbol": 'SWAP-LP',
          "address": 'secret17rch628qthxewc07dpgfjmlf28t82ghpld8hqv'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1s4fllut0e6vw0k3fxsg4fs6fm2ad6hn09zwgwv-SecretSwap-LP-Token-secret1lamq00jwpms5hzel22rjgmd0v2wn8fep6rzhmh',
          "symbol": 'SWAP-LP',
          "address": 'secret1m76hs58wqxasd7f6au3c7gx8at5xu2ez9kf44l'
        },
        {
          "decimals": 6,
          "name": 'secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps-secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw-SecretSwap-LP-Token-secret1xhr2kt02t9wxwcfjj2me77yehar83dpw2kq07q',
          "symbol": 'SWAP-LP',
          "address": 'secret1ket00reye5tuaurqd3lh4kplsz4rjpe7hepmzf'
        },
        {
          "decimals": 18,
          "name": 'secret-rune',
          "symbol": 'RUNE',
          "address": 'secret1el5uj9ns9sty682dem033pt50xsv5mklmsvy24'
        },
        {
          "decimals": 2,
          "name": 'secret-kidney',
          "symbol": 'SKDNY',
          "address": 'secret16vkzpmgpxekcg4w7q202ny5tlmjx9kvn6h02qw'
        },
        {
          "decimals": 2,
          "name": 'stake-or-die-token',
          "symbol": 'STKDIE',
          "address": 'secret1z6dn2vnr7futu9h80xamz75v5m7ya7qxl9e5fz'
        },
        {
          "decimals": 18,
          "name": 'secret-alpha',
          "symbol": 'ALPHA',
          "address": 'secret1h0tn05w9cjtsz9stccq2xl5rha2fxl0n2d765t'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1p4zvqgxggrrk435nj94p6la2g4xd0rwssgzpsr-SecretSwap-LP-Token-secret1mq2f0x9qyr2fwpyuaux3tehgvk8faz9ntazehd',
          "symbol": 'SWAP-LP',
          "address": 'secret1n5qe4k8zf09gh8zdrydcc3jqls4ceww8wzr2kv'
        },
        {
          "decimals": 6,
          "name": 'secret15grq8y54tvc24j8hf8chunsdcr84fd3d30fvqv-secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-SecretSwap-LP-Token-secret1qf03p2jeen2g5f5ttj0ttd4eyt2q9mr9pzmwum',
          "symbol": 'SWAP-LP',
          "address": 'secret1n0gdq68hxeyu5hatqmmz8gcd08x8cs0a0u0pge'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1yxwnyk8htvvq25x2z87yj0r5tqpev452fk6h5h-SecretSwap-LP-Token-secret1fz6k6sxlnqwga9q67y9wly6q9hcknddn8alrtg',
          "symbol": 'SWAP-LP',
          "address": 'secret1k6ypx2hv28yd73c9ethamru48ke9vetqrjzu26'
        },
        {
          "decimals": 6,
          "name": 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret1k2u3khzp59mp6wz2q4ulwhhy4rqpez63ln2fy6',
          "symbol": 'SWAP-LP',
          "address": 'secret1nvqrwwr9942gn89nk44nf2nku6gr7u8tsg6z45'
        },
        {
          "decimals": 6,
          "name": 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-secret1yxwnyk8htvvq25x2z87yj0r5tqpev452fk6h5h-SecretSwap-LP-Token-secret1wdqv9g68l98vw5xdczjmj9zpldu8hf8v2d6ra4',
          "symbol": 'SWAP-LP',
          "address": 'secret1skmznhm94a8rywghxj3vm4ltllj4n8uy4uklmc'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5-SecretSwap-LP-Token-secret1mgznzddvnarq28eua9pqe3f44tnuuwrrkrvcsu',
          "symbol": 'SWAP-LP',
          "address": 'secret1j08nzr6flvfpzx35ahkp23lk9jnte8flux4rly'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1ukn328k6y3th5nw9z00p8lvk5s7m05cr9p06cu-SecretSwap-LP-Token-secret1ldac7f6372k5nte03u9ev9c0ls7le5sp09gz8d',
          "symbol": 'SWAP-LP',
          "address": 'secret1jmv4h3f8rtlxsfaven4kstdaq55pr8rwty8ss5'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret19uje5xy80rm6rfu03df2xea532mcalw9hv8vf9-SecretSwap-LP-Token-secret1m79q9hnz44xtndmlrd9p57tt6z3kjeecp7957u',
          "symbol": 'SWAP-LP',
          "address": 'secret15atu5s5aqhkezg44d035nufq80ltwx968vey00'
        },
        {
          "decimals": 6,
          "name": 'secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te-secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-SecretSwap-LP-Token-secret1sk0l9gpx8aw22a4qlw47sgcuugaw00ztq5da5j',
          "symbol": 'SWAP-LP',
          "address": 'secret1nvq2d00293k8vaeagj23c9eg6kjhec4emnpa9c'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret16nqax7x66z4efpu3y0kssdfnhg93va0h20yjre-SecretSwap-LP-Token-secret1jp7f26yaa5yvk6a75ytaq5jnnntetlw38negl6',
          "symbol": 'SWAP-LP',
          "address": 'secret14ta2jf4muuem9hl2ktxvlestc260yz97wkmrlv'
        },
        {
          "decimals": 6,
          "name": 'secret1h0tn05w9cjtsz9stccq2xl5rha2fxl0n2d765t-secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-SecretSwap-LP-Token-secret15x63eu5wrqa8szmhkw3ams3x6eel4gpfx6rv22',
          "symbol": 'SWAP-LP',
          "address": 'secret1w0yshs43puncn4mu68epkdfzsynthtmm25sgjh'
        },
        {
          "decimals": 6,
          "name": 'secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret1ersk748pm763pjml54kzapycydu6uwtka8xe6t',
          "symbol": 'SWAP-LP',
          "address": 'secret1udzehhadgcpt3na688suy4xtra3sjxv4l42ktn'
        },
        {
          "decimals": 18,
          "name": 'secret-torn',
          "symbol": 'TORN',
          "address": 'secret19g8edr6pa2s7ywuc3wys9sgk76kj2th7xtksey'
        },
        {
          "decimals": 6,
          "name": 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret1rtgz90f7umulrg3a574p9n6d9hzcxmxqwdk9hj',
          "symbol": 'SWAP-LP',
          "address": 'secret1azv7mn6q7pqd2wqevx59rcprxnnalkxchhf3va'
        },
        {
          "decimals": 18,
          "name": 'ZGHpdOrREH',
          "symbol": 'SBAC',
          "address": 'secret19d0tgjlu7836048rk0mhhxu558pxqde06mxqmy'
        },
        {
          "decimals": 18,
          "name": '2moORQfvLD',
          "symbol": 'SETH',
          "address": 'secret1pzjgnnx9dacvqqswvc9sglftkskyjlajey23cx'
        },
        {
          "decimals": 18,
          "name": 'secret-enj',
          "symbol": 'ENJ',
          "address": 'secret1wp8aj7tja30cek5wf5jwcv0xalw8vmdasfv2lh'
        },
        {
          "decimals": 18,
          "name": 'secret-mana',
          "symbol": 'MANA',
          "address": 'secret178t2cp33hrtlthphmt9lpd25qet349mg4kcega'
        },
        {
          "decimals": 6,
          "name": 'secret1h0tn05w9cjtsz9stccq2xl5rha2fxl0n2d765t-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret1f0zqcy62ge3jevrum4sxqnm9re44xnuyzalylh',
          "symbol": 'SWAP-LP',
          "address": 'secret140gcjdue3ywsr3y6088250stamxtv2jhk05c7t'
        },
        {
          "decimals": 6,
          "name": 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te-SecretSwap-LP-Token-secret1qzemy8wsnr64m2s4k3772yf7mfdshksdlac6ff',
          "symbol": 'SWAP-LP',
          "address": 'secret1tq5t8y37yrqh4gatxplmks4k7vw5auslapkpx7'
        },
        {
          "decimals": 6,
          "name": 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw-SecretSwap-LP-Token-secret1hudap8eslsxsd3qjw66gnqheeyaalds53s6cgz',
          "symbol": 'SWAP-LP',
          "address": 'secret1v8h6em4ya9m62qusgxqq9w2gdpevtat549l27v'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1nq7resltu9870ar7vdu2suhzplx84800jfj2ja-SecretSwap-LP-Token-secret1fh9f4zquppnzp8wrhvy2pfkwyd4tadt530332a',
          "symbol": 'SWAP-LP',
          "address": 'secret1djl87ynczxgsm0xzcpqslcwkpuppp5tc68yywv'
        },
        {
          "decimals": 6,
          "name": 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-SecretSwap-LP-Token-secret12fnnk0k9n9d2wjuv3gz7nszazk5wvf6rqgce6s',
          "symbol": 'SWAP-LP',
          "address": 'secret1dengjn6lnw7an0l6rqudxsd739pxyzpyq96lju'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1vcm525c3gd9g5ggfqg7d20xcjnmcc8shh902un-SecretSwap-LP-Token-secret1g97kxc857asparfgdudzkzyq5akd74xmup52uj',
          "symbol": 'SWAP-LP',
          "address": 'secret102gfpp4hgvytxlxsz8hnjy7uqndmhau3jkzps8'
        },
        {
          "decimals": 6,
          "name": 'secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv-secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-SecretSwap-LP-Token-secret1pq6q9wgnwp5vmw2mg4l4tjhn7g87nn258f57qg',
          "symbol": 'SWAP-LP',
          "address": 'secret1s4e975hvcc37tgunfethl6mc48r6ervw6pzf63'
        },
        {
          "decimals": 6,
          "name": 'secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5-secret1yxwnyk8htvvq25x2z87yj0r5tqpev452fk6h5h-SecretSwap-LP-Token-secret15mp52phcct6f45tkhyvedhlt3zv9jn4ul44mfa',
          "symbol": 'SWAP-LP',
          "address": 'secret14e2fj6p59xuaghaan5f4xz5tk40yqar0ky8u4j'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret178t2cp33hrtlthphmt9lpd25qet349mg4kcega-SecretSwap-LP-Token-secret1e05xwjuhww4aql0xguzys63977mp27qlx6j4de',
          "symbol": 'SWAP-LP',
          "address": 'secret10sy4y68wa6649nw5c7m00zqcqx06tgrem90k4g'
        },
        {
          "decimals": 6,
          "name": 'secret17w6pnfv0yn9k99dc8wttz5h0e0e6hz5pt8k2yu-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret183lq5e49veyushgu5s2ul3dup57z4qcacx7ek8',
          "symbol": 'SWAP-LP',
          "address": 'secret1sv23mqdqammv9zdxgp33nk6wqgl07ly92lh5px'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1793ctg56epnzjlv7t7mug2tv3s2zylhqssyjwe-SecretSwap-LP-Token-secret1vtlce7s4p8mk3y7cfnqq9rr7qs3pthk0v5g7yx',
          "symbol": 'SWAP-LP',
          "address": 'secret1lu8vvymp4jfljqx0xvg408pmhgent50kyjh4th'
        },
        {
          "decimals": 6,
          "name": 'secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret1q00lhgule0mammrxdfn2e67uwhandgr5jhfvvm',
          "symbol": 'SWAP-LP',
          "address": 'secret10phk4mdrz0wcfrmulzcvxfpaeuz20g6eatef08'
        },
        {
          "decimals": 6,
          "name": 'secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps-SecretSwap-LP-Token-secret1p839pa56c6lvnemmsv5f7rlz52qytsg8h8gm8g',
          "symbol": 'SWAP-LP',
          "address": 'secret1w79c8pemt5k4l0ruzyxc7jkjyg6d623wvve64r'
        },
        {
          "decimals": 6,
          "name": 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-SecretSwap-LP-Token-secret1yf5ha6ysgznlnedad4ggdcxl4zwtcucqvannlr',
          "symbol": 'SWAP-LP',
          "address": 'secret1hk47f93mnzu702ya0akwn4p4f4gte895v0xpsk'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1r0l0g7l07y7xrpyys80z3qu2eqvnfjlpcees2x-SecretSwap-LP-Token-secret1w779swgqkedkuqjs24ka4u900sdkm3khack0e7',
          "symbol": 'SWAP-LP',
          "address": 'secret10e3yqlvc7u7jn86rec7mvv9f38hu3xm3v73fhr'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1ezg8weaamcr99848qhkqcf2ap5xz7nwe3cy22x-SecretSwap-LP-Token-secret1py6j9h7mfe87h9jud0e6zyk6qyhllz4r89xpe8',
          "symbol": 'SWAP-LP',
          "address": 'secret138wwgfj4p7w87dwq8hnjckjhpy6kv76e6ez4me'
        },
        {
          "decimals": 6,
          "name": 'secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5-secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-SecretSwap-LP-Token-secret17kaeu53n2na40z7cfxseaqycyzwkhgskrnj2s9',
          "symbol": 'SWAP-LP',
          "address": 'secret1g6s9u02wyem7k65dxjkcvlasr8p0e65qgx7k2k'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret178t2cp33hrtlthphmt9lpd25qet349mg4kcega-SecretSwap-LP-Token-secret1u9zfyh7d4mgf44f3y8fhz4e70dhjzd5e5df8hp',
          "symbol": 'SWAP-LP',
          "address": 'secret1gewshds6yhyry842vnxl9q6krezaatep6rxyt2'
        },
        {
          "decimals": 6,
          "name": 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-SecretSwap-LP-Token-secret153sh9337q6a46g39pdsx9e8sne6g0qz79qsvzq',
          "symbol": 'SWAP-LP',
          "address": 'secret1ysd3f2ydqawlrrjhfarkf35tc57ayca7sqpwqq'
        },
        {
          "decimals": 6,
          "name": 'secret1l5gtpejl5dcjupa9ac2hyd5q88vhp72dgnagx3-secret1x5d2d889znrdj8zx4pjxksjjgcwqj7a96v952k-SecretSwap-LP-Token-secret1twjm5j6vdal6khekdr2krpqdmnhwx20p6je3p9',
          "symbol": 'SWAP-LP',
          "address": 'secret1whxyqtkhhccpag6532vvpf9sch8anwxypj6cer'
        },
        {
          "decimals": 6,
          "name": 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-secret1xzlgeyuuyqje79ma6vllregprkmgwgavk8y798-SecretSwap-LP-Token-secret1pukk3cvgdg3a9a72n9rkhcqk9fc9qgjpzlhlnl',
          "symbol": 'SWAP-LP',
          "address": 'secret1tylaycndtscnkgalsfsjc8nx0lrqpvla3ajzfj'
        },
        {
          "decimals": 6,
          "name": 'secret15c5ftq4rq7xq3tml4nphv2fvz3u7kg73a583qp-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret12um5gxf2vdm6vy4q36jcxlg9mc60y6wgewwxx9',
          "symbol": 'SWAP-LP',
          "address": 'secret1tp25zaypu53g8av4qcr3gdrzujerxze38hm090'
        },
        {
          "decimals": 6,
          "name": 'secret1nq7resltu9870ar7vdu2suhzplx84800jfj2ja-secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te-SecretSwap-LP-Token-secret1pnefssturvfzm7dvk07495l564f7pe2v6qfmay',
          "symbol": 'SWAP-LP',
          "address": 'secret14nlydvrctetjfur4rl20qctscx7mfjf944hyha'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret1pxp9wy9gv20kpaee6evsp9n4h6gptxxkwhwfaj',
          "symbol": 'SWAP-LP',
          "address": 'secret1tjegqrmat45ur6pwkn3w4tnn7w27azxn6c2q9p'
        },
        {
          "decimals": 6,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-SecretSwap-LP-Token-secret1jta83ms8xe2nzmt4sg0mumqwuejx6wa7zqsduq',
          "symbol": 'SWAP-LP',
          "address": 'secret1tvaja4n4jz7wcqvata5vfxv6gkcn9t78jlty0j'
        },
        {
          "decimals": 6,
          "name": 'secret1szqzgpl9w42kekla57609y6dq2r39nf0ncx400-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret14v9dc5kfe0aamnz73vtc2a6ph7klqh5lspdxrg',
          "symbol": 'SWAP-LP',
          "address": 'secret1dt6lw86drnlfxl5ppnawdw80vtym09p6dhvqg5'
        },
        {
          "decimals": 6,
          "name": 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-secret1ukn328k6y3th5nw9z00p8lvk5s7m05cr9p06cu-SecretSwap-LP-Token-secret1samke0j286t44v72utzmm6dekea5z0v75sddwj',
          "symbol": 'SWAP-LP',
          "address": 'secret1t37zhqmyfq5qe7zpwczly6lcq7qa2lrey540zq'
        },
        {
          "decimals": 6,
          "name": 'secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te-secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-SecretSwap-LP-Token-secret145p9527297y5trecz3kf8yrma0ls2r40vedvga',
          "symbol": 'SWAP-LP',
          "address": 'secret120xdju4pcl9xxntf47chtt0du8cny9lzxu05x9'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1d673zrls7z5sd7nzqavqs4uzahnzqxq9zk7e62-SecretSwap-LP-Token-secret1v82egg9xtycsaz0h3nqay0saq0dv296z4swjku',
          "symbol": 'SWAP-LP',
          "address": 'secret1t6vfa5wnzqgvlk7u7u6fz9dwltrn44kzr22fh6'
        },
        {
          "decimals": 6,
          "name": 'secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv-SecretSwap-LP-Token-secret12dmwk3s0atewvcl4gzs6rh3puz29ahy0wwfhtj',
          "symbol": 'SWAP-LP',
          "address": 'secret12kw8cul8ssyvfffyctngzlr0a7c25rcmv2pva2'
        },
        {
          "decimals": 1,
          "name": 'torn-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret15g78xxtmcuc3y77cj89e2dwu9tg3up54vns9uf'
        },
        {
          "decimals": 1,
          "name": 'band-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1gfxwjj5evt9p0wnarheh59shz9kqf7rjf3hjnd'
        },
        {
          "decimals": 1,
          "name": 'matic-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret16n5p4d0gsuj4yu5rcg25paflwcgvtdr0tlwtsa'
        },
        {
          "decimals": 1,
          "name": 'alpha-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1e3kzrxjg5eyc8t9c4l0m5s4kj0ym4ku7dwj9ru'
        },
        {
          "decimals": 1,
          "name": 'ocean-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret17negel9x6nsanvjwjy0at5ny66zjyppesytk5n'
        },
        {
          "decimals": 1,
          "name": 'dpi-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1q8ddhqvsgrwsrdrnspja70cgeyjhw7kymyxzn5'
        },
        {
          "decimals": 1,
          "name": 'mana-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret18ht734kgefpxk49nju3ld8qzzk8g4wcx7tm9ys'
        },
        {
          "decimals": 1,
          "name": 'snx-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1fcvxek0quxhsfvh7xc80e7332hhwn2zamvtqcw'
        },
        {
          "decimals": 1,
          "name": 'enj-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1f9pn0vh8dltxhhpd5qe76ddw3qgl8prufq65yv'
        },
        {
          "decimals": 6,
          "name": 'secret15grq8y54tvc24j8hf8chunsdcr84fd3d30fvqv-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret1nc59zhtyqdxuutzu9a9qd35rgs6ad8c5mddh4p',
          "symbol": 'SWAP-LP',
          "address": 'secret1jdvjcplxywh068jzrajdvda87faer9zz268v26'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret19g8edr6pa2s7ywuc3wys9sgk76kj2th7xtksey-SecretSwap-LP-Token-secret14v3p9xq0353fvwrhkjyv4c96vrujjvzwmqyq0k',
          "symbol": 'SWAP-LP',
          "address": 'secret1853yqdhf2yjnaf2xerhmgsl5dt50t4grh63y3r'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1x5d2d889znrdj8zx4pjxksjjgcwqj7a96v952k-SecretSwap-LP-Token-secret10tl9at5y8awqyaanlg5f2fw63wjmg2l2x3m8ke',
          "symbol": 'SWAP-LP',
          "address": 'secret18xnahmm4jet302rz4zzdppc54ey82fatrfp6hd'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-SecretSwap-LP-Token-secret132zd4csn5xfellxa9xp94t7dl32jqk5lu4hump',
          "symbol": 'SWAP-LP',
          "address": 'secret1xug4dc46sqlcaetm5c72qhjtedh05922uac9k2'
        },
        {
          "decimals": 6,
          "name": 'secret1vp5vrl0wacxlkh03xkcvfh6q9tcrw4qrl4q4a5-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret13avjjq75jwqpthykw9vcjkqtqnvfjd2nwv5c9j',
          "symbol": 'SWAP-LP',
          "address": 'secret1xcecc2tt5rph6mfuj45nwvtmur7gfuh8yrae68'
        },
        {
          "decimals": 6,
          "name": 'uscrt-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SecretSwap-LP-Token-secret1rf4uqg4d2elmvp535ayhxwnrpdykmxan0nrwtg',
          "symbol": 'SWAP-LP',
          "address": 'secret1xhvv5uj5fa9yxcuuk4awqw568ve7g05v7fa0vd'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1tqltnm8f53xnprmnlurczf6sr86a4mgztafxzp-SecretSwap-LP-Token-secret15kkj9gyjurvxqcv63ly96lmc7vpcsllt65f7dv',
          "symbol": 'SWAP-LP',
          "address": 'secret185jen8q6ss5xnja33vj7pvqz49m8frkdekvzpy'
        },
        {
          "decimals": 6,
          "name": 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-SecretSwap-LP-Token-secret10nh7zxf88q8t7zntnfq7wuu2ekjt6y9zv8hnas',
          "symbol": 'SWAP-LP',
          "address": 'secret15lsv600d4jrwpl27ewy5vz6dse4kmx7fy7dznd'
        },
        {
          "decimals": 1,
          "name": 'ren-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1xkhzk4qa45gpytku2znd2y32j83cl4werlw6gg'
        },
        {
          "decimals": 6,
          "name": 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-secret1793ctg56epnzjlv7t7mug2tv3s2zylhqssyjwe-SecretSwap-LP-Token-secret1jjxaany509v3kdhmvazrj7ln5klkflcjvx890a',
          "symbol": 'SWAP-LP',
          "address": 'secret1fehemfxexk2yxxzpzgglm4ta2r7f90kwnzcu42'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1xzlgeyuuyqje79ma6vllregprkmgwgavk8y798-SecretSwap-LP-Token-secret1494aehy93xjdrsuhs7plp2ha0u9mrk8d9a4s4r',
          "symbol": 'SWAP-LP',
          "address": 'secret12pn4fehy0hkymh7p0u8jul395ywez55uhfl96h'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw-SecretSwap-LP-Token-secret1x8244a7l2fr642axef0sl5z3jw2pn75rp36hxs',
          "symbol": 'SWAP-LP',
          "address": 'secret1rldr66767a4gz3adkq2vgndwgnxlfqqae4fgen'
        },
        {
          "decimals": 6,
          "name": 'secret1rs389ss2jch4xjmxv5guru86s8y839nmjsrm5d-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret15jlnng79vd7ut6qhkwtp6tudrv0gf6zfjqqm8d',
          "symbol": 'SWAP-LP',
          "address": 'secret1zk39zl9h26zjkcuam3hqultqs2nucf0lefxxrj'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1yasq9f8d9tncxu9e8apr6qmr4haq9vvmhv6luq-SecretSwap-LP-Token-secret1mw60ydzyt8gmlmmg4gjv3vg8x5978p8dse8lhf',
          "symbol": 'SWAP-LP',
          "address": 'secret1z4367qkm7xa3x0vq2hupk7vhszzrl5vupyfnye'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1m6a72200733a7jnm76xrznh9cpmt4kf5ql0a6t-SecretSwap-LP-Token-secret1vmlnlyvgcdxrp3786gha42xwtsdktlgkn2z56d',
          "symbol": 'SWAP-LP',
          "address": 'secret1rwpy396gqqmpxxmkmd98wy9f3m5tsrufx3jdal'
        },
        {
          "decimals": 6,
          "name": 'secret16euwqyntvsp0fp2rstmggw77w5xgz2z26cpwxj-secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg-SecretSwap-LP-Token-secret1mvwdz62tdqg4hnmmszlwppk9p85892pdecg99s',
          "symbol": 'SWAP-LP',
          "address": 'secret1rkehnr0s6jdr62keklpyu79z84y7psrg7kaqgu'
        },
        {
          "decimals": 6,
          "name": 'secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-secret1tqltnm8f53xnprmnlurczf6sr86a4mgztafxzp-SecretSwap-LP-Token-secret1r4x95f8fzlkdn87a3gdr0xjuwe08qnkqdls5uz',
          "symbol": 'SWAP-LP',
          "address": 'secret198qgewnmmv7ut6r45pkrknqecxfhmd440aw2gf'
        },
        {
          "decimals": 6,
          "name": 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt-secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-SecretSwap-LP-Token-secret1f30aqh59eg5xhalsdc6u8cv26qe283ey9pp658',
          "symbol": 'SWAP-LP',
          "address": 'secret19kh9wmzulxv8lw0e0fyxjxmwtmln2fqpnetucl'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-SecretSwap-LP-Token-secret10x0k62eaal4q3t9c200qvmgftahxjqvdawn69c',
          "symbol": 'SWAP-LP',
          "address": 'secret1xxvqanj85m7dppplku5782cn9hl8askqd329sv'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1npxd6pyh7ujhdsk7cvmq93y2v5uccj79sccch5-SecretSwap-LP-Token-secret1fq7n6wx33qeqfw3gltjy43x9er2al5m09nsqw6',
          "symbol": 'SWAP-LP',
          "address": 'secret1ycws8up7nessz26n672rpalpax6metk4hwkc7z'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1wp8aj7tja30cek5wf5jwcv0xalw8vmdasfv2lh-SecretSwap-LP-Token-secret14yfchhpzrdhj78tyk4d8un0t64s038szkk66n5',
          "symbol": 'SWAP-LP',
          "address": 'secret1ymxsh0sytl7sfq8hkgcs843cd09ude285ndu2f'
        },
        {
          "decimals": 1,
          "name": 'knc-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1hf6tvptq8c5r86dvs037fhmm6m9mclfl5jnhdu'
        },
        {
          "decimals": 1,
          "name": 'mkr-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret13aukj7v7fg8xzpm343s94vp5x244qk8fxjws0j'
        },
        {
          "decimals": 1,
          "name": 'yfi-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1047wugr9wsxuapxgtyr407uy68cw4d6k6tkf8d'
        },
        {
          "decimals": 1,
          "name": 'bat-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1uc0k4rwwzccz9a4an773lyuun4l8k4qpvz3k99'
        },
        {
          "decimals": 1,
          "name": 'aave-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret12s2260yswdhry8lljp2m83cvudu0zc67h3t8st'
        },
        {
          "decimals": 1,
          "name": 'uni-wscrt-eth-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1r8nge6cwweezye4n750gpeqkgaqkazax598gpg'
        },
        {
          "decimals": 1,
          "name": 'sushi-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1lsvqk5h647y4qfqyn2lxacdetry22txg9mnfzd'
        },
        {
          "decimals": 1,
          "name": 'yfl-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1ra9l5p04sc4pu8vc5djr3c9ds7npmwmzvsee32'
        },
        {
          "decimals": 1,
          "name": 'rune-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret12u4cjgput2uvdv4y9h5h7rs9grxdx582wlvxgj'
        },
        {
          "decimals": 1,
          "name": 'link-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret19y50xzywrz98g6ljxp43fd4q47sl40gkcpm03n'
        },
        {
          "decimals": 1,
          "name": 'zrx-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1snr63w7m44ay9pl9sdkppmyqjxqauh7t5gvms7'
        },
        {
          "decimals": 1,
          "name": 'tusd-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1xdvsf5mah8yhd0ndk2khktkpaqqtat6jwyfecz'
        },
        {
          "decimals": 6,
          "name": 'secret15c5ftq4rq7xq3tml4nphv2fvz3u7kg73a583qp-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret1jkcg9srf07pdcr79yy8vef9p9m8qut30xgatqj',
          "symbol": 'SWAP-LP',
          "address": 'secret1y2pjf7zaswfvqtfja8uwlzep3h9xjtmupgx6vr'
        },
        {
          "decimals": 6,
          "name": 'secret15grq8y54tvc24j8hf8chunsdcr84fd3d30fvqv-secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-SecretSwap-LP-Token-secret1u2kes9x458mf7e7ghj5x2j9mmpr894qg9x0qm9',
          "symbol": 'SWAP-LP',
          "address": 'secret1xwvxlcpdwfqpezh2gtlmyxmdr8jyedznuus3rj'
        },
        {
          "decimals": 6,
          "name": 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-SecretSwap-LP-Token-secret1c7far5kl8824jmqucyrfpwx43fa40ek902wwzc',
          "symbol": 'SWAP-LP',
          "address": 'secret18uwjv5dzz0yyzxzveksqcp4jw38rvdg3hqzmgp'
        },
        {
          "decimals": 6,
          "name": 'secret1t6228qgqgkwhnsegk84ahljgw2cj7f9xprk9zd-secret1px5mtmjh072znpez4fjpmxqsv3hpevdpyu9l4v-SecretSwap-LP-Token-secret1vwdklfh4h023tpgttnreyajedyfq8swyj22gzg',
          "symbol": 'SWAP-LP',
          "address": 'secret1xprxgq8mmwuauwx4wdea3xkjnvxwz8l9fctzs3'
        },
        {
          "decimals": 1,
          "name": 'rsr-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1p4a6pr76r4p2sn324ek2ayagr7qvrchwc0radv'
        },
        {
          "decimals": 6,
          "name": 'secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw-secret1h0tn05w9cjtsz9stccq2xl5rha2fxl0n2d765t-SecretSwap-LP-Token-secret1449vdd3sydkqy4nf2sqyty3tq3pp8kgxqel9zm',
          "symbol": 'SWAP-LP',
          "address": 'secret1qxklqtynsp0fc9mc6p8vnt8m0jajgwjxwja0w9'
        },
        {
          "decimals": 6,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret16efkcwgj3vkxsfvk4j6zjz05ukfxg35zsrj0vs-SecretSwap-LP-Token-secret1k33pn6akw9ug8rdwyszeqzmr9k8ssxhvydmg8t',
          "symbol": 'SWAP-LP',
          "address": 'secret1pjf9swahsje7ejqklfp283nxhj0c4txpfac5ye'
        },
        {
          "decimals": 6,
          "name": 'secret12sjaw9wutn39cc5wqxfmkypm4n7tcerwfpvmps-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret1zkckdmjv5f2wk6r6ehunvwse55xded0n6dwfs0',
          "symbol": 'SWAP-LP',
          "address": 'secret1pprth4wa696lnyhtmpvwpa0x8zhqe6pr4fsrvc'
        },
        {
          "decimals": 6,
          "name": 'secret1nq7resltu9870ar7vdu2suhzplx84800jfj2ja-secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-SecretSwap-LP-Token-secret173jjaeen8jqm69z3s2rhfma5nwsx2vm00e58jg',
          "symbol": 'SWAP-LP',
          "address": 'secret1qml2ktledypf0m5a7w8p2evgsejlm3qye2hurt'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1ds8850j99cf5h3hygy25f0zzs6r6s7vsgfs8te-SecretSwap-LP-Token-secret1m25qmwkxcflzzsz5rfuty3yx3cll3rtzfwyx09',
          "symbol": 'SWAP-LP',
          "address": 'secret1q6yzuparxlk6ydc5t08zg3hma6e995klwxfwyl'
        },
        {
          "decimals": 6,
          "name": 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-secret1ryh523y4e3233hphrkdslegszqz8syjfpthcpp-SecretSwap-LP-Token-secret1ejjy36t0sz8lxvy3p58hgg0gs5w2aw2rztwngy',
          "symbol": 'SWAP-LP',
          "address": 'secret1qcszs0526shrrkrwycqfurrzhk2nauu7a4lcas'
        },
        {
          "decimals": 6,
          "name": 'secret16euwqyntvsp0fp2rstmggw77w5xgz2z26cpwxj-secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-SecretSwap-LP-Token-secret1hy8ajfzfj5yd70x7nhw9gd4qyyqqc4stgjqsr3',
          "symbol": 'SWAP-LP',
          "address": 'secret1pzu2paj6syelj2hrgqpaqa7ps77dsxc3l96eul'
        },
        {
          "decimals": 6,
          "name": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-secret1ezg8weaamcr99848qhkqcf2ap5xz7nwe3cy22x-SecretSwap-LP-Token-secret1udcm40mkgw53hdus3tcf2xhup88sx6yns9xv23',
          "symbol": 'SWAP-LP',
          "address": 'secret1g88sj0xplmutyw0uupk6g6p5qcvjypdf2znpe7'
        },
        {
          "decimals": 1,
          "name": 'usdt-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1kma59tlgk66hwpxvjlcc42gys0sz9jc96v4jak'
        },
        {
          "decimals": 1,
          "name": 'usdc-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1sugd87x8ul2jxsqpm7gazhgz6tf9zfwmfwk095'
        },
        {
          "decimals": 1,
          "name": 'wbtc-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1ayl9jv7atks34l0vx9n7y6rl60t32ptycac909'
        },
        {
          "decimals": 1,
          "name": 'renbtc-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1texzs8e40dc40m4phvswxt0e3l5ymmaptzukjz'
        },
        {
          "decimals": 1,
          "name": 'bac-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1q762ytweqslmvsryggnunmry6ahhlwek745rau'
        },
        {
          "decimals": 1,
          "name": 'eth-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1q6y7wz6pev80aadyjsejk5xr2yj4mkrj40zrvn'
        },
        {
          "decimals": 1,
          "name": 'uni-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1qgaxregzkc6z9wmf4rgp5frj9els95zx3cs93u'
        },
        {
          "decimals": 1,
          "name": 'comp-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret1qgfqajzarljueaglzar8tdpgjkmdnr9cqgj9xl'
        },
        {
          "decimals": 1,
          "name": 'dai-rewards',
          "symbol": 'ETH-RWRDS',
          "address": 'secret16q4sz5s4dpzdywrdcnfe8pvucuegrm6m9ksdtd'
        },
        {
          "decimals": 6,
          "name": 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SecretSwap-LP-Token-secret1rdgh73kulr52q7r09x9d2r3528jq52es4dalnt',
          "symbol": 'SWAP-LP',
          "address": 'secret1pzkxv0tmltf2dqxtxl9t8xsrnd93s4awj0pn7w'
        },
        {
          "decimals": 18,
          "name": 'secret-bnb',
          "symbol": 'SBNB',
          "address": 'secret1qs6lw4gcqazew5m2keg39lu3mrxnav805j564q'
        },
        {
          "decimals": 18,
          "name": 'secret-bch-bsc',
          "symbol": 'SBCH(BSC)',
          "address": 'secret12cwvnd5g0r7raq94rpve93rdrl49f3rpw30gqn'
        },
        {
          "decimals": 18,
          "name": 'secret-bunny',
          "symbol": 'SBUNNY',
          "address": 'secret1fsmwnrttkr2qtywzzlkmy6wpu22khg7a88kzm6'
        },
        {
          "decimals": 18,
          "name": 'secret-bakery',
          "symbol": 'SBAKE',
          "address": 'secret1r8pgpj8x8ptqxwlweu8j8dqagjmqzugxpxa706'
        },
        {
          "decimals": 18,
          "name": 'secret-fine',
          "symbol": 'SFINE',
          "address": 'secret1ztejvy40avl54gu049jdk4wtggcq2uxnw0wnxu'
        },
        {
          "decimals": 18,
          "name": 'secret-usdc-bsc',
          "symbol": 'SUSDC(BSC)',
          "address": 'secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg'
        },
        {
          "decimals": 18,
          "name": 'secret-link-bsc',
          "symbol": 'SLINK(BSC)',
          "address": 'secret1trr50jqff3ncn099cpukehh8a4pjxu0d3m4ccq'
        },
        {
          "decimals": 18,
          "name": 'secret-busd-bsc',
          "symbol": 'SBUSD(BSC)',
          "address": 'secret1793ctg56epnzjlv7t7mug2tv3s2zylhqssyjwe'
        },
        {
          "decimals": 18,
          "name": 'secret-ust',
          "symbol": 'SUST',
          "address": 'secret1mhwawf2yu7erjgmya6mqy0apl08a5f2xz568qg'
        },
        {
          "decimals": 8,
          "name": 'secret-doge-bsc',
          "symbol": 'SDOGE(BSC)',
          "address": 'secret16nqax7x66z4efpu3y0kssdfnhg93va0h20yjre'
        },
        {
          "decimals": 18,
          "name": 'secret-lina',
          "symbol": 'SLINA',
          "address": 'secret1u9myrsw6mmgvmrrgjnkermayp88arkjd5e9jut'
        },
        {
          "decimals": 6,
          "name": 'secret-scrt-bsc',
          "symbol": 'SSCRT(BSC)',
          "address": 'secret1c7apt5mmv9ma5dpa9tmwjunhhke9de2206ufyp'
        },
        {
          "decimals": 18,
          "name": 'secret-trx-bsc',
          "symbol": 'STRX(BSC)',
          "address": 'secret1ehz0rjrng3q8pr8sdduuajnwq7fwrdhqf8awtz'
        },
        {
          "decimals": 18,
          "name": 'secret-ada-bsc',
          "symbol": 'SADA(BSC)',
          "address": 'secret1t6228qgqgkwhnsegk84ahljgw2cj7f9xprk9zd'
        },
        {
          "decimals": 18,
          "name": 'secret-usdt-bsc',
          "symbol": 'SUSDT(BSC)',
          "address": 'secret16euwqyntvsp0fp2rstmggw77w5xgz2z26cpwxj'
        },
        {
          "decimals": 18,
          "name": 'secret-bnb-bsc',
          "symbol": 'SBNB(BSC)',
          "address": 'secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5'
        },
        {
          "decimals": 18,
          "name": 'secret-eth-bsc',
          "symbol": 'SETH(BSC)',
          "address": 'secret1m6a72200733a7jnm76xrznh9cpmt4kf5ql0a6t'
        },
        {
          "decimals": 18,
          "name": 'secret-cake',
          "symbol": 'SCAKE',
          "address": 'secret13z4thzp3zzyxr008fsygnpn2jpl84w884gfy86'
        },
        {
          "decimals": 18,
          "name": 'secret-ltc-bsc',
          "symbol": 'SLTC(BSC)',
          "address": 'secret17zt6ycf3n079fngha6ku5u4qwjca2k2jq6rfp9'
        },
        {
          "decimals": 18,
          "name": 'secret-xrp-bsc',
          "symbol": 'SXRP(BSC)',
          "address": 'secret1j0urq4pfrjr55c95z9s9jzv0evj88gjc9m0h02'
        },
        {
          "decimals": 18,
          "name": 'secret-dot-bsc',
          "symbol": 'SDOT(BSC)',
          "address": 'secret1px5mtmjh072znpez4fjpmxqsv3hpevdpyu9l4v'
        },
        {
          "decimals": 18,
          "name": 'secret-xvs',
          "symbol": 'SXVS',
          "address": 'secret1npxd6pyh7ujhdsk7cvmq93y2v5uccj79sccch5'
        },
        {
          "decimals": 6,
          "name": 'cshbk',
          "symbol": 'CSHBK',
          "address": 'secret1eckd8jyjjz5qvse3t42qnepy4ywg9qj6hlh46s'
        },
        {
          "decimals": 18,
          "name": 'o725n99QTO',
          "symbol": 'BNB',
          "address": 'secret1hvh5jruncq9q58sfw6wsst68phlp7cdnvwgnx8'
        },
        {
          "decimals": 18,
          "name": 'test-busd',
          "symbol": 'BUSD',
          "address": 'secret1sl3pz6c7rsgw983uhvv6s2d9qu2q5y4prmmtj3'
        },
        {
          "decimals": 18,
          "name": 'test-bnb',
          "symbol": 'BNB',
          "address": 'secret1wzq0e2dds7l8el4ehfqn7x52mz7rudqt2ruwad'
        },
        {
          "decimals": 18,
          "name": '0PmlwEG1M6',
          "symbol": 'BUSD',
          "address": 'secret1vwnexe4rel8exgkf7sheka2u6j4pudd63306n6'
        },
        {
          "decimals": 18,
          "name": 'vbLLPXbTJF',
          "symbol": 'BNB',
          "address": 'secret1fgqdnkm0k9p9ytf0evp44gqa4dk68457kfx5me'
        },
        {
          "decimals": 18,
          "name": 'UGPObALMce',
          "symbol": 'BETH',
          "address": 'secret1fq9u0cl6jnjepk4deh7tlvv0sk2vevwcwh8xhg'
        },
        {
          "decimals": 6,
          "name": 'ctest',
          "symbol": 'CTEST',
          "address": 'secret10ufxcd6neuhh29d5vcrdmwyv2l6m2jdvauu3ku'
        },
        {
          "decimals": 6,
          "name": 'secret10ufxcd6neuhh29d5vcrdmwyv2l6m2jdvauu3ku-gov',
          "symbol": 'GCTEST',
          "address": 'secret1y0rgrelgxvkjw2vg4rqw4hzgxxmcknu77adrhq'
        },
        {
          "decimals": 6,
          "name": 'ADCL - 8a521d85d3ab88f',
          "symbol": 'ADCL',
          "address": 'secret1plcwuk28x7skvkjmhdqw7lsy5qlaa8s4q37ytt'
        },
        {
          "decimals": 6,
          "name": 'Secret UniSwap - 6cd7194b5a795b6',
          "symbol": 'SUNI',
          "address": 'secret1r5tggnmvf8efgw6306rqpw2pu5art8pd8nge8m'
        },
        {
          "decimals": 2,
          "name": 'ikigai - c6a141d96916a70',
          "symbol": 'IKI',
          "address": 'secret17npyzt0fp9uply7dy2u725mpjyt6jhkce3ll4z'
        },
        {
          "decimals": 6,
          "name": 'Secret Ethereum - 675645ae26f52b6',
          "symbol": 'SETH',
          "address": 'secret1m66xf20rl6zx3txgvpnrrwmsslh6ctacmkyx6w'
        },
        {
          "decimals": 6,
          "name": 'Lunex - f92111df5bf314c',
          "symbol": 'LUNEX',
          "address": 'secret1zl95qg097kar8qft8ht923g6kt6ajvv0ucdrqw'
        },
        {
          "decimals": 6,
          "name": 'CannaLabs - 5de5612be44616b',
          "symbol": 'CANLAB',
          "address": 'secret18597lzhfdphj4jxpln7eryzdnhsfldwnex4254'
        },
        {
          "decimals": 6,
          "name": 'Secret Doge - 05044d462eda9a5',
          "symbol": 'SDOGE',
          "address": 'secret19sq4zmt5gha8kdr3lnkdmnr34h77nsdhdx8fae'
        },
        {
          "decimals": 10,
          "name": 'OAK - ec0783271622770',
          "symbol": 'OAK',
          "address": 'secret19qskuljcc429nmkx0pq4x7m475kxnt9zxay4a8'
        },
        {
          "decimals": 8,
          "name": 'Waddle - bb90c5db8956d65',
          "symbol": 'WADL',
          "address": 'secret18phe6dpzvapgnehjssw402vewny8tjj5lmk7us'
        },
        {
          "decimals": 6,
          "name": 'cicada - abdb5d3c6cf7146',
          "symbol": 'PGP',
          "address": 'secret1x5d2d889znrdj8zx4pjxksjjgcwqj7a96v952k'
        },
        {
          "decimals": 6,
          "name": 'Jasu Club Token - c59eb6665469e47',
          "symbol": 'JCT',
          "address": 'secret140ke08ecyc78jruhej4mhuy35kj6jafk26nfz4'
        },
        {
          "decimals": 6,
          "name": 'Secret USD - 87ef514a725cbe6',
          "symbol": 'SUSD',
          "address": 'secret1x4x8fjhhe5ulhqer0p2gd0h6nxmqyfanx9nfh5'
        },
        {
          "decimals": 6,
          "name": 'Venus Secret - 5b1d0c4da36df6b',
          "symbol": 'VST',
          "address": 'secret1wd6navr7uut9swdytp6frwf67wad80dquhxc25'
        },
        {
          "decimals": 6,
          "name": 'Secret Doge - 49f340133523197',
          "symbol": 'SDOGE',
          "address": 'secret1hu088d7y9yg0uujd8dykuzc0mv03u9p2a57t9f'
        },
        {
          "decimals": 6,
          "name": 'dSCRT-token',
          "symbol": 'dSCRT',
          "address": 'secret17w6pnfv0yn9k99dc8wttz5h0e0e6hz5pt8k2yu'
        },
        {
          "decimals": 6,
          "name": 'Saturniidollar - fa7d3558ee86b0b',
          "symbol": 'SAT',
          "address": 'secret1j90psg72qn2hj3385wghrx9g3e5pa2866rhz2x'
        },
        {
          "decimals": 6,
          "name": 'Secret Pi Network - cc2c1ea6ec5d134',
          "symbol": 'SPI',
          "address": 'secret1ckanjhml2nyl2u3gy52pxp8xhy5qllxv7347vz'
        },
        {
          "decimals": 6,
          "name": 'Secret Defloration Token - 1bf231aabe148f6',
          "symbol": 'SDT',
          "address": 'secret14a9kt5rsjr6nknntwaa0yjact92wn0gyx6xpmg'
        },
        {
          "decimals": 6,
          "name": 'Secret USD - 1675edbdb34f00a',
          "symbol": 'SUSD',
          "address": 'secret1jndzl9eacf74xwwznrrwjkff983svqqss9afvy'
        },
        {
          "decimals": 6,
          "name": 'Jasu Cluc Token - 62da532c1146955',
          "symbol": 'JCT',
          "address": 'secret1j096yl9dsuv857smhf6tfumrv6x3pve3atw734'
        },
        {
          "decimals": 8,
          "name": 'Secret harcore token  - 0c99c6d56d6d712',
          "symbol": 'SHT',
          "address": 'secret18hptaueyzlk0ygnpxwvp78kfffs3at8z85eq6f'
        },
        {
          "decimals": 6,
          "name": 'ADCL - 2b94f1f4911043a',
          "symbol": 'ADCL',
          "address": 'secret1c8v9wrnq3zpw2t2pd0cjxgen0cy6nays7t6y6k'
        },
        {
          "decimals": 18,
          "name": 'LerdCoin - 3a560d3b72f37f4',
          "symbol": 'LERD',
          "address": 'secret1gjay0a6m3wa92hm464p7t9v64q74azgxkz7at3'
        },
        {
          "decimals": 6,
          "name": 'tck test token0 - 88f35bafe9a6cd6',
          "symbol": 'TCKTW',
          "address": 'secret1ch2hd5cjqsyr8d2twsutulck2qs4tlw35g9ta2'
        },
        {
          "decimals": 18,
          "name": 'RUFF FINANCE - 1f6e83d5e7e0892',
          "symbol": 'RUFF',
          "address": 'secret1ufyrwnat36xve6wa2g00f0t9j8ksj26g84yann'
        },
        {
          "decimals": 6,
          "name": 'Secret Non-fungible token - f5051a55143c21e',
          "symbol": 'SNFT',
          "address": 'secret1tfsvzdp4vawc6efguaq89gpwfpjrcrgruc4ayv'
        },
        {
          "decimals": 6,
          "name": 'tux3do - 475e1ff040aa5b7',
          "symbol": 'TUX',
          "address": 'secret1l5gtpejl5dcjupa9ac2hyd5q88vhp72dgnagx3'
        },
        {
          "decimals": 6,
          "name": 'KINGPIN - 9e6eb25615c10c8',
          "symbol": 'KING',
          "address": 'secret1t0je9v0tcydkmkh2tjuppyu8n7fv7ghupqdmlu'
        },
        {
          "decimals": 6,
          "name": 'Secret Internet Computer Token - 412bfb4cd02a64a',
          "symbol": 'SIC',
          "address": 'secret1qrzk0w0drsqyyfz7mynaw5s3q55lutn3x9sx75'
        },
        {
          "decimals": 6,
          "name": 'Cat Token - 73d106be656f34e',
          "symbol": 'CAT',
          "address": 'secret1vjvrylt448seaj2qd7r39c9dw0nhgt2f8aspgx'
        },
        {
          "decimals": 6,
          "name": 'Buttcoin',
          "symbol": 'BUTT',
          "address": 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt'
        },
        {
          "decimals": 6,
          "name": 'dSCRT',
          "symbol": 'dSCRT',
          "address": 'secret1y5x6yrc4suagjvd3c6swjnv3r78rkrn2250l2e'
        },
        {
          "decimals": 6,
          "name": 'Secret Cardano Network - bf5800715a86df7',
          "symbol": 'SADA',
          "address": 'secret15hy75jzh6urxk9tnan4shn8kep0mu3fhf0mqd9'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-yfi',
          "symbol": 'SPYSCRTYFI',
          "address": 'secret1d5qkesgrhhpcvkaephrs5ws7nvankrkgf32un5'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-dai',
          "symbol": 'SPYSCRTDAI',
          "address": 'secret1fc3w26lv0t2q8j2u0rrc7cf5mycde9sqg8jjf6'
        },
        {
          "decimals": 1,
          "name": 'spy-sefi',
          "symbol": 'SPYSEFI',
          "address": 'secret1y9z3ck449a46r4ku7klkhdxnlq07zh4shc7cuy'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-rsr',
          "symbol": 'SPYSCRTRSR',
          "address": 'secret1rxu6rksvyaxksnhqszv06d3n92y0prgr2ghj5m'
        },
        {
          "decimals": 1,
          "name": 'spy-eth-ethbsc',
          "symbol": 'SPYETHETHBSC',
          "address": 'secret1c0qu9mj4y7ch7aj4sect5jx2pyycuzgeg65jxv'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-rune',
          "symbol": 'SPYSCRTRUNE',
          "address": 'secret16wup0xc9m5ndgvna3p523xntk7favp353xa79v'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-eth',
          "symbol": 'SPYSCRTETH',
          "address": 'secret146dg4c7jt5y37nw94swp6sahleshefxhrerpqm'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-usdt',
          "symbol": 'SPYSCRTUSDT',
          "address": 'secret1zysw570u5edsfdp44q80tm5zhdllawgh603ezy'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-bnb',
          "symbol": 'SPYSCRTBNB',
          "address": 'secret1le6m83ry8uftsrft8s7lz6k36yvqlkp43qagpr'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-link',
          "symbol": 'SPYSCRTLINK',
          "address": 'secret1mlv3av6nlqt3fmzmtw0pnehsff2dxrzxq98225'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-sefi',
          "symbol": 'SPYSCRTSEFI',
          "address": 'secret1097s3zmexc4mk9s2rdv3gs6r76x9dn9rmv86c7'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-sienna',
          "symbol": 'SPYSCRTSIENNA',
          "address": 'secret1mqlzjcc3vfa4shw89qzsd47uujxgk8st6ye8ly'
        },
        {
          "decimals": 1,
          "name": 'spy-eth-wbtc',
          "symbol": 'SPYETHWBTC',
          "address": 'secret1mznq6qwlj3ryzfpetfgydffef7w40tmlkhufcl'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-uni',
          "symbol": 'SPYSCRTUNI',
          "address": 'secret13gdhmsf5j9jjva6d924hhdjrngf8092tv5frp8'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-wbtc',
          "symbol": 'SPYSCRTWBTC',
          "address": 'secret1a3qvtsxd3fu5spkrscp5wwz3gtjmf50fgruezy'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-ocean',
          "symbol": 'SPYSCRTOCEAN',
          "address": 'secret1zpz7x64lm625k0rxgk6z0drffz5hwwsnnwaxkf'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-mana',
          "symbol": 'SPYSCRTMANA',
          "address": 'secret1358gj5s2ys859tuue6v43w98jzavfnh8d8gz8y'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-dotbsc',
          "symbol": 'SPYSCRTDOTBSC',
          "address": 'secret1nd59d30xz7yyv2gdq7x8hkmx7wghde8nkt7zqa'
        },
        {
          "decimals": 6,
          "name": 'SEFI',
          "symbol": 'SEFI',
          "address": 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt'
        },
        {
          "decimals": 18,
          "name": '2021-05-01_22-43-03-066_SIENNA_SNIP20',
          "symbol": 'SIENNA',
          "address": 'secret1f2y33hq9df7lql6wmnwm3wgpdeds53qf4fuulp'
        },
        {
          "decimals": 18,
          "name": '2021-05-01_22-44-51-600_SIENNA_SNIP20',
          "symbol": 'SIENNA',
          "address": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4'
        },
        {
          "decimals": 18,
          "name": 'bsc-bridge-sienna-proxy',
          "symbol": 'PSIENA',
          "address": 'secret17askz8qzhwgx5s2kumzpyneuccmmwv4drhhkgy'
        },
        {
          "decimals": 6,
          "name": 'My Token8592',
          "symbol": 'TST',
          "address": 'secret1zwhaw6j8enawh04fdv2s7yfrdezk49x0zeam48'
        },
        {
          "decimals": 18,
          "name": 'eth-bridge-sienna-proxy',
          "symbol": 'PSIENA',
          "address": 'secret1vq0gc5wdjqnalvtgra3dr4m07kaxkhq2st3hzx'
        },
        {
          "decimals": 6,
          "name": 'bsc-bridge-sscrt-proxy',
          "symbol": 'PSSCRT',
          "address": 'secret1t9cdexpf8pxtjlz4k9cfydd0ml2jxanl0uw5s0'
        },
        {
          "decimals": 6,
          "name": 'eth-bridge-sscrt-proxy',
          "symbol": 'PSSCRT',
          "address": 'secret1zxt48uqzquvjsp2a7suzxlyd9n3jfpdw4k5zve'
        },
        {
          "decimals": 6,
          "name": 'STKd',
          "symbol": 'STKd',
          "address": 'secret18cgnku4dcd8scn56t3ru63ludh3lm0svemul8v'
        },
        {
          "decimals": 6,
          "name": 'Secret UniSwap - 36c551c62289fb1',
          "symbol": 'SUNI',
          "address": 'secret1z6x04gw708q0wlkscw9z89ngw5jgvkdtw3npv6'
        },
        {
          "decimals": 2,
          "name": 'ikigai - 234f723bb4d937e',
          "symbol": 'IKI',
          "address": 'secret16760az5r0cd32ty00yael8zmt0jegn8xk0m770'
        },
        {
          "decimals": 6,
          "name": 'Secret Ethereum - 7905ff621a4f6a7',
          "symbol": 'SETH',
          "address": 'secret1mjcaa3774yq7s3u70rkdmz74z2kle2qe8r2gh5'
        },
        {
          "decimals": 6,
          "name": 'Venus Secret Token - 17d9a4fda600a6e',
          "symbol": 'VST',
          "address": 'secret1sgx6nvt8s9pgteacg6g80hwtsgd47avetz98fx'
        },
        {
          "decimals": 8,
          "name": 'WADDLE - 3ba00b89d5fa5e8',
          "symbol": 'WADL',
          "address": 'secret1r35d8rk7e8ryqx4dlgq96d45t4nlkqnwhr54jz'
        },
        {
          "decimals": 6,
          "name": 'Secret Charity Network - 929f9ce27df7847',
          "symbol": 'SCT',
          "address": 'secret1uqere9utykef8dw7ypw3hjvf5gtcvj9z263x7v'
        },
        {
          "decimals": 6,
          "name": 'Venus Secret Token - 053857d867f7560',
          "symbol": 'VST',
          "address": 'secret1pwl7ggzpzfms9d2kwax0jv8pgn69mqxu93ass3'
        },
        {
          "decimals": 6,
          "name": 'Cat Token - 68685bcb40a5a27',
          "symbol": 'CAT',
          "address": 'secret1yasq9f8d9tncxu9e8apr6qmr4haq9vvmhv6luq'
        },
        {
          "decimals": 18,
          "name": 'Test - c0746f5bfb42745',
          "symbol": 'TST',
          "address": 'secret1lkaqx2wpwqwde2mdyfg9q2sequ5ft4ar0jn2zt'
        },
        {
          "decimals": 6,
          "name": 'Secret Garden - bd22d4b69e66d78',
          "symbol": 'GRDN',
          "address": 'secret1erkwrxtfkmjnr0rp57a7tcgrecgxsrdlavc8jz'
        },
        {
          "decimals": 6,
          "name": 'CRW - 3aa7c47224dd44d',
          "symbol": 'CRW',
          "address": 'secret1rzuh00czh7pkc4s06m2cg4vdsy9equsjhgsfgd'
        },
        {
          "decimals": 6,
          "name": 'Lunex - 484a10f08ab1852',
          "symbol": 'LUNEX',
          "address": 'secret18g2yzcwtgt8rmsza2qg4476d24d82dy2z4q3lh'
        },
        {
          "decimals": 6,
          "name": 'Slim Secret - 3cc340fb464aa8a',
          "symbol": 'SLIMS',
          "address": 'secret1ml6cuyr3au0vzvvls2n308r5yf9pq5dpm3lyn0'
        },
        {
          "decimals": 6,
          "name": 'Secret Ethereum - 675645ae26f52b6',
          "symbol": 'SETH',
          "address": 'secret1m66xf20rl6zx3txgvpnrrwmsslh6ctacmkyx6w'
        },
        {
          "decimals": 6,
          "name": 'Secret Satoshi Nakamoto - 2f9feeb41105182',
          "symbol": 'SSBTC',
          "address": 'secret1zqu5um278ysrxm9hjzskrt0dnqs7h6xmr32and'
        },
        {
          "decimals": 1,
          "name": 'spy-sefi-v2',
          "symbol": 'SPYSEFI-V2',
          "address": 'secret1wuhypk53eukm9xvlzu2z30rtyqfh74qtqgvlvr'
        },
        {
          "decimals": 1,
          "name": 'spy-usdc-usdcbsc',
          "symbol": 'SPYUSDCUSDCBSC',
          "address": 'secret1t7xqjaqx4jr68w0xwlqvwzwks2e2l0q24wjajf'
        },
        {
          "decimals": 1,
          "name": 'spy-sefi-usdc',
          "symbol": 'SPYSEFIUSDC',
          "address": 'secret18jtdn487m5xt9zg5077l0zjfmh2khztlnkpklv'
        },
        {
          "decimals": 1,
          "name": 'spy-sefi-xmr',
          "symbol": 'SPYSEFIXMR',
          "address": 'secret1znn2jssc78chse93zyze7f7an86wm577zg3mqv'
        },
        {
          "decimals": 6,
          "name": 'Jasu Club Token - 98479ae50eb9f1f',
          "symbol": 'JCT',
          "address": 'secret1zc2fd6dfuj05krmreyvgw8zjq6fyn2z33hw4mj'
        },
        {
          "decimals": 8,
          "name": 'SBTC',
          "symbol": 'SBTC',
          "address": 'secret1w63d8zftw9stmrytrglk9eed3p6cgmjak5clul'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-sefi-3',
          "symbol": 'SPYSCRTSEFI-3',
          "address": 'secret1twjquxp06j9ppyg4v6dr496fnmfcvzpx8weddm'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-eth-3',
          "symbol": 'SPYSCRTETH-3',
          "address": 'secret17r72nj7yhc0fnm3ay8j8tluqqd2twj60lvwr3w'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-wbtc-3',
          "symbol": 'SPYSCRTWBTC-3',
          "address": 'secret1enpte7ll3r4zrs70najmf7g83hdzy33wmdx7nk'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-usdt-3',
          "symbol": 'SPYSCRTUSDT-3',
          "address": 'secret1ny8nvnya5q4zcxpyldvdhts0uvh26heny8ynuj'
        },
        {
          "decimals": 1,
          "name": 'spy-eth-wbtc-3',
          "symbol": 'SPYETHWBTC-3',
          "address": 'secret1zsnjdcjwpyamc98lyvd5v8u9rw0949px6r5agg'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-link-3',
          "symbol": 'SPYSCRTLINK-3',
          "address": 'secret1umzq0nm4vd7mjdu9c263hx4y0h6hvgnxdlnpkj'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-rune-3',
          "symbol": 'SPYSCRTRUNE-3',
          "address": 'secret15yd7gs9qvu9p5kjdlgzr9pf08p0w33j00mfy83'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-rsr-3',
          "symbol": 'SPYSCRTRSR-3',
          "address": 'secret12s5296mk2xxvqhn40xwk9qp923renks6sd7z32'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-uni-3',
          "symbol": 'SPYSCRTUNI-3',
          "address": 'secret1nrpcvjlwn9u4mc9ev8r8lvhcnydfk29kh574hp'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-ocean-3',
          "symbol": 'SPYSCRTOCEAN-3',
          "address": 'secret1r8c9dr4th9k6pe0xrrlnrvfzs6sh69lvatddf8'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-yfi-3',
          "symbol": 'SPYSCRTYFI-3',
          "address": 'secret1nqq70l57wze93ecnh48t0qlxl9r2euuvrrcsr0'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-dai-3',
          "symbol": 'SPYSCRTDAI-3',
          "address": 'secret14rs234ae0v70kjzkwv8rtngvfrgww2udkym5ys'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-mana-3',
          "symbol": 'SPYSCRTMANA-3',
          "address": 'secret1hnuusygg9n7zn7w6gdk2gkaqupdzxa5wwfwkzs'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-bnb-3',
          "symbol": 'SPYSCRTBNB-3',
          "address": 'secret16pqkssv08hjfmamrcz9gruhxxsuvc25n4gq0s2'
        },
        {
          "decimals": 1,
          "name": 'spy-eth-ethbsc-3',
          "symbol": 'SPYETHETHBSC-3',
          "address": 'secret1s3gg4l6u2vpewqp2lpupqwr52ktdak00rq05ms'
        },
        {
          "decimals": 1,
          "name": 'spy-scrt-dotbsc-3',
          "symbol": 'SPYSCRTDOTBSC-3',
          "address": 'secret1geklww0t0kwehc2w9llwce2wkg40pp4ljfpa8m'
        },
        {
          "decimals": 1,
          "name": 'spy-sefi-xmr-3',
          "symbol": 'SPYSEFIXMR-3',
          "address": 'secret1pqvny7lp32z939vtd08jhe66cxl0qp3quxyls5'
        },
        {
          "decimals": 1,
          "name": 'spy-sefi-usdc-3',
          "symbol": 'SPYSEFIUSDC-3',
          "address": 'secret16ahwz30chht7wg926tfaj07563hkmemad4nnzm'
        },
        {
          "decimals": 1,
          "name": 'spy-usdc-usdcbsc-3',
          "symbol": 'SPYUSDCUSDCBSC-3',
          "address": 'secret1rcvjaua8dfhjlh0kwhrsj54l4aj46mu5evgqwq'
        },
        {
          "decimals": 1,
          "name": 'spy-ust-3',
          "symbol": 'DPLXUST',
          "address": 'secret1sj7m8jqscf472v97fx6q2emduxgr9ltx0pr2en'
        },
        {
          "decimals": 1,
          "name": 'spy-sefi-3',
          "symbol": 'SPYSEFI-3',
          "address": 'secret1knars62aly28xkqxe8xeqtf7ans8hqxgm6a05k'
        },
        {
          "decimals": 1,
          "name": 'dplx-ust',
          "symbol": 'DPLXUST',
          "address": 'secret13cxl5h6swfpcfzqt737hu3z2lvsxkr0m9r3d7u'
        },
        {
          "decimals": 12,
          "name": 'sXMR_token_v3',
          "symbol": 'SXMR',
          "address": 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88'
        },
        {
          "decimals": 12,
          "name": 'sXMR_token_v2',
          "symbol": 'SXMR',
          "address": 'secret176psnkm057wagljwdzsf4c304lltuedullj24c'
        },
        {
          "decimals": 12,
          "name": 'sXMR_token',
          "symbol": 'SXMR',
          "address": 'secret12ykldsz7q68gr3yj2y4aqjcn8ygrgtw02a3v6a'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA_Pool_1633873068432',
          "symbol": 'SRW',
          "address": 'secret109g22wm3q3nfys0v6uh7lqg68cn6244n2he4t6'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA_Pool',
          "symbol": 'SRW',
          "address": 'secret1ja57vrpqusx99rgvxacvej3vhzhh4rhlkdkd7w'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA-sSCRT_Pool',
          "symbol": 'SRW',
          "address": 'secret1ansj9erlu3wl5r6kg9dpjt5nejs6q4r80p7f2h'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA-sETH_Pool',
          "symbol": 'SRW',
          "address": 'secret170mhhnqqjzg2a2dt4tcwxhvtp42u3yk4xx0kcr'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-sSCRT_Pool_1633873081283',
          "symbol": 'SRW',
          "address": 'secret1qd6mh5tlnnl6an66ymv0023ancf2jte9sn4ut0'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-sBNB_Pool_1633873088350',
          "symbol": 'SRW',
          "address": 'secret12xzexvvy9xfk4t024jldydu8ehrs6dej9nspmm'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA-sBNB_Pool',
          "symbol": 'SRW',
          "address": 'secret1arfqxvyqewng637enxcyp75s4fz0fs3zx6czww'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-sETH_Pool_1633873096168',
          "symbol": 'SRW',
          "address": 'secret13w8zzr46syhls2aqf79feg2r9e5ayw3fqt3tpv'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA-sUSDT_ERC20_Pool',
          "symbol": 'SRW',
          "address": 'secret1s6dj8rgv9vt83y62yxnkh2g8dr4gya4gyg7urq'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA-sUSDC_ERC20_Pool',
          "symbol": 'SRW',
          "address": 'secret1cvr96ncvlu349v65xyphcne6z0qtzleqm6w0k3'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-sETH_Pool_1633873117331',
          "symbol": 'SRW',
          "address": 'secret1nc30hhxxadajz89g25954kzlweyqhy35z48fwc'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA-sXMR_Pool',
          "symbol": 'SRW',
          "address": 'secret1zd3a78wrvt7wjy5jj8cc486yh2mu5geuqg9lu0'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-sUSDT_ERC20_Pool_1633873127460',
          "symbol": 'SRW',
          "address": 'secret19p2s70w2qrtmxh26patry8k7vfc4jcnvm3rfj2'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA-WBTC_Pool',
          "symbol": 'SRW',
          "address": 'secret19zrgvu0e5m0twqclzwrz8nrrur6vw0ukmw3gxe'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-sUSDC_ERC20_Pool_1633873133306',
          "symbol": 'SRW',
          "address": 'secret1rh2wdnu4qkf5292fscv8nhw4hnzk58vq90nhz4'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA-SEFI_Pool',
          "symbol": 'SRW',
          "address": 'secret1pxu8v03t0azdu6j8ldd9aar2vu06e3ndk2kfru'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-sXMR_Pool_1633873138207',
          "symbol": 'SRW',
          "address": 'secret18ny0ygknhp8m7ze46484yx3a7klkwsa3e2c752'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-sXMR_Pool_1633873158569',
          "symbol": 'SRW',
          "address": 'secret1sc0l6t2aa3z99ls7gmdn85cfyewex0yladl0dz'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-WBTC_Pool_1633873164488',
          "symbol": 'SRW',
          "address": 'secret1pj22jz7hmacl6w69lqfpcu9agwfyecl34vdhwy'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-SEFI_Pool_1633873170798',
          "symbol": 'SRW',
          "address": 'secret1f6pfxup7xp9auvafcu9ftsc6090h843rdt7cxc'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_SIENNA-sRUNE_Pool_1633873176404',
          "symbol": 'SRW',
          "address": 'secret197d69eefvyffkalpacuydvurqrnu6a5qt7dlwz'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_sXMR-sUSDT_ERC20_Pool_1633873205585',
          "symbol": 'SRW',
          "address": 'secret1aftudwrr9cg7re8xs474u2y03xd25f44kl7v6p'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_sXMR-sSCRT_Pool_1633873217122',
          "symbol": 'SRW',
          "address": 'secret14s2qkvyxpjfe65mhxjhcg62lyetx867873keg7'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_sSCRT-sUSDC_ERC20_Pool_1633873228957',
          "symbol": 'SRW',
          "address": 'secret1twt4d50s9dskqkcxw29sh6gugy5jsc9eukhnh4'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_sXMR-sWBTC_Pool_1633873234768',
          "symbol": 'SRW',
          "address": 'secret129886eu55rud2ph3r673tgt7mcj3p0s7v6hl2l'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_sSCRT-sETH_Pool_1633873223266',
          "symbol": 'SRW',
          "address": 'secret15l5vpepsaaaryga0wtyr5rv8nld6lqs0r75q8u'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_sSCRT-sWBTC_Pool_1633873243922',
          "symbol": 'SRW',
          "address": 'secret1e80n3tp3s405aks0vuyqw49qcj4urrqyulgfee'
        },
        {
          "decimals": 1,
          "name": 'SiennaRewards_sSCRT-sWBTC_Pool_1633873263141',
          "symbol": 'SRW',
          "address": 'secret1ys8629ymruxakjs6xscw88aje4ew00xgkqd7a8'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_sXMR-sSCRT_Pool',
          "symbol": 'SRW',
          "address": 'secret16ste6yxdytk8dccjucqq0s5qsf9uv59ay4cvcc'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_sSCRT-sETH_Pool',
          "symbol": 'SRW',
          "address": 'secret17agq695fk9cdtdcwmwmzvkreamrmzqvru8tl6k'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_sXMR-sUSDT_ERC20_Pool',
          "symbol": 'SRW',
          "address": 'secret1ljpklvq8hlwq64m8uweuqp00rez50umtvxxzyz'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_sXMR-sWBTC_Pool',
          "symbol": 'SRW',
          "address": 'secret1elz6q8w5dnfqzd5w4kuatk3ea82402m5me482d'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_sSCRT-sUSDC_ERC20_Pool',
          "symbol": 'SRW',
          "address": 'secret1mcdtx76cskgl9xva28yangnpy2fl29txdfudqz'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_sSCRT-sWBTC_Pool',
          "symbol": 'SRW',
          "address": 'secret1c05rdgey2u0fx80y90s28jy77g7d52daxftx9p'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA_Pool_1633865288817',
          "symbol": 'SRW',
          "address": 'secret1v0unagl9hckcmpy796kjjvj8cc2y8lyeq5q5h2'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5-SiennaSwap-LP-Token-secret1gzmeahvxmpvm8j7jr59nzyu7m9kfcyr03dr0jh',
          "symbol": 'SWAP-LP',
          "address": 'secret18fmpq659lafjtrhr6p7vl844x6e6gkydqfvcdd'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SiennaSwap-LP-Token-secret12mhc3vl7gkwy96zc0uthcx66gt8fam2hqgkz4v',
          "symbol": 'SWAP-LP',
          "address": 'secret18y8zyjhhww66yduv538cj5svq37c0klc7au05n'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SiennaSwap-LP-Token-secret16h2zlqp45wrj9l3p5px6j55thdxptmgs0j3ke0',
          "symbol": 'SWAP-LP',
          "address": 'secret1cm2sup79a7l0mpa0p8gvcfh9fdxfvpxwfs6xju'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-SiennaSwap-LP-Token-secret1vx2ecq5nmau722mmvx78dk388fnjqmyvapcyny',
          "symbol": 'SWAP-LP',
          "address": 'secret1wjhaukfp8wh2662j5tm8d3vye2g2d9a6vj6vh8'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv-SiennaSwap-LP-Token-secret1qncs7zvp8dxkw7e8m0stpqxgmpm705wrgu4jsd',
          "symbol": 'SWAP-LP',
          "address": 'secret1l6maepdm36e6twaszw3rganuushnssxmv053v3'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-SiennaSwap-LP-Token-secret1angrgadt62w3vcf4q2yxnw5d3s02f9dsw0syan',
          "symbol": 'SWAP-LP',
          "address": 'secret1ev72erhnnsrz8cwggd8mw7459zxg825c5eqdlq'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-SiennaSwap-LP-Token-secret1ny3ycqfana9995dpfjquejjvx6qjvlnwenszz5',
          "symbol": 'SWAP-LP',
          "address": 'secret1kcw5328pfz75hrrw9fg58r036338tlaeft2qex'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-SiennaSwap-LP-Token-secret1ef32pr9st29f2k7qrjd4vgq3tj4dvgv66hsdj9',
          "symbol": 'SWAP-LP',
          "address": 'secret1vejyfzemg545g03xcc4pc9ntg9f5kzctfn27ej'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw-SiennaSwap-LP-Token-secret1sxqv0m3r40yfplre9k8qdqjujypce9d0ux3mmu',
          "symbol": 'SWAP-LP',
          "address": 'secret18adh065e46rg7y3ke78azztv54t7j4mkcuvldl'
        },
        {
          "decimals": 18,
          "name": 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-SiennaSwap-LP-Token-secret1y4e8c6rvz5hxjjdf7kxuc0uply8mdj9m880zkf',
          "symbol": 'SWAP-LP',
          "address": 'secret1ctlqscyvuaetnctk4k8xkd8l8h5kqgch4de4k9'
        },
        {
          "decimals": 18,
          "name": 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SiennaSwap-LP-Token-secret1w95sau5ll2cm0tdy2r0mf8m8572rhq7sumltam',
          "symbol": 'SWAP-LP',
          "address": 'secret1u5r839wcxdcd4zet3r4vu0k5uxch2g2tqv5h6n'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret1el5uj9ns9sty682dem033pt50xsv5mklmsvy24-SiennaSwap-LP-Token-secret1qm0sfft5zgqw3r3h3ftzcpkvzlady7daaawlcs',
          "symbol": 'SWAP-LP',
          "address": 'secret1236tzzrvf7rcz2m9ss2lavpfef3henryyyzk0r'
        },
        {
          "decimals": 18,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw-SiennaSwap-LP-Token-secret1ala3wd5jx8wvc23khnu7z4kglhpkvek843vgdf',
          "symbol": 'SWAP-LP',
          "address": 'secret15l8395q7z5ly9vul7dpuyv0yyr7ypqm0psk0jg'
        },
        {
          "decimals": 18,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv-SiennaSwap-LP-Token-secret1f2gz25aw6mexw0m2vxm37yd6f3y94kn4zujs4c',
          "symbol": 'SWAP-LP',
          "address": 'secret1h5u2wd8hlggaulrg4yv8dn85w3chasq3al5s4a'
        },
        {
          "decimals": 18,
          "name": 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-SiennaSwap-LP-Token-secret18fs3zw3vel608zd2h9ldu735wjf5zzwvukf23v',
          "symbol": 'SWAP-LP',
          "address": 'secret1yxc0avafu6wvkf7w7jhx2886qdsnz75q2fryu6'
        },
        {
          "decimals": 18,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-SiennaSwap-LP-Token-secret1cwdy6wus2krp3vnvp6uvjtgn6ttmyjrt50rshc',
          "symbol": 'SWAP-LP',
          "address": 'secret18ua6rwe4aq7a53v8c23jedmlhw6w0d87uud8wd'
        },
        {
          "decimals": 18,
          "name": 'secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-secret1vcm525c3gd9g5ggfqg7d20xcjnmcc8shh902un-SiennaSwap-LP-Token-secret15hevre4vmatpktxxv0pztmf5h53tts462t7490',
          "symbol": 'SWAP-LP',
          "address": 'secret1tz6rapgjx4zxkaslzt5k55tuzalndghdyzclkq'
        },
        {
          "decimals": 18,
          "name": 'secret16euwqyntvsp0fp2rstmggw77w5xgz2z26cpwxj-secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-SiennaSwap-LP-Token-secret1408t0qkx9hn2r399z83t7mk5p8wcnhus9yj7uz',
          "symbol": 'SWAP-LP',
          "address": 'secret1vf3cxupa208f5uj730d6294v2yx2eqew9vkvst'
        },
        {
          "decimals": 18,
          "name": 'secret16euwqyntvsp0fp2rstmggw77w5xgz2z26cpwxj-secret1c7apt5mmv9ma5dpa9tmwjunhhke9de2206ufyp-SiennaSwap-LP-Token-secret1gusv62nyqr46dpwp39428kfn7vlqm9uautzfvg',
          "symbol": 'SWAP-LP',
          "address": 'secret18ytzwql6e376tqz0tvrqc5uzcjm499h2z8rdu2'
        },
        {
          "decimals": 18,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a-SiennaSwap-LP-Token-secret1c5qjspn066het2jn5ncw837ftnagq5t0c07tpe',
          "symbol": 'SWAP-LP',
          "address": 'secret1dflxrvd4xww6wqz87zu28ykcyankv2m3uj94me'
        },
        {
          "decimals": 18,
          "name": 'secret1p4zvqgxggrrk435nj94p6la2g4xd0rwssgzpsr-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SiennaSwap-LP-Token-secret1vm2g67q6hd46tj29d33ypu65sh07k83tvqv334',
          "symbol": 'SWAP-LP',
          "address": 'secret1shesj8ylrm28fmvdyf6knlxj89ea9vayra9439'
        },
        {
          "decimals": 18,
          "name": 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-SiennaSwap-LP-Token-secret16fuv6mjcffxzd6cwtqek5kym25e9f4g4rxlhq3',
          "symbol": 'SWAP-LP',
          "address": 'secret1urmzwpv0nt40xljzj2xls97y067u3unlez3f2z'
        },
        {
          "decimals": 18,
          "name": 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f-secret16euwqyntvsp0fp2rstmggw77w5xgz2z26cpwxj-SiennaSwap-LP-Token-secret1jsjhzghgxc3jg7twcm24mj55zm8q2kapu43z9c',
          "symbol": 'SWAP-LP',
          "address": 'secret1llj95j404h9mc6z0n9rc55smjc73tq88fgj8fx'
        },
        {
          "decimals": 18,
          "name": 'secret1h6z05y90gwm4sqxzhz4pkyp36cna9xtp7q0urv-secret1kf45vm4mg5004pgajuplcmkrzvsyp2qtvlklyg-SiennaSwap-LP-Token-secret1tpx0x6048alwr5tdvs8l0kmufpwdh7y6q85nlt',
          "symbol": 'SWAP-LP',
          "address": 'secret1cazhpg7a20p3pwlgehj2n4297sgell2uhl9tz5'
        },
        {
          "decimals": 18,
          "name": 'secret1vnjck36ld45apf8u4fedxd5zy7f5l92y3w5qwq-secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek-SiennaSwap-LP-Token-secret13sepv96c76atfautrfdd7y7aa3wj2nwrwh297n',
          "symbol": 'SWAP-LP',
          "address": 'secret1nhuelu23pvfu7ku3q8j8p3hhuln9sm2wavxst7'
        },
        {
          "decimals": 18,
          "name": 'secret17zt6ycf3n079fngha6ku5u4qwjca2k2jq6rfp9-secret1rgm2m5t530tdzyd99775n6vzumxa5luxcllml4-SiennaSwap-LP-Token-secret1ukxu4dncppxfewn8f8vv6u7laqerwfhf9z5dky',
          "symbol": 'SWAP-LP',
          "address": 'secret16faxtw0nn0xfwnkpwas5taxkect0vlyvepwadh'
        },
        {
          "decimals": 18,
          "name": 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88-secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt-SiennaSwap-LP-Token-secret1wa3ffuaml5j9yrynjz6ja8q3kngregc95k05r7',
          "symbol": 'SWAP-LP',
          "address": 'secret1c8mzprqq9jkdfe0d06pwrt0st35sauvzs26nzd'
        },
        {
          "decimals": 1,
          "name": 'prod/SiennaRewards_SIENNA-sRUNE_Pool',
          "symbol": 'SRW',
          "address": 'secret1dv3mjwcdhcc56kz3vnh2776apmlpd3cyp6ejnr'
        }
      ]

      x.each do |c|
        Rails.logger.debug c
        Cryptocurrency.find_or_create_by!(decimals: c[:decimals], name: c[:name], symbol: c[:symbol],
                                          smart_contract: SmartContract.find_by(address: c[:address]))
      end
      # SecretFinanceStakingPoolsJob.perform_now if initialized_server? && Rails.env.production?
      SecretNetworkGetSmartContractsJob.perform_now if initialized_server? && Rails.env.production?
    end
  end
end
