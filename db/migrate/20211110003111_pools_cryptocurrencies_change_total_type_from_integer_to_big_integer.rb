class PoolsCryptocurrenciesChangeTotalTypeFromIntegerToBigInteger < ActiveRecord::Migration[6.1]
  def change
    change_column :cryptocurrencies_pools, :total, :bigint
  end
end
