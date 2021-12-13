# frozen_string_literal: true

# === BLOCKCHAIN ===
Blockchain.identifiers.each_key do |identifier|
  b = Blockchain.find_or_initialize_by(identifier: identifier)
  next if b.persisted?

  b.update!(name: identifier.humanize)
end

# === PROTOCOL ===
Protocol.identifiers.each_key do |identifier|
  p = Protocol.find_or_initialize_by(identifier: identifier)
  next if p.persisted?

  url = 'https://btn.group/' if identifier == 'btn_group'
  url = 'https://secretswap.io/' if identifier == 'secret_swap'
  url = 'https://sienna.network/' if identifier == 'sienna'
  p.update!(name: identifier.humanize, url: url)
end

# === CRYPTOCURRENCIES & POOLS ===
c = Cryptocurrency.find_or_initialize_by(symbol: 'SCRT')
c.update!(blockchain: Blockchain.find_by(identifier: :secret_network), decimals: 6, denom: 'uscrt', official: true, name: 'Secret') unless c.persisted?
smart_contract = SmartContract.find_by(address: 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek')
sc = Cryptocurrency.find_or_initialize_by(smart_contract: smart_contract)
sc.update!(decimals: 6, name: 'sSCRT', symbol: 'SSCRT', official: true, blockchain: Blockchain.find_by(identifier: :secret_network)) unless sc.persisted?
pool = Pool.find_or_create_by(smart_contract: smart_contract, category: :trade_pair)
if pool.cryptocurrency_pools.empty?
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: c)
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: sc)
end

c = Cryptocurrency.find_or_initialize_by(symbol: 'ATOM')
c.update(blockchain: Blockchain.find_by(identifier: :cosmos), decimals: 6, denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2', official: true, name: 'Cosmos') unless c.persisted?
smart_contract = SmartContract.find_by(address: 'secret14mzwd0ps5q277l20ly2q3aetqe3ev4m4260gf4')
sc = Cryptocurrency.find_or_initialize_by(smart_contract: smart_contract)
sc.update!(decimals: 6, name: 'sATOM', symbol: 'SATOM', official: true, blockchain: Blockchain.find_by(identifier: :secret_network)) unless sc.persisted?
pool = Pool.find_or_create_by(smart_contract: smart_contract, category: :trade_pair)
if pool.cryptocurrency_pools.empty?
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: c)
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: sc)
end

c = Cryptocurrency.find_or_initialize_by(symbol: 'LUNA')
c.update(blockchain: Blockchain.find_by(identifier: :terra), decimals: 6, denom: 'ibc/D70B0FBF97AEB04491E9ABF4467A7F66CD6250F4382CE5192D856114B83738D2', official: true, name: 'Terra') unless c.persisted?
smart_contract = SmartContract.find_by(address: 'secret1ra7avvjh9fhr7dtr3djutugwj59ptctsrakyyw')
sc = Cryptocurrency.find_or_initialize_by(smart_contract: smart_contract)
sc.update!(decimals: 6, name: 'sLUNA', symbol: 'SLUNA', official: true, blockchain: Blockchain.find_by(identifier: :secret_network)) unless sc.persisted?
pool = Pool.find_or_create_by(smart_contract: smart_contract, category: :trade_pair)
if pool.cryptocurrency_pools.empty?
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: c)
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: sc)
end

c = Cryptocurrency.find_or_initialize_by(symbol: 'UST')
c.update(blockchain: Blockchain.find_by(identifier: :terra), decimals: 6, denom: 'ibc/4294C3DB67564CF4A0B2BFACC8415A59B38243F6FF9E288FBA34F9B4823BA16E', official: true, name: 'TerraUSD') unless c.persisted?
smart_contract = SmartContract.find_by(address: 'secret129h4vu66y3gry6wzwa24rw0vtqjyn8tujuwtn9')
sc = Cryptocurrency.find_or_initialize_by(smart_contract: smart_contract)
sc.update!(decimals: 6, name: 'sUST', symbol: 'SUST', official: true, blockchain: Blockchain.find_by(identifier: :secret_network)) unless sc.persisted?
pool = Pool.find_or_create_by(smart_contract: smart_contract, category: :trade_pair)
if pool.cryptocurrency_pools.empty?
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: c)
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: sc)
end

c = Cryptocurrency.find_or_initialize_by(symbol: 'OSMO')
c.update(blockchain: Blockchain.find_by(identifier: :osmosis), decimals: 6, denom: 'ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B', official: true, name: 'Osmosis') unless c.persisted?
smart_contract = SmartContract.find_by(address: 'secret1zwwealwm0pcl9cul4nt6f38dsy6vzplw8lp3qg')
sc = Cryptocurrency.find_or_initialize_by(smart_contract: smart_contract)
sc.update!(decimals: 6, name: 'sOSMO', symbol: 'SOSMO', official: true, blockchain: Blockchain.find_by(identifier: :secret_network)) unless sc.persisted?
pool = Pool.find_or_create_by(smart_contract: smart_contract, category: :trade_pair)
if pool.cryptocurrency_pools.empty?
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: c)
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: sc)
end

c = Cryptocurrency.find_or_initialize_by(symbol: 'DVPN')
c.update(blockchain: Blockchain.find_by(identifier: :sentinel), decimals: 6, denom: 'ibc/E83107E876FF194B54E9AC3099E49DBB7728156F250ABD3E997D2B7E89E0810B', official: true, name: 'Sentinel') unless c.persisted?
smart_contract = SmartContract.find_by(address: 'secret1k8cge73c3nh32d4u0dsd5dgtmk63shtlrfscj5')
sc = Cryptocurrency.find_or_initialize_by(smart_contract: smart_contract)
sc.update!(decimals: 6, name: 'sDVPN', symbol: 'SDVPN', official: true, blockchain: Blockchain.find_by(identifier: :secret_network)) unless sc.persisted?
pool = Pool.find_or_create_by(smart_contract: smart_contract, category: :trade_pair)
if pool.cryptocurrency_pools.empty?
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: c)
  pool.cryptocurrency_pools.create(cryptocurrency_role: :deposit, cryptocurrency: sc)
end

[%w[secret199pnc4xusvazp73ns95mylqeq9m4xcr8k4fzku secret17r72nj7yhc0fnm3ay8j8tluqqd2twj60lvwr3w],
 %w[secret1yuxtccepn3n3z8stqq8cwkz2kvyjcx4nahcs0v secret1twjquxp06j9ppyg4v6dr496fnmfcvzpx8weddm],
 %w[secret19dq8df5jyqqd7v6eugk4c255lgasj76kug242c secret1geklww0t0kwehc2w9llwce2wkg40pp4ljfpa8m],
 %w[secret1k38fm5942tnyl7jqct0nxkluldl84gldhravql secret1rcvjaua8dfhjlh0kwhrsj54l4aj46mu5evgqwq],
 %w[secret1vpvypnlcz0kng32qlp4727tx87e2kauffng79v secret1enpte7ll3r4zrs70najmf7g83hdzy33wmdx7nk],
 %w[secret1xec2u79g8qx7krz48lk3xsmr3crmyvp6tp46jn secret16ahwz30chht7wg926tfaj07563hkmemad4nnzm],
 %w[secret17gpz09yv0eyw633y459ncqmf4qsye9kwqecnvf secret1knars62aly28xkqxe8xeqtf7ans8hqxgm6a05k],
 %w[secret1rtu4dnkknlsuxwunc0ufry8se78vjul4953l5z secret1ny8nvnya5q4zcxpyldvdhts0uvh26heny8ynuj],
 %w[secret18ys9t245ejrx06zmfj6mkvnrd8wrupdanfvnxp secret16pqkssv08hjfmamrcz9gruhxxsuvc25n4gq0s2],
 %w[secret1wgqv5ch9njg454ru5pau02ut7mh5wjf2rr3gmj secret1pqvny7lp32z939vtd08jhe66cxl0qp3quxyls5]].each do |yo_pool_address_and_farm_address|
  farm_pool = Pool.find_by(smart_contract: SmartContract.find_by(address: yo_pool_address_and_farm_address[1]))
  next if farm_pool&.pool
  next if SmartContract.find_by(address: yo_pool_address_and_farm_address[0]).blank?

  yop_pool = Pool.find_or_create_by!(protocol: Protocol.find_by(identifier: 'btn_group'),
                                     smart_contract: SmartContract.find_by(address: yo_pool_address_and_farm_address[0]),
                                     category: 'yield_optimizer')
  farm_pool.update(pool: yop_pool)
end
