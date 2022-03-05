# frozen_string_literal: true

def create_cryptocurrency_by_smart_contact(address, name, symbol, decimals)
  smart_contract = SmartContract.find_by(address: address)
  Cryptocurrency.find_or_create_by(blockchain: smart_contract.blockchain,
                                   decimals: decimals,
                                   name: name,
                                   smart_contract: smart_contract,
                                   symbol: symbol)
end
