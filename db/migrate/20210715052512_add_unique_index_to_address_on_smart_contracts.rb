class AddUniqueIndexToAddressOnSmartContracts < ActiveRecord::Migration[6.1]
  def change
    add_index :smart_contracts, :address, unique: true
  end
end
