class CreatePools < ActiveRecord::Migration[6.1]
  def change
    create_table :pools do |t|
      t.references :protocol, index: true

      t.timestamps
    end
  end
end
