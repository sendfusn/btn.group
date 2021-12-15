class CreateSwapPaths < ActiveRecord::Migration[6.1]
  def change
    create_table :swap_paths do |t|
      t.string :swap_path_as_string
      t.references :from
      t.references :to

      t.timestamps
    end

    add_index :swap_paths, %i[from_id to_id]
    add_index :swap_paths, %i[swap_path_as_string from_id to_id], unique: true
  end
end
