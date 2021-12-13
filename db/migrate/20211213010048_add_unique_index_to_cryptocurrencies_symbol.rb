class AddUniqueIndexToCryptocurrenciesSymbol < ActiveRecord::Migration[6.1]
  def change
    add_index :cryptocurrencies, %i[smart_contract_id symbol], unique: true
  end
end
