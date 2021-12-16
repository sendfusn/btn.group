class IndexSwapCountInSwapPaths < ActiveRecord::Migration[6.1]
  def change
    add_index :swap_paths, :swap_count
  end
end
