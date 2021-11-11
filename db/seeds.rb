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
