class CryptocurrenciesChangeColumnPriceToBeBigger < ActiveRecord::Migration[6.1]
  def change
    change_column :cryptocurrencies, :price, :decimal, precision: 30, scale: 10
  end
end
