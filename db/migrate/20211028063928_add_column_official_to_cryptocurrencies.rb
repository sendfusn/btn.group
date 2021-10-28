class AddColumnOfficialToCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    add_column :cryptocurrencies, :official, :boolean
  end
end
