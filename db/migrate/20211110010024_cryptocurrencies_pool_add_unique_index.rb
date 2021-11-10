class CryptocurrenciesPoolAddUniqueIndex < ActiveRecord::Migration[6.1]
  def change
    add_index :cryptocurrencies_pools, [:cryptocurrency_role, :cryptocurrency_id, :pool_id], unique: true, name: 'by_role_and_associations'
  end
end
