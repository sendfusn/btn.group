class ChangeTypeToCategoryInPools < ActiveRecord::Migration[6.1]
  def change
    rename_column :pools, :type, :category
  end
end
