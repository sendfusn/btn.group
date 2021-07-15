class IncreasePrecisionAndScaleOnPriceInCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    change_column :cryptocurrencies, :price, :decimal, :precision => 15, :scale => 10
  end
end
