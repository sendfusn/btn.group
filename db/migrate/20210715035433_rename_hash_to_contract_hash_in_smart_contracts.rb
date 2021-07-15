class RenameHashToContractHashInSmartContracts < ActiveRecord::Migration[6.1]
  def change
    rename_column :smart_contracts, :hash, :data_hash
  end
end
