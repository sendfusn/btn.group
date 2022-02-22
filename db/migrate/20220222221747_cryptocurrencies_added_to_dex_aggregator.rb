class CryptocurrenciesAddedToDexAggregator < ActiveRecord::Migration[6.1]
  def change
    add_column :cryptocurrencies, :registered_with_dex_aggregator, :boolean
  end
end
