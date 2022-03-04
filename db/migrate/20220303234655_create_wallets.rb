class CreateWallets < ActiveRecord::Migration[7.0]
  def change
    create_table :wallets do |t|
      t.string :address, null: false
      t.string :butt_staked
      t.references :blockchain, index: true

      t.timestamps
    end
    add_index :wallets, :address, unique: true
  end
end
