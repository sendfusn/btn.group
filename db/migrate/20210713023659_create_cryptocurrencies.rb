class CreateCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    create_table :cryptocurrencies do |t|
      t.string :address
      t.integer :decimals, null: false
      t.string :name, null: false
      t.string :symbol, null: false

      t.timestamps
    end
  end
end
