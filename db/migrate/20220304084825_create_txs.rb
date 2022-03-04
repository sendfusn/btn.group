class CreateTxs < ActiveRecord::Migration[7.0]
  def change
    create_table :txs do |t|
      t.integer :identifier, index: true
      t.references :cryptocurrency, index: true
      t.references :from, polymorphic: true, index: true
      t.references :to, polymorphic: true, index: true

      t.timestamps
    end
    add_index :txs, %i[identifier cryptocurrency_id], unique: true
  end
end
