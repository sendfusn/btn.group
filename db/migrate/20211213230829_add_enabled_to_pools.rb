class AddEnabledToPools < ActiveRecord::Migration[6.1]
  def change
    add_column :pools, :enabled, :boolean, default: false
  end
end
