class AddPriceToCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    add_column :cryptocurrencies, :price, :decimal, precision: 8, scale: 6
  end
end
