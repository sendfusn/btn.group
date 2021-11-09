class AddTypeToPools < ActiveRecord::Migration[6.1]
  def change
    add_column :pools, :type, :integer
  end
end
