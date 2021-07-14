class AddTotalLockedPendingRewardsAndDeadlineColumnsToPool < ActiveRecord::Migration[6.1]
  def change
    add_column :pools, :deadline, :bigint
    add_column :pools, :pending_rewards, :bigint
    add_column :pools, :total_locked, :bigint
  end
end
