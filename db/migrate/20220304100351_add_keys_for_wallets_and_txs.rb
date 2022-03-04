class AddKeysForWalletsAndTxs < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key "txs", "cryptocurrencies", name: "txs_cryptocurrency_id_fk"
    add_foreign_key "wallets", "blockchains", name: "wallets_blockchain_id_fk"
  end
end
