class AddNftToCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    add_column :cryptocurrencies, :nft, :boolean
  end
end
