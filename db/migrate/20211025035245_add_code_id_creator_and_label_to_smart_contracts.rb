class AddCodeIdCreatorAndLabelToSmartContracts < ActiveRecord::Migration[6.1]
  def change
    add_column :smart_contracts, :code_id, :bigint
    add_column :smart_contracts, :creator, :string
    add_column :smart_contracts, :label, :string
  end
end
