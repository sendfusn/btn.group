class PoolsIncreaseAprApyPrecisionAndScale < ActiveRecord::Migration[6.1]
  def change
    change_column :pools, :apr, :decimal, precision: 30, scale: 10
    change_column :pools, :apy, :decimal, precision: 30, scale: 10
  end
end
