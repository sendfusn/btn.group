class AddCoinGeckoIdToCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    add_column :cryptocurrencies, :coin_gecko_id, :string
    add_index :cryptocurrencies, :coin_gecko_id
  end
end
