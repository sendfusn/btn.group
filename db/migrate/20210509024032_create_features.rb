class CreateFeatures < ActiveRecord::Migration[6.1]
  def change
    create_table :features do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.integer :blockchain

      t.timestamps
    end

    add_index :features, :name, unique: true
    add_index :features, :slug, unique: true
  end
end
