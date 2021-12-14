class RenameCryptocurrencyPoolsTotalToAmount < ActiveRecord::Migration[6.1]
  def change
    rename_column :cryptocurrencies_pools, :total, :amount
  end
end
