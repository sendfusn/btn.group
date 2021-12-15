class AddSwapCountToSwapPath < ActiveRecord::Migration[6.1]
  def change
    add_column :swap_paths, :swap_count, :integer, null: false
  end
end
