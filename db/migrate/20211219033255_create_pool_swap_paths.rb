class CreatePoolSwapPaths < ActiveRecord::Migration[6.1]
  def change
    create_table :pool_swap_paths do |t|
      t.integer :position
      t.references :pool
      t.references :swap_path

      t.timestamps
    end
    add_index :pool_swap_paths, %i[position pool_id swap_path_id], unique: true
  end
end
