class AddSmartContractReferenceToPools < ActiveRecord::Migration[6.1]
  def change
    add_reference :pools, :smart_contract
  end
end
