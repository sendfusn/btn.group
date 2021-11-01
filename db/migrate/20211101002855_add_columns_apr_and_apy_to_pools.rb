class AddColumnsAprAndApyToPools < ActiveRecord::Migration[6.1]
  def change
    add_column :pools, :apr, :decimal, precision: 8, scale: 6
    add_column :pools, :apy, :decimal, precision: 8, scale: 6
  end
end
