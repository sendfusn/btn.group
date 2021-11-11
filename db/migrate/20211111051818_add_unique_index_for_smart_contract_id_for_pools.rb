class AddUniqueIndexForSmartContractIdForPools < ActiveRecord::Migration[6.1]
  def change
    remove_index :pools, :smart_contract_id
    add_index :pools, :smart_contract_id, unique: true
  end
end
