class CreateSmartContracts < ActiveRecord::Migration[6.1]
  def change
    create_table :smart_contracts do |t|
      t.references :blockchain, index: true
      t.string :address
      t.string :hash

      t.timestamps
    end
  end
end
