class ReplaceColumnAddressWithSmartContractReferenceInCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    remove_column :cryptocurrencies, :address
    add_reference :cryptocurrencies, :smart_contract, index: true
  end
end
