class AddDowncaseDataHashForSwapToCryptocurrencyPools < ActiveRecord::Migration[6.1]
  def change
    add_column :cryptocurrencies_pools, :downcase_data_hash_for_swap_simulation, :boolean
  end
end
