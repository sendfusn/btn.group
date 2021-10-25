class RemoveThenAddSmartContractAddressUniqueIndex < ActiveRecord::Migration[6.1]
  def change
    remove_index :smart_contracts, :address, unique: true
    add_index :smart_contracts, :address, unique: true
  end
end
