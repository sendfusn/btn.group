class CryptocurrenciesPoolsSmartContracts < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key "cryptocurrencies_pools", "cryptocurrencies", name: "cryptocurrencies_pools_cryptocurrency_id_fk"
    add_foreign_key "cryptocurrencies_pools", "pools", name: "cryptocurrencies_pools_pool_id_fk"
    add_foreign_key "pools", "protocols", name: "pools_protocol_id_fk"
    add_foreign_key "pools", "smart_contracts", name: "pools_smart_contract_id_fk"
    add_foreign_key "smart_contracts", "blockchains", name: "smart_contracts_blockchain_id_fk"
  end
end
