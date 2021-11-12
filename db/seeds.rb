Blockchain.identifiers.keys.each do |identifier|
	b = Blockchain.find_or_initialize_by(identifier: identifier)
	next if b.persisted?

	url = 'https://scrt.network/' if identifier == 'secret_network'
	b.update!(name: identifier.humanize, url: url) 
end

Protocol.identifiers.keys.each do |identifier|
	p = Protocol.find_or_initialize_by(identifier: identifier)
	next if p.persisted?

	url = 'https://btn.group/' if identifier == 'btn_group'
	url = 'https://secretswap.io/' if identifier == 'secret_swap'
	p.update!(name: identifier.humanize, url: url)
end

[["secret199pnc4xusvazp73ns95mylqeq9m4xcr8k4fzku", "secret17r72nj7yhc0fnm3ay8j8tluqqd2twj60lvwr3w"],
 ["secret1yuxtccepn3n3z8stqq8cwkz2kvyjcx4nahcs0v", "secret1twjquxp06j9ppyg4v6dr496fnmfcvzpx8weddm"],
 ["secret19dq8df5jyqqd7v6eugk4c255lgasj76kug242c", "secret1geklww0t0kwehc2w9llwce2wkg40pp4ljfpa8m"],
 ["secret1k38fm5942tnyl7jqct0nxkluldl84gldhravql", "secret1rcvjaua8dfhjlh0kwhrsj54l4aj46mu5evgqwq"],
 ["secret1vpvypnlcz0kng32qlp4727tx87e2kauffng79v", "secret1enpte7ll3r4zrs70najmf7g83hdzy33wmdx7nk"],
 ["secret1xec2u79g8qx7krz48lk3xsmr3crmyvp6tp46jn", "secret16ahwz30chht7wg926tfaj07563hkmemad4nnzm"],
 ["secret17gpz09yv0eyw633y459ncqmf4qsye9kwqecnvf", "secret1knars62aly28xkqxe8xeqtf7ans8hqxgm6a05k"],
 ["secret1rtu4dnkknlsuxwunc0ufry8se78vjul4953l5z", "secret1ny8nvnya5q4zcxpyldvdhts0uvh26heny8ynuj"],
 ["secret18ys9t245ejrx06zmfj6mkvnrd8wrupdanfvnxp", "secret16pqkssv08hjfmamrcz9gruhxxsuvc25n4gq0s2"],
 ["secret1wgqv5ch9njg454ru5pau02ut7mh5wjf2rr3gmj", "secret1pqvny7lp32z939vtd08jhe66cxl0qp3quxyls5"]].each do |yo_pool_address_and_farm_address|
 	farm_pool = Pool.find_by(smart_contract: SmartContract.find_by(address: yo_pool_address_and_farm_address[1]))
 	next if farm_pool.pool

 	yop_pool = Pool.find_or_create_by!(protocol: Protocol.find_by(identifier: 'btn_group'),
 							smart_contract: SmartContract.find_by(address: yo_pool_address_and_farm_address[0]),
 							category: 'yield_optimizer')
	farm_pool.update(pool: yop_pool)
end
