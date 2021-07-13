class CreateCryptocurrenciesPools < ActiveRecord::Migration[6.1]
  def change
    create_table :cryptocurrencies_pools do |t|
      t.integer :cryptocurrency_role, null: false
      t.references :cryptocurrency, index: true
      t.references :pool, index: true

      t.timestamps
    end
  end
end
