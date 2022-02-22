class BlockchainsAddBaseBlockTimeAndLatestBlockTime < ActiveRecord::Migration[6.1]
  def change
    add_column :blockchains, :base_block_time, :decimal, precision: 6, scale: 2
    add_column :blockchains, :latest_block_time, :decimal, precision: 6, scale: 2
  end
end
