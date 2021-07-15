class AddUniqueIndexToSmartContractIdOnCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    remove_index :cryptocurrencies, :smart_contract_id
    add_index :cryptocurrencies, :smart_contract_id, unique: true
  end
end
