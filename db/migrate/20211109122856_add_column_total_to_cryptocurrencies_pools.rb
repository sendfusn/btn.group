class AddColumnTotalToCryptocurrenciesPools < ActiveRecord::Migration[6.1]
  def change
    add_column :cryptocurrencies_pools, :total, :integer
  end
end
