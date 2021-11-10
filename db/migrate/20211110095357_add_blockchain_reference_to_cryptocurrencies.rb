class AddBlockchainReferenceToCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    add_reference :cryptocurrencies, :blockchain, index: true
  end
end
