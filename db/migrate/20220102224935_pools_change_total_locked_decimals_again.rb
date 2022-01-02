class PoolsChangeTotalLockedDecimalsAgain < ActiveRecord::Migration[6.1]
  def change
    change_column :pools, :total_locked, :decimal, precision: 15, scale: 2
  end
end
