class AddUniqueIndexToAddressOnSmartContracts < ActiveRecord::Migration[6.1]
  def change
    change_column(:pools, :deadline , :decimal, precision: 40, scale: 0)
    change_column(:pools, :pending_rewards, :decimal, precision: 40, scale: 0)
    change_column(:pools, :total_locked, :decimal, precision: 40, scale: 0)
  end
end
